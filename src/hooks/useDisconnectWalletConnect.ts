import { useActiveWeb3React } from './web3'
import { useWeb3React } from '@web3-react/core'
import { bestWalletConnector } from 'connectors'

const useDisconnectWalletconnect = () => {
  const { library } = useActiveWeb3React()
  const { active } = useWeb3React()
  const disconnectWallet = () => {
    if ((library?.provider as any)?.isWalletConnect) {
      if (active && (library?.provider as any)?.disconnect) {
        bestWalletConnector?.disconnectWallet()
        // ;(library?.provider as any)?.disconnectWallet()
      }
    }
  }
  return disconnectWallet
}

export default useDisconnectWalletconnect
