import { Currency, Percent, TradeType } from '@tech-alchemy/best-dex/sdk-core'
import { Trade as V2Trade } from '@tech-alchemy/best-dex/v2-sdk'
import { Trade as V3Trade } from '@tech-alchemy/best-dex/v3-sdk'

import { ONE_HUNDRED_PERCENT, ZERO_PERCENT } from '../constants/misc'

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined | null,
  tradeB: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined | null,
  minimumDelta: Percent = ZERO_PERCENT
): boolean | undefined {
  if (tradeA && !tradeB) return false
  if (tradeB && !tradeA) return true
  if (!tradeA || !tradeB) return undefined

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency)
  ) {
    throw new Error('Comparing incomparable trades')
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice)
  } else {
    return tradeA.executionPrice.asFraction
      .multiply(minimumDelta.add(ONE_HUNDRED_PERCENT))
      .lessThan(tradeB.executionPrice)
  }
}
