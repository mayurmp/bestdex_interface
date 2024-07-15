import { BigNumber } from '@ethersproject/bignumber'
// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { Currency, Percent, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Router, Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { SwapRouter, Trade as V3Trade } from '@tech-alchemy/best-dex/v3-sdk'
import { ReactNode, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'

import {
  UNISWAP_SWAP_ROUTER_ADDRESSES,
  SWAP_ROUTER_ADDRESSES,
  UNISWAP_V2_ROUTER_ADDRESSES,
  V2_ROUTER_ADDRESS,
  PANCAKESWAP_V3_ROUTER_ADDRESS,
  // PANCAKESWAP_V3_ROUTER_ADDRESS
} from '../constants/addresses'
import { TransactionType } from '../state/transactions/actions'
import { useTransactionAdder } from '../state/transactions/hooks'
import approveAmountCalldata from '../utils/approveAmountCalldata'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { currencyId } from '../utils/currencyId'
import isZero from '../utils/isZero'
import { useArgentWalletContract } from './useArgentWalletContract'
import { useV2RouterContract } from './useContract'
import useENS from './useENS'
import { SignatureData } from './useERC20Permit'
import useTransactionDeadline from './useTransactionDeadline'
import { useActiveWeb3React } from './web3'
import logSwapInfo from '../utils/logSwapInfo'
import { JsonRpcProvider } from '@ethersproject/providers'
import abiPancakeswap from '../utils/abi/abiPancakeswap.json'
// eslint-disable-next-line no-restricted-imports
import { ethers } from 'ethers'
import Bugsnag from '@bugsnag/js'
import { getProviderOrSigner } from '../utils/index'
import { geotargetly_loaded } from 'utils/findCountry'
enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  address: string
  calldata: string
  value: string
}

interface SwapCallEstimate {
  call: SwapCall
}

interface SuccessfulCall extends SwapCallEstimate {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  call: SwapCall
  error: Error
}

const RPC_URL = 'https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY
const country_name = geotargetly_loaded()

function useSwapCallArgumentsPancakeswap(
  isNative: boolean,
  path: string,
  recipient: string | null | undefined,
  amountIn: string | undefined,
  // deadline: string,
  amountOutMinimum: string
) {
  const { account, chainId, library } = useActiveWeb3React()

  // const { address: recipientAddress } = useENS(recipientAddressOrName)
  // const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  if (!recipient || !library || !account || !chainId || !deadline || !amountIn) {
    return []
  }
  const address = '0x1b81D678ffb9C0263b24A97847620C99d213eB14'
  const contract = new ethers.Contract(address, abiPancakeswap, getProviderOrSigner(library, account) as any)
  const functionName = 'exactInput'
  let value: string
  if (isNative) {
    value = ethers.utils.parseEther('0.0001').toHexString() // amountIn
  } else {
    value = '0x00'
  }

  const args = [path, recipient, deadline, amountIn, ethers.utils.parseEther(amountOutMinimum)]
  const calldata = contract.interface.encodeFunctionData(functionName, [args])
  console.log({ calldata })
  console.log({ amountIn })
  return [
    {
      address,
      calldata,
      value,
    },
  ]
}

export function useSwapCallbackPancakeswap(
  // isNative: boolean,
  path: string,
  recipientAddressOrName: string | null,
  amountIn: string | undefined,
  amountOutMinimum: string,
  typedValue: string
) {
  const { account, chainId, library } = useActiveWeb3React()
  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  const swapCalls = useSwapCallArgumentsPancakeswap(true, path, recipient, amountIn, amountOutMinimum)
  // if (!recipient || !library || !account || !chainId) {
  //   return []
  // }
  // const sendSwapLog = useCallback(
  //   async (response: any, trade: any) => {
  //     console.log('rpc url', RPC_URL)
  //     const providerData = new JsonRpcProvider(RPC_URL ?? '')
  //     const interval = 3000
  //     const maxInterval = interval * 10 * 10
  //     const checkStatus = (_interval: number) => {
  //       setTimeout(async () => {
  //         const tx = await providerData.getTransactionReceipt(response?.hash)
  //         if (tx?.status === 1) {
  //           logSwapInfo({
  //             transactionHash: response?.hash,
  //             path: (trade.route as any)?.path?.map((item: any) =>
  //               item?.tokenInfo ? { ...item?.tokenInfo, isNative: item?.isNative, isToken: item?.isToken } : item
  //             ),
  //             userInput: typedValue ? typedValue : '',
  //           })
  //         }
  //         if (tx?.status !== 1 && tx?.status !== 0) {
  //           if (_interval * 10 <= maxInterval) {
  //             checkStatus(_interval * 10)
  //           }
  //         }
  //       }, _interval)
  //     }
  //     checkStatus(interval)
  //   },
  //   [typedValue]
  // )
  return useMemo(() => {
    if (!library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Missing dependencies</Trans> }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Invalid recipient</Trans> }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }
    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)
                const errorMessage = gasError?.message ? gasError?.message : gasError
                Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                  event.addMetadata('errorData', {
                    account,
                    address,
                    calldata,
                    value,
                    chainId,
                    location: country_name,
                  })
                })

                return library
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: <Trans>Unexpected issue with estimating the gas. Please try again.</Trans> }
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError)
                    const errorMessage = callError?.message ? callError?.message : callError
                    Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                      event.addMetadata('errorData', {
                        account,
                        address,
                        calldata,
                        chainId,
                        value,
                        location: window.navigator,
                      })
                    })
                    return { call, error: t`${swapErrorToUserReadableMessage(callError)}` }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`)
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption

        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            ...(value && !isZero(value) ? { value } : {}),
          })
          .then((response) => {
            // if (contractNumber !== 0) {
            //   sendSwapLog(response, trade)
            // }
            // addTransaction(
            //   response,
            //   trade.tradeType === TradeType.EXACT_INPUT
            //     ? {
            //         type: TransactionType.SWAP,
            //         tradeType: TradeType.EXACT_INPUT,
            //         inputCurrencyId: currencyId(trade.inputAmount.currency),
            //         inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            //         expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            //         outputCurrencyId: currencyId(trade.outputAmount.currency),
            //         minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
            //       }
            //     : {
            //         type: TransactionType.SWAP,
            //         tradeType: TradeType.EXACT_OUTPUT,
            //         inputCurrencyId: currencyId(trade.inputAmount.currency),
            //         maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
            //         outputCurrencyId: currencyId(trade.outputAmount.currency),
            //         outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
            //         expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
            //       }
            // )

            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              const errorMessage = error?.message ? error?.message : error
              Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                event.addMetadata('errorData', {
                  account,
                  address,
                  calldata,
                  chainId,
                  value,
                  location: country_name,
                })
              })
              throw new Error(t`Transaction rejected.`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)
              const errorMessage = error?.message ? error?.message : error
              Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                event.addMetadata('errorData', {
                  account,
                  address,
                  calldata,
                  chainId,
                  value,
                  location: country_name,
                })
              })

              throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [account, chainId, library, recipient, recipientAddressOrName, swapCalls])
}
/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param signatureData the signature data of the permit of the input token amount, if available
 */

function useSwapCallArguments(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | null | undefined,
  contractNumber: number
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  type AddressMap = { [chainId: number]: string }

  let router: AddressMap
  if (contractNumber === 0) {
    router = V2_ROUTER_ADDRESS
  } else {
    router = UNISWAP_V2_ROUTER_ADDRESSES
  }

  const routerContract = useV2RouterContract(router)
  const argentWalletContract = useArgentWalletContract()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    if (trade instanceof V2Trade) {
      if (!routerContract) return []
      const swapMethods = []

      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: false,
          allowedSlippage,
          recipient,
          deadline: deadline.toNumber(),
        })
      )

      if (trade.tradeType === TradeType.EXACT_INPUT) {
        swapMethods.push(
          Router.swapCallParameters(trade, {
            feeOnTransfer: true,
            allowedSlippage,
            recipient,
            deadline: deadline.toNumber(),
          })
        )
      }
      return swapMethods.map(({ methodName, args, value }) => {
        if (argentWalletContract && trade.inputAmount.currency.isToken) {
          return {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), routerContract.address),
                {
                  to: routerContract.address,
                  value,
                  data: routerContract.interface.encodeFunctionData(methodName, args),
                },
              ],
            ]),
            value: '0x0',
          }
        } else {
          return {
            address: routerContract.address,
            calldata: routerContract.interface.encodeFunctionData(methodName, args),
            value,
          }
        }
      })
    } else {
      // trade is V3Trade
      let V3Router = SWAP_ROUTER_ADDRESSES
      if (contractNumber === 1) {
        V3Router = UNISWAP_SWAP_ROUTER_ADDRESSES
      } else if (contractNumber === 2) {
        V3Router = PANCAKESWAP_V3_ROUTER_ADDRESS
      }
      const swapRouterAddress = chainId ? V3Router[chainId] : undefined
      if (!swapRouterAddress) return []

      const { value, calldata } = SwapRouter.swapCallParameters(trade, {
        recipient,
        slippageTolerance: allowedSlippage,
        deadline: deadline.toString(),
        ...(signatureData
          ? {
              inputTokenPermit:
                'allowed' in signatureData
                  ? {
                      expiry: signatureData.deadline,
                      nonce: signatureData.nonce,
                      s: signatureData.s,
                      r: signatureData.r,
                      v: signatureData.v as any,
                    }
                  : {
                      deadline: signatureData.deadline,
                      amount: signatureData.amount,
                      s: signatureData.s,
                      r: signatureData.r,
                      v: signatureData.v as any,
                    },
            }
          : {}),
      })
      if (argentWalletContract && trade.inputAmount.currency.isToken) {
        return [
          {
            address: argentWalletContract.address,
            calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
              [
                approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), swapRouterAddress),
                {
                  to: swapRouterAddress,
                  value,
                  data: calldata,
                },
              ],
            ]),
            value: '0x0',
          },
        ]
      }
      return [
        {
          address: swapRouterAddress,
          calldata,
          value,
        },
      ]
    }
  }, [
    account,
    allowedSlippage,
    argentWalletContract,
    chainId,
    contractNumber,
    deadline,
    library,
    recipient,
    routerContract,
    signatureData,
    trade,
  ])
}

/**
 * This is hacking out the revert reason from the ethers provider thrown error however it can.
 * This object seems to be undocumented by ethers.
 * @param error an error from the ethers provider
 */
function swapErrorToUserReadableMessage(error: any): ReactNode {
  let reason: string | undefined
  while (Boolean(error)) {
    reason = error.reason ?? error.message ?? reason
    error = error.error ?? error.data?.originalError
  }

  if (reason?.indexOf('execution reverted: ') === 0) reason = reason.substr('execution reverted: '.length)

  switch (reason) {
    case 'LaunchpadExchangeV2Router: EXPIRED':
      return `The transaction could not be sent because the deadline has passed. Please check that your transaction deadline
          is not too low.`
    case 'LaunchpadExchangeV2Router: INSUFFICIENT_OUTPUT_AMOUNT':
    case 'LaunchpadExchangeV2Router: EXCESSIVE_INPUT_AMOUNT':
      return `This transaction will not succeed either due to price movement or fee on transfer. Try increasing your
          slippage tolerance.`
    case 'TransferHelper: TRANSFER_FROM_FAILED':
      return `The input token cannot be transferred. There may be an issue with the input token.`
    case 'LaunchpadExchangeV2: TRANSFER_FAILED':
      return `The output token cannot be transferred. There may be an issue with the output token.`
    case 'LaunchpadExchangeV2: K':
      return `The BestDex invariant x*y=k was not satisfied by the swap. This usually means one of the tokens you are swapping
          incorporates custom behavior on transfer.`
    case 'Too little received':
    case 'Too much requested':
    case 'STF':
      return `This transaction will not succeed due to price movement. Try increasing your slippage tolerance. Note: fee on
          transfer and rebase tokens are incompatible with BestDex V3.`

    case 'TF':
      return `The output token cannot be transferred. There may be an issue with the output token. Note: fee on transfer and
          rebase tokens are incompatible with BestDex V3.`
    default:
      if (reason?.indexOf('undefined is not an object') !== -1) {
        console.error(error, reason)
        return `An error occurred when trying to execute this swap. You may need to increase your slippage tolerance. If
            that does not work, there may be an incompatibility with the token you are trading. Note: fee on transfer
            and rebase tokens are incompatible with BestDex V3.`
      }
      return `Error: Swap Unsuccessful: Something went wrong with your swap, but don't worry – no funds were taken. Please try your swap shortly`
  }
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: Percent, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  signatureData: SignatureData | undefined | null,
  contractNumber: number,
  typedValue?: string
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: ReactNode | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipientAddressOrName, signatureData, contractNumber)
  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  // for rendering DEX inside best wallet
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)

  const sendSwapLog = useCallback(
    async (response: any, trade: any) => {
      const providerData = new JsonRpcProvider(RPC_URL ?? '')
      const interval = 3000
      const maxInterval = interval * 10 * 10
      const checkStatus = (_interval: number) => {
        setTimeout(async () => {
          const tx = await providerData.getTransactionReceipt(response?.hash)
          if (tx?.status === 1) {
            logSwapInfo({
              transactionHash: response?.hash,
              path: (trade.route as any)?.path?.map((item: any) =>
                item?.tokenInfo ? { ...item?.tokenInfo, isNative: item?.isNative, isToken: item?.isToken } : item
              ),
              userInput: typedValue ? typedValue : '',
            })
          }
          if (tx?.status !== 1 && tx?.status !== 0) {
            if (_interval * 10 <= maxInterval) {
              checkStatus(_interval * 10)
            }
          }
        }, _interval)
      }
      checkStatus(interval)
    },
    [typedValue]
  )
  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Missing dependencies</Trans> }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: <Trans>Invalid recipient</Trans> }
      } else {
        return { state: SwapCallbackState.LOADING, callback: null, error: null }
      }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const { address, calldata, value } = call

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  }

            return library
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call)
                const errorMessage = gasError?.message ? gasError?.message : gasError
                Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                  event.addMetadata('errorData', {
                    account,
                    address,
                    calldata,
                    chainId,
                    value,
                    location: country_name,
                  })
                })
                return library
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: <Trans>Unexpected issue with estimating the gas. Please try again.</Trans> }
                  })
                  .catch((callError) => {
                    const errorMessage = callError?.message ? callError?.message : callError
                    Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                      event.addMetadata('errorData', {
                        account,
                        address,
                        calldata,
                        chainId,
                        value,
                        location: country_name,
                      })
                    })
                    return { call, error: t`${swapErrorToUserReadableMessage(callError)}` }
                  })
              })
          })
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | SwapCallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1])
        )

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          const firstNoErrorCall = estimatedCalls.find<SwapCallEstimate>(
            (call): call is SwapCallEstimate => !('error' in call)
          )
          if (!firstNoErrorCall) throw new Error(t`Unexpected error. Could not estimate gas for the swap.`)
          bestCallOption = firstNoErrorCall
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption
        if (clientType === CLIENT_BEST_WALLET) {
          const bestWAlletConnectorPrefix = process?.env?.REACT_APP_BEST_WALLET_BEST_DEX_CONNECTOR
          const tradeData =
            trade.tradeType === TradeType.EXACT_INPUT
              ? {
                  type: TransactionType.SWAP,
                  tradeType: TradeType.EXACT_INPUT,
                  inputCurrencyChainId: trade?.inputAmount?.currency?.chainId,
                  outputCurrencyChainId: trade?.outputAmount?.currency?.chainId,
                  inputCurrencyId: currencyId(trade?.inputAmount?.currency),
                  inputCurrencyAmountRaw: trade?.inputAmount?.quotient?.toString(),
                  expectedOutputCurrencyAmountRaw: trade?.outputAmount?.quotient?.toString(),
                  outputCurrencyId: currencyId(trade?.outputAmount?.currency),
                  minimumOutputCurrencyAmountRaw: trade?.minimumAmountOut(allowedSlippage)?.quotient?.toString(),
                  toAddress: address,
                  inputCurrencySymbol: trade.inputAmount.currency.symbol?.toString(),
                  outputCurrencySymbol: trade.outputAmount.currency.symbol?.toString(),
                  inputCurrencyDecimal: trade.inputAmount.currency.decimals,
                  outputCurrencyDecimal: trade.outputAmount.currency.decimals,
                }
              : {
                  type: TransactionType.SWAP,
                  tradeType: TradeType.EXACT_OUTPUT,
                  inputCurrencyId: currencyId(trade?.inputAmount?.currency),
                  inputCurrencyChainId: trade?.inputAmount?.currency?.chainId,
                  outputCurrencyChainId: trade?.outputAmount?.currency?.chainId,
                  maximumInputCurrencyAmountRaw: trade?.maximumAmountIn(allowedSlippage)?.quotient?.toString(),
                  outputCurrencyId: currencyId(trade?.outputAmount?.currency),
                  outputCurrencyAmountRaw: trade?.outputAmount?.quotient?.toString(),
                  expectedInputCurrencyAmountRaw: trade?.inputAmount?.quotient?.toString(),
                  toAddress: address,
                  inputCurrencySymbol: trade.inputAmount.currency.symbol?.toString(),
                  outputCurrencySymbol: trade.outputAmount.currency.symbol?.toString(),
                  inputCurrencyDecimal: trade.inputAmount.currency.decimals,
                  outputCurrencyDecimal: trade.outputAmount.currency.decimals,
                }
          ;(window as Window).location = bestWAlletConnectorPrefix + JSON.stringify(tradeData)
        }
        return library
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            ...(value && !isZero(value) ? { value } : {}),
          })
          .then((response) => {
            // sending trade data to best wallet if best wallet is the client

            if (contractNumber !== 0) {
              sendSwapLog(response, trade)
            }
            addTransaction(
              response,
              trade.tradeType === TradeType.EXACT_INPUT
                ? {
                    type: TransactionType.SWAP,
                    tradeType: TradeType.EXACT_INPUT,
                    inputCurrencyId: currencyId(trade.inputAmount.currency),
                    inputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                    expectedOutputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                    outputCurrencyId: currencyId(trade.outputAmount.currency),
                    minimumOutputCurrencyAmountRaw: trade.minimumAmountOut(allowedSlippage).quotient.toString(),
                  }
                : {
                    type: TransactionType.SWAP,
                    tradeType: TradeType.EXACT_OUTPUT,
                    inputCurrencyId: currencyId(trade.inputAmount.currency),
                    maximumInputCurrencyAmountRaw: trade.maximumAmountIn(allowedSlippage).quotient.toString(),
                    outputCurrencyId: currencyId(trade.outputAmount.currency),
                    outputCurrencyAmountRaw: trade.outputAmount.quotient.toString(),
                    expectedInputCurrencyAmountRaw: trade.inputAmount.quotient.toString(),
                  }
            )
            return response.hash
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              const errorMessage = error?.message ? error?.message : error
              Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                event.addMetadata('errorData', {
                  account,
                  address,
                  calldata,
                  chainId,
                  value,
                  location: country_name,
                })
              })
              throw new Error(t`Transaction rejected.`)
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, address, calldata, value)
              const errorMessage = error?.message ? error?.message : error
              Bugsnag.notify(new Error(JSON.stringify(errorMessage)), (event) => {
                event.addMetadata('errorData', {
                  account,
                  address,
                  calldata,
                  chainId,
                  value,
                  location: country_name,
                })
              })

              throw new Error(t`Swap failed: ${swapErrorToUserReadableMessage(error)}`)
            }
          })
      },
      error: null,
    }
  }, [
    trade,
    library,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCalls,
    contractNumber,
    addTransaction,
    allowedSlippage,
    sendSwapLog,
    clientType,
  ])
}
