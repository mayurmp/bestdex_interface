import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@tech-alchemy/best-dex/v2-sdk'
import { FACTORY_ADDRESS as V3_FACTORY_ADDRESS } from '@tech-alchemy/best-dex/v3-sdk'
import { FACTORY_ADDRESS as UNISWAP_V2_FACTORY } from '@uniswap/v2-sdk'
import { FACTORY_ADDRESS as UNISWAP_V3_FACTORY_ADDRESS } from '@uniswap/v3-sdk'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'
type AddressMap = { [chainId: number]: string }
// eslint-disable-next-line @typescript-eslint/no-redeclare
// export let V2_FACTORY_ADDRESS: any
// eslint-disable-next-line @typescript-eslint/no-redeclare
// export let UNISWAP_V2_FACTORY: any
const REACT_APP_V2_ROUTER_ADDRESS =
  process.env.REACT_APP_V2_ROUTER_ADDRESS ?? '0x04181279C093AE7dda8621FF0cA669628C1F0D3E'
const REACT_APP_QUOTER_ADDRESS = process.env.REACT_APP_QUOTER_ADDRESS ?? '0x69C8231822E72737388F0a054a86F81358FAbBEf'
const REACT_APP_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES =
  process.env.REACT_APP_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES ?? '0x14EA2f535054A582D16f1BeB95E0f38f55455B35'
const REACT_APP_SWAP_ROUTER_ADDRESS =
  process.env.REACT_APP_SWAP_ROUTER_ADDRESS ?? '0x9A2585bE108db8d10b3bD0657AEd080F3491A1AC'
const REACT_APP_V3_MIGRATOR_ADDRESSES =
  process.env.REACT_APP_V3_MIGRATOR_ADDRESSES ?? '0x96Add37DD1fE54f896226FF4bbA315b2f31C7078'

const REACT_APP_UNISWAP_V3_FACTORY_ADDRESS_BSC =
  process.env.REACT_APP_UNISWAP_V3_FACTORY_ADDRESS_BSC ?? '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7'
const REACT_APP_UNISWAP_QUOTER_ADDRESSES_BSC =
  process.env.REACT_APP_UNISWAP_QUOTER_ADDRESSES ?? '0xF49D24216Cb5FE7f21b6b47C0F45a4F80d21c7F0'
const REACT_APP_UNISWAP_V3_SWAPROUTER_ADDRESS_BSC =
  process.env.REACT_APP_UNISWAP_V3_SWAPROUTER_ADDRESS_BSC ?? '0x74Dca1Bd946b9472B2369E11bC0E5603126E4C18'
const REACT_APP_PANCAKESWAP_V3_SWAPROUTER = '0x1b81D678ffb9C0263b24A97847620C99d213eB14'
export const PANCAKESWAP_V3_ROUTER_ADDRESS: AddressMap = {
  ...constructSameAddressMap(REACT_APP_PANCAKESWAP_V3_SWAPROUTER, [SupportedChainId.MAINNET, SupportedChainId.BINANCE]),
}
export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984', [
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.OPTIMISM,
  ]),
  [SupportedChainId.ARBITRUM_ONE]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [SupportedChainId.ARBITRUM_RINKEBY]: '0xa501c031958F579dB7676fF1CE78AD305794d579',
  [SupportedChainId.POLYGON]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [SupportedChainId.BINANCE]: '0xee2A1bec902d04747814e00C9172B006A057747C',
  [SupportedChainId.POLYGON_MUMBAI]: '0x558FD8E6aFCeB193daA1584220bBE6C7DAFb7D14',
  [SupportedChainId.BINANCE_TESTNET]: '0x558FD8E6aFCeB193daA1584220bBE6C7DAFb7D14',
  [SupportedChainId.SEPOLIA]: '0xD6a877629e0E16A4B89113B09d7c7741Bb7d833B',
}

export const V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(V2_FACTORY_ADDRESS, [SupportedChainId.SEPOLIA])
//
export const V2_ROUTER_ADDRESS: AddressMap = constructSameAddressMap(REACT_APP_V2_ROUTER_ADDRESS, [
  SupportedChainId.SEPOLIA,
])
export const UNISWAP_V2_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(UNISWAP_V2_FACTORY, [
  SupportedChainId.SEPOLIA,
])
export const UNISWAP_V2_ROUTER_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [SupportedChainId.SEPOLIA]
)
/**
 * The oldest V0 governance address
 */
export const GOVERNANCE_ALPHA_V0_ADDRESSES: AddressMap = constructSameAddressMap(
  '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
)
/**
 * The older V1 governance address
 */
export const GOVERNANCE_ALPHA_V1_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0xC4e172459f1E7939D522503B81AFAaC1014CE6F6',
}
/**
 * The latest governor bravo that is currently admin of timelock
 */
export const GOVERNANCE_BRAVO_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
}
export const TIMELOCK_ADDRESS: AddressMap = constructSameAddressMap('0x1a9C8182C09F50C8318d769245beA52c32BE35BC')
export const MERKLE_DISTRIBUTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e',
}
export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}
export const V3_CORE_FACTORY_ADDRESSES: AddressMap = constructSameAddressMap(V3_FACTORY_ADDRESS, [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BINANCE,
  SupportedChainId.BINANCE_TESTNET,
  SupportedChainId.SEPOLIA,
])
//
export const UNISWAP_V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  ...constructSameAddressMap(UNISWAP_V3_FACTORY_ADDRESS, [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.SEPOLIA,
    // SupportedChainId.BINANCE_TESTNET,
  ]),
  [SupportedChainId.BINANCE]: REACT_APP_UNISWAP_V3_FACTORY_ADDRESS_BSC,
}
export const QUOTER_ADDRESSES: AddressMap = constructSameAddressMap(REACT_APP_QUOTER_ADDRESS, [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BINANCE,
  SupportedChainId.BINANCE_TESTNET,
  SupportedChainId.SEPOLIA,
])
export const UNISWAP_QUOTER_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6', [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.SEPOLIA,
    // SupportedChainId.BINANCE_TESTNET,
  ]),
  [SupportedChainId.BINANCE]: REACT_APP_UNISWAP_QUOTER_ADDRESSES_BSC,
}
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = constructSameAddressMap(
  REACT_APP_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.BINANCE,
    SupportedChainId.BINANCE_TESTNET,
    SupportedChainId.SEPOLIA,
  ]
)
// export const UNISWAP_NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = constructSameAddressMap(
//   '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
//   [
//     SupportedChainId.OPTIMISM,
//     SupportedChainId.OPTIMISTIC_KOVAN,
//     SupportedChainId.ARBITRUM_ONE,
//     SupportedChainId.ARBITRUM_RINKEBY,
//     SupportedChainId.POLYGON,
//     SupportedChainId.POLYGON_MUMBAI,
//     SupportedChainId.BINANCE,
//     SupportedChainId.BINANCE_TESTNET,
//   ]
// )
export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.ROPSTEN]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.SEPOLIA]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}
//
export const SWAP_ROUTER_ADDRESSES: AddressMap = constructSameAddressMap(REACT_APP_SWAP_ROUTER_ADDRESS, [
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISTIC_KOVAN,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BINANCE,
  SupportedChainId.BINANCE_TESTNET,
  SupportedChainId.SEPOLIA,
])
export const UNISWAP_SWAP_ROUTER_ADDRESSES: AddressMap = {
  ...constructSameAddressMap('0xE592427A0AEce92De3Edee1F18E0157C05861564', [
    SupportedChainId.OPTIMISM,
    SupportedChainId.OPTIMISTIC_KOVAN,
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.ARBITRUM_RINKEBY,
    SupportedChainId.POLYGON,
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.SEPOLIA,
    // SupportedChainId.BINANCE_TESTNET,
  ]),
  [SupportedChainId.BINANCE]: REACT_APP_UNISWAP_V3_SWAPROUTER_ADDRESS_BSC,
}
export const V3_MIGRATOR_ADDRESSES: AddressMap = constructSameAddressMap(REACT_APP_V3_MIGRATOR_ADDRESSES, [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.BINANCE,
  SupportedChainId.BINANCE_TESTNET,
  SupportedChainId.SEPOLIA,
])
