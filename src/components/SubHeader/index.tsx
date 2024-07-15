import useContentPage from 'hooks/useContentPage'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'
import { Trans } from '@lingui/macro'
import styled from 'styled-components/macro'
import Row from '../Row'
import { NavLink } from 'react-router-dom'
import useScrollPosition from '@react-hook/window-scroll'

const Headertab = styled.div<{ showBackground: boolean; isHome: boolean }>`
  display: flex;
  justify-content: center;
  width: 100%;
  // height: 83px;
  padding-top: 100px;
  top: 0;
  position: relative;
  z-index: 2;
  /* Background slide effect on scroll. */
  background-image: ${({ theme, isHome }) =>
    `linear-gradient(to bottom, transparent 50%, ${isHome ? '#5a63ff96' : theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 1px 0px 0px
    ${({ theme, showBackground, isHome }) => (showBackground ? (isHome ? '#5a63ff96' : theme.bg2) : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;
  background-blend-mode: hard-light;
  @media screen and (max-width: 767px) {
    height: 0px;
  }
`

const HeaderLinks = styled(Row)`
  justify-self: center;
  background-color: ${({ theme }) => theme.bg0};
  width: fit-content;
  padding: 4px;
  border-radius: 16px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 10px;
  overflow: auto;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    justify-self: start;  
    `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    // flex-direction: row;
    // justify-content: space-between;
    // justify-self: center;
    // z-index: 99;
    // position: fixed;
    // bottom: 0; right: 44%;
    // transform: translate(30%,-50%);
    // margin: 0 auto;
    // background-color: ${({ theme }) => theme.bg0};
    // border: 1px solid ${({ theme }) => theme.bg2};
    // box-shadow: 0px 6px 10px rgb(0 0 0 / 2%);
    justify-self: center;
    height: fit-content;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    // bottom: 0; right: 28%;
    // transform: translate(20%,-50%);
    justify-self: center;
    height: fit-content;
  `};
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text8};
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  overflow: hidden;
  white-space: nowrap;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    justify-content: center;
    color: white;
    background-color: ${({ theme }) => theme.bydefault};
    &:hover {
      background-color: ${({ theme }) => theme.hover};
    }
    &:active {
      background-color: ${({ theme }) => theme.bydefault};
      box-shadow: 0px 0px 0px 4px rgba(90, 99, 255, 0.2), 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    }
  }
`
const HeaderLinksForSm = styled(HeaderLinks)`
  visibility: hidden;
`

export default function SubHeader() {
  const isContentPage = useContentPage()
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)
  const scrollY = useScrollPosition()
  return (
    <Headertab isHome={isContentPage} showBackground={isContentPage || scrollY > 45}>
      {!isContentPage && clientType !== CLIENT_BEST_WALLET ? (
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
            <Trans>Swap</Trans>
          </StyledNavLink>
          <StyledNavLink id={`buy-nav-link`} to={'/buy'}>
            <Trans>Buy</Trans>
          </StyledNavLink>
          {/* temperary hiding sell flow*/}
          {/* <StyledNavLink id={`sell-nav-link`} to={'/sell'}>
            <Trans>Sell</Trans>
          </StyledNavLink> */}
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
    </Headertab>
  )
}
