import '@reach/dialog/styles.css'
import 'inter-ui'
import 'polyfills'
import 'components/analytics'
// import '@fontsource/barlow/500.css'
// import '@fontsource/barlow/700.css'
// import '@fontsource/barlow-condensed/500.css'
// import '@fontsource/barlow-condensed/700.css'
// import '@fontsource/barlow-semi-condensed/500.css'
// import '@fontsource/barlow-semi-condensed/700.css'

// import '@fontsource/work-sans/500.css'
// import '@fontsource/work-sans/700.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'

import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import './index.css'
import Blocklist from './components/Blocklist'
import { NetworkContextName } from './constants/misc'
import { LanguageProvider } from './i18n'
import App from './pages/App'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import store from './state'
import ApplicationUpdater from './state/application/updater'
import ListsUpdater from './state/lists/updater'
import LogsUpdater from './state/logs/updater'
import MulticallUpdater from './state/multicall/updater'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import ThemeProvider, { ThemedGlobalStyle } from './theme'
import RadialGradientByChainUpdater from './theme/RadialGradientByChainUpdater'
import getLibrary from './utils/getLibrary'
import { ToastContainer } from 'react-toastify'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
const apiKey: string = process.env.REACT_APP_BUGSNAG_API_KEY ?? ''

Bugsnag.start({
  apiKey,
  plugins: [new BugsnagPluginReact()],
  releaseStage: 'development',
})
const bugsnagPlugin = Bugsnag.getPlugin('react')

const ErrorBoundary = bugsnagPlugin?.createErrorBoundary(React) ?? React.Fragment

const ErrorView = () => (
  <div>
    <p>Something went wrong please try again.</p>
  </div>
)

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      <RadialGradientByChainUpdater />
      <ListsUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
      <LogsUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <LanguageProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
              <Blocklist>
                <Updaters />
                <ThemeProvider>
                  <ThemedGlobalStyle />
                  <ToastContainer />
                  <ErrorBoundary FallbackComponent={ErrorView}>
                    <App />
                  </ErrorBoundary>
                </ThemeProvider>
              </Blocklist>
            </Web3ProviderNetwork>
          </Web3ReactProvider>
        </LanguageProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
)

// if (process.env.REACT_APP_SERVICE_WORKER !== 'false') {
//   serviceWorkerRegistration.register()
// }
