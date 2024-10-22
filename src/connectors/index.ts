import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { PortisConnector } from '@web3-react/portis-connector'
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from '../constants/chains'
import getLibrary from '../utils/getLibrary'
import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { CustomWalletConnectConnector } from './CustomWalletConnectV2Connector'
import { BestWalletConnector } from './BestWalletConnector'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

const REACT_APP_ETH_URL = process.env.REACT_APP_ETH_URL ?? ''
const REACT_APP_BSC_URL = process.env.REACT_APP_BSC_URL ?? ''
const REACT_APP_POLYGON_URL = process.env.REACT_APP_POLYGON_URL ?? ''
const REACT_APP_BSC_TESTNET_URL = process.env.REACT_APP_BSC_TESTNET_URL ?? ''
const REACT_APP_POLYGON_TESTNET_URL = process.env.REACT_APP_POLYGON_TESTNET_URL ?? ''

export const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: REACT_APP_ETH_URL,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.SEPOLIA]: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.OPTIMISTIC_KOVAN]: `https://optimism-kovan.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.POLYGON]: REACT_APP_POLYGON_URL,
  [SupportedChainId.POLYGON_MUMBAI]: REACT_APP_POLYGON_TESTNET_URL,
  [SupportedChainId.BINANCE]: REACT_APP_BSC_URL,
  [SupportedChainId.BINANCE_TESTNET]: REACT_APP_BSC_TESTNET_URL,
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const metamaskConnectionState = {
  isManuallyDisconnected: false,
}
export const gnosisSafe = new SafeAppConnector()
/**************************************************************/
export const walletconnect = new CustomWalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  // rpc: NETWORK_URLS,
  // qrcode: true,
})

export const bestWalletConnector = new BestWalletConnector({
  // qrcode: true,
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1,
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1],
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URLS[SupportedChainId.MAINNET],
  appName: 'Uniswap',
  appLogoUrl: UNISWAP_LOGO_URL,
})
