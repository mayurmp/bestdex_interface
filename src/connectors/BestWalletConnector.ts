import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { IWCEthRpcConnectionOptions } from '@walletconnect/types'
import { EthereumProvider } from 'ehthereum-provider-v2'
import { ALL_SUPPORTED_CHAIN_IDS } from '../constants/chains'
import { setSessionData, removeSessionData } from 'utils/sessionStorage'
import { NETWORK_URLS } from 'connectors'

export const URI_AVAILABLE = 'URI_AVAILABLE'
const __DEV__ = process.env.NODE_ENV === 'development'
const projectId = process.env.REACT_APP_PROJECT_ID ?? 'b9d84930ea1c28fe169a1d4cd3775f92'
export interface WalletConnectConnectorArguments extends IWCEthRpcConnectionOptions {
  supportedChainIds?: number[]
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

function getSupportedChains({ supportedChainIds, rpc }: WalletConnectConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds
  }

  return rpc ? Object.keys(rpc).map((k) => Number(k)) : undefined
}
export class BestWalletConnector extends AbstractConnector {
  private readonly config: WalletConnectConnectorArguments

  public walletConnectProvider?: any
  public bestWalletURL?: string
  public uriResolve?: any
  public uriReject?: any
  public uriPromise?: Promise<string>
  constructor(config: WalletConnectConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) })

    this.config = config
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
    this.getBestWalletUriPromise = this.getBestWalletUriPromise.bind(this)
  }

  private handleChainChanged(chainId: number | string): void {
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    this.emitUpdate({ chainId })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    this.emitUpdate({ account: accounts[0] })
  }

  private handleDisconnect(): void {
    if (__DEV__) {
      console.log("Handling 'disconnect' event")
    }
    this.emitDeactivate()
  }
  public getBestWalletUriPromise(): Promise<string> {
    return (this.uriPromise = new Promise((res, rej) => {
      this.uriResolve = res
      this.uriReject = rej
    }))
  }

  public disconnectWallet(): void {
    if (__DEV__) {
      console.log("Handling 'disconnect' event")
    }
    this.emitDeactivate()
  }
  public async checkActiveConnections(): Promise<boolean> {
    if (!this.walletConnectProvider) {
      // const WalletConnectProvider = await import('@walletconnect/ethereum-provider').then((m) => m?.default ?? m)
      // this.walletConnectProvider = new WalletConnectProvider(this.config)
      try {
        // need to add RPCMAP
        const provider = await EthereumProvider.init({
          projectId: projectId ?? '', // REQUIRED your projectId
          chains: [1], // REQUIRED chain ids
          optionalChains: ALL_SUPPORTED_CHAIN_IDS, // OPTIONAL chains
          showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
          // methods, // REQUIRED ethereum methods
          optionalMethods: [
            'eth_signTypedData',
            'eth_signTypedData_v4',
            'eth_sign',
            'personal_sign',
            'wallet_switchEthereumChain',
          ], // OPTIONAL ethereum methods
          // events, // REQUIRED ethereum events
          // optionalEvents, // OPTIONAL ethereum events
          rpcMap: NETWORK_URLS, // OPTIONAL rpc urls for each chain
          // metadata, // OPTIONAL metadata of your app
          // qrModalOptions // OPTIONAL - `undefined` by default, see https://docs.walletconnect.com/2.0/web3modal/options
        })
        return !!provider.session
      } catch (e) {
        console.log(e)
        return false
      }
    }
    return false
  }
  public async activate(): Promise<ConnectorUpdate> {
    if (!this.walletConnectProvider) {
      // const WalletConnectProvider = await import('@walletconnect/ethereum-provider').then((m) => m?.default ?? m)
      // this.walletConnectProvider = new WalletConnectProvider(this.config)
      try {
        // need to add RPCMAP
        const provider = await EthereumProvider.init({
          projectId: projectId ?? '', // REQUIRED your projectId
          chains: [1], // REQUIRED chain ids
          optionalChains: ALL_SUPPORTED_CHAIN_IDS, // OPTIONAL chains
          showQrModal: false, // REQUIRED set to "true" to use @walletconnect/modal
          // methods, // REQUIRED ethereum methods
          optionalMethods: [
            'eth_signTypedData',
            'eth_signTypedData_v4',
            'eth_sign',
            'personal_sign',
            'wallet_switchEthereumChain',
          ], // OPTIONAL ethereum methods
          // events, // REQUIRED ethereum events
          // optionalEvents, // OPTIONAL ethereum events
          // rpcMap, // OPTIONAL rpc urls for each chain
          // metadata, // OPTIONAL metadata of your app
          // qrModalOptions // OPTIONAL - `undefined` by default, see https://docs.walletconnect.com/2.0/web3modal/options
        })
        provider.on('display_uri', (uri: string) => {
          this.bestWalletURL = uri
          this.uriResolve(uri)
        })
        if (!provider?.session) {
          await provider.connect()
          setSessionData('bestWalletData', { isConnected: true })
          removeSessionData('walletConnectData')
        }
        this.walletConnectProvider = provider
      } catch (e) {
        console.log(e)
      }
    }
    this.walletConnectProvider.on('chainChanged', this.handleChainChanged)
    this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)
    this.walletConnectProvider.on('disconnect', this.handleDisconnect)

    const account = await this.walletConnectProvider
      .enable()
      .then((accounts: string[]): string => accounts[0])
      .catch((error: Error): void => {
        // TODO ideally this would be a better check
        if (error.message === 'User closed modal') {
          throw new UserRejectedRequestError()
        }

        throw error
      })

    return { provider: this.walletConnectProvider, account }
  }

  public async getProvider(): Promise<any> {
    return this.walletConnectProvider
  }

  public async getChainId(): Promise<number | string> {
    return Promise.resolve(this.walletConnectProvider.chainId)
  }

  public async getAccount(): Promise<null | string> {
    return Promise.resolve(this.walletConnectProvider.accounts).then((accounts: string[]): string => accounts[0])
  }

  public deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect)
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider.disconnect()
    }
  }

  public async close() {
    this.emitDeactivate()
  }
}
/**************************************************************/
