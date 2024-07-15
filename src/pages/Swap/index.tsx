import { Trans } from '@lingui/macro'
import { Currency, CurrencyAmount, Percent, Token, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { Trade as V3Trade } from '@tech-alchemy/best-dex/v3-sdk'

// import { Trade as UniswapV2Trade } from '@uniswap2/v2-sdk'
import Button from 'components/@common/button'
import { LoadingOpacityContainer } from 'components/Loader/styled'
import { NetworkAlert } from 'components/NetworkAlert/NetworkAlert'
import { AdvancedSwapDetails, MyAdvancedSwapDetails } from 'components/swap/AdvancedSwapDetails'
import { AutoRouterLogo } from 'components/swap/RouterLabel'
import SwapRoute from 'components/swap/SwapRoute'
import TradePrice from 'components/swap/TradePrice'
import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { MouseoverTooltip, MouseoverTooltipContent } from 'components/Tooltip'
import { defaultVersion, VersionType } from 'config'
import JSBI from 'jsbi'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, CheckCircle, HelpCircle, Info } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { V3TradeState } from 'state/routing/types'
import styled, { ThemeContext } from 'styled-components/macro'

import arrow_down_up from '../../assets/images/icons/arrow-down-up.svg'
import Arrow_upDown_darkTheme from '../../assets/images/Arrow_upDown_darkTheme.png'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonConfirmed, ButtonError, ButtonPrimary } from '../../components/Button'
import Card, { DisabledCard, GreyCard } from '../../components/Card'
import { AutoColumn, CustomColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import CurrencyLogo from '../../components/CurrencyLogo'
import Loader from '../../components/Loader'
import Row, { AutoRow, RowFixed } from '../../components/Row'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import {
  ArrowWrapper,
  Dots,
  ResponsiveTooltipContainer,
  SwapCallbackError,
  Wrapper,
} from '../../components/swap/styleds'
import SwapHeader from '../../components/swap/SwapHeader'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import TokenWarningModal from '../../components/TokenWarningModal'
import { useAllTokens, useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useERC20PermitFromTrade, UseERC20PermitState } from '../../hooks/useERC20Permit'
import useIsArgentWallet from '../../hooks/useIsArgentWallet'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion from '../../hooks/useToggledVersion'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useActiveWeb3React } from '../../hooks/web3'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo0,
  useDerivedSwapInfo1,
  useDerivedSwapInfo2,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useExpertModeManager, useRoutingAPIEnabled } from '../../state/user/hooks'
import { LinkStyledButton, ThemedText } from '../../theme'
import { computeFiatValuePriceImpact } from '../../utils/computeFiatValuePriceImpact'
import { getTradeVersion } from '../../utils/getTradeVersion'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'
import { useAppDispatch } from 'state/hooks'
import { showGlobalLoader } from '../../state/application/reducer'
// import { swapFromPancake } from 'utils/pancakeswap'
import { PancakeswapTradeObjectInterface, ParamsPancake } from 'pages/Swap/PancakeSwap'
// import { JsonRpcProvider } from '@ethersproject/providers'
import { isNativeToken } from 'utils/getNativeTokenInfo'

const StyledInfo = styled(Info)`
  height: 16px;
  width: 16px;
  margin-left: 4px;
  color: ${({ theme }) => theme.text3};
  :hover {
    color: ${({ theme }) => theme.text1};
  }
`
export default function Swap({ history }: RouteComponentProps) {
  const { account, chainId } = useActiveWeb3React()
  const loadedUrlParams = useDefaultsFromURLSearch()
  const dispatch = useAppDispatch()
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c?.isToken ?? false) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )
  const [pendingApprovalState, setPendingApprovalState] = useState<boolean>(false)
  const [approvedTrade, setApprovedTrade] = useState<
    V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
  >(undefined)
  const [pancakeSwapTrade, setPancakeSwapTrade] = useState<PancakeswapTradeObjectInterface | null | undefined>(
    undefined
  )

  const throttling = useRef(false)

  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault = useMemo(
    () =>
      urlLoadedTokens &&
      urlLoadedTokens.filter((token: Token) => {
        return !Boolean(token.address in defaultTokens)
      }),
    [defaultTokens, urlLoadedTokens]
  )

  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get version from the url
  const toggledVersion = useToggledVersion()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()

  // for rendering DEX inside best wallet
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)

  // LE contract values which are default values
  let {
    v3Trade: { state: v3TradeState },
    bestTrade: trade,
    allowedSlippage,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    contractNumber,
  } = useDerivedSwapInfo0(toggledVersion)
  // uniswap contract values
  const {
    v3Trade: { state: v3TradeState1 },
    bestTrade: trade1,
    allowedSlippage: allowedSlippage1,
    currencyBalances: currencyBalances1,
    parsedAmount: parsedAmount1,
    currencies: currencies1,
    inputError: swapInputError1,
    contractNumber: contractNumber1,
  } = useDerivedSwapInfo1(toggledVersion)

  const {
    currencies: currencies2,
    parsedAmount: parsedAmount2,
    trade: trade2,
    inputError: inputError2,
  } = useDerivedSwapInfo2(pancakeSwapTrade)

  // logic to get tradeType without trade object
  let tradeType2: number
  if (parsedAmount2?.currency.symbol === currencies2.INPUT?.symbol) {
    tradeType2 = 0
  } else {
    tradeType2 = 1
  }

  let paramsPancake: ParamsPancake
  if (parsedAmount2) {
    const numerator = BigInt(
      Math.trunc(parseFloat(parsedAmount2?.toSignificant(10)) * 10 ** parsedAmount2?.currency.decimals)
    )

    const tradetypeVerbal = [currencies2.INPUT, currencies2.OUTPUT]
    let tempVar = 0
    if (tradeType2 === 0) {
      tempVar = 1
    }
    paramsPancake = {
      amount: {
        numerator,
        denominator: '1',
        currency: {
          chainId: parsedAmount2?.currency.chainId,
          decimals: parsedAmount2?.currency.decimals,
          symbol: parsedAmount2?.currency.symbol,
          name: parsedAmount2?.currency.name,
          isNative: parsedAmount2?.currency.isNative,
          isToken: parsedAmount2?.currency.isToken,
          address: tradetypeVerbal[tradeType2]?.wrapped.address,
          projectLink: '',
          wrapped: {
            address: tradetypeVerbal[tradeType2]?.wrapped.address,
            chainId: parsedAmount2?.currency.chainId,
            decimals: parsedAmount2?.currency.decimals,
            symbol: parsedAmount2?.currency.symbol,
            name: parsedAmount2?.currency.name,
            projectLink: '',
          },
        },
        decimalScale: BigInt(Math.trunc(10 ** parsedAmount2?.currency.decimals)),
      },
      currency: {
        address: tradetypeVerbal[tempVar]?.wrapped.address,
        chainId: tradetypeVerbal[tempVar]?.wrapped.chainId,
        decimals: tradetypeVerbal[tempVar]?.wrapped.decimals,
        symbol: tradetypeVerbal[tempVar]?.wrapped.symbol,
        name: tradetypeVerbal[tempVar]?.wrapped.name,
        logoURI: '',
        wrapped: {
          address: tradetypeVerbal[tempVar]?.wrapped.address,
          chainId: tradetypeVerbal[tempVar]?.wrapped.chainId,
          decimals: tradetypeVerbal[tempVar]?.wrapped.decimals,
          symbol: tradetypeVerbal[tempVar]?.wrapped.symbol,
          name: tradetypeVerbal[tempVar]?.wrapped.name,
          logoURI: '',
        },
      },
      tradeType: tradeType2,
    }
  }
  const JSONStringify = (data: any) => {
    const bigInts = /([[:])?"(\d+)n"([,}\]])/g
    const preliminaryJSON = JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value
    )
    const finalJSON = preliminaryJSON.replace(bigInts, '$1$2$3')

    return finalJSON
  }

  // API call to get pancake trade object
  const handleThrottleSearch = () => {
    if (throttling.current) {
      return
    }
    // If there is no search term, do not make API call
    if (!paramsPancake) {
      return
    }
    throttling.current = true
    setTimeout(() => {
      throttling.current = false
      fetch('https://v32taybhxj.execute-api.eu-west-2.amazonaws.com/staging/api/pancake', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        //credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSONStringify(paramsPancake),
      })
        .then(async (response) => {
          if (!response.ok) {
            console.log('Something went wrong!')
            setPancakeSwapTrade(null)
          } else {
            const data = await response.json()
            setPancakeSwapTrade(data)
          }
        })
        .catch((err) => {
          setPancakeSwapTrade(null)
          console.error(err)
        })
    }, 1000)
  }

  handleThrottleSearch()
  // const getPancakeswapTrade = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5045/getTrades', {
  //       method: 'POST',
  //       mode: 'cors',
  //       cache: 'no-cache',
  //       //credentials: 'include',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       redirect: 'follow',
  //       referrerPolicy: 'no-referrer',
  //       body: JSONStringify(paramsPancake),
  //     })
  //     return await response.json()
  //   } catch (error) {
  //     console.log('from log', error)
  //   }
  // }

  const pancakeswapTradeObject: PancakeswapTradeObjectInterface | undefined | null = pancakeSwapTrade

  const priceImpact0 = MyAdvancedSwapDetails(trade, allowedSlippage)
  const priceImpact1 = MyAdvancedSwapDetails(trade1, allowedSlippage1)
  const priceImpact2 = pancakeswapTradeObject ? pancakeswapTradeObject.priceImpactFormatted : '-'

  function compareTradeViaPriceImpact(p0: number, p1: number, p2: number) {
    const mvp = {
      value: p0,
      source: 0,
    }
    if (Number.isNaN(p0)) {
      p0 = 100
    }
    if (Number.isNaN(p1)) {
      p1 = 100
    }
    if (Number.isNaN(p2)) {
      p2 = 100
    }

    const d01 = Math.abs(p0) - Math.abs(p1)
    const d02 = Math.abs(p0) - Math.abs(p2)
    if (d01 > 15 || d02 > 15) {
      if (d01 > d02) {
        mvp.value = p1
        mvp.source = 1
      } else {
        mvp.value = p2
        mvp.source = 2
      }
    }
    if (Number.isNaN(mvp.value)) {
      mvp.source = NaN
    }
    return mvp
  }
  // 0 =bestdex, 1=uniswap, 2=pancake
  const mvp = compareTradeViaPriceImpact(Number(priceImpact0), Number(priceImpact1), Number(priceImpact2))
  if (!Number.isNaN(mvp.source)) {
    if (mvp.source === 0) {
      // usual trade state that is bestdex which is default assigned
    } else if (mvp.source === 1) {
      // uniswap
      // const pancakeSwapTrade = V3Trade.createUncheckedTrade({
      //   route : pancakeswapTradeObject ? pancakeswapTradeObject.routes[0] : [],
      // })
      v3TradeState = v3TradeState1
      trade = trade1
      allowedSlippage = allowedSlippage1
      currencyBalances = currencyBalances1
      parsedAmount = parsedAmount1
      currencies = currencies1
      swapInputError = swapInputError1
      contractNumber = contractNumber1
    } else if (mvp.source === 2) {
      // pancake
      contractNumber = 2
      trade = trade2
      swapInputError = inputError2
    }
  }
  const [wrapTransaction, setWrapTransaction] = useState(false)
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)

  const handleWrap = useCallback(() => {
    setWrapTransaction(true)
    if (typeof onWrap === 'function') {
      onWrap()
        .then(() => {
          setWrapTransaction(false)
        })
        .catch((error) => {
          setWrapTransaction(false)
        })
    }
  }, [onWrap])

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            [Field.INPUT]: parsedAmount,
            [Field.OUTPUT]: parsedAmount,
          }
        : {
            [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
            [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade]
  )
  // async function comparison() {
  //   if (trade?.tradeType === 0 || trade1?.tradeType === 0 || pancakeswapTradeObject?.tradeType === 0) {
  //     const value0 = parseFloat(formattedAmounts.OUTPUT)
  //     const value1 = parseFloat(formattedAmounts1.OUTPUT)
  //   }
  //   const value2 =
  //     pancakeswapTradeObject?.outputAmount.numerator /
  //     pancakeswapTradeObject?.outputAmount.denominator /
  //     pancakeswapTradeObject?.outputAmount.decimalScale
  //   // BigInt(pancakeswapTradeObject?.outputAmount.numerator) /
  //   // BigInt(pancakeswapTradeObject?.outputAmount.denominator) /
  //   // BigInt(pancakeswapTradeObject?.outputAmount.decimalScale)

  // }
  // comparison()

  const [routeNotFound, routeIsLoading, routeIsSyncing] = useMemo(
    () => [
      trade instanceof V3Trade ? !trade?.swaps : !trade?.route,
      V3TradeState.LOADING === v3TradeState,
      V3TradeState.SYNCING === v3TradeState,
    ],
    [trade, v3TradeState]
  )

  const [routeIsLoading1, routeIsSyncing1] = useMemo(
    () => [V3TradeState.LOADING === v3TradeState1, V3TradeState.SYNCING === v3TradeState1],
    [v3TradeState1]
  )
  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = routeIsSyncing ? undefined : computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      setPancakeSwapTrade(undefined)
      setApprovedTrade(undefined)
      setApprovalSubmitted(false)
      onUserInput(Field.INPUT, value)
      setSwapState((prev) => ({
        ...prev,
        swapErrorMessage: undefined,
      }))
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      setPancakeSwapTrade(undefined)
      setApprovedTrade(undefined)
      setApprovalSubmitted(false)
      onUserInput(Field.OUTPUT, value)
      setSwapState((prev) => ({
        ...prev,
        swapErrorMessage: undefined,
      }))
    },
    [onUserInput]
  )

  // reset if they close warning without tokens in params
  const handleDismissTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
    history.push('/swap/')
  }, [history])

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // bestdex formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, parsedAmounts, showWrap, typedValue]
  )
  // uniswap formatted amounts
  // const { wrapType: wrapType1 } = useWrapCallback(currencies1[Field.INPUT], currencies1[Field.OUTPUT], typedValue)
  // const showWrap1: boolean = wrapType1 !== WrapType.NOT_APPLICABLE
  // const parsedAmounts1 = useMemo(
  //   () =>
  //     showWrap1
  //       ? {
  //           [Field.INPUT]: parsedAmount1,
  //           [Field.OUTPUT]: parsedAmount1,
  //         }
  //       : {
  //           [Field.INPUT]: independentField === Field.INPUT ? parsedAmount1 : trade1?.inputAmount,
  //           [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount1 : trade1?.outputAmount,
  //         },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [showWrap1]
  // )

  // const formattedAmounts1 = useMemo(
  //   () => ({
  //     [independentField]: typedValue,
  //     [dependentField]: showWrap1
  //       ? parsedAmounts1[independentField]?.toExact() ?? ''
  //       : parsedAmounts1[dependentField]?.toSignificant(6) ?? '',
  //   }),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [parsedAmounts1, showWrap1]
  // )
  // }
  // async function pancakeFormatAmount() {
  //   let formattedAmounts
  //   pancakeswapTradeObject = await getPancakeswapTrade()
  //   if (pancakeswapTradeObject !== undefined) {
  //     console.log('pancakeswapTradeObject: ', pancakeswapTradeObject)
  //     formattedAmounts = {
  //       INPUT: (
  //         pancakeswapTradeObject.inputAmount.numerator / pancakeswapTradeObject.inputAmount.decimalScale
  //       ).toString(),
  //       OUTPUT: (
  //         pancakeswapTradeObject.outputAmount.numerator / pancakeswapTradeObject.outputAmount.decimalScale
  //       ).toString(),
  //     }
  //   }
  //   // console.log('formattedAmounts1', formattedAmounts)
  //   return formattedAmounts
  // }
  // pancakeFormatAmount()

  // async function compareLiquidities() {
  //   const pancake = await pancakeFormatAmount()
  //   // const uniswap = formattedAmounts1
  //   console.log('pancakeFormattedAmounts: ', pancake)
  //   // console.log('uniswapFormattedAmounts: ', uniswap)
  // }
  // compareLiquidities()

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, mvp.source)
  const {
    state: signatureState,
    signatureData,
    gatherPermitSignature,
  } = useERC20PermitFromTrade(trade, allowedSlippage)

  const handleApprove = async () => {
    if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
      try {
        await gatherPermitSignature()
        setPendingApprovalState(false)
      } catch (error) {
        setPendingApprovalState(false)
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (error?.code !== 4001) {
          try {
            await approveCallback()
            setApprovedTrade(trade)
          } catch (error) {
            setApprovedTrade(undefined)
            console.log(error)
          } finally {
            setPendingApprovalState(false)
          }
        }
      }
    } else {
      try {
        await approveCallback()
        setApprovedTrade(trade)
        ReactGA.event({
          category: 'Swap',
          action: 'Approve',
          label: [trade?.inputAmount.currency.symbol, toggledVersion].join('/'),
        })
      } catch (e) {
        setApprovedTrade(undefined)
        console.log(e)
      } finally {
        setPendingApprovalState(false)
      }
    }
  }
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])
  /**
   * pointing to swap v2 by default
   */
  useEffect(() => {
    if (defaultVersion === VersionType.v2) {
      history.push({ search: '?use=v2' })
    }
  }, [history])
  /**
   * showing global loader for bestwallet client
   */
  useEffect(() => {
    if (clientType === CLIENT_BEST_WALLET && !account) {
      dispatch(showGlobalLoader({ showGlobalLoader: true }))
    } else {
      dispatch(showGlobalLoader({ showGlobalLoader: false }))
    }
  }, [account, dispatch, clientType])

  const maxInputAmount: CurrencyAmount<Currency> | undefined = useMemo(
    () => maxAmountSpend(currencyBalances[Field.INPUT]),
    [currencyBalances]
  )
  const showMaxButton = Boolean(maxInputAmount?.greaterThan(0) && !parsedAmounts[Field.INPUT]?.equalTo(maxInputAmount))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    approvedTrade ? approvedTrade : trade,
    allowedSlippage,
    recipient,
    signatureData,
    contractNumber,
    typedValue
  )

  // const { callback: swapCallbackPancakeswap, error: swapCallbackErrorPancakeswap } = useSwapCallbackPancakeswap(
  //   // paramsPancake.amount.currency.isNative,
  //   pathPancake,
  //   recipient,
  //   amountIn,
  //   amountOutMinimum,
  //   typedValue
  // )

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })
        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade),
            'MH',
          ].join('/'),
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message ? error.message : error,
          txHash: undefined,
        })
      })
  }, [swapCallback, priceImpact, tradeToConfirm, showConfirm, recipient, recipientAddress, account, trade])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)
  // warnings on the greater of fiat value price impact and execution price impact
  const denominatorLocal = 100000
  const optionalPriceImpact = mvp.source === 2 ? `-${priceImpact2}%` : null

  const executionPriceImpact =
    mvp.source === 2
      ? new Percent(JSBI.BigInt(Math.trunc(parseFloat(priceImpact2) * 1000)) ?? 0, JSBI.BigInt(denominatorLocal) ?? 0)
      : trade?.priceImpact
  const priceImpactSeverity = warningSeverity(
    executionPriceImpact && priceImpact
      ? executionPriceImpact.greaterThan(priceImpact)
        ? executionPriceImpact
        : priceImpact
      : executionPriceImpact ?? priceImpact
  )
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const isArgentWallet = useIsArgentWallet()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setPancakeSwapTrade(undefined)
      setApprovedTrade(undefined)
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
      setSwapState((prev) => ({
        ...prev,
        swapErrorMessage: undefined,
      }))
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
    setPancakeSwapTrade(undefined)
    setApprovedTrade(undefined)
    setApprovalSubmitted(false)
    ReactGA.event({
      category: 'Swap',
      action: 'Max',
    })
    setSwapState((prev) => ({
      ...prev,
      swapErrorMessage: undefined,
    }))
  }, [maxInputAmount, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      setPancakeSwapTrade(undefined)
      setApprovedTrade(undefined)
      setApprovalSubmitted(false)
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      setSwapState((prev) => ({
        ...prev,
        swapErrorMessage: undefined,
      }))
    },
    [onCurrencySelection]
  )
  const isInputNative = isNativeToken(chainId, parsedAmounts[Field.INPUT]?.currency.symbol ?? '')
  const swapIsUnsupported = useIsSwapUnsupported(currencies[Field.INPUT], currencies[Field.OUTPUT])

  const priceImpactTooHigh = priceImpactSeverity > 3 && !isExpertMode
  const routingAPIEnabled = useRoutingAPIEnabled()

  return (
    <>
      <TokenWarningModal
        isOpen={importTokensNotInDefault.length > 0 && !dismissTokenWarning}
        tokens={importTokensNotInDefault}
        onConfirm={handleConfirmTokenWarning}
        onDismiss={handleDismissTokenWarning}
      />
      <NetworkAlert />
      <AppBody {...{ boxShadow: 'lg' }}>
        <SwapHeader allowedSlippage={allowedSlippage} />
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
            priceImpactInput={optionalPriceImpact ?? trade?.priceImpact}
          />
          <Card padding="20px">
            <AutoColumn gap={'sm'}>
              <CustomColumn id="input-container" gap="xlg">
                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap ? <Trans>From (at most)</Trans> : <Trans>From</Trans>
                  }
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={showMaxButton}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  fiatValue={fiatValueInput ?? undefined}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  showCommonBases={true}
                  id="swap-currency-input"
                  loading={independentField === Field.OUTPUT && routeIsSyncing}
                />
                <ArrowWrapper
                  clickable
                  onClick={() => {
                    setApprovalSubmitted(false) // reset 2 step UI for approvals
                    onSwitchTokens()
                  }}
                >
                  {theme.darkMode ? (
                    <img style={{ width: '50px' }} src={Arrow_upDown_darkTheme} alt="Arrow_upDown_darkTheme" />
                  ) : (
                    <img style={{ width: '25px' }} src={arrow_down_up} alt="arrow up down" />
                  )}
                  {/* <img style={{ width: '25px' }} src={arrow_down_up} alt="arrow up down" /> */}
                  {/* <ArrowDown
                  size="16"
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.text1 : theme.text3}
                /> */}
                </ArrowWrapper>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap ? <Trans>To (at least)</Trans> : <Trans>To</Trans>
                  }
                  showMaxButton={false}
                  hideBalance={false}
                  fiatValue={fiatValueOutput ?? undefined}
                  priceImpact={priceImpact}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  showCommonBases={true}
                  id="swap-currency-output"
                  loading={independentField === Field.INPUT && routeIsSyncing}
                />
              </CustomColumn>

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.text2} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      <Trans>- Remove recipient</Trans>
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {!showWrap && trade && (
                <Row margin="15px 0px 0px 0px" justify={!trade ? 'center' : 'space-between'}>
                  <RowFixed style={{ position: 'relative' }}>
                    <MouseoverTooltipContent
                      wrap={false}
                      content={
                        <ResponsiveTooltipContainer>
                          <SwapRoute trade={trade} syncing={routeIsSyncing} />
                        </ResponsiveTooltipContainer>
                      }
                      placement="bottom"
                      onOpen={() =>
                        ReactGA.event({
                          category: 'Swap',
                          action: 'Router Tooltip Open',
                        })
                      }
                    >
                      <AutoRow gap="4px" width="auto">
                        <AutoRouterLogo />
                        {routingAPIEnabled ? (
                          <Text style={{ fontSize: '14px', fontWeight: 500 }}>Auto Router</Text>
                        ) : (
                          <Text style={{ fontSize: '14px', fontWeight: 500 }}>Trade Route</Text>
                        )}
                        <LoadingOpacityContainer $loading={routeIsSyncing}>
                          {trade instanceof V3Trade && trade.swaps.length > 1 && (
                            <ThemedText.Blue fontSize={14}>{trade.swaps.length} routes</ThemedText.Blue>
                          )}
                        </LoadingOpacityContainer>
                      </AutoRow>
                    </MouseoverTooltipContent>
                  </RowFixed>
                  <RowFixed>
                    <LoadingOpacityContainer $loading={routeIsSyncing}>
                      <TradePrice
                        price={trade.executionPrice}
                        showInverted={showInverted}
                        setShowInverted={setShowInverted}
                      />
                    </LoadingOpacityContainer>
                    <MouseoverTooltipContent
                      wrap={false}
                      content={
                        <ResponsiveTooltipContainer origin="top right" width={'295px'}>
                          <AdvancedSwapDetails
                            trade={trade}
                            allowedSlippage={allowedSlippage}
                            syncing={routeIsSyncing}
                            priceImpactInput={optionalPriceImpact ?? trade?.priceImpact}
                          />
                        </ResponsiveTooltipContainer>
                      }
                      placement="bottom"
                      onOpen={() =>
                        ReactGA.event({
                          category: 'Swap',
                          action: 'Transaction Details Tooltip Open',
                        })
                      }
                    >
                      <StyledInfo />
                    </MouseoverTooltipContent>
                  </RowFixed>
                </Row>
              )}

              <Card padding="0px" margin="15px 0px 0px 0px">
                {swapIsUnsupported ? (
                  <ButtonPrimary disabled={true}>
                    <ThemedText.Main mb="4px">
                      <Trans>Unsupported Asset</Trans>
                    </ThemedText.Main>
                  </ButtonPrimary>
                ) : !account ? (
                  <Button
                    type="SECONDARY"
                    size="XLARGE"
                    center={true}
                    disabled={clientType === CLIENT_BEST_WALLET}
                    fillWidth={true}
                    onClick={toggleWalletModal}
                    // backgroundColor={'#757dff'}
                    fontColor="white"
                  >
                    {clientType === CLIENT_BEST_WALLET ? (
                      <Dots>
                        <Trans>Loading</Trans>
                      </Dots>
                    ) : (
                      <Trans>Connect Wallet</Trans>
                    )}
                  </Button>
                ) : showWrap ? (
                  wrapTransaction ? (
                    <GreyCard style={{ textAlign: 'center' }}>
                      <ThemedText.Main mb="4px">
                        <Dots>
                          <Trans>Loading</Trans>
                        </Dots>
                      </ThemedText.Main>
                    </GreyCard>
                  ) : (
                    <ButtonPrimary
                      disabled={Boolean(wrapInputError) || wrapTransaction}
                      onClick={() => {
                        handleWrap()
                      }}
                    >
                      {wrapInputError ??
                        (wrapType === WrapType.WRAP ? (
                          <Trans>
                            Wrap
                            {/* {wrapTransaction ? <Loader /> : 'Wrap'} */}
                          </Trans>
                        ) : wrapType === WrapType.UNWRAP ? (
                          <Trans>
                            Unwrap
                            {/* {wrapTransaction ? <Loader /> : 'Unwrap'} */}
                          </Trans>
                        ) : null)}
                    </ButtonPrimary>
                  )
                ) : routeIsSyncing ||
                  routeIsLoading ||
                  routeIsLoading1 ||
                  routeIsSyncing1 ||
                  (pancakeSwapTrade === undefined && formattedAmounts[Field.INPUT]) ||
                  (approvalState === ApprovalState.UNKNOWN &&
                    !isInputNative &&
                    formattedAmounts[Field.INPUT] &&
                    formattedAmounts[Field.OUTPUT]) ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <ThemedText.Main mb="4px">
                      <Dots>
                        <Trans>Loading</Trans>
                      </Dots>
                    </ThemedText.Main>
                  </GreyCard>
                ) : routeNotFound && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <ThemedText.Red mb="4px">
                      <Trans>Insufficient liquidity for this trade.</Trans>
                    </ThemedText.Red>
                  </GreyCard>
                ) : showApproveFlow ? (
                  <AutoRow style={{ flexWrap: 'nowrap', width: '100%' }}>
                    <AutoColumn style={{ width: '100%' }} gap="12px">
                      <ButtonConfirmed
                        onClick={() => {
                          setPendingApprovalState(true)
                          handleApprove()
                        }}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted ||
                          signatureState === UseERC20PermitState.SIGNED
                        }
                        width="100%"
                        altDisabledStyle={approvalState === ApprovalState.PENDING} // show solid button while waiting
                        confirmed={
                          approvalState === ApprovalState.APPROVED || signatureState === UseERC20PermitState.SIGNED
                        }
                      >
                        <AutoRow justify="space-between" style={{ flexWrap: 'nowrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            <CurrencyLogo
                              currency={currencies[Field.INPUT]}
                              size={'20px'}
                              style={{ marginRight: '8px', flexShrink: 0 }}
                            />
                            {/* we need to shorten this string on mobile */}
                            {approvalState === ApprovalState.APPROVED ||
                            signatureState === UseERC20PermitState.SIGNED ? (
                              <Trans>You can now trade {currencies[Field.INPUT]?.symbol}</Trans>
                            ) : (
                              <Trans>Allow the BestDex Protocol to use your {currencies[Field.INPUT]?.symbol}</Trans>
                            )}
                          </span>
                          {pendingApprovalState || approvalState === ApprovalState.PENDING ? (
                            <Loader stroke="white" />
                          ) : (approvalSubmitted && approvalState === ApprovalState.APPROVED) ||
                            signatureState === UseERC20PermitState.SIGNED ? (
                            <CheckCircle size="20" color={theme.green1} />
                          ) : (
                            <MouseoverTooltip
                              text={
                                <Trans>
                                  You must give the BestDex smart contracts permission to use your{' '}
                                  {currencies[Field.INPUT]?.symbol}. You only have to do this once per token.
                                </Trans>
                              }
                            >
                              <HelpCircle size="20" color={'white'} style={{ marginLeft: '8px' }} />
                            </MouseoverTooltip>
                          )}
                        </AutoRow>
                      </ButtonConfirmed>
                      <ButtonError
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined,
                            })
                          }
                        }}
                        width="100%"
                        id="swap-button"
                        disabled={
                          !isValid ||
                          (approvalState !== ApprovalState.APPROVED && signatureState !== UseERC20PermitState.SIGNED) ||
                          priceImpactTooHigh
                        }
                        error={isValid && priceImpactSeverity > 2}
                      >
                        <Text fontSize={16} fontWeight={500}>
                          {priceImpactTooHigh ? (
                            <Trans>High Price Impact</Trans>
                          ) : priceImpactSeverity > 2 ? (
                            <Trans>Swap Anyway</Trans>
                          ) : (
                            <Trans>Swap</Trans>
                          )}
                        </Text>
                      </ButtonError>
                    </AutoColumn>
                  </AutoRow>
                ) : swapInputError ? (
                  <DisabledCard style={{ textAlign: 'center' }}>
                    {/* <ThemedText.Red mb="4px"> */}
                    <Text fontSize={20} fontWeight={500}>
                      {swapInputError}
                    </Text>
                    {/* </ThemedText.Red> */}
                  </DisabledCard>
                ) : attemptingTxn ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <ThemedText.Main mb="4px">
                      <Dots>
                        <Trans>Loading</Trans>
                      </Dots>
                    </ThemedText.Main>
                  </GreyCard>
                ) : (
                  <Button
                    type="PRIMARY"
                    size="XLARGE"
                    center={true}
                    fillWidth={true}
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                        // const tokenArr = pancakeswapTradeObject?.routes[0]?.path?.map((data) => {
                        //   return data.address
                        // })
                        // const feeArr = pancakeswapTradeObject?.routes[0]?.pools?.map((data) => {
                        //   return data.fee
                        // })
                        // swapFromPancake(
                        //   tokenArr,
                        //   feeArr,
                        //   account,
                        //   deadline,
                        //   paramsPancake.amount.numerator,
                        //   0,
                        //   library?.provider as any,
                        //   account
                        // )
                      }
                    }}
                    id="swap-button"
                    disabled={!isValid || priceImpactTooHigh || !!swapCallbackError}
                    // error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {priceImpactTooHigh ? (
                        <Trans>Price Impact Too High</Trans>
                      ) : priceImpactSeverity > 2 ? (
                        <Trans>Swap Anyway</Trans>
                      ) : (
                        <Trans>Swap</Trans>
                      )}
                    </Text>
                  </Button>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                {/* {swapCallbackError ? <SwapCallbackError error={swapCallbackError} /> : null} */}
              </Card>
            </AutoColumn>
          </Card>
        </Wrapper>
      </AppBody>
      <SwitchLocaleLink />
      {!swapIsUnsupported ? null : (
        <UnsupportedCurrencyFooter
          show={swapIsUnsupported}
          currencies={[currencies[Field.INPUT], currencies[Field.OUTPUT]]}
        />
      )}
    </>
  )
}
