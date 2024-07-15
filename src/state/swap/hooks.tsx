import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { Pool, Trade as V3Trade, Route } from '@tech-alchemy/best-dex/v3-sdk'
import { Trans } from '@lingui/macro'
import { TWO_PERCENT } from 'constants/misc'
import { useBestV2Trade } from 'hooks/useBestV2Trade'
import { useBestV3Trade } from 'hooks/useBestV3Trade'
import JSBI from 'jsbi'
import { ParsedQs } from 'qs'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { V3TradeState } from 'state/routing/types'
import { isTradeBetter } from 'utils/isTradeBetter'
// import { Text } from 'rebass'

import { useCurrency, useToken } from '../../hooks/Tokens'
import useENS from '../../hooks/useENS'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import useSwapSlippageTolerance from '../../hooks/useSwapSlippageTolerance'
import { Version } from '../../hooks/useToggledVersion'
import { useActiveWeb3React } from '../../hooks/web3'
import { isAddress } from '../../utils'
import { AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field, replaceSwapState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { SwapState } from './reducer'
import { PancakeswapTradeObjectInterface } from 'pages/Swap/PancakeSwap'
export function useSwapState(): AppState['swap'] {
  return useAppSelector((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useAppDispatch()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency.isToken ? currency.address : currency.isNative ? 'ETH' : '',
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount<T extends Currency>(value?: string, currency?: T): CurrencyAmount<T> | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return CurrencyAmount.fromRawAmount(currency, JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: { [address: string]: true } = {
  '0xC8b1540256426fda368Fd91e06Ed01fEFb6981C9': true, // v2 factory
  '0x06Fffa3F0D7776Dd46FBFe5eD1B57021C19f46d0': true, // v2 router 01
  '0xbc22819a34d62BCF5078857450429C6735b04338': true, // v2 router 02
}

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>,
  checksummedAddress: string
): boolean {
  const path = trade instanceof V2Trade ? trade.route.path : trade.route.tokenPath
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof V2Trade
      ? trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
      : false)
  )
}
// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo0(toggledVersion: Version | undefined): {
  currencies: { [field in Field]?: Currency | null }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: ReactNode
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  v3Trade: {
    trade: V3Trade<Currency, Currency, TradeType> | null
    state: V3TradeState
  }
  bestTrade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
  allowedSlippage: Percent
  contractNumber: number
} {
  const { account } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = useMemo(
    () => tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )
  // get v2 and v3 quotes
  // skip if other version is toggled
  // let v2Trade
  const v2Trade = useBestV2Trade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    toggledVersion !== Version.v3 ? parsedAmount : undefined,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    0
  )
  // const v2Trade1 = useBestV2Trade(
  //   isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
  //   toggledVersion !== Version.v3 ? parsedAmount : undefined,
  //   (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
  //   1
  // )

  const v3Trade = useBestV3Trade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    toggledVersion !== Version.v2 ? parsedAmount : undefined,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    0
  )

  const isV2TradeBetter = useMemo(() => {
    try {
      // avoids comparing trades when V3Trade is not in a ready state.
      return toggledVersion === Version.v2 ||
        [V3TradeState.VALID, V3TradeState.SYNCING, V3TradeState.NO_ROUTE_FOUND].includes(v3Trade.state)
        ? isTradeBetter(v3Trade.trade, v2Trade, TWO_PERCENT)
        : undefined
    } catch (e) {
      // v3 trade may be debouncing or fetching and have different
      // inputs/ouputs than v2
      return undefined
    }
  }, [toggledVersion, v2Trade, v3Trade.state, v3Trade.trade])

  // const isV2TradeBetter1 = useMemo(() => {
  //   try {
  //     // avoids comparing trades when V3Trade is not in a ready state.
  //     return toggledVersion === Version.v2 ||
  //       [V3TradeState.VALID, V3TradeState.SYNCING, V3TradeState.NO_ROUTE_FOUND].includes(v3Trade.state)
  //       ? isTradeBetter(v3Trade.trade, v2Trade1, TWO_PERCENT)
  //       : undefined
  //   } catch (e) {
  //     // v3 trade may be debouncing or fetching and have different
  //     // inputs/ouputs than v2
  //     return undefined
  //   }
  // }, [toggledVersion, v2Trade1, v3Trade.state, v3Trade.trade])

  const contractNumber = 0
  // let bestTrade
  const bestTrade = isV2TradeBetter === undefined ? undefined : isV2TradeBetter ? v2Trade : v3Trade.trade
  // const bestTrade1 = isV2TradeBetter1 === undefined ? undefined : isV2TradeBetter1 ? v2Trade1 : v3Trade.trade
  // console.log('bestTrade0', bestTrade0)
  // console.log('bestTrade1', bestTrade1)

  // if (bestTrade0 === undefined) {
  //   bestTrade = bestTrade1
  //   v2Trade = v2Trade1
  //   contractNumber = 1
  // } else {
  //   bestTrade = bestTrade0
  //   v2Trade = v2Trade0
  //   contractNumber = 0
  // }
  // if (randomNum === 0) {
  //   bestTrade = bestTrade0
  //   v2Trade = v2Trade0
  //   contractNumber = 0
  // } else {
  //   bestTrade = bestTrade1
  //   v2Trade = v2Trade1
  //   contractNumber = 1
  // }

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency | null } = {
    [Field.INPUT]: inputCurrency,
    [Field.OUTPUT]: outputCurrency,
  }

  let inputError: ReactNode | undefined
  if (!account) {
    inputError = <Trans>Connect Wallet</Trans>
  }
  // const darkMode = useIsDarkMode()
  if (!parsedAmount) {
    inputError = inputError ?? <Trans>Enter an amount</Trans>
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? <Trans>Select a token</Trans>
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? <Trans>Enter a recipient</Trans>
  } else {
    if (BAD_RECIPIENT_ADDRESSES[formattedTo] || (v2Trade && involvesAddress(v2Trade, formattedTo))) {
      inputError = inputError ?? <Trans>Invalid recipient</Trans>
    }
  }

  const allowedSlippage = useSwapSlippageTolerance(bestTrade ?? undefined)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], bestTrade?.maximumAmountIn(allowedSlippage)]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = <Trans>Insufficient {amountIn.currency.symbol} balance</Trans>
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    v2Trade: v2Trade ?? undefined,
    v3Trade,
    bestTrade: bestTrade ?? undefined,
    allowedSlippage,
    contractNumber,
  }
}

export function useDerivedSwapInfo1(toggledVersion: Version | undefined): {
  currencies: { [field in Field]?: Currency | null }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  inputError?: ReactNode
  v2Trade: V2Trade<Currency, Currency, TradeType> | undefined
  v3Trade: {
    trade: V3Trade<Currency, Currency, TradeType> | null
    state: V3TradeState
  }
  bestTrade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
  allowedSlippage: Percent
  contractNumber: number
} {
  const { account } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = useMemo(
    () => tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )
  // get v2 and v3 quotes
  // skip if other version is toggled
  // let v2Trade
  // const v2Trade0 = useBestV2Trade(
  //   isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
  //   toggledVersion !== Version.v3 ? parsedAmount : undefined,
  //   (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
  //   0
  // )
  const v2Trade = useBestV2Trade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    toggledVersion !== Version.v3 ? parsedAmount : undefined,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    1
  )

  const v3Trade = useBestV3Trade(
    isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
    toggledVersion !== Version.v2 ? parsedAmount : undefined,
    (isExactIn ? outputCurrency : inputCurrency) ?? undefined,
    1
  )

  // console.log('v3Trade1', v3Trade)
  // console.log('')
  const isV2TradeBetter = useMemo(() => {
    try {
      // avoids comparing trades when V3Trade is not in a ready state.
      return toggledVersion === Version.v2 ||
        [V3TradeState.VALID, V3TradeState.SYNCING, V3TradeState.NO_ROUTE_FOUND].includes(v3Trade.state)
        ? isTradeBetter(v3Trade.trade, v2Trade, TWO_PERCENT)
        : undefined
    } catch (e) {
      // v3 trade may be debouncing or fetching and have different
      // inputs/ouputs than v2
      return undefined
    }
  }, [toggledVersion, v2Trade, v3Trade.state, v3Trade.trade])

  // const isV2TradeBetter1 = useMemo(() => {
  //   try {
  //     // avoids comparing trades when V3Trade is not in a ready state.
  //     return toggledVersion === Version.v2 ||
  //       [V3TradeState.VALID, V3TradeState.SYNCING, V3TradeState.NO_ROUTE_FOUND].includes(v3Trade.state)
  //       ? isTradeBetter(v3Trade.trade, v2Trade1, TWO_PERCENT)
  //       : undefined
  //   } catch (e) {
  //     // v3 trade may be debouncing or fetching and have different
  //     // inputs/ouputs than v2
  //     return undefined
  //   }
  // }, [toggledVersion, v2Trade1, v3Trade.state, v3Trade.trade])

  const contractNumber = 1
  // let bestTrade
  // const bestTrade0 = isV2TradeBetter0 === undefined ? undefined : isV2TradeBetter0 ? v2Trade0 : v3Trade.trade
  const bestTrade = isV2TradeBetter === undefined ? undefined : isV2TradeBetter ? v2Trade : v3Trade.trade
  // console.log('bestTrade0', bestTrade0)
  // console.log('bestTrade1', bestTrade1)

  // if (bestTrade0 !== undefined && bestTrade1 !== undefined) {
  //   bestTrade = bestTrade1
  //   v2Trade = v2Trade1
  //   contractNumber = 1
  // } else {
  //   bestTrade = undefined
  //   v2Trade = undefined
  //   contractNumber = 0
  // }

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency | null } = {
    [Field.INPUT]: inputCurrency,
    [Field.OUTPUT]: outputCurrency,
  }

  let inputError: ReactNode | undefined
  if (!account) {
    inputError = <Trans>Connect Wallet</Trans>
  }

  if (!parsedAmount) {
    inputError = inputError ?? <Trans>Enter an amount</Trans>
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? <Trans>Select a token</Trans>
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? <Trans>Enter a recipient</Trans>
  } else {
    if (BAD_RECIPIENT_ADDRESSES[formattedTo] || (v2Trade && involvesAddress(v2Trade, formattedTo))) {
      inputError = inputError ?? <Trans>Invalid recipient</Trans>
    }
  }

  const allowedSlippage = useSwapSlippageTolerance(bestTrade ?? undefined)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], bestTrade?.maximumAmountIn(allowedSlippage)]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = <Trans>Insufficient {amountIn.currency.symbol} balance</Trans>
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    v2Trade: v2Trade ?? undefined,
    v3Trade,
    bestTrade: bestTrade ?? undefined,
    allowedSlippage,
    contractNumber,
  }
}

export function useDerivedSwapInfo2(pancakeSwap: PancakeswapTradeObjectInterface | undefined | null): {
  currencies: { [field in Field]?: Currency | null }
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  parsedAmount: CurrencyAmount<Currency> | undefined
  contractNumber: number
  trade: V3Trade<Currency, Currency, TradeType> | undefined
  inputError?: ReactNode
} {
  const { account } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()
  const [token1Address, token2Address] = [
    pancakeSwap?.inputAmount?.currency.address,
    pancakeSwap?.outputAmount?.currency.address,
  ]
  const token1 = useToken(token1Address)
  const token2 = useToken(token2Address)
  let pool
  let route
  let trade
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const isExactIn: boolean = independentField === Field.INPUT
  const recipientLookup = useENS(recipient ?? undefined)

  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const parsedAmount = useMemo(
    () => tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
    [inputCurrency, isExactIn, outputCurrency, typedValue]
  )

  const poolsArray: Pool[] = []
  let isLiquidityPresent = true
  pancakeSwap?.routes[0]?.pools?.forEach((pool) => {
    if (!pool.liquidity) {
      isLiquidityPresent = false
    }
  })
  if (pancakeSwap && pancakeSwap.routes && token1 && token2 && parsedAmount && isLiquidityPresent) {
    for (let i = 0; i < pancakeSwap.routes[0].pools.length; i++) {
      const pools = pancakeSwap.routes[0].pools[i]
      const token0 = new Token(
        pools.token0.chainId,
        pools.token0.address,
        pools.token0.decimals,
        pools.token0.symbol,
        pools.token0.name
      )
      console.log({ token0 })
      const token1 = new Token(
        pools.token1.chainId,
        pools.token1.address,
        pools.token1.decimals,
        pools.token1.symbol,
        pools.token1.name
      )

      if (token0 && token1 && pools.liquidity) {
        try {
          pool = new Pool(token0, token1, pools.fee, pools.sqrtRatioX96, pools.liquidity, pools.tick)
          poolsArray.push(pool)
        } catch (e) {
          console.log(e)
        }
      }
    }
    route = new Route(poolsArray, token1, token2)
    try {
      trade = V3Trade.createUncheckedTrade({
        route,
        inputAmount: isExactIn ? parsedAmount : CurrencyAmount.fromRawAmount(token1, pancakeSwap.inputAmount.numerator),
        outputAmount: isExactIn
          ? CurrencyAmount.fromRawAmount(token2, pancakeSwap.outputAmount.numerator)
          : parsedAmount,
        tradeType: TradeType.EXACT_INPUT,
      })
    } catch (e) {
      console.log({ trade })
    }
  }

  // const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null
  const relevantTokenBalances = useCurrencyBalances(
    account ?? undefined,
    useMemo(() => [inputCurrency ?? undefined, outputCurrency ?? undefined], [inputCurrency, outputCurrency])
  )

  const contractNumber = 2
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  const currencies: { [field in Field]?: Currency | null } = {
    [Field.INPUT]: inputCurrency,
    [Field.OUTPUT]: outputCurrency,
  }

  let inputError: ReactNode | undefined
  if (!account) {
    inputError = <Trans>Connect Wallet</Trans>
  }

  if (!parsedAmount) {
    inputError = inputError ?? <Trans>Enter an amount</Trans>
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? <Trans>Select a token</Trans>
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? <Trans>Enter a recipient</Trans>
  } else {
    if (BAD_RECIPIENT_ADDRESSES[formattedTo]) {
      inputError = inputError ?? <Trans>Invalid recipient</Trans>
    }
  }
  const allowedSlippage = useSwapSlippageTolerance(trade ?? undefined)
  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], trade?.maximumAmountIn(allowedSlippage)]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = <Trans>Insufficient {amountIn.currency.symbol} balance</Trans>
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    contractNumber,
    trade,
    inputError,
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'ETH') return 'ETH'
  }
  return ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): Field {
  return typeof urlParam === 'string' && urlParam.toLowerCase() === 'output' ? Field.OUTPUT : Field.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToSwapState(parsedQs: ParsedQs, chainId?: number | undefined): SwapState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  if (inputCurrency === '' && outputCurrency === '') {
    // default to ETH input
    inputCurrency = 'ETH'
  } else if (inputCurrency === outputCurrency) {
    // clear output if identical
    outputCurrency = ''
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency === '' ? null : inputCurrency ?? null,
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency === '' ? null : outputCurrency ?? null,
    },
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToSwapState(parsedQs, chainId)
    const inputCurrencyId = parsed[Field.INPUT].currencyId ?? undefined
    const outputCurrencyId = parsed[Field.OUTPUT].currencyId ?? undefined

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId,
        outputCurrencyId,
        recipient: parsed.recipient,
      })
    )

    setResult({ inputCurrencyId, outputCurrencyId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
