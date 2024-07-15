import { Trans } from '@lingui/macro'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BestWalletConnector } from 'connectors/BestWalletConnector'
import { AutoColumn } from 'components/Column'
import { PrivacyPolicy } from 'components/PrivacyPolicy'
import Row from 'components/Row'
import { useWalletConnectMonitoringEventCallback } from 'hooks/useMonitoringEventCallback'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft } from 'react-feather'
import ReactGA from 'react-ga'
import styled from 'styled-components/macro'
import { Box } from 'rebass'
import { QRCodeSVG } from 'qrcode.react'

import MetamaskIcon from '../../assets/images/metamask.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { fortmatic, injected, portis } from '../../connectors'
import { OVERLAY_READY } from '../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import usePrevious from '../../hooks/usePrevious'
import { useModalOpen, useWalletModalToggle, useOpenModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ThemedText } from '../../theme'
import { isMobile } from '../../utils/userAgent'
import AccountDetails from '../AccountDetails'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'
import bestWalletTopBg from '../../assets/svg/coming_soon_top.svg'
import bestWalletBottomBg from '../../assets/svg/coming_soon_bottom.svg'
import bestWalletBot from '../../assets/svg/best_wallet_bot.svg'
import bestWalletLogo from '../../assets/svg/best_wallet_logo.svg'
import BestWalletLogoBordered from '../../assets/svg/best_wallet_with_border.svg'
import DownloadBestWalletModal from './DownloadBestWalletModal'
import { getMobileOperatingSystem } from '../../utils/userAgent'
import { CustomWalletConnectConnector } from 'connectors/CustomWalletConnectV2Connector'
import { removeSessionData, setSessionData } from 'utils/sessionStorage'
// import { LightCard } from 'components/Card'
const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
const CloseIconGrey = styled.div`
  cursor: pointer;
`
const CloseIconWhiteBG = styled.div`
  border-radius: 50%;
  padding: 6px 6px 4px 6px;
  display: flex;
  height: 36px;
  width: 36px;
  background-color: ${({ theme }) => theme.bg1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 0 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0 1rem 1rem 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
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
const ComingSoonContainer = styled(Box)`
  position: relative;
  background: linear-gradient(0deg, #4b53d5 0%, #9ea4ff 100%);
  width: 420px;
  height: 420px;
  display: flex;
  flex-direction: column;
  background-size: cover;
`
const CustomLink = styled(ThemedText.Link)`
  color: ${({ theme }) => theme.black};
  cursor: pointer;
  padding-left: 5px;
`
const BestWalletTopBg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`
const BestWalletBottomBg = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
`
const UndecoratedLink = styled.a`
  text-decoration: none;
  display: flex;
`
const QRCodeContainer = styled.div`
  background-color: ${({ theme }) => theme.bg7};
  padding: 24px;
`
const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
  LEGAL: 'legal',
  COMING_SOON: 'coming_soon',
  BEST_WALLET_QR: 'best_wallet_QR',
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, account, connector, activate, error } = useWeb3React()

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const [bestWalletConnectorUri, setBestWalletConnectorUri] = useState<string>('')
  const previousWalletView = usePrevious(walletView)

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState<boolean>(false)
  const [isBestWalletOption, setIsBestWalletOption] = useState<boolean>(false)
  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)
  const openWalletModalHandler = useOpenModal(ApplicationModal.WALLET)

  const logMonitoringEvent = useWalletConnectMonitoringEventCallback()
  const selectedProvider = (window?.ethereum as any)?.selectedProvider
  useEffect(() => {
    // if (selectedProvider.isCoinbaseWallet) {
    setIsCoinbaseWallet(!!selectedProvider?.isCoinbaseWallet)
    // connector?.getProvider()?.then((providerData) => {
    //   setIsCoinbaseWallet(!!(window?.ethereum as any)?.selectedProvider?.isCoinbaseWallet)
    // })
  }, [selectedProvider])

  // close on connection, when logged out before
  useEffect(() => {
    if (account && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])

  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  useEffect(() => {
    if (walletModalOpen && ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [setWalletView, active, error, connector, walletModalOpen, activePrevious, connectorPrevious])

  // handling case for bestwallet connector
  const openBestWalletUrl = useCallback((url: string, bestWalletConnectorUri: string) => {
    if (url) {
      // setTimeout(() => {
      //   window.open(bestWalletUrl + bestWalletConnectorUri)
      // })
      const now = new Date().valueOf()
      setTimeout(function () {
        if (new Date().valueOf() - now > 100) return
        const linkElement = document.createElement('a')
        document.body.appendChild(linkElement)
        linkElement.style.visibility = 'hidden'
        linkElement.href = url
        if (getMobileOperatingSystem() === 'android') {
          linkElement.target = '_blank'
        }
        linkElement.click()
        document.body.removeChild(linkElement)
      }, 50)
      ;(window as Window).location = process.env?.REACT_APP_BEST_WALLET_GENRIC_CONNECTOR + bestWalletConnectorUri
    }
  }, [])
  useEffect(() => {
    if (bestWalletConnectorUri !== '') {
      if (!isMobile) {
        setWalletView(WALLET_VIEWS.BEST_WALLET_QR)
      } else {
        const bestWalletUrl = process?.env?.REACT_APP_BEST_WALLET_URL
          ? process?.env?.REACT_APP_BEST_WALLET_URL
          : 'https://best-wallet-staging.web.app/connect?'
        if (bestWalletUrl) {
          // window.open(bestWalletUrl + bestWalletConnectorUri, '_blank')
          openBestWalletUrl(bestWalletUrl + bestWalletConnectorUri, bestWalletConnectorUri)
        }
      }
    }
  }, [bestWalletConnectorUri, openBestWalletUrl])

  useEffect(() => {
    if (!(walletView === WALLET_VIEWS.BEST_WALLET_QR) && !(walletView === WALLET_VIEWS.PENDING)) {
      setBestWalletConnectorUri('')
    }
  }, [walletView])
  /**
   * Function to allow selecting between metamask and coinbase if both wallets
   * present in browser
   * @param connector wallet connector object
   * @param name string - name of the network
   * @returns void
   */
  const tryWebActivation = (connector: AbstractConnector | undefined, name: string) => {
    if ((window as any).ethereum && (window as any).ethereum.providers) {
      const { ethereum } = window
      if (!(ethereum as any)?.providers) {
        return undefined
      }
      let provider
      switch (name) {
        case 'Coinbase Wallet':
          provider = (ethereum as any).providers.find(({ isCoinbaseWallet }: any) => isCoinbaseWallet)
          removeSessionData('metamaskConnectData')
          setSessionData('coinbaseConnectData', { isConnected: true })

          break
        case 'MetaMask':
          provider = (ethereum as any).providers.find(({ isMetaMask }: any) => isMetaMask)
          removeSessionData('coinbaseConnectData')
          setSessionData('metamaskConnectData', { isConnected: true })
          break
        default:
          tryActivation(connector)
          return undefined
      }
      if (provider) {
        ;(ethereum as any).setSelectedProvider(provider)
        tryActivation(connector)
      }
    } else {
      tryActivation(connector)
    }
    return undefined
  }
  const tryActivation = async (connector: AbstractConnector | undefined) => {
    let name = ''
    let walletConnectRejected = false
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    setPendingWallet(connector) // set wallet for pending view
    setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector) {
      connector.walletConnectProvider = undefined
    }
    if (connector instanceof BestWalletConnector) {
      connector.getBestWalletUriPromise().then((val: string) => {
        setBestWalletConnectorUri(val ? val : '')
      })
    }
    // closing modal to avoid overlap between walletconnect modal, as it affects the view all wallet scroll.
    if (connector instanceof CustomWalletConnectConnector) {
      toggleWalletModal()
    }
    connector &&
      (await activate(connector, undefined, true)
        .then(async () => {
          const walletAddress = await connector.getAccount()
          // setWalletView(WALLET_VIEWS.BEST_WALLET_QR)
          logMonitoringEvent({ walletAddress })
          if (isCoinbaseWallet) {
            setWalletView(WALLET_VIEWS.ACCOUNT)
          }
        })
        .catch((error) => {
          if (error instanceof UnsupportedChainIdError) {
            activate(connector) // a little janky...can't use setError because the connector isn't set
          } else {
            // show closed modal again for walletconnect.
            if (connector instanceof CustomWalletConnectConnector) {
              openWalletModalHandler()
              setWalletView(WALLET_VIEWS.PENDING)
              setPendingError(true)
            }
            walletConnectRejected = true
            setPendingError(true)
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
              setPendingError(true)
            }
          })
      }, 200)
    }
  }

  const renderDownloadBestWalletPopup = () => {
    return <DownloadBestWalletModal></DownloadBestWalletModal>
  }
  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                // if (option.name === 'Best Wallet') {
                //   setWalletView(WALLET_VIEWS.COMING_SOON)
                // } else {
                option.connector !== connector && !option.href && tryActivation(option.connector)
                // }
              }}
              id={`connect-${key}`}
              key={key}
              active={option.connector && option.connector === connector}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={option.iconURL}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={<Trans>Install Metamask</Trans>}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }
      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              if (isCoinbaseWallet && walletView === WALLET_VIEWS.OPTIONS) {
                option.name === 'Coinbase Wallet'
                  ? setWalletView(WALLET_VIEWS.ACCOUNT)
                  : !option.href && tryWebActivation(option.connector, option.name)
              }
              //  else if (option.name === 'Best Wallet') {
              //   setIsBestWalletOption(true)
              //   setWalletView(WALLET_VIEWS.BEST_WALLET_QR)
              // }
              else {
                option.connector === connector
                  ? setWalletView(WALLET_VIEWS.ACCOUNT)
                  : !option.href && tryWebActivation(option.connector, option.name)
              }
            }}
            key={key}
            active={isCoinbaseWallet ? connector && option.name === 'Coinbase Wallet' : option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={option.iconURL}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error connecting</Trans>}
          </HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>
                <Trans>Please connect to the appropriate Ethereum network.</Trans>
              </h5>
            ) : (
              <Trans>Error connecting. Try refreshing the page.</Trans>
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (walletView === WALLET_VIEWS.COMING_SOON) {
      return (
        <ComingSoonContainer>
          <BestWalletTopBg src={bestWalletTopBg} width={'120px'} alt={'background_image'}></BestWalletTopBg>
          <BestWalletBottomBg src={bestWalletBottomBg} width={'80px'} alt={'background_image'}></BestWalletBottomBg>
          <Box display={'flex'} padding={'15px'} alignItems={'center'} justifyContent={'end'}>
            <CloseIconWhiteBG
              onClick={() => {
                setIsBestWalletOption(false)
                setWalletView(
                  (previousWalletView === WALLET_VIEWS.LEGAL ? WALLET_VIEWS.ACCOUNT : previousWalletView) ??
                    WALLET_VIEWS.ACCOUNT
                )
              }}
            >
              <CloseColor />
            </CloseIconWhiteBG>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
            <img src={bestWalletBot} width={'60px'} alt={'best wallet bot'}></img>
            <Box marginY={'10px'}>
              <img src={bestWalletLogo} width={'200px'} alt={'best wallet logo'}></img>
            </Box>
            <ThemedText.White marginBottom={'5px'} fontWeight={'800'} fontSize={'2.7rem'}>
              <Trans>{'Coming Soon'}</Trans>
            </ThemedText.White>
            <ThemedText.White fontWeight={'600'} fontSize={'0.8rem'}>
              <Trans>{'Connect to Best Wallet'}</Trans>
            </ThemedText.White>
            <Box display={'flex'}>
              <ThemedText.White fontWeight={'600'} fontSize={'0.8rem'}>
                <Trans>{'Learn more'}</Trans>
              </ThemedText.White>
              <UndecoratedLink href="https://bestwallet.com/en" target="_blank">
                <CustomLink fontWeight={'600'} fontSize={'0.8rem'}>
                  <Trans>{'here.'}</Trans>
                </CustomLink>
              </UndecoratedLink>
            </Box>
          </Box>
        </ComingSoonContainer>
      )
    }
    if (walletView === WALLET_VIEWS.BEST_WALLET_QR) {
      return (
        <QRCodeContainer>
          <Box display={'flex'} justifyContent={'space-between'} marginBottom={'12px'}>
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              <ArrowLeft color={'#CBCBCB'} />
            </HoverText>
            <ThemedText.Black>
              <Trans>Scan with Best Wallet</Trans>
            </ThemedText.Black>
            <CloseIconGrey onClick={toggleWalletModal}>
              <CloseColor color={'#CBCBCB'} />
            </CloseIconGrey>
          </Box>
          <Box padding={'10px'} paddingBottom={'5px'} bg={'white'} style={{ borderRadius: '10px' }}>
            <QRCodeSVG
              value={bestWalletConnectorUri ? 'best_wallet:' + bestWalletConnectorUri : ''}
              width="100%"
              height="100%"
              level="M"
              fgColor={'black'}
              imageSettings={{
                src: BestWalletLogoBordered,
                height: 33,
                width: 33,
                excavate: false,
              }}
            ></QRCodeSVG>
          </Box>
        </QRCodeContainer>
      )
    }
    if (walletView === WALLET_VIEWS.LEGAL) {
      return (
        <UpperSection>
          <HeaderRow>
            <HoverText
              onClick={() => {
                setWalletView(
                  (previousWalletView === WALLET_VIEWS.LEGAL ? WALLET_VIEWS.ACCOUNT : previousWalletView) ??
                    WALLET_VIEWS.ACCOUNT
                )
              }}
            >
              <ArrowLeft />
            </HoverText>
            <Row justify="center">
              <ThemedText.MediumHeader>
                <Trans>Legal & Privacy</Trans>
              </ThemedText.MediumHeader>
            </Row>
          </HeaderRow>
          <PrivacyPolicy />
        </UpperSection>
      )
    }
    if (account && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
          setBestWalletConnectorUri={setBestWalletConnectorUri}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              <ArrowLeft />
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>
              <Trans>Connect a wallet</Trans>
            </HoverText>
          </HeaderRow>
        )}
        <ContentWrapper>
          <AutoColumn gap="16px">
            {walletView === WALLET_VIEWS.PENDING ? (
              <PendingView
                connector={pendingWallet}
                error={pendingError}
                setPendingError={setPendingError}
                tryActivation={tryActivation}
              />
            ) : (
              <OptionGrid>{getOptions()}</OptionGrid>
            )}
          </AutoColumn>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal
      hideBorder={isBestWalletOption}
      isOpen={walletModalOpen}
      onDismiss={toggleWalletModal}
      minHeight={false}
      maxHeight={90}
      secondaryPopup={walletView === WALLET_VIEWS.BEST_WALLET_QR ? renderDownloadBestWalletPopup : undefined}
      modalWidth={walletView === WALLET_VIEWS.BEST_WALLET_QR ? '480px' : '420px'}
    >
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
