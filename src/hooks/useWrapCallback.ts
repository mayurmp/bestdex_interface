import { Currency } from '@tech-alchemy/best-dex/sdk-core'
import { useMemo } from 'react'
import { WETH9_EXTENDED } from '../constants/tokens'
import { tryParseAmount } from '../state/swap/hooks'
import { TransactionType } from '../state/transactions/actions'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useWETHContract } from './useContract'
import { useActiveWeb3React } from './web3'
import { currencyId } from 'utils/currencyId'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined | null,
  outputCurrency: Currency | undefined | null,
  typedValue: string | undefined
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency ?? undefined)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency ?? undefined), [inputCurrency, typedValue])

  const addTransaction = useTransactionAdder()
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE
    const weth = WETH9_EXTENDED[chainId]
    if (!weth) return NOT_APPLICABLE

    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'))
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency.isNative && weth.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  if (clientType === CLIENT_BEST_WALLET) {
                    const bestWAlletConnectorPrefix = process?.env?.REACT_APP_BEST_WALLET_BEST_DEX_CONNECTOR
                    const tradeData = {
                      type: WrapType.WRAP,
                      tradeType: null,
                      inputCurrencyChainId: inputAmount?.currency?.chainId,
                      outputCurrencyChainId: inputAmount?.currency?.chainId,
                      inputCurrencyId: currencyId(inputAmount?.currency),
                      inputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      expectedOutputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      outputCurrencyId: currencyId(outputCurrency),
                      minimumOutputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      toAddress: null,
                      inputCurrencySymbol: inputAmount?.currency?.symbol?.toString(),
                      outputCurrencySymbol: outputCurrency?.symbol?.toString(),
                      inputCurrencyDecimal: inputAmount?.currency?.decimals,
                      outputCurrencyDecimal: outputCurrency?.decimals,
                    }

                    console.log({ tradeData })
                    ;(window as Window).location = bestWAlletConnectorPrefix + JSON.stringify(tradeData)
                    console.log('inside true')
                  }
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.quotient.toString(16)}` })
                  console.log({ txReceipt })
                  addTransaction(txReceipt, {
                    type: TransactionType.WRAP,
                    unwrapped: false,
                    currencyAmountRaw: inputAmount?.quotient.toString(),
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : hasInputAmount ? 'Insufficient ETH balance' : 'Enter ETH amount',
      }
    } else if (weth.equals(inputCurrency) && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  if (clientType === CLIENT_BEST_WALLET) {
                    const bestWAlletConnectorPrefix = process?.env?.REACT_APP_BEST_WALLET_BEST_DEX_CONNECTOR
                    const tradeData = {
                      type: WrapType.UNWRAP,
                      tradeType: null,
                      inputCurrencyChainId: inputAmount?.currency?.chainId,
                      outputCurrencyChainId: inputAmount?.currency?.chainId,
                      inputCurrencyId: currencyId(inputAmount?.currency),
                      inputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      expectedOutputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      outputCurrencyId: currencyId(outputCurrency),
                      minimumOutputCurrencyAmountRaw: inputAmount?.quotient?.toString(),
                      toAddress: null,
                      inputCurrencySymbol: inputAmount?.currency?.symbol?.toString(),
                      outputCurrencySymbol: outputCurrency?.symbol?.toString(),
                      inputCurrencyDecimal: inputAmount?.currency?.decimals,
                      outputCurrencyDecimal: outputCurrency?.decimals,
                    }
                    ;(window as Window).location = bestWAlletConnectorPrefix + JSON.stringify(tradeData)
                  }
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.quotient.toString(16)}`)
                  addTransaction(txReceipt, {
                    type: TransactionType.WRAP,
                    unwrapped: true,
                    currencyAmountRaw: inputAmount?.quotient.toString(),
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance ? undefined : hasInputAmount ? 'Insufficient WETH balance' : 'Enter WETH amount',
      }
    } else {
      return NOT_APPLICABLE
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction, clientType])
}
