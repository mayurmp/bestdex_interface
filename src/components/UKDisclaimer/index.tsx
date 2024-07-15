// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { useOpenModal } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components/macro'
import { ButtonText, ThemedText } from 'theme/components'
import bannerText from './bannerText'

export const UK_BANNER_HEIGHT = 65
export const UK_BANNER_HEIGHT_MD = 113
export const UK_BANNER_HEIGHT_SM = 137

const BannerWrapper = styled.div`
  position: relative;
  display: flex;
  background-color: rgb(255, 255, 255);
  padding: 20px;
  border-bottom: 1px solid rgba(34, 34, 34, 0.07);
  z-index: 2;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  gap: 5px;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const BannerTextWrapper = styled(ThemedText.BodySecondary)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(125, 125, 125);
  @media only screen and (max-width: 768px) {
    @supports (-webkit-line-clamp: 2) {
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  @media only screen and (max-width: 640px) {
    @supports (-webkit-line-clamp: 3) {
      white-space: initial;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
`

const ReadMoreWrapper = styled(ButtonText)`
  flex-shrink: 0;
  width: max-content;

  :focus {
    text-decoration: none;
  }
`

export function UkBanner() {
  const openDisclaimer = useOpenModal(ApplicationModal.UK_DISCLAIMER)

  return (
    <BannerWrapper>
      <BannerTextWrapper lineHeight="24px">{t`UK disclaimer:` + ' ' + bannerText}</BannerTextWrapper>
      <ReadMoreWrapper>
        <ThemedText.BodySecondary lineHeight="24px" color="primary1" onClick={openDisclaimer}>
          <Trans>Read more</Trans>
        </ThemedText.BodySecondary>
      </ReadMoreWrapper>
    </BannerWrapper>
  )
}
