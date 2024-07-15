// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken } from 'polished'
import { useMemo, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Activity } from 'react-feather'
import { Box } from 'rebass'
import styled, { css } from 'styled-components/macro'
import { ThemedText } from 'theme'
import { useLocation } from 'react-router-dom'
import { NetworkContextName } from '../../constants/misc'
import useENSName from '../../hooks/useENSName'
import { useHasSocks } from '../../hooks/useSocksBalance'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import { ButtonSecondary } from '../Button'
import StatusIcon from '../Identicon/StatusIcon'
import Loader from '../Loader'
import { RowBetween } from '../Row'
import WalletModal from '../WalletModal'
// import Button from 'components/@common/button'
import BestDexHero from '../../assets/svg/best_DEX_Hero.svg'
import Modal from '../Modal'
import { Menu, X } from 'react-feather'
import { isMobile } from '../../utils/userAgent'
import MenuComponent from 'components/Menu'
import Button from 'components/@common/button'
import useContentPage from 'hooks/useContentPage'
import { useActiveWeb3React } from 'hooks/web3'
import useDisconnectWalletconnect from 'hooks/useDisconnectWalletConnect'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'
// import { SupportedChainId } from 'constants/chains'
// import { useActiveWeb3React } from '../../hooks/web3'
// import { useETHBalances } from 'state/wallet/hooks'

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const Web3StatusGeneric = styled(ButtonSecondary)`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  padding: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  user-select: none;
  :focus {
    outline: none;
  }
`
const Web3StatusError = styled(Web3StatusGeneric)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
`

const Web3StatusConnect = styled(Web3StatusGeneric)<{ faded?: boolean }>`
  background-color: ${({ theme }) => theme.bydefault};
  border: none;

  font-weight: 500;

  :hover {
    background-color: ${({ theme }) => theme.hover};
    border: 1px solid ${({ theme }) => theme.hover};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.bydefault};
    color: ${({ theme }) => theme.primaryText2};
    background-color: ${({ theme }) => theme.bydefault};
  }
  :active {
    background-color: ${({ theme }) => theme.bydefault};
    box-shadow: 0px 0px 0px 4px rgba(90, 99, 255, 0.2), 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${({ theme }) => theme.bydefault};
      border: 1px solid ${({ theme }) => theme.bydefault};
      color: ${({ theme }) => theme.primaryText2};

      :hover {
        background-color: ${({ theme }) => theme.hover};
      }
      :focus {
        // border: 1px solid ${({ theme }) => darken(0.05, theme.primaryBg1)};
        color: ${({ theme }) => darken(0.05, theme.primaryText2)};
      }
      :active {
        background-color: ${({ theme }) => theme.bydefault};
        box-shadow: 0px 0px 0px 4px rgba(90, 99, 255, 0.2), 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
      }
    `}
  @media screen and (max-width: 450px) {
    width: 180px;
  }
  @media screen and (max-width: 360px) {
    width: 165px;
  }
  @media screen and (max-width: 320px) {
    width: 120px;
  }
`

const Web3StatusConnected = styled(Web3StatusGeneric)<{ pending?: boolean }>`
  background-color: ${({ pending, theme }) => (pending ? theme.bydefault : theme.bg0)};
  border: 1px solid ${({ pending, theme }) => (pending ? theme.bydefault : theme.bg1)};
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text1)};
  font-weight: 500;
  :hover,
  :focus {
    border: 1px solid ${({ theme, pending }) => darken(0.05, pending ? theme.hover : theme.bg0)};
    background-color: ${({ pending, theme }) => darken(0.05, pending ? theme.hover : theme.bg0)};
    :focus {
      border: 1px solid ${({ pending, theme }) => (pending ? darken(0.1, theme.hover) : darken(0.1, theme.bg2))};
      background-color: ${({ pending, theme }) => darken(0.05, pending ? theme.hover : theme.bg0)};
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`
const StyledNavButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`
const StyledMenuIcon = styled(Menu)`
  height: 30px;
  width: 30px;
  cursor: pointer;
  > * {
    stroke: ${({ theme }) => theme.primaryText2};
  }
  :hover {
    stroke: #4b53d5;
  }
`
const StyledCloseIcon = styled(X)`
  height: 30px;
  width: 30px;
  cursor: pointer;
  > * {
    stroke: ${({ theme }) => theme.primaryText2};
  }
  :hover {
    stroke: #4b53d5;
  }
`
const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`
const NavContent = styled.div`
  background-color: #4b53d5;
  display: flex;
  flex-direction: column;
`
const NavHeading = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  align-items: center;
`
const NavBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 48px 0px;
  gap: 20px;
  align-items: center;
`
const LogoBox = styled(Box)`
  // padding-left: 103px;
  @media screen and (max-width: 600px) {
    // padding-left: 30px;
  }
`
const ResponseImage = styled.img`
  width: 60px;
  @media screen and (max-width: 1000px) {
    width: 40px;
  }
`
const PageLinks = styled.a`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: white;
  margin-right: 32px;
  cursor: pointer;
  text-decoration: none;
  padding: 12px 0px;
  :hover {
    color: #75ffff;
  }
  @media screen and (max-width: 600px) {
    margin-right: 0px !important;
  }
`
const UndecoratedLink = styled(Link)`
  text-decoration: none;
`
const UndecoratedHashLink = styled(Link)`
  color: ${({ theme }) => theme.white};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
`
// const AccountElement = styled.div<{ active: boolean; showBg: boolean }>`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   background-color: ${({ theme, active, showBg }) => (showBg ? (!active ? theme.bg1 : theme.bg1) : '')};
//   border-radius: 12px;
//   white-space: nowrap;
//   :focus {
//     border: 1px solid blue;
//   }
// `
// const BalanceText = styled(RebassText)``
// // we want the latest one to come first, so return negative if a is after b

function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Sock() {
  return (
    <span role="img" aria-label={t`has socks emoji`} style={{ marginTop: -4, marginBottom: -4 }}>
      🧦
    </span>
  )
}

function WrappedStatusIcon({ connector }: { connector: AbstractConnector }) {
  return (
    <IconWrapper size={16}>
      <StatusIcon connector={connector} />
    </IconWrapper>
  )
}

function Web3StatusInner() {
  const { account, connector, error } = useWeb3React()
  const searchParams = new URLSearchParams(useLocation()?.search)
  const clientType = searchParams.get(CLIENT)
  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()
  const isContentPage = useContentPage()
  // const location = useLocation()
  // const isContentPage =
  //   location.pathname === '/home' || location.pathname === '/airdrop' || location.pathname === '/partner'
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions).filter((tx) => tx.from === account)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions, account])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

  const hasPendingTransactions = !!pending.length
  const hasSocks = useHasSocks()
  const toggleWalletModal = useWalletModalToggle()
  const handleToggleWallet = () => {
    if (clientType !== CLIENT_BEST_WALLET) {
      toggleWalletModal()
    }
  }
  if (account) {
    return !isContentPage ? (
      <Web3StatusConnected id="web3-status-connected" onClick={handleToggleWallet} pending={hasPendingTransactions}>
        {hasPendingTransactions ? (
          <RowBetween>
            <ThemedText.White>
              <Trans>{pending?.length} Pending</Trans>
            </ThemedText.White>{' '}
            <Box marginTop={'5px'} marginLeft={'5px'}>
              <Loader stroke="white" />
            </Box>
          </RowBetween>
        ) : (
          <>
            {hasSocks ? <Sock /> : null}
            <ThemedText.Black>{ENSName || shortenAddress(account)}</ThemedText.Black>
          </>
        )}
        {!hasPendingTransactions && connector && <WrappedStatusIcon connector={connector} />}
      </Web3StatusConnected>
    ) : (
      <></>
    )
  } else if (error) {
    return !isContentPage && clientType !== CLIENT_BEST_WALLET ? (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error</Trans>}</Text>
      </Web3StatusError>
    ) : (
      <></>
    )
  } else {
    return !isContentPage && clientType !== CLIENT_BEST_WALLET ? (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>
          <Trans>Connect Wallet</Trans>
        </Text>
      </Web3StatusConnect>
    ) : (
      <>
        {/* <Button
          fontColor={'#4B53D5'}
          type={'HERO'}
          size={'LARGE'}
          onClick={toggleWalletModal}
          fontWeight={600}
          text="Connect Wallet"
        ></Button> */}
      </>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)
  const isContentPage = useContentPage()
  const { ENSName } = useENSName(account ?? undefined)
  const { library } = useActiveWeb3React()
  // const location = useLocation()
  const timerRef = useRef<any>()
  const [showMobileNav, setShowMobileNav] = useState(false)
  const allTransactions = useAllTransactions()
  const disconnectWallet = useDisconnectWalletconnect()
  // const { chainId } = useActiveWeb3React()
  // const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions).filter((tx) => tx.from === account)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions, account])

  const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)
  useEffect(() => {
    if ((library?.provider as any)?.isWalletConnect) {
      // to check the connection is active or disconnected by user end
      clearInterval(timerRef.current)
      timerRef.current = setInterval(async () => {
        try {
          if (library?.provider?.request) {
            await library?.provider?.request({ method: 'eth_requestAccounts' })
          }
        } catch (e) {
          if (active && disconnectWallet && e?.message === 'Please call connect() before request()') {
            disconnectWallet()
          }
        }
      }, 5000)
    } else {
      clearInterval(timerRef.current)
    }
  }, [library?.provider, active, disconnectWallet])
  // function getCurrencyName(): string {
  //   if (!chainId) return 'ETH'
  //   switch (chainId) {
  //     case SupportedChainId.POLYGON:
  //     case SupportedChainId.POLYGON_MUMBAI:
  //       return 'MATIC'
  //     case SupportedChainId.BINANCE:
  //     case SupportedChainId.BINANCE_TESTNET:
  //       return 'BNB'
  //     default:
  //       return 'ETH'
  //   }
  // }
  return (
    <>
      {isContentPage && isMobile ? (
        <>
          <StyledNavButton onClick={() => setShowMobileNav((prev) => !prev)}>
            <StyledMenuIcon />
          </StyledNavButton>
          <Modal
            isOpen={showMobileNav}
            onDismiss={() => setShowMobileNav((prev) => !prev)}
            minHeight={35}
            maxHeight={90}
            mobileModalPosition={'TOP'}
            backgroundColor={'#4B53D5'}
          >
            <Wrapper>
              {
                <NavContent>
                  <NavHeading>
                    <LogoBox display={'flex'}>
                      <ResponseImage src={BestDexHero} alt="logo" />
                      <ThemedText.White fontWeight={700} display={'flex'} alignItems={'center'}>
                        Best DEX
                      </ThemedText.White>
                    </LogoBox>
                    <StyledCloseIcon onClick={() => setShowMobileNav((prev) => !prev)} />
                  </NavHeading>
                  <NavBody>
                    {/******* Temp. hiding trade button ********/}
                    {/* <PageLinks href="https://bestwallet.com/en/airdrop" target="_blank">
                      Airdrop
                    </PageLinks> */}
                    <UndecoratedHashLink to="/home#features-scroll" onClick={() => setShowMobileNav((prev) => !prev)}>
                      Features
                    </UndecoratedHashLink>
                    <PageLinks
                      href="https://bestwallet.com"
                      target="_blank"
                      onClick={() => setShowMobileNav((prev) => !prev)}
                    >
                      Best Wallet
                    </PageLinks>
                    {/* <PageLinks href="#/swap">Trade</PageLinks> */}
                    <UndecoratedLink to={'/swap'}>
                      <Button
                        fontColor={'#4B53D5'}
                        size={'MEDIUM'}
                        borderRadius={'10px'}
                        type={'HERO'}
                        text={<Trans>Trade</Trans>}
                        fontWeight={600}
                        // onClick={() => history.push('/swap')}
                      ></Button>
                    </UndecoratedLink>
                    {<MenuComponent />}
                    {/* wallet status in homepage mobile view */}
                    {/* <AccountElement
                      showBg={(!!activeAccount && !!userEthBalance) || !isContentPage}
                      active={!!activeAccount}
                    >
                      {activeAccount && userEthBalance ? (
                        <BalanceText
                          style={{ flexShrink: 0, userSelect: 'none' }}
                          pl="0.75rem"
                          pr="0.5rem"
                          fontWeight={500}
                        >
                          <Trans>
                            {userEthBalance?.toSignificant(4)} {getCurrencyName()}
                          </Trans>
                        </BalanceText>
                      ) : null}
                      <Box width={!isMobile ? '150px' : 'fit-content'}>
                        <Web3StatusInner />
                      </Box>
                    </AccountElement> */}
                  </NavBody>
                </NavContent>
              }
            </Wrapper>
          </Modal>
        </>
      ) : (
        <Web3StatusInner />
      )}

      {(contextNetwork.active || active) && (
        <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
      )}
    </>
  )
}
