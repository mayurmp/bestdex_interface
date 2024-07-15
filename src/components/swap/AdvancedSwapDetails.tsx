import { Trans } from '@lingui/macro'
import { Currency, Percent, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { Trade as V3Trade } from '@tech-alchemy/best-dex/v3-sdk'
import { LoadingRows } from 'components/Loader/styled'
import { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components/macro'

import { ThemedText } from '../../theme'
import { computeRealizedLPFeePercent } from '../../utils/prices'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { TransactionDetailsLabel } from './styleds'

interface AdvancedSwapDetailsProps {
  trade?: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType>
  allowedSlippage: Percent
  syncing?: boolean
  priceImpactInput?: Percent | undefined | string
}

function TextWithLoadingPlaceholder({
  syncing,
  width,
  children,
}: {
  syncing: boolean
  width: number
  children: JSX.Element
}) {
  return syncing ? (
    <LoadingRows>
      <div style={{ height: '15px', width: `${width}px` }} />
    </LoadingRows>
  ) : (
    children
  )
}

export function MyAdvancedSwapDetails(trade: any, allowedSlippage: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }
    console.log({ tradeAdvancedSwapDetials: trade })
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)
    return { priceImpact, realizedLPFee }
  }, [trade])

  const myPriceImpact = priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}` : '-'
  return myPriceImpact
}

export function AdvancedSwapDetails({
  trade,
  allowedSlippage,
  syncing = false,
  priceImpactInput,
}: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)

  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)
    let priceImpact
    try {
      if (typeof priceImpactInput === 'string') {
        priceImpact = priceImpactInput
      } else {
        priceImpact = priceImpactInput
          ? priceImpactInput.subtract(realizedLpFeePercent)
          : trade.priceImpact.subtract(realizedLpFeePercent)
      }
    } catch (e) {
      console.log(e)
    }
    return { priceImpact, realizedLPFee }
  }, [trade, priceImpactInput])

  return !trade ? null : (
    <AutoColumn gap="8px">
      <TransactionDetailsLabel fontWeight={500} fontSize={14}>
        <Trans>Transaction Details</Trans>
      </TransactionDetailsLabel>
      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader color={theme.text1}>
            <Trans>Liquidity Provider Fee</Trans>
          </ThemedText.SubHeader>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={65}>
          <ThemedText.Black textAlign="right" fontSize={14}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.currency.symbol}` : '-'}
          </ThemedText.Black>
        </TextWithLoadingPlaceholder>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader color={theme.text1}>
            <Trans>Price Impact</Trans>
          </ThemedText.SubHeader>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={50}>
          <ThemedText.Black textAlign="right" fontSize={14}>
            {typeof priceImpact === 'string' ? priceImpact : <FormattedPriceImpact priceImpact={priceImpact} />}
          </ThemedText.Black>
        </TextWithLoadingPlaceholder>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader color={theme.text1}>
            <Trans>Allowed Slippage</Trans>
          </ThemedText.SubHeader>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={45}>
          <ThemedText.Black textAlign="right" fontSize={14}>
            {allowedSlippage.toFixed(2)}%
          </ThemedText.Black>
        </TextWithLoadingPlaceholder>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <ThemedText.SubHeader color={theme.text1}>
            {trade.tradeType === TradeType.EXACT_INPUT ? <Trans>Minimum received</Trans> : <Trans>Maximum sent</Trans>}
          </ThemedText.SubHeader>
        </RowFixed>
        <TextWithLoadingPlaceholder syncing={syncing} width={70}>
          <ThemedText.Black textAlign="right" fontSize={14}>
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
              : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
          </ThemedText.Black>
        </TextWithLoadingPlaceholder>
      </RowBetween>
    </AutoColumn>
  )
}
