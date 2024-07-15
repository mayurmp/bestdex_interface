import { Trans } from '@lingui/macro'
import useScrollPosition from '@react-hook/window-scroll'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useWalletConnectMonitoringEventCallback } from 'hooks/useMonitoringEventCallback'
import { BestWalletConnector } from 'connectors/BestWalletConnector'
import { SupportedChainId } from 'constants/chains'
import { useEffect, useState, useCallback, useRef } from 'react'
import { Box, Text } from 'rebass'
import { Link } from 'react-router-dom'
import { useShowClaimPopup, useToggleSelfClaimModal } from 'state/application/hooks'
import { useUserHasAvailableClaim } from 'state/claim/hooks'
import { useUserHasSubmittedClaim } from 'state/transactions/hooks'
import { useETHBalances } from 'state/wallet/hooks'
import styled from 'styled-components/macro'
import logo from '../../assets/svg/Logo_DEX.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import { ThemedText } from '../../theme'
import ClaimModal from '../claim/ClaimModal'
import { CardNoise } from '../earn/styled'
// import Menu from '../Menu'
import Languagedropdown from 'components/Languagedropdown'
import Modal from '../Modal'
import { Dots } from '../swap/styleds'
import Web3Status from '../Web3Status'
import NetworkSelector from './NetworkSelector'
import UniBalanceContent from './UniBalanceContent'
import BestDexHero from '../../assets/svg/best_DEX_Hero.svg'
// import { darken } from 'polished'
import { isMobile } from '../../utils/userAgent'
import Button from 'components/@common/button'
import useContentPage from 'hooks/useContentPage'
import { X } from 'react-feather'
import { AutoColumn } from '../Column'
import { RowBetween } from 'components/Row'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'
import { bestWalletConnector } from 'connectors'
// import { getMobileOperatingSystem } from '../../utils/userAgent'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import ReactGA from 'react-ga'

const HeaderFrame = styled.div<{ showBackground: boolean; isHome: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 83px;
  top: 0;
  position: relative;
  padding: 0.5rem;
  z-index: 21;
  position: relative;
  /* Background slide effect on scroll. */
  background-image: ${({ theme, isHome }) =>
    `linear-gradient(to bottom, transparent 50%, ${isHome ? '#5a63ff96' : theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 0px
    ${({ theme, showBackground, isHome }) => (showBackground ? (isHome ? '#5a63ff96' : theme.bg2) : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
`

const HeaderFrameInner = styled.div<{ gridFr: string }>`
  display: grid;
  width: 100%;
  max-width: 1440px;
  grid-template-columns: ${({ theme, gridFr }) => gridFr + ' 1fr ' + gridFr};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  @media screen and (min-width: 950px) {
    justify-content: space-around;
  }

  ${({ theme, gridFr }) => theme.mediaWidth.upToLarge`
    grid-template-columns: ${gridFr} 1fr ${gridFr};
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding:  1rem;
    grid-template-columns: 1fr 500px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding:  8px 12px;
    grid-template-columns: 130px 1fr;
  `};
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    padding: 0px 2.5rem;
  }
`

const HeaderControls = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
  gap: 15px;
  @media screen and (max-width: 600px) {
    padding-right: 0px !important;
    gap: 8px;
  }
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  &:not(:first-child) {
    margin-left: 0.5em;
  }

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const LogoBox = styled(Box)`
  padding-left: 103px;
  @media screen and (max-width: 600px) {
    padding-left: 0px;
  }
`

const AccountElement = styled.div<{ active: boolean; showBg: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active, showBg }) => (showBg ? (!active ? theme.bg9 : theme.bg9) : '')};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

// const Title = styled.a`
//   display: flex;
//   align-items: center;
//   pointer-events: auto;
//   text-decoration: none;
//   justify-self: flex-start;
//   margin-right: 12px;
//   font-weight: 700;
//   font-size: 24px;
//   line-height: 36px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     justify-self: flex-start;
//   `};
//   :hover {
//     cursor: pointer;
//   }
// `

const UniIcon = styled.div`
  // transition: transform 0.3s ease;
  display: flex;
  margin-top: -10px;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  // :hover {
  //   transform: rotate(-5deg);
  // }
  @media screen and (max-width: 600px) {
    margin-top: 0px;
  }
`

const PageLinks = styled.a`
  width: 90px;
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: white;
  cursor: pointer;
  text-decoration: none;
  :hover {
    color: #75ffff;
  }
  @media screen and (max-width: 600px) {
    margin-right: 0px !important;
  }
`
const HideForMobileText = styled(ThemedText.White)`
  width: 150px;
  font-size: 24px;

  @media screen and (max-width: 1000px) {
    font-size: 17px;
    width: 100px;
  }
  @media screen and (max-width: 600px) {
    // display: none !important;
  }
`
const HideForMobileTextDark = styled(ThemedText.Black)`
  width: 150px;
  margin-left: 10px;
  font-size: 20px;
  cursor: pointer;
  @media screen and (max-width: 1000px) {
    font-size: 16px;
    width: 100px;
  }
  @media screen and (max-width: 600px) {
    display: none !important;
  }
`
const ResponseImage = styled.img`
  width: 60px;
  @media screen and (max-width: 1000px) {
    width: 40px;
  }
`
const HomeLinks = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  gap: 30px;
  font-size: 15px;
`
const UndecoratedLink = styled(Link)`
  text-decoration: none;
`
const HoverText = styled.div`
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`
// const StickyNote = styled(Box)`
//   cursor: pointer;
// `
// const UndecoratedLink = styled.a`
//   text-decoration: none;
// `

export default function Header() {
  const isContentPage = useContentPage()
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)
  const urlRef = useRef('')
  const { account, chainId } = useActiveWeb3React()
  const [openNetworkSwitchError, setNetworkSwitchError] = useState(false)
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const toggleClaimModal = useToggleSelfClaimModal()
  const { activate } = useWeb3React()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const logMonitoringEvent = useWalletConnectMonitoringEventCallback()
  const showClaimPopup = useShowClaimPopup()
  const scrollY = useScrollPosition()
  const toggleNetworkError = () => {
    setNetworkSwitchError((prev) => !prev)
  }

  // auto connecting to best wallet when client is bestwallet
  const openBestWalletUrl = useCallback((url: string, bestWalletConnectorUri: string) => {
    if (url) {
      const bestWAlletConnectorPrefix = process?.env?.REACT_APP_BEST_WALLET_BEST_DEX_CONNECTOR
      ;(window as Window).location = bestWAlletConnectorPrefix + bestWalletConnectorUri
    }
  }, [])

  // auto connecting to best wallet when client is bestwallet
  const tryActivation = useCallback(
    async (connector: AbstractConnector | undefined) => {
      try {
        let name = ''
        let walletConnectRejected = false
        Object.keys(SUPPORTED_WALLETS).map((key) => {
          if (connector === SUPPORTED_WALLETS[key]?.connector) {
            return (name = SUPPORTED_WALLETS[key]?.name)
          }
          return true
        })
        // log selected wallet
        ReactGA.event({
          category: 'Wallet',
          action: 'Change Wallet',
          label: name,
        })

        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof WalletConnectConnector) {
          connector.walletConnectProvider = undefined
        }
        if (connector instanceof BestWalletConnector) {
          connector.getBestWalletUriPromise().then((val: string) => {
            const bestWalletUrl = process?.env?.REACT_APP_BEST_WALLET_URL ? process?.env?.REACT_APP_BEST_WALLET_URL : ''
            if (bestWalletUrl) {
              // window.open(bestWalletUrl + bestWalletConnectorUri, '_blank')
              openBestWalletUrl(bestWalletUrl + val, val)
              urlRef.current = val
            }
          })
        }
        connector &&
          (await activate(connector, undefined, true)
            .then(async () => {
              await connector.getAccount()
            })
            .catch((error) => {
              if (error instanceof UnsupportedChainIdError) {
                activate(connector) // a little janky...can't use setError because the connector isn't set
              } else {
                walletConnectRejected = true
              }
            }))
        if (connector instanceof WalletConnectConnector && !walletConnectRejected) {
          connector.walletConnectProvider = undefined
          setTimeout(() => {
            activate(connector, undefined, true)
              .then(async () => {
                const walletAddress = await connector.getAccount()
                logMonitoringEvent({ walletAddress })
              })
              .catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                  activate(connector) // a little janky...can't use setError because the connector isn't set
                } else {
                }
              })
          }, 200)
        }
      } catch (e) {
        console.log(e)
      }
    },
    [activate, logMonitoringEvent, openBestWalletUrl]
  )
  // auto connecting to best wallet when client is bestwallet
  useEffect(() => {
    if (clientType === CLIENT_BEST_WALLET && urlRef.current === '') {
      tryActivation(bestWalletConnector)
    }
  }, [clientType, tryActivation])
  /**
   * function to get the native token name
   * @returns string - native token name
   */
  function getCurrencyName(): string {
    if (!chainId) return 'ETH'
    switch (chainId) {
      case SupportedChainId.POLYGON:
      case SupportedChainId.POLYGON_MUMBAI:
        return 'MATIC'
      case SupportedChainId.BINANCE:
      case SupportedChainId.BINANCE_TESTNET:
        return 'BNB'
      default:
        return 'ETH'
    }
  }
  return (
    <Box width={'100%'}>
      <HeaderFrame isHome={isContentPage} showBackground={isContentPage || scrollY > 45}>
        {/* <HeaderFrameInner gridFr={isContentPage ? '600px' : 'auto'}> */}
        <HeaderFrameInner gridFr={isContentPage ? '600px' : 'auto'}>
          <ClaimModal />
          <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
            <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
          </Modal>
          {openNetworkSwitchError && (
            <Modal isOpen={openNetworkSwitchError} onDismiss={() => toggleNetworkError()}>
              <AutoColumn gap="12px">
                <RowBetween padding="1rem 1rem 0.5rem 1rem">
                  <ThemedText.MediumHeader>
                    <Trans>Network Change Error</Trans>
                  </ThemedText.MediumHeader>
                  <HoverText onClick={() => toggleNetworkError()}>
                    <X size={24} />
                  </HoverText>
                </RowBetween>
                <RowBetween padding="1rem 1rem 0.5rem 1rem">
                  <ThemedText.DarkGray>
                    <Trans>Please select the network from your wallet application</Trans>
                  </ThemedText.DarkGray>
                </RowBetween>
                <Box padding="1rem 1rem 0.5rem 1rem" display={'flex'} justifyContent={'end'}>
                  <Button onClick={() => toggleNetworkError()} borderRadius={'12px'}>
                    <ThemedText.White>
                      <Trans>close</Trans>
                    </ThemedText.White>
                  </Button>
                </Box>
              </AutoColumn>
            </Modal>
          )}
          {clientType !== CLIENT_BEST_WALLET ? (
            <>
              {!isContentPage ? (
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  height={'100%'}
                  onClick={() => {
                    if (process.env.REACT_APP_URL) {
                      const appBaseURL = process.env.REACT_APP_URL?.replace('app/#/swap', '')
                      window.location.replace(appBaseURL ?? '')
                    }
                  }}
                >
                  <UniIcon style={{ width: '70%' }}>
                    <img src={logo} style={{ width: '35px', cursor: 'pointer' }} alt="logo" />
                    {/* <Logo fill={darkMode ? white : black} width="24px" height="100%" title="logo" /> */}
                    <HideForMobileTextDark
                      fontWeight={700}
                      marginLeft={'6px'}
                      display={'flex'}
                      alignItems={'center'}
                    >{`Best DEX`}</HideForMobileTextDark>
                  </UniIcon>
                </Box>
              ) : (
                <LogoBox display={'flex'}>
                  <ResponseImage src={BestDexHero} alt="logo" />
                  <HideForMobileText fontWeight={700} display={'flex'} alignItems={'center'}>
                    Best DEX
                  </HideForMobileText>
                </LogoBox>
              )}
            </>
          ) : (
            <div></div>
          )}
          {/* {!isContentPage && clientType !== CLIENT_BEST_WALLET ? (
            <HeaderLinks>
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                <Trans>Swap</Trans>
              </StyledNavLink>
              <StyledNavLink
                id={`pool-nav-link`}
                to={'/pool'}
                isActive={(match, { pathname }) =>
                  Boolean(match) ||
                  pathname.startsWith('/add') ||
                  pathname.startsWith('/remove') ||
                  pathname.startsWith('/increase') ||
                  pathname.startsWith('/find')
                }
              >
                <Trans>Pool</Trans>
              </StyledNavLink>
            </HeaderLinks>
          ) : (
            <HeaderLinksForSm></HeaderLinksForSm>
          )} */}
          <HeaderControls paddingRight={isContentPage ? '120px' : '0px'}>
            <HeaderElement>
              {!isContentPage ? <NetworkSelector toggleNetworkError={toggleNetworkError} /> : <Box></Box>}
            </HeaderElement>
            <HeaderElement>
              {availableClaim && !showClaimPopup && (
                <UNIWrapper onClick={toggleClaimModal}>
                  <UNIAmount
                    showBg={!isContentPage}
                    active={!!account && !availableClaim}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <ThemedText.White padding="0 2px">
                      {claimTxn && !claimTxn?.receipt ? (
                        <Dots>
                          <Trans>Claiming BD LP</Trans>
                        </Dots>
                      ) : (
                        <Trans>Claim BD LP</Trans>
                      )}
                    </ThemedText.White>
                  </UNIAmount>
                  <CardNoise />
                </UNIWrapper>
              )}
              {/******* Temp. hiding trade button ********/}
              {/* {isContentPage && !isMobile && (
              <PageLinks href="https://bestwallet.com/en/airdrop" target="_blank">
                Airdrop`
              </PageLinks>
            )} */}
              {isContentPage && !isMobile && (
                <HomeLinks>
                  <PageLinks href="#features-scroll">
                    <Trans>Features</Trans>
                  </PageLinks>
                  <PageLinks href="https://bestwallet.com" target="_blank">
                    Best Wallet
                  </PageLinks>
                  {/* <PageLinks href="#/swap">
                  <Trans>Trade</Trans>
                </PageLinks> */}
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
                </HomeLinks>
              )}
              {/* if it not homepage dont show wallet details */}
              {!isContentPage ? (
                <AccountElement
                  showBg={(!!account && !!userEthBalance && !isMobile) || !isContentPage}
                  active={!!account}
                >
                  {account && userEthBalance ? (
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
                  <Web3Status />
                </AccountElement>
              ) : (
                <Web3Status />
              )}
            </HeaderElement>
            {/* if it not homepage and mobile dont show on header, instead show in fade in nav bar */}
            {!(isContentPage && isMobile) && (
              <HeaderElement>{<Languagedropdown langShortHand={isMobile} />}</HeaderElement>
            )}
          </HeaderControls>
        </HeaderFrameInner>
      </HeaderFrame>
      {/* <Headertab isHome={isContentPage} showBackground={isContentPage || scrollY > 45}>
        {!isContentPage && clientType !== CLIENT_BEST_WALLET ? (
          <HeaderLinks>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              <Trans>Swap</Trans>
            </StyledNavLink>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/increase') ||
                pathname.startsWith('/find')
              }
            >
              <Trans>Pool</Trans>
            </StyledNavLink>
          </HeaderLinks>
        ) : (
          <HeaderLinksForSm></HeaderLinksForSm>
        )}
      </Headertab> */}

      {/* hiding the sticky note as it not needed for now */}
      {/* {isContentPage && (
        <UndecoratedLink href="https://bestwallet.com/en" target="_blank">
          <StickyNote
            backgroundColor={'#969BFF'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'38px'}
          >
            <ThemedText.Black fontWeight={'600'} color={'#3C42AA'} fontSize={isMobile ? '11px' : '15px'}>
              <Trans>Join the Best Wallet Waitlist to participate in the BEST Airdrop</Trans>
            </ThemedText.Black>
          </StickyNote>
        </UndecoratedLink>
      )} */}
    </Box>
  )
}
