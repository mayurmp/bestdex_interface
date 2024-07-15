import {
  ARBITRUM_HELP_CENTER_LINK,
  CHAIN_INFO,
  L2_CHAIN_IDS,
  OPTIMISM_HELP_CENTER_LINK,
  SupportedChainId,
  SupportedL2ChainId,
} from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useActiveWeb3React } from 'hooks/web3'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { ArrowDownCircle, ChevronDown } from 'react-feather'
import { useModalOpen, useToggleModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useAppSelector } from 'state/hooks'
import styled from 'styled-components/macro'
import { ExternalLink, MEDIA_WIDTHS } from 'theme'
import { switchToNetwork } from 'utils/switchToNetwork'
import { Trans } from '@lingui/macro'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'
import { getSupportedChainIdsFromWalletConnectSession } from 'utils/getSupportedChainIdsFromWalletConnectSession'

const ActiveRowLinkList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  & > a {
    align-items: center;
    color: ${({ theme }) => theme.text2};
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 500;
    justify-content: space-between;
    padding: 8px 0 4px;
    text-decoration: none;
  }
  & > a:first-child {
    border-top: 1px solid ${({ theme }) => theme.text2};
    margin: 0;
    margin-top: 6px;
    padding-top: 10px;
  }
`
const ActiveRowWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 18px;
  cursor: pointer;
  padding: 8px 0 8px 0;
  width: 100%;
`
const FlyoutHeader = styled.div`
  color: ${({ theme }) => theme.text2};
  font-weight: 400;
`
const FlyoutMenu = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 16px;
  position: absolute;
  top: 64px;
  width: 272px;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 12px;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    top: 50px;
  }
`
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.bg2 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
  :hover,
  :active,
  :focus {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg7};
  }
`
const FlyoutRowActiveIndicator = styled.div`
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  height: 9px;
  width: 9px;
`
const LinkOutCircle = styled(ArrowDownCircle)`
  transform: rotate(230deg);
  width: 16px;
  height: 16px;
`
const Logo = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 8px;
`
const NetworkLabel = styled.div`
  flex: 1 1 auto;
`
const SelectorLabelTooltip = styled.span`
  visibility: hidden;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.bg7};
  border: 1px solid ${({ theme }) => theme.text5};
  text-align: center;
  border-radius: 6px;
  padding: 3px 5px;
  position: absolute;
  z-index: 10;
  top: 5px;
  right: 102%;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    outline: border: 1px solid black;
    border-color: transparent #EDEEF2 transparent transparent;
  }
`
const SelectorLabel = styled(NetworkLabel)<{ clientType: string }>`
  display: ${({ theme, clientType }) => (clientType === CLIENT_BEST_WALLET ? 'block' : 'none')};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 125px;
  color: ${({ theme }) => theme.text6};
  white-space: nowrap;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    margin-right: 8px;
  }
  &:hover ${SelectorLabelTooltip} {
    visibility: visible;
  }
`

const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg9};
  border: 3px solid ${({ theme }) => theme.text7};
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`
const SelectorLogo = styled(Logo)<{ interactive?: boolean; clientType: string }>`
  margin-right: ${({ interactive, clientType }) => (interactive ? 8 : clientType === CLIENT_BEST_WALLET ? 8 : 0)}px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  }
`
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`
const StyledChevronDown = styled(ChevronDown)`
  color: ${({ theme }) => theme.text6};
  width: 12px;
`
const WalletUnsupportedError = styled.p`
  font-size: 10px;
  color: #565a698a !important;
`
const NetworkLabelRoot = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-flex: 1 1 auto;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  color: #565a698a !important;
`
const BridgeText = ({ chainId }: { chainId: SupportedL2ChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <Trans>Arbitrum Bridge</Trans>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <Trans>Optimism Gateway</Trans>
    default:
      return <Trans>Bridge</Trans>
  }
}
const ExplorerText = ({ chainId }: { chainId: SupportedL2ChainId }) => {
  switch (chainId) {
    case SupportedChainId.ARBITRUM_ONE:
    case SupportedChainId.ARBITRUM_RINKEBY:
      return <Trans>Arbiscan</Trans>
    case SupportedChainId.OPTIMISM:
    case SupportedChainId.OPTIMISTIC_KOVAN:
      return <Trans>Optimistic Etherscan</Trans>
    default:
      return <Trans>Explorer</Trans>
  }
}

export default function NetworkSelector({ toggleNetworkError }: { toggleNetworkError: () => void }) {
  const { chainId, library, account } = useActiveWeb3React()
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  const location = useLocation()
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const clientType = searchParams.get(CLIENT) ?? ''
  useOnClickOutside(node, open ? toggle : undefined)
  const implements3085 = useAppSelector((state) => state.application.implements3085)
  const info = chainId ? CHAIN_INFO[chainId] : undefined
  const __DEV__ = process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'testing'
  const queryParamChainId = searchParams.get('selectedChainId')
  const isOnL2 = chainId ? L2_CHAIN_IDS.includes(chainId) : false
  const showSelector = Boolean(implements3085 || isOnL2)
  const mainnetInfo = CHAIN_INFO[SupportedChainId.MAINNET]
  const supportedChains = getSupportedChainIdsFromWalletConnectSession((library?.provider as any)?.session)

  useEffect(() => {
    if (
      library &&
      queryParamChainId &&
      account
      // &&
      // clientType === CLIENT_BEST_WALLET &&
      // supportedChains.indexOf(parseInt(queryParamChainId)) === -1
    ) {
      if (parseInt(queryParamChainId) !== chainId) {
        switchToNetwork({ library, chainId: parseInt(queryParamChainId) })
      } else {
        searchParams.delete('selectedChainId')
      }
    }
  }, [library, supportedChains, queryParamChainId, searchParams, account, chainId])

  const conditionalToggle = useCallback(() => {
    if (showSelector) {
      toggle()
    }
  }, [showSelector, toggle])

  if (!chainId || !info || !library) {
    return null
  }
  function Row({ targetChain }: { targetChain: number }) {
    if (!library || !chainId || (!implements3085 && targetChain !== chainId)) {
      return null
    }
    const handleRowClick = () => {
      if (
        (library?.provider as any)?.isWalletConnect &&
        (library?.provider as any)?.session?.peer?.metadata?.name === 'MetaMask Wallet'
      ) {
        if (supportedChains.indexOf(targetChain) !== -1) {
          switchToNetwork({ library, chainId: targetChain })
        }
        // toggleNetworkError()
      } else {
        switchToNetwork({ library, chainId: targetChain })
        // toggle()
      }
      toggle()
    }
    const getNetworkLabel = () => {
      if (
        (library?.provider as any)?.isWalletConnect &&
        (library?.provider as any)?.session?.peer?.metadata?.name === 'MetaMask Wallet'
      ) {
        if (supportedChains.indexOf(targetChain) === -1) {
          return (
            <NetworkLabelRoot>
              <NetworkLabel color={'#565A69'}>{rowText}</NetworkLabel>
              <WalletUnsupportedError color={'#565A69'}>
                <Trans>Unsupported by your wallet</Trans>
              </WalletUnsupportedError>
            </NetworkLabelRoot>
          )
        } else {
          return <NetworkLabel>{rowText}</NetworkLabel>
        }
      } else {
        return <NetworkLabel>{rowText}</NetworkLabel>
      }
    }
    const active = chainId === targetChain
    const hasExtendedInfo = L2_CHAIN_IDS.includes(targetChain)
    const isOptimism = targetChain === SupportedChainId.OPTIMISM
    const rowText = `${CHAIN_INFO[targetChain].label}${isOptimism ? ' (Optimism)' : ''}`
    const RowContent = () => (
      <FlyoutRow
        onClick={() => {
          handleRowClick()
        }}
        active={active}
      >
        <Logo src={CHAIN_INFO[targetChain].logoUrl} />
        {getNetworkLabel()}
        {chainId === targetChain && <FlyoutRowActiveIndicator />}
      </FlyoutRow>
    )
    const helpCenterLink = isOptimism ? OPTIMISM_HELP_CENTER_LINK : ARBITRUM_HELP_CENTER_LINK
    if (active && hasExtendedInfo) {
      return (
        <ActiveRowWrapper>
          <RowContent />
          <ActiveRowLinkList>
            <ExternalLink href={CHAIN_INFO[targetChain as SupportedL2ChainId].bridge}>
              <BridgeText chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
            <ExternalLink href={CHAIN_INFO[targetChain].explorer}>
              <ExplorerText chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
            <ExternalLink href={helpCenterLink}>
              <Trans>Help Center</Trans> <LinkOutCircle />
            </ExternalLink>
          </ActiveRowLinkList>
        </ActiveRowWrapper>
      )
    }
    return <RowContent />
  }

  return (
    <>
      <SelectorWrapper ref={node as any}>
        <SelectorControls onClick={conditionalToggle} interactive={showSelector}>
          <SelectorLogo interactive={showSelector} clientType={clientType} src={info.logoUrl || mainnetInfo.logoUrl} />

          <SelectorLabel clientType={clientType}>
            {info.label}
            <SelectorLabelTooltip>{info.label}</SelectorLabelTooltip>
          </SelectorLabel>

          {showSelector && <StyledChevronDown />}
        </SelectorControls>
        {open && (
          <FlyoutMenu>
            <FlyoutHeader>
              <Trans>Select a network</Trans>
            </FlyoutHeader>
            {!__DEV__ ? (
              <>
                <Row targetChain={SupportedChainId.MAINNET} />
                {/* <Row targetChain={SupportedChainId.OPTIMISM} /> */}
                {/* <Row targetChain={SupportedChainId.ARBITRUM_ONE} /> */}
                <Row targetChain={SupportedChainId.POLYGON} />
                <Row targetChain={SupportedChainId.BINANCE} />
                {/* <Row targetChain={SupportedChainId.POLYGON_MUMBAI} />
                <Row targetChain={SupportedChainId.SEPOLIA} />
                <Row targetChain={SupportedChainId.BINANCE_TESTNET} /> */}
              </>
            ) : (
              <>
                <Row targetChain={SupportedChainId.MAINNET} />
                <Row targetChain={SupportedChainId.POLYGON} />
                <Row targetChain={SupportedChainId.BINANCE} />
                <Row targetChain={SupportedChainId.POLYGON_MUMBAI} />
                <Row targetChain={SupportedChainId.SEPOLIA} />
                <Row targetChain={SupportedChainId.BINANCE_TESTNET} />
              </>
            )}
          </FlyoutMenu>
        )}
      </SelectorWrapper>
    </>
  )
}
