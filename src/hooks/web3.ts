import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

import { gnosisSafe, injected, metamaskConnectionState } from '../connectors'
import { IS_IN_IFRAME, NetworkContextName } from '../constants/misc'
import { isMobile } from '../utils/userAgent'
import { bestWalletConnector, walletconnect } from '../connectors'
import { getSessionData, removeSessionData } from 'utils/sessionStorage'

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  // gnosisSafe.isSafeApp() races a timeout against postMessage, so it delays pageload if we are not in a safe app;
  // if we are not embedded in an iframe, it is not worth checking
  const [triedSafe, setTriedSafe] = useState(!IS_IN_IFRAME)

  // first, try connecting to a gnosis safe
  useEffect(() => {
    if (!triedSafe) {
      gnosisSafe.isSafeApp().then((loadedInSafe) => {
        if (loadedInSafe) {
          activate(gnosisSafe, undefined, true).catch(() => {
            setTriedSafe(true)
          })
        } else {
          setTriedSafe(true)
        }
      })
    }
  }, [activate, setTriedSafe, triedSafe])

  // then, if that fails, try connecting to an injected connector
  useEffect(() => {
    if (!active && triedSafe) {
      injected.isAuthorized().then((isAuthorized) => {
        const { ethereum } = window
        if (getSessionData('metamaskConnectData')?.isConnected && !metamaskConnectionState.isManuallyDisconnected) {
          const provider = (ethereum as any).providers.find(({ isMetaMask }: any) => isMetaMask)
          ;(ethereum as any).setSelectedProvider(provider)
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        }

        if (getSessionData('coinbaseConnectData')?.isConnected && !metamaskConnectionState.isManuallyDisconnected) {
          const provider = (ethereum as any).providers.find(({ isCoinbaseWallet }: any) => isCoinbaseWallet)
          ;(ethereum as any).setSelectedProvider(provider)
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        }

        if (isAuthorized && !getSessionData('metamaskConnectionState')?.isConnected) {
          activate(injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          if (isMobile && window.ethereum) {
            activate(injected, undefined, true).catch(() => {
              setTried(true)
            })
            return
          }
          walletconnect.checkActiveConnections().then((sessionAvailable) => {
            if (sessionAvailable && getSessionData('walletConnectData')?.isConnected) {
              activate(walletconnect, undefined, true)
                .then(() => {
                  console.log('connected')
                })
                .catch((e) => {
                  console.log(e)
                  setTried(true)
                })
            } else {
              setTried(true)
            }
          })
          bestWalletConnector.checkActiveConnections().then((sessionAvailable) => {
            if (sessionAvailable && getSessionData('bestWalletData')?.isConnected) {
              activate(bestWalletConnector, undefined, true)
                .then(() => {
                  console.log('connected')
                })
                .catch((e) => {
                  console.log(e)
                  setTried(true)
                })
            } else {
              setTried(true)
            }
          })
        }
      })
    }
  }, [activate, active, triedSafe])

  // wait until we get confirmation of a connection to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
      removeSessionData('metamaskConnectionState')
    }
  }, [active])

  return tried
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}
