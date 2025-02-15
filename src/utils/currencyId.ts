import { Currency } from '@tech-alchemy/best-dex/sdk-core'

export function currencyId(currency: Currency): string {
  if (currency.isNative) return currency.symbol ? currency.symbol : 'ETH'
  if (currency.isToken) return currency.address
  throw new Error('invalid currency')
}
