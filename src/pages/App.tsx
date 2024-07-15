import Loader from 'components/Loader'
import ApeModeQueryParamReader from 'hooks/useApeModeQueryParamReader'
import { Suspense, lazy, useEffect, useState } from 'react' // lazy
import { Redirect, Route, Switch, useLocation } from 'react-router-dom' // Redirect

import GlobalLoader from 'components/GlobalLoader'
import { UK_BANNER_HEIGHT, UK_BANNER_HEIGHT_MD, UK_BANNER_HEIGHT_SM, UkBanner } from 'components/UKDisclaimer'
import { UkDisclaimerModal } from 'components/UKDisclaimer/UKDisclaimerModal'
import useContentPage from 'hooks/useContentPage'
import { AppState } from 'state'
import { useAppSelector } from 'state/hooks'
import styled from 'styled-components/macro'
import ErrorBoundary from '../components/ErrorBoundary'
import Header from '../components/Header'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import { useModalOpen, useToggleModal } from '../state/application/hooks'
import { ApplicationModal } from '../state/application/reducer'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import AddLiquidity from './AddLiquidity'
import { RedirectDuplicateTokenIds } from './AddLiquidity/redirects'
import { RedirectDuplicateTokenIdsV2 } from './AddLiquidityV2/redirects'
import Earn from './Earn'
import Manage from './Earn/Manage'
import MigrateV2 from './MigrateV2'
import MigrateV2Pair from './MigrateV2/MigrateV2Pair'
import Pool from './Pool'
import { PositionPage } from './Pool/PositionPage'
import PoolV2 from './Pool/v2'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'
import RemoveLiquidityV3 from './RemoveLiquidity/V3'
import Swap from './Swap'
import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'
import SubHeader from 'components/SubHeader'
import Buy from './Buy'
// import Sell from './Sell'

const Vote = lazy(() => import('./Vote'))

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 16px 0px 16px;
  align-items: center;
  flex: 1;
  z-index: 1;
  @media screen and (max-width: 960px) {
    padding: 20px 16px 0px 16px;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0rem 16px 16px 16px;
  `};
`

const HeaderWrapper = styled.div<{ bannerIsVisible: boolean; scrollY: number }>`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  position: fixed;
  z-index: 3;
  top: ${({ bannerIsVisible, scrollY }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT - scrollY, 0) : 0)}px;

  @media only screen and (max-width: 768px) {
    top: ${({ bannerIsVisible, scrollY }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_MD - scrollY, 0) : 0)}px;
  }

  @media only screen and (max-width: 640px) {
    top: ${({ bannerIsVisible, scrollY }) => (bannerIsVisible ? Math.max(UK_BANNER_HEIGHT_SM - scrollY, 0) : 0)}px;
  }
`

const Marginer = styled.div`
  margin-top: 5rem;
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
  return (
    <>
      <AddressClaimModal isOpen={open} onDismiss={toggle} />
      <UkDisclaimerModal />
    </>
  )
}

export default function App() {
  const location = useLocation()
  // const [isActiveHeader, setActiveHeader] = useState(true)
  const isContentPage = useContentPage()
  const IS_SWAP_ALLOWED = process.env.REACT_APP_SWAP_FEATURE_ALLOWED ?? ''
  const originCountry = useAppSelector((state: AppState) => state.user.originCountry)
  const { pathname } = location

  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    window.scrollTo(0, 0)
    setScrollY(0)
  }, [pathname])

  useEffect(() => {
    const scrollListener = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', scrollListener)
    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  const renderUkBannner = Boolean(originCountry) && originCountry === 'GB'

  useEffect(() => {
    const { ethereum } = window
    if (
      (window as any)?.ethereum &&
      (window as any)?.ethereum?.providers?.length > 1 &&
      (ethereum as any)?.selectedProvider?.isCoinbaseWallet
    ) {
      if (typeof ethereum === 'object') {
        ;(ethereum as any)?.selectedProvider?.close()
      }
    }
  }, [])

  // useEffect(() => {
  //   if (location?.pathname === '/terms' || location?.pathname === '/privacy' || location?.pathname === '/cookies') {
  //     setActiveHeader(false)
  //   } else {
  //     setActiveHeader(true)
  //   }
  // }, [location?.pathname])

  return (
    <ErrorBoundary>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <Route component={ApeModeQueryParamReader} />
      {renderUkBannner && <UkBanner />}

      <Web3ReactManager>
        <AppWrapper>
          {/* <HeaderWrapper>{isActiveHeader ? <Header /> : ''}</HeaderWrapper> */}
          <GlobalLoader></GlobalLoader>
          <HeaderWrapper bannerIsVisible={renderUkBannner} scrollY={scrollY}>
            <Header />
          </HeaderWrapper>
          <BodyWrapper style={isContentPage ? { padding: '0px' } : {}}>
            <SubHeader />
            <Popups />
            <Polling />
            <TopLevelModals />
            <Suspense fallback={<Loader />}>
              {IS_SWAP_ALLOWED === 'true' ? (
                <Switch>
                  {/* Route for home page */}
                  {/********************Temp. commenting the other routes*************************/}
                  <Route strict path="/vote" component={Vote} />
                  <Route exact strict path="/create-proposal">
                    <Redirect to="/vote/create-proposal" />
                  </Route>
                  <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
                  <Route exact strict path="/uni" component={Earn} />
                  <Route exact strict path="/uni/:currencyIdA/:currencyIdB" component={Manage} />

                  <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                  <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                  <Route exact strict path="/swap" component={Swap} />

                  <Route exact strict path="/pool/v2/find" component={PoolFinder} />
                  <Route exact strict path="/pool/v2" component={PoolV2} />
                  <Route exact strict path="/pool" component={Pool} />
                  <Route exact strict path="/pool/:tokenId" component={PositionPage} />
                  <Route
                    exact
                    strict
                    path="/add/v2/:currencyIdA?/:currencyIdB?"
                    component={RedirectDuplicateTokenIdsV2}
                  />
                  <Route
                    exact
                    strict
                    path="/add/:currencyIdA?/:currencyIdB?/:feeAmount?"
                    component={RedirectDuplicateTokenIds}
                  />

                  <Route
                    exact
                    strict
                    path="/increase/:currencyIdA?/:currencyIdB?/:feeAmount?/:tokenId?"
                    component={AddLiquidity}
                  />

                  <Route exact strict path="/remove/v2/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                  <Route exact strict path="/remove/:tokenId" component={RemoveLiquidityV3} />

                  <Route exact strict path="/migrate/v2" component={MigrateV2} />
                  <Route exact strict path="/migrate/v2/:address" component={MigrateV2Pair} />
                  <Route exact strict path="/buy" component={Buy} />
                  {/* <Route exact strict path="/sell" component={Sell} /> */}

                  {/********************Temp. commenting the other routes end*************************/}
                  {/* 
                  <Route exact strict path="/terms" component={Terms}></Route>
                  <Route exact strict path="/privacy" component={Policy}></Route>
                  <Route exact strict path="/cookies" component={Cookies}></Route> */}
                  <Route path="*" component={RedirectPathToSwapOnly} />
                </Switch>
              ) : (
                <Switch></Switch>
              )}
            </Suspense>
            <Marginer />
          </BodyWrapper>
        </AppWrapper>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
