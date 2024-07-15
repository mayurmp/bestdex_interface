import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { isMobile } from 'utils/userAgent'
import { Trans } from '@lingui/macro'
import LogoDEX from '../../assets/svg/Logo_DEX.svg'

// import TwitterIcon from '../../assets/svg/twitter_grey.svg'
import TwitterIcon from '../../assets/svg/twitter.svg'
import TelegramIcon from '../../assets/svg/telegram_grey.svg'
import DiscordIcon from '../../assets/svg/discord_grey.svg'
import TreeIcon from '../../assets/svg/tree_grey.svg'

// import privacy from '../../assets/document/Best_ DEX_ Privacy_Policy.pdf'

// import privacy from '../../assets/document/Best_ DEX_ Privacy_Policy.pdf'
// import cookiesDocument from '../../assets/document/Best_DEX_Cookies_Policy.pdf'
import { TWITTER_URL, TELEGRAM_URL, DISCORD_URL, LINK_TREE_URL } from 'constants/links'
import { Link } from 'react-router-dom'

const FooterLinks = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  @media screen and (max-width: 600px) {
    flex-direction: column-reverse;
    justify-content: center;
    gap: 16px;
  }
`
const FooterIcon = styled(Box)`
  width: fit-content;
  // width: 170px;
  // @media screen and (max-width: 1000px) {
  //   width: 130px;
  // }
  // @media screen and (max-width: 800px) {
  //   width: 100px;
  // }
  // @media screen and (max-width: 600px) {
  //   width: fit-content;
  // }
`

const HideForMobileTextDark = styled(ThemedText.Black)`
  width: 150px;
  margin-left: 10px;
  font-size: 12px;
  font-weight: 400;
  @media screen and (max-width: 1000px) {
    font-size: 12px;
    width: 100px;
  }
  // @media screen and (max-width: 600px) {
  //   display: none !important;
  // }
`

const FooterInfo = styled(Box)`
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f1f1f1;
  @media screen and (max-width: 600px) {
    padding-bottom: 0px;
    border-bottom: none;
  }
`

const FooterText = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #868686;
  padding: 0px 16px;
`

// const PageLinks = styled.a`
//   font-weight: 600;
//   font-size: 15px;
//   line-height: 22px;
//   color: #0a142f;
//   margin: 0 16px;
//   cursor: pointer;
//   text-decoration: none;
// `
const UndecoratedLink = styled.a`
  text-decoration: none;
  display: flex;
`
const UndecoratedRouterLink = styled(Link)`
  font-weight: 600;
  font-size: 15px;
  line-height: 22px;
  color: #0a142f;
  margin: 0 16px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
`
const ExternalLinks = styled(Box)`
  display: flex;
  gap: 10px;
  align-items: center;
`
const ExternalLinkIcon = styled.img`
  width: 34px;
  cursor: pointer;
`

function Footer() {
  return (
    <footer style={{ margin: isMobile ? '0px 10px' : '0px 120px', width: '90%', maxWidth: '1224px' }}>
      <Box width={'100%'} marginTop={'50px'} marginBottom={isMobile ? '-30px' : '-20px'}></Box>
      <FooterInfoWrapper />
      <FooterLinksWrapper />
    </footer>
  )
}

function FooterInfoWrapper() {
  return (
    <FooterInfo>
      <FooterText>
        <Trans>
          Cryptocurrency may be unregulated in your jurisdiction. The value of cryptocurrencies may go down as well as
          up. Profits may be subject to capital gains or other taxes applicable in your jurisdiction.
        </Trans>
      </FooterText>
    </FooterInfo>
  )
}

function FooterLinksWrapper() {
  return (
    <FooterLinks marginTop={'30px'}>
      <FooterIcon width={'fit-content'} display={'flex'}>
        <img width={'37px'} src={LogoDEX} alt={'DEX Logo'} />
        <HideForMobileTextDark
          marginLeft={'16px'}
          display={'flex'}
          color={'#868686'}
          alignItems={'center'}
          width={'fit-content'}
        >
          © <Trans>2023 Best Web3. All Right Reserved.</Trans>
        </HideForMobileTextDark>
      </FooterIcon>
      <Box display={'flex'} alignItems={'center'}>
        {/* <UndecoratedRouterLink to={'/terms'} target="_blank">
          <Trans>Terms</Trans>
        </UndecoratedRouterLink> */}
        <UndecoratedRouterLink to={'/terms'}>
          <Trans>Terms</Trans>
        </UndecoratedRouterLink>
        <UndecoratedRouterLink to={'/privacy'}>
          <Trans>Privacy</Trans>
        </UndecoratedRouterLink>
        <UndecoratedRouterLink to={'/cookies'}>
          <Trans>Cookies</Trans>
        </UndecoratedRouterLink>
        {/* <PageLinks href={privacy} target="_blank">
          <Trans>Privacy</Trans>
        </PageLinks>
        <PageLinks href={cookiesDocument} target="_blank">
          <Trans>Cookies</Trans>
        </PageLinks> */}
      </Box>
      <ExternalLinks>
        <UndecoratedLink href={TWITTER_URL} target="_blank">
          <ExternalLinkIcon src={TwitterIcon} alt={'Twitter'} />
        </UndecoratedLink>
        <UndecoratedLink href={TELEGRAM_URL} target="_blank">
          <ExternalLinkIcon src={TelegramIcon} alt={'Telegram'} />
        </UndecoratedLink>
        <UndecoratedLink href={DISCORD_URL} target="_blank">
          <ExternalLinkIcon src={DiscordIcon} alt={'Discord'} />
        </UndecoratedLink>
        <UndecoratedLink href={LINK_TREE_URL} target="_blank">
          <ExternalLinkIcon src={TreeIcon} alt={''} />
        </UndecoratedLink>
      </ExternalLinks>
    </FooterLinks>
  )
}
export default Footer
