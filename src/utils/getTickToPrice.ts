import { Price, Token } from '@tech-alchemy/best-dex/sdk-core'
import { tickToPrice } from '@tech-alchemy/best-dex/v3-sdk'

export function getTickToPrice(baseToken?: Token, quoteToken?: Token, tick?: number): Price<Token, Token> | undefined {
  if (!baseToken || !quoteToken || typeof tick !== 'number') {
    return undefined
  }
  return tickToPrice(baseToken, quoteToken, tick)
}
