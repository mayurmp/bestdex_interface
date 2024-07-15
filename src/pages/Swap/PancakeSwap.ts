import { BigintIsh } from '@uniswap/sdk-core'

export interface PancakeSwapParams {
  amount: {
    numerator: bigint
    denominator: string
    currency: {
      chainId: number
      decimals: number
      symbol: string | undefined
      name: string | undefined
      isNative: boolean
      isToken: boolean
      address: string | undefined
      projectLink: string
      wrapped: {
        address: string | undefined
        chainId: number
        decimals: number
        symbol: string | undefined
        name: string | undefined
        projectLink: string
      }
    }
    decimalScale: bigint
  }
  currency: {
    address: string | undefined
    chainId: number | undefined
    decimals: number | undefined
    symbol: string | undefined
    name: string | undefined
    logoURI: string
    wrapped: {
      address: string | undefined
      chainId: number | undefined
      decimals: number | undefined
      symbol: string | undefined
      name: string | undefined
      logoURI: string
    }
  }
  tradeType: number
}

export interface PancakeswapTradeObjectInterface {
  tradeType: number
  routes: RoutesEntity[]
  gasEstimate: number
  gasEstimateInUSD: GasEstimateInUSD
  inputAmount: InputAmountOrOutputAmount
  outputAmount: InputAmountOrOutputAmount
  priceImpactFormatted: string
  priceImpactWithoutFee: {
    numerator: BigintIsh
    denominator: BigintIsh
  }
  midPrice: MidPrice
}
export interface RoutesEntity {
  percent: number
  type: number
  pools: PoolsEntity[]
  path: PathEntity[]
  inputAmount: InputAmountOrOutputAmount
  outputAmount: InputAmountOrOutputAmount
}
export interface PoolsEntity {
  type: number
  fee: number
  token0: Token0OrCurrencyOrQuoteCurrency
  token1: Token1OrCurrencyOrBaseCurrency
  liquidity: number
  sqrtRatioX96: number
  tick: number
  address: string
  tvlUSD: number
  token0ProtocolFee: Token0ProtocolFeeOrToken1ProtocolFee
  token1ProtocolFee: Token0ProtocolFeeOrToken1ProtocolFee
}
export interface Token0OrCurrencyOrQuoteCurrency {
  chainId: number
  decimals: number
  symbol: string
  name: string
  isNative: boolean
  isToken: boolean
  address: string
  projectLink: string
}
export interface Token1OrCurrencyOrBaseCurrency {
  chainId: number
  decimals: number
  symbol: string
  name: string
  isNative: boolean
  isToken: boolean
  address: string
}
export interface Token0ProtocolFeeOrToken1ProtocolFee {
  numerator: number
  denominator: number
  isPercent: boolean
}
export interface PathEntity {
  chainId: number
  decimals: number
  symbol: string
  name: string
  isNative: boolean
  isToken: boolean
  address: string
  projectLink?: string | null
}
export interface InputAmountOrOutputAmount {
  numerator: number
  denominator: number
  currency: Token1OrCurrencyOrBaseCurrency
  decimalScale: number
}
export interface GasEstimateInUSD {
  numerator: number
  denominator: number
  currency: Token0OrCurrencyOrQuoteCurrency
  decimalScale: number
}
export interface MidPrice {
  numerator: number
  denominator: number
  baseCurrency: Token1OrCurrencyOrBaseCurrency
  quoteCurrency: Token0OrCurrencyOrQuoteCurrency
  scalar: Scalar
}
export interface Scalar {
  numerator: number
  denominator: number
}

export interface ParamsPancake {
  amount: {
    numerator: bigint
    denominator: string
    currency: {
      chainId: number
      decimals: number
      symbol: string | undefined
      name: string | undefined
      isNative: boolean
      isToken: boolean
      address: string | undefined
      projectLink: string
      wrapped: {
        address: string | undefined
        chainId: number
        decimals: number
        symbol: string | undefined
        name: string | undefined
        projectLink: string
      }
    }
    decimalScale: bigint
  }
  currency: {
    address: string | undefined
    chainId: number | undefined
    decimals: number | undefined
    symbol: string | undefined
    name: string | undefined
    logoURI: string
    wrapped: {
      address: string | undefined
      chainId: number | undefined
      decimals: number | undefined
      symbol: string | undefined
      name: string | undefined
      logoURI: string
    }
  }
  tradeType: number
}
