import { Trans } from '@lingui/macro'
import { AbstractConnector } from '@web3-react/abstract-connector'
import Button from 'components/@common/button'
import { useCallback, useContext } from 'react'
import { ExternalLink as LinkIcon } from 'react-feather'
import { useAppDispatch } from 'state/hooks'
import styled, { ThemeContext } from 'styled-components/macro'
// import { darken } from 'polished'

import { ReactComponent as Close } from '../../assets/images/x.svg'
import { injected, portis, walletlink } from '../../connectors'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import { useActiveWeb3React } from '../../hooks/web3'
import { clearAllTransactions } from '../../state/transactions/actions'
import { ExternalLink, ThemedText } from '../../theme'
import { shortenAddress } from '../../utils'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { ButtonSecondary } from '../Button'
import StatusIcon from '../Identicon/StatusIcon'
import { AutoRow } from '../Row'
import Copy from './Copy'
import Transaction from './Transaction'
import { useIsDarkMode } from 'state/user/hooks'
import { removeSessionData, setSessionData } from 'utils/sessionStorage'

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
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

const InfoCard = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};
  border-radius: 20px;
  position: relative;
  display: grid;
  grid-row-gap: 12px;
  margin-bottom: 20px;
`

const AccountGroupingRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  color: ${({ theme }) => theme.text1};

  div {
    ${({ theme }) => theme.flexRowNoWrap}
    align-items: center;
  }
`

const AccountSection = styled.div`
  padding: 0rem 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0rem 1rem 1.5rem 1rem;`};
`

const YourAccount = styled.div`
  h5 {
    margin: 0 0 1rem 0;
    font-weight: 400;
  }

  h4 {
    margin: 0;
    font-weight: 500;
  }
`

const LowerSection = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  padding: 1.5rem;
  flex-grow: 1;
  overflow: auto;
  background-color: ${({ theme }) => theme.primary6};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  h5 {
    margin: 0;
    font-weight: 400;
    color: ${({ theme }) => theme.text3};
  }
`

const AccountControl = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 0;
  width: 100%;

  font-weight: 500;
  font-size: 1.25rem;

  a:hover {
    text-decoration: underline;
  }

  p {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const AddressLink = styled(ExternalLink)<{ hasENS: boolean; isENS: boolean }>`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text3};
  margin-left: 1rem;
  font-size: 0.825rem;
  display: flex;
  :hover {
    color: ${({ theme }) => theme.text2};
  }
`

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
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

const WalletName = styled.div`
  width: initial;
  font-size: 0.825rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text3};
  @media screen and (max-width: 600px) {
    max-width: 150px;
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: flex-end;
  `};
`

function WrappedStatusIcon({ connector }: { connector: AbstractConnector }) {
  return (
    <IconWrapper size={16}>
      <StatusIcon connector={connector} />
      {connector === portis && (
        <MainWalletAction
          onClick={() => {
            portis.portis.showPortis()
          }}
        >
          <Trans>Show Portis</Trans>
        </MainWalletAction>
      )}
    </IconWrapper>
  )
}

const TransactionListWrapper = styled.div<{ darkMode: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  // overflow-y: scroll;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 15px;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: ${({ theme }) => theme.bg10};
  }
  ::-webkit-scrollbar-thumb:vertical {
    // height: 10px;
    background-color: ${({ theme }) => (theme.darkMode ? '#444444' : '#C1C1C1')};
  }
`

const WalletAction = styled(ButtonSecondary)`
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.825rem;
  padding: 4px 6px;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const DisconnectButton = styled(ButtonSecondary)`
  text-decoration: none;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  font-weight: 400;
  margin-left: 8px;
  font-size: 0.725rem;
  font-weight: 500;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  border: none;
  background-color: ${({ theme }) => theme.red1};
  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && theme.red1};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.redHover};
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && theme.red1};
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    border: 2px solid rgba(254, 228, 226, 0.5);
  }
`

const MainWalletAction = styled(WalletAction)`
  color: ${({ theme }) => theme.primary1};
`

function renderTransactions(transactions: string[], darkMode: boolean) {
  return (
    <TransactionListWrapper darkMode={darkMode}>
      {transactions.map((hash, i) => {
        return <Transaction key={i} hash={hash} />
      })}
    </TransactionListWrapper>
  )
}

interface AccountDetailsProps {
  toggleWalletModal: () => void
  pendingTransactions: string[]
  confirmedTransactions: string[]
  ENSName?: string
  openOptions: () => void
  setBestWalletConnectorUri: (val: string) => void
}

export default function AccountDetails({
  toggleWalletModal,
  pendingTransactions,
  confirmedTransactions,
  ENSName,
  openOptions,
  setBestWalletConnectorUri,
}: AccountDetailsProps) {
  const { chainId, account, connector, deactivate } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const dispatch = useAppDispatch()
  const from = account ? account : ''
  function formatConnectorName() {
    const { ethereum } = window
    const isMetaMask = !!(ethereum && ethereum.isMetaMask)
    let name = ''
    if (ethereum && (ethereum as any)?.selectedProvider && (ethereum as any)?.selectedProvider?.isCoinbaseWallet) {
      name = 'Coinbase'
    } else {
      name = Object.keys(SUPPORTED_WALLETS)
        .filter(
          (k) =>
            SUPPORTED_WALLETS[k].connector === connector &&
            (connector !== injected || isMetaMask === (k === 'METAMASK'))
        )
        .map((k) => SUPPORTED_WALLETS[k].name)[0]
    }
    return (
      <WalletName>
        <Trans>Connected with {name}</Trans>
      </WalletName>
    )
  }

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId, from }))
  }, [dispatch, chainId, from])

  const darkMode = useIsDarkMode()

  return (
    <>
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        <HeaderRow>
          <Trans>Account</Trans>
        </HeaderRow>
        <AccountSection>
          <YourAccount>
            <InfoCard>
              <AccountGroupingRow>
                {formatConnectorName()}
                <Button
                  type={'SECONDARY'}
                  size={'SMALL'}
                  center={true}
                  noElevation={true}
                  onClick={() => {
                    openOptions()
                  }}
                  // backgroundColor={darkMode ? '#5a63ff' : '#e6e6e6'}
                  fontColor="white"
                  fontWeight={'700'}
                >
                  <Trans>Change</Trans>
                </Button>
              </AccountGroupingRow>
              <AccountGroupingRow id="web3-account-identifier-row">
                <AccountControl>
                  {ENSName ? (
                    <>
                      <div>
                        {connector && <WrappedStatusIcon connector={connector} />}
                        <p> {ENSName}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        {connector && <WrappedStatusIcon connector={connector} />}
                        <p> {account && shortenAddress(account)}</p>
                      </div>
                    </>
                  )}
                  <DisconnectButton
                    style={{ fontWeight: 700, fontSize: '14px' }}
                    onClick={() => {
                      if (connector === walletlink || connector === injected) {
                        connector.deactivate()
                        deactivate()
                        // metamaskConnectionState.isManuallyDisconnected = true
                        setSessionData('metamaskConnectionState', { isConnected: true })
                        removeSessionData('coinbaseConnectData')
                        removeSessionData('metamaskConnectData')
                        removeSessionData('walletConnectData')
                      } else {
                        setBestWalletConnectorUri('')
                        ;(connector as any).close()
                      }
                    }}
                  >
                    <Trans>Disconnect</Trans>
                  </DisconnectButton>
                </AccountControl>
              </AccountGroupingRow>
              <AccountGroupingRow>
                {ENSName ? (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>
                              <Trans>Copy Address</Trans>
                            </span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={true}
                            href={getExplorerLink(chainId, ENSName, ExplorerDataType.ADDRESS)}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>
                              <Trans>View on Explorer</Trans>
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                ) : (
                  <>
                    <AccountControl>
                      <div>
                        {account && (
                          <Copy toCopy={account}>
                            <span style={{ marginLeft: '4px' }}>
                              <Trans>Copy Address</Trans>
                            </span>
                          </Copy>
                        )}
                        {chainId && account && (
                          <AddressLink
                            hasENS={!!ENSName}
                            isENS={false}
                            href={getExplorerLink(chainId, account, ExplorerDataType.ADDRESS)}
                          >
                            <LinkIcon size={16} />
                            <span style={{ marginLeft: '4px' }}>
                              <Trans>View on Explorer</Trans>
                            </span>
                          </AddressLink>
                        )}
                      </div>
                    </AccountControl>
                  </>
                )}
              </AccountGroupingRow>
            </InfoCard>
          </YourAccount>
        </AccountSection>
      </UpperSection>
      {!!pendingTransactions.length || !!confirmedTransactions.length ? (
        <LowerSection>
          <AutoRow mb={'1rem'} style={{ justifyContent: 'space-between' }}>
            <ThemedText.Body>
              <Trans>Recent Transactions</Trans>
            </ThemedText.Body>
            <Button type={'DESTRUCTIVE'} size={'SMALL'} center={true} onClick={clearAllTransactionsCallback}>
              <Trans>clear all</Trans>
            </Button>
          </AutoRow>
          {renderTransactions(pendingTransactions, darkMode)}
          {renderTransactions(confirmedTransactions, darkMode)}
        </LowerSection>
      ) : (
        <LowerSection>
          <ThemedText.Body color={theme.text1}>
            <Trans>Your transactions will appear here...</Trans>
          </ThemedText.Body>
        </LowerSection>
      )}
    </>
  )
}
