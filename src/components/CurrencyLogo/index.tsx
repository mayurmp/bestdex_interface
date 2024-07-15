import { Currency } from '@tech-alchemy/best-dex/sdk-core'
import { SupportedChainId } from 'constants/chains'
import React, { useMemo } from 'react'
import styled from 'styled-components/macro'

import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Binance from '../../assets/svg/binance.svg'
import Polygon from '../../assets/svg/polygon.svg'
import useHttpLocations from '../../hooks/useHttpLocations'
import { useActiveWeb3React } from '../../hooks/web3'
import { WrappedTokenInfo } from '../../state/lists/wrappedTokenInfo'
import Logo from '../Logo'
type Network = 'ethereum' | 'arbitrum' | 'optimism' | 'polygon' | 'binance'

function chainIdToNetworkName(networkId: SupportedChainId): Network {
  switch (networkId) {
    case SupportedChainId.MAINNET:
      return 'ethereum'
    case SupportedChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case SupportedChainId.OPTIMISM:
      return 'optimism'
    case SupportedChainId.POLYGON:
      return 'polygon'
    case SupportedChainId.BINANCE:
      return 'binance'
    default:
      return 'ethereum'
  }
}

export const getTokenLogoURL = (
  address: string,
  chainId: SupportedChainId = SupportedChainId.MAINNET
): string | void => {
  const networkName = chainIdToNetworkName(chainId)
  const networksWithUrls = [
    SupportedChainId.ARBITRUM_ONE,
    SupportedChainId.MAINNET,
    SupportedChainId.OPTIMISM,
    SupportedChainId.POLYGON,
    SupportedChainId.BINANCE,
  ]
  if (networksWithUrls.includes(chainId)) {
    return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
  }
}

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.white};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  ...rest
}: {
  currency?: Currency | null
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const { chainId } = useActiveWeb3React()
  const srcs: string[] = useMemo(() => {
    if (!currency || currency.isNative) return []
    if (currency.isToken) {
      const defaultUrls = []
      const url = getTokenLogoURL(currency.address, currency.chainId)
      if (url) {
        defaultUrls.push(url)
      }
      if (currency instanceof WrappedTokenInfo) {
        return [...defaultUrls, ...uriLocations]
      }
      return defaultUrls
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    let nativeLogo = EthereumLogo
    if (chainId === SupportedChainId.POLYGON || chainId === SupportedChainId.POLYGON_MUMBAI) {
      nativeLogo = Polygon
    } else if (chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.BINANCE_TESTNET) {
      nativeLogo = Binance
    }
    return <StyledEthereumLogo src={nativeLogo} alt="ethereum logo" size={size} style={style} {...rest} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} {...rest} />
}
