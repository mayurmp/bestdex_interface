import { SupportedChainId } from 'constants/chains'
export const currencyReturnByChainId = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.MAINNET:
    case SupportedChainId.SEPOLIA:
      return 'WETH'
    case SupportedChainId.POLYGON:
    case SupportedChainId.POLYGON_MUMBAI:
      return 'WMATIC'
    case SupportedChainId.BINANCE:
    case SupportedChainId.BINANCE_TESTNET:
      return 'WBNB'
    default:
      return 'WETH'
  }
}
