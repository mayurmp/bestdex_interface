import { Currency, CurrencyAmount, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Route, SwapQuoter, Trade } from '@tech-alchemy/best-dex/v3-sdk'
import { SupportedChainId } from 'constants/chains'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { V3TradeState } from 'state/routing/types'

import { useSingleContractWithCallData } from '../state/multicall/hooks'
import { useAllV3Routes0, useAllV3Routes1 } from './useAllV3Routes'
import { useV3Quoter, useV3QuoterUniswap } from './useContract'
import { useActiveWeb3React } from './web3'

const QUOTE_GAS_OVERRIDES: { [chainId: number]: number } = {
  [SupportedChainId.ARBITRUM_ONE]: 25_000_000,
  [SupportedChainId.ARBITRUM_RINKEBY]: 25_000_000,
}

const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired swap
 * @param tradeType whether the swap is an exact in/out
 * @param amountSpecified the exact amount to swap in/out
 * @param otherCurrency the desired output/payment currency
 */
export function useClientSideV3Trade<TTradeType extends TradeType>(
  tradeType: TTradeType,
  amountSpecified?: CurrencyAmount<Currency>,
  otherCurrency?: Currency,
  contractNumber?: number
): { state: V3TradeState; trade: Trade<Currency, Currency, TTradeType> | null } {
  const [currencyIn, currencyOut] = useMemo(
    () =>
      tradeType === TradeType.EXACT_INPUT
        ? [amountSpecified?.currency, otherCurrency]
        : [otherCurrency, amountSpecified?.currency],
    [tradeType, amountSpecified, otherCurrency]
  )

  const { routes: routes0, loading: routesLoading0 } = useAllV3Routes0(currencyIn, currencyOut, 0)
  const { routes: routes1, loading: routesLoading1 } = useAllV3Routes1(currencyIn, currencyOut, 1)
  let routes = routes0
  let routesLoading = routesLoading0

  let quoter = useV3Quoter()

  if (contractNumber === 1) {
    routes = routes1
    routesLoading = routesLoading1
    // eslint-disable-next-line react-hooks/rules-of-hooks
    quoter = useV3QuoterUniswap()
  }
  // console.log('routes0', routes0)
  // console.log('routes1', routes1)
  // {
  //   const { routes } = useAllV3Routes(currencyIn, currencyOut, 1)
  //   // console.log('routes1:', routes)
  // }
  // console.log('routes:', routes)

  const { chainId } = useActiveWeb3React()
  const quotesResults = useSingleContractWithCallData(
    quoter,
    amountSpecified
      ? routes.map((route) => SwapQuoter.quoteCallParameters(route, amountSpecified, tradeType).calldata)
      : [],
    {
      gasRequired: chainId ? QUOTE_GAS_OVERRIDES[chainId] ?? DEFAULT_GAS_QUOTE : undefined,
    }
  )

  return useMemo(() => {
    if (
      !amountSpecified ||
      !currencyIn ||
      !currencyOut ||
      quotesResults.some(({ valid }) => !valid) ||
      // skip when tokens are the same
      (tradeType === TradeType.EXACT_INPUT
        ? amountSpecified.currency.equals(currencyOut)
        : amountSpecified.currency.equals(currencyIn))
    ) {
      return {
        state: V3TradeState.INVALID,
        trade: null,
      }
    }

    if (routesLoading || quotesResults.some(({ loading }) => loading)) {
      return {
        state: V3TradeState.LOADING,
        trade: null,
      }
    }

    const { bestRoute, amountIn, amountOut } = quotesResults.reduce(
      (
        currentBest: {
          bestRoute: Route<Currency, Currency> | null
          amountIn: CurrencyAmount<Currency> | null
          amountOut: CurrencyAmount<Currency> | null
        },
        { result },
        i
      ) => {
        if (!result) return currentBest

        // overwrite the current best if it's not defined or if this route is better
        if (tradeType === TradeType.EXACT_INPUT) {
          const amountOut = CurrencyAmount.fromRawAmount(currencyOut, result.amountOut.toString())
          if (currentBest.amountOut === null || JSBI.lessThan(currentBest.amountOut.quotient, amountOut.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn: amountSpecified,
              amountOut,
            }
          }
        } else {
          const amountIn = CurrencyAmount.fromRawAmount(currencyIn, result.amountIn.toString())
          if (currentBest.amountIn === null || JSBI.greaterThan(currentBest.amountIn.quotient, amountIn.quotient)) {
            return {
              bestRoute: routes[i],
              amountIn,
              amountOut: amountSpecified,
            }
          }
        }

        return currentBest
      },
      {
        bestRoute: null,
        amountIn: null,
        amountOut: null,
      }
    )

    if (!bestRoute || !amountIn || !amountOut) {
      return {
        state: V3TradeState.NO_ROUTE_FOUND,
        trade: null,
      }
    }

    return {
      state: V3TradeState.VALID,
      trade: Trade.createUncheckedTrade({
        route: bestRoute,
        tradeType,
        inputAmount: amountIn,
        outputAmount: amountOut,
      }),
    }
  }, [amountSpecified, currencyIn, currencyOut, quotesResults, routes, routesLoading, tradeType])
}
