// a list of tokens by chain
import { Currency, Token } from '@tech-alchemy/best-dex/sdk-core'

import { SupportedChainId } from './chains'
import {
  AMPL,
  BUSD,
  BUSD_TESTNET,
  USDT_BSC,
  USDC_BSC,
  DAI,
  DAI_ARBITRUM_ONE,
  DAI_OPTIMISM,
  DAI_POLYGON,
  DAI_POLYGON_MUMBAI,
  ETH2X_FLI,
  ExtendedEther,
  FEI,
  FRAX,
  FXS,
  renBTC,
  rETH2,
  sETH2,
  SWISE,
  TRIBE,
  USDC,
  USDC_ARBITRUM,
  USDC_OPTIMISM,
  USDC_POLYGON,
  USDC_POLYGON_MUMBAI,
  USDT,
  USDT_ARBITRUM_ONE,
  USDT_OPTIMISM,
  USDT_POLYGON,
  WBTC,
  WBTC_ARBITRUM_ONE,
  WBTC_OPTIMISM,
  WBTC_POLYGON,
  WETH_POLYGON,
  WETH_POLYGON_MUMBAI,
  WETH9_EXTENDED,
} from './tokens'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[]
}

const WETH_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WETH9_EXTENDED).map(([key, value]) => [key, [value]])
)

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [SupportedChainId.MAINNET]: [...WETH_ONLY[SupportedChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [SupportedChainId.OPTIMISM]: [...WETH_ONLY[SupportedChainId.OPTIMISM], DAI_OPTIMISM, USDT_OPTIMISM, WBTC_OPTIMISM],
  [SupportedChainId.ARBITRUM_ONE]: [
    ...WETH_ONLY[SupportedChainId.ARBITRUM_ONE],
    DAI_ARBITRUM_ONE,
    USDT_ARBITRUM_ONE,
    WBTC_ARBITRUM_ONE,
  ],
  [SupportedChainId.POLYGON]: [
    ...WETH_ONLY[SupportedChainId.POLYGON],
    DAI_POLYGON,
    USDC_POLYGON,
    USDT_POLYGON,
    WETH_POLYGON,
  ],
  [SupportedChainId.BINANCE]: [...WETH_ONLY[SupportedChainId.BINANCE], BUSD, USDT_BSC, USDC_BSC],
  [SupportedChainId.BINANCE_TESTNET]: [...WETH_ONLY[SupportedChainId.BINANCE_TESTNET]],
  [SupportedChainId.SEPOLIA]: [...WETH_ONLY[SupportedChainId.SEPOLIA]],
}
export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {
    '0xF16E4d813f4DcfDe4c5b44f305c908742De84eF0': [ETH2X_FLI],
    [rETH2.address]: [sETH2],
    [SWISE.address]: [sETH2],
    [FEI.address]: [TRIBE],
    [TRIBE.address]: [FEI],
    [FRAX.address]: [FXS],
    [FXS.address]: [FRAX],
    [WBTC.address]: [renBTC],
    [renBTC.address]: [WBTC],
  },
}
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH9_EXTENDED[SupportedChainId.MAINNET]],
  },
}

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES: ChainCurrencyList = {
  [SupportedChainId.MAINNET]: [
    ExtendedEther.onChain(SupportedChainId.MAINNET),
    DAI,
    USDC,
    USDT,
    WBTC,
    WETH9_EXTENDED[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.ROPSTEN]: [
    ExtendedEther.onChain(SupportedChainId.ROPSTEN),
    WETH9_EXTENDED[SupportedChainId.ROPSTEN],
  ],
  [SupportedChainId.RINKEBY]: [
    ExtendedEther.onChain(SupportedChainId.RINKEBY),
    WETH9_EXTENDED[SupportedChainId.RINKEBY],
  ],
  [SupportedChainId.SEPOLIA]: [
    ExtendedEther.onChain(SupportedChainId.SEPOLIA),
    WETH9_EXTENDED[SupportedChainId.SEPOLIA],
  ],
  [SupportedChainId.KOVAN]: [ExtendedEther.onChain(SupportedChainId.KOVAN), WETH9_EXTENDED[SupportedChainId.KOVAN]],
  [SupportedChainId.ARBITRUM_ONE]: [
    ExtendedEther.onChain(SupportedChainId.ARBITRUM_ONE),
    DAI_ARBITRUM_ONE,
    USDC_ARBITRUM,
    USDT_ARBITRUM_ONE,
    WBTC_ARBITRUM_ONE,
    WETH9_EXTENDED[SupportedChainId.ARBITRUM_ONE],
  ],
  [SupportedChainId.ARBITRUM_RINKEBY]: [
    ExtendedEther.onChain(SupportedChainId.ARBITRUM_RINKEBY),
    WETH9_EXTENDED[SupportedChainId.ARBITRUM_RINKEBY],
  ],
  [SupportedChainId.OPTIMISM]: [
    ExtendedEther.onChain(SupportedChainId.OPTIMISM),
    DAI_OPTIMISM,
    USDC_OPTIMISM,
    USDT_OPTIMISM,
    WBTC_OPTIMISM,
  ],
  [SupportedChainId.OPTIMISTIC_KOVAN]: [ExtendedEther.onChain(SupportedChainId.OPTIMISTIC_KOVAN)],

  [SupportedChainId.POLYGON]: [
    //ExtendedEther.onChain(SupportedChainId.POLYGON),
    WETH_POLYGON,
    USDC_POLYGON,
    DAI_POLYGON,
    USDT_POLYGON,
    WBTC_POLYGON,
  ],
  [SupportedChainId.POLYGON_MUMBAI]: [
    //ExtendedEther.onChain(SupportedChainId.POLYGON_MUMBAI),
    WETH9_EXTENDED[SupportedChainId.POLYGON_MUMBAI],
    WETH_POLYGON_MUMBAI,
    DAI_POLYGON_MUMBAI,
    USDC_POLYGON_MUMBAI,
  ],
  [SupportedChainId.BINANCE]: [
    //ExtendedEther.onChain(SupportedChainId.BINANCE),
    BUSD,
  ],
  [SupportedChainId.BINANCE_TESTNET]: [
    //ExtendedEther.onChain(SupportedChainId.BINANCE_TESTNET),
    WETH9_EXTENDED[SupportedChainId.BINANCE_TESTNET],
    BUSD_TESTNET,
  ],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [SupportedChainId.MAINNET]: [...WETH_ONLY[SupportedChainId.MAINNET], DAI, USDC, USDT, WBTC],
}
export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [SupportedChainId.MAINNET]: [
    [
      new Token(SupportedChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(
        SupportedChainId.MAINNET,
        '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
        8,
        'cUSDC',
        'Compound USD Coin'
      ),
    ],
    [USDC, USDT],
    [DAI, USDT],
  ],
}

export enum QUERY_PARAMS {
  WALLETS = 'networkWallets',
  API_KEY = 'apiKey',
  SUCCESS_REDIRECT_URL = 'successRedirectUrl',
  FAILURE_REDIRECT_URL = 'failureRedirectUrl',
  MODE = 'mode',
  THEME = 'themeName',
}
