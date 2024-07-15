import { Currency } from '@tech-alchemy/best-dex/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { BinanceTokenInfo, MaticTokenInfo } from 'constants/tokens'

import { ExtendedEther, WETH9_EXTENDED } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  if (formattedChainId && currency.equals(WETH9_EXTENDED[formattedChainId])) {
    const ether = ExtendedEther.onChain(currency.chainId)
    let nativeToken: any
    if (
      (currency.chainId === SupportedChainId.POLYGON_MUMBAI || currency.chainId === SupportedChainId.POLYGON) &&
      ether
    ) {
      nativeToken = Object.create(ether)
      nativeToken.name = MaticTokenInfo.name
      nativeToken.symbol = MaticTokenInfo.symbol
    } else if (
      (currency.chainId === SupportedChainId.BINANCE || currency.chainId === SupportedChainId.BINANCE_TESTNET) &&
      ether
    ) {
      nativeToken = Object.create(ether)
      nativeToken.name = BinanceTokenInfo.name
      nativeToken.symbol = BinanceTokenInfo.symbol
    } else {
      nativeToken = ether
    }
    return nativeToken
  }
  return currency
}
