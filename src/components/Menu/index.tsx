// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { PrivacyPolicyModal } from 'components/PrivacyPolicy'
import { SupportedLocale, LocaleFlags, SUPPORTED_LOCALES } from 'constants/locales' // LOCALE_LABEL
import { useActiveLocale } from 'hooks/useActiveLocale'
import { useLocationLinkProps } from 'hooks/useLocationLinkProps'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Globe } from 'react-feather' // Check ChevronDown
import { Link } from 'react-router-dom'
// import { useDarkModeManager } from 'state/user/hooks'
import styled, { css } from 'styled-components/macro'

import { ReactComponent as MenuIcon } from '../../assets/svg/Language.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ExternalLink, ThemedText } from '../../theme'
import { isMobile } from 'utils/userAgent'
import useContentPage from 'hooks/useContentPage'
import { useLocation } from 'react-router-dom'
import { CLIENT, CLIENT_BEST_WALLET } from 'constants/params'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 38px;
  display: flex;
  gap: 5px;
  justify-content: center;
  color: ${({ theme }) => theme.text5};
  align-items: center;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  @media screen and (max-width: 600px) {
    padding: 0px;
  }
  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }

  svg {
  }
`
const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 165px;
  max-height: 350px;
  overflow: auto;
  background-color: ${({ theme }) => theme.bg7};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  // border: 1px solid ${({ theme }) => theme.bg0};
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  position: absolute;
  overscroll-behavior: contain;
  top: 3rem;
  z-index: 100;
  padding: 0rem;
  }

  ${({ flyoutAlignment = FlyoutAlignment.RIGHT }) =>
    flyoutAlignment === FlyoutAlignment.RIGHT
      ? css`
          right: 0rem;
        `
      : css`
          left: 0rem;
        `};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    bottom: unset;
    right: 0;
    left: unset;
  `};
`

const MenuItem = styled(ExternalLink)`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const InternalMenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`

const InternalLinkMenuItem = styled(InternalMenuItem)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0rem;
  justify-content: start;
  gap: 5px;
  text-decoration: none;
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`

const ToggleMenuItem = styled.button`
  background-color: transparent;
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0.5rem;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
`
const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
`
const FlagContainer = styled.img`
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  min-width: 24px;
  width: 24px;
  height: 24px;
  object-fit: cover;
`
const FlyoutMenuContainer = styled(FlagContainer)`
  border-radius: 50%;
  border: 1px solid #aaaaaa;
  overflow: hidden;
  margin: 0 7px;
  width: 20px;
  height: 20px;
  min-width: 24px;
  object-fit: cover;
`
const ResponsiveTextTheme = styled(ThemedText.White)<{ isContentPage: boolean }>`
  color: ${({ theme, isContentPage }) => (isContentPage ? theme.white : theme.black)} !important;
`
function LanguageMenuItem({
  locale,
  active,
  key,
  onClosing,
}: {
  locale: SupportedLocale
  active: boolean
  key: string
  onClosing: () => void
}) {
  const { to, onClick } = useLocationLinkProps(locale)

  const onhandleChange = () => {
    if (onClick) {
      onClick()
    }
    onClosing()
  }

  if (!to) return null

  return (
    <InternalLinkMenuItem onClick={onhandleChange} key={key} to={to}>
      <FlyoutMenuContainer src={LocaleFlags[locale].image ?? ''} alt={locale}></FlyoutMenuContainer>
      <ThemedText.Black marginRight={'25px'} fontSize={'16px'} fontWeight={'600'}>
        {LocaleFlags[locale].label ?? ''}
      </ThemedText.Black>
      {/* <div>{LOCALE_LABEL[locale]}</div> */}
      {/* {active && <Check opacity={0.6} size={16} />} */}
    </InternalLinkMenuItem>
  )
}

function LanguageMenu({ close }: { close: () => void }) {
  const activeLocale = useActiveLocale()
  return (
    <MenuFlyout>
      {/* <ToggleMenuItem onClick={close}>
        <ChevronLeft size={16} />
      </ToggleMenuItem> */}
      {SUPPORTED_LOCALES.map((locale) => (
        <LanguageMenuItem locale={locale} active={activeLocale === locale} key={locale} onClosing={close} />
      ))}
      {/* <LanguageMenuItem locale={'en-US'} active={activeLocale === 'en-US'} key={'en-US'} /> */}
    </MenuFlyout>
  )
}
interface MenuProps {
  langShortHand?: boolean
}
export default function Menu({ langShortHand = false }: MenuProps) {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const searchParams = new URLSearchParams(useLocation().search)
  const clientType = searchParams.get(CLIENT)
  const toggleMenu = useToggleModal(ApplicationModal.MENU)
  const activeLocale = useActiveLocale()
  const isContentPage = useContentPage()
  // const location = useLocation()
  // const isContentPage =
  //   location.pathname === '/home' || location.pathname === '/airdrop' || location.pathname === '/partner'
  useOnClickOutside(node, open ? toggleMenu : undefined)
  // reference for future dark theme support
  // const [darkMode, toggleDarkMode] = useDarkModeManager()

  const [menu, setMenu] = useState<'main' | 'lang'>('lang')

  useEffect(() => {
    setMenu('lang')
  }, [open])

  return (
    <>
      {/* // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451 */}
      <StyledMenu ref={node as any}>
        <StyledMenuButton
          onClick={() => {
            toggleMenu()
          }}
          aria-label={t`Menu`}
        >
          {menu === 'lang' ? (
            clientType !== CLIENT_BEST_WALLET && (
              <LanguageContainer>
                <FlagContainer src={LocaleFlags[activeLocale]?.image ?? ''} alt={activeLocale}></FlagContainer>
                {!langShortHand && (
                  <ResponsiveTextTheme isContentPage={isContentPage} fontSize={'14px'}>
                    {' '}
                    {/* marginRight={'25px'} */}
                    {isMobile ? LocaleFlags[activeLocale]?.label ?? '' : ''}
                  </ResponsiveTextTheme>
                )}
                <ChevronDown fontSize={'14px'}></ChevronDown>
              </LanguageContainer>
            )
          ) : (
            <>
              <StyledMenuIcon /> {' ' + activeLocale.slice(3)}
            </>
          )}
        </StyledMenuButton>

        {open &&
          (() => {
            switch (menu) {
              case 'lang':
                return <LanguageMenu close={() => setMenu('main')} />
              case 'main':
                toggleMenu()
                return null
              default:
                return (
                  <MenuFlyout>
                    {/* <MenuItem href="https://uniswap.org/">
                      <div>
                        <Trans>About</Trans>
                      </div>
                      <Info opacity={0.6} size={16} />
                    </MenuItem>
                    <MenuItem href="https://help.uniswap.org/">
                      <div>
                        <Trans>Help Center</Trans>
                      </div>
                      <HelpCircle opacity={0.6} size={16} />
                    </MenuItem>
                    <MenuItem href="https://uniswap.canny.io/feature-requests">
                      <div>
                        <Trans>Request Features</Trans>
                      </div>
                      <Coffee opacity={0.6} size={16} />
                    </MenuItem>
                    <MenuItem href="https://discord.gg/FCfyBSbCU5">
                      <div>
                        <Trans>Discord</Trans>
                      </div>
                      <MessageCircle opacity={0.6} size={16} />
                    </MenuItem> */}
                    <ToggleMenuItem onClick={() => setMenu('lang')}>
                      <div>
                        <Trans>Language</Trans>
                      </div>
                      <Globe opacity={0.6} size={16} />
                    </ToggleMenuItem>
                    {/* <ToggleMenuItem onClick={() => toggleDarkMode()}>
                      <div>{darkMode ? <Trans>Light Theme</Trans> : <Trans>Dark Theme</Trans>}</div>
                      {darkMode ? <Moon opacity={0.6} size={16} /> : <Sun opacity={0.6} size={16} />}
                    </ToggleMenuItem>
                    <MenuItem href="https://docs.uniswap.org/">
                      <div>
                        <Trans>Docs</Trans>
                      </div>
                      <BookOpen opacity={0.6} size={16} />
                    </MenuItem>
                    <ToggleMenuItem onClick={() => togglePrivacyPolicy()}>
                      <div>
                        <Trans>Legal & Privacy</Trans>
                      </div>
                      <FileText opacity={0.6} size={16} />
                    </ToggleMenuItem>
                    {showUNIClaimOption && (
                      <UNIbutton
                        onClick={openClaimModal}
                        padding="8px 16px"
                        width="100%"
                        $borderRadius="12px"
                        mt="0.5rem"
                      >
                        <Trans>Claim UNI</Trans>
                      </UNIbutton>
                    )} */}
                  </MenuFlyout>
                )
            }
          })()}
      </StyledMenu>
      <PrivacyPolicyModal />
    </>
  )
}

interface NewMenuProps {
  flyoutAlignment?: FlyoutAlignment
  ToggleUI?: React.FunctionComponent
  menuItems: {
    content: any
    link: string
    external: boolean
  }[]
}

const NewMenuFlyout = styled(MenuFlyout)`
  top: 3rem !important;
`
const NewMenuItem = styled(InternalMenuItem)`
  width: max-content;
  text-decoration: none;
`

const ExternalMenuItem = styled(MenuItem)`
  width: max-content;
  text-decoration: none;
`

export const NewMenu = ({ flyoutAlignment = FlyoutAlignment.RIGHT, ToggleUI, menuItems, ...rest }: NewMenuProps) => {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  const toggle = useToggleModal(ApplicationModal.POOL_OVERVIEW_OPTIONS)
  useOnClickOutside(node, open ? toggle : undefined)
  const ToggleElement = ToggleUI || StyledMenuIcon
  return (
    <StyledMenu ref={node as any} {...rest}>
      <ToggleElement onClick={toggle} />
      {open && (
        <NewMenuFlyout flyoutAlignment={flyoutAlignment}>
          {menuItems.map(({ content, link, external }, i) =>
            external ? (
              <ExternalMenuItem href={link} key={i}>
                {content}
              </ExternalMenuItem>
            ) : (
              <NewMenuItem to={link} key={i}>
                {content}
              </NewMenuItem>
            )
          )}
        </NewMenuFlyout>
      )}
    </StyledMenu>
  )
}
