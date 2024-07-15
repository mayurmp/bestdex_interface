import { Currency, CurrencyAmount, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Pair, Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { useMemo } from 'react'
import { isTradeBetter } from 'utils/isTradeBetter'

import { BETTER_TRADE_LESS_HOPS_THRESHOLD } from '../constants/misc'
import { useAllCurrencyCombinations } from './useAllCurrencyCombinations'
import { PairState, useV2Pairs } from './useV2Pairs'

// let factoryTypeList: any

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency, contractNumber?: number): Pair[] {
  const allCurrencyCombinations = useAllCurrencyCombinations(currencyA, currencyB)

  const allPairs = useV2Pairs(allCurrencyCombinations, contractNumber)
  // console.log('ALL Pairs', allPairs)
  // factoryTypeList = whichFactoryContract()
  // console.log(typeof allPairs)
  // console.log(typeof allPairs[0])

  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          .map(([, pair]) => pair)
      ),
    [allPairs]
  )
}

const MAX_HOPS = 3

/**
 * Returns the best v2 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useBestV2Trade(
  tradeType: TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  contractNumber?: number,
  { maxHops = MAX_HOPS } = {}
): Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT> | null {
  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, otherCurrency]
  )
  const allowedPairs = useAllCommonPairs(currencyIn, currencyOut, contractNumber)
  // console.log('hhhhhhhh', factoryTypeList)
  // const allowedPairs = allowedPairsObj.map((pairData: { pair: Pair; factoryContract: Factory_Type }) => pairData.pair)
  // console.log('Allowed Pairs:', allowedPairs)
  // console.log('Allowed Pairs Object', allowedPairsObj)

  // factoryTypeList = allowedPairsObj.map(
  //   (pairData: { pair: Pair; factoryContract: Factory_Type }) => pairData.factoryContract
  // )[0]
  return useMemo(() => {
    if (amountSpecified && currencyIn && currencyOut && allowedPairs.length > 0) {
      if (maxHops === 1) {
        const options = { maxHops: 1, maxNumResults: 1 }
        if (tradeType === TradeType.EXACT_INPUT) {
          const amountIn = amountSpecified
          return Trade.bestTradeExactIn(allowedPairs, amountIn, currencyOut, options)[0] ?? null
        } else {
          const amountOut = amountSpecified
          return Trade.bestTradeExactOut(allowedPairs, currencyIn, amountOut, options)[0] ?? null
        }
      }

      // search through trades with varying hops, find best trade out of them
      let bestTradeSoFar: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT> | null = null
      for (let i = 1; i <= maxHops; i++) {
        const options = { maxHops: i, maxNumResults: 1 }
        let currentTrade: Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT> | null

        if (tradeType === TradeType.EXACT_INPUT) {
          const amountIn = amountSpecified
          currentTrade = Trade.bestTradeExactIn(allowedPairs, amountIn, currencyOut, options)[0] ?? null
        } else {
          const amountOut = amountSpecified
          currentTrade = Trade.bestTradeExactOut(allowedPairs, currencyIn, amountOut, options)[0] ?? null
        }

        // if current trade is best yet, save it
        if (isTradeBetter(bestTradeSoFar, currentTrade, BETTER_TRADE_LESS_HOPS_THRESHOLD)) {
          bestTradeSoFar = currentTrade
        }
      }
      return bestTradeSoFar
    }

    return null
  }, [tradeType, amountSpecified, currencyIn, currencyOut, allowedPairs, maxHops])
}