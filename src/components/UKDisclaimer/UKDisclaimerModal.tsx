// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { ButtonSecondary } from 'components/Button'
import { CustomColumn } from 'components/Column'
import Modal from 'components/Modal'
import { X } from 'react-feather'
import { useCloseModal, useModalIsOpen } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import styled from 'styled-components/macro'
import { ButtonText, ThemedText } from 'theme/components'
import bannerText from './bannerText'

const Wrapper = styled(CustomColumn)`
  padding: 8px;
`

const ButtonContainer = styled(CustomColumn)`
  padding: 8px 12px 4px;
`

const CloseIconWrapper = styled(ButtonText)`
  display: flex;
  color: ${({ theme }) => theme.text2};
  justify-content: flex-end;
  padding: 8px 0px 4px;

  :focus {
    text-decoration: none;
  }
`

// const StyledThemeButton = styled(ButtonEmphasis)`
//   width: 100%;
//   padding: 30px 10px;
// `

export function UkDisclaimerModal() {
  const isOpen = useModalIsOpen(ApplicationModal.UK_DISCLAIMER)
  const closeModal = useCloseModal()

  return (
    <Modal isOpen={isOpen} onDismiss={closeModal}>
      <Wrapper gap="md">
        <CloseIconWrapper onClick={() => closeModal()}>
          <X size={24} />
        </CloseIconWrapper>
        <CustomColumn gap="sm">
          <ThemedText.HeadlineLarge padding="0px 8px" fontSize="24px" lineHeight="32px">
            <Trans>Disclaimer for UK residents</Trans>
          </ThemedText.HeadlineLarge>
          <ThemedText.BodyPrimary padding="8px 8px 12px" lineHeight="24px">
            {bannerText}
          </ThemedText.BodyPrimary>
        </CustomColumn>
        <ButtonContainer gap="md">
          {/* <StyledThemeButton size={ButtonSize.large} onClick={() => closeModal()} padding={''}>
            <Trans>Dismiss</Trans>
          </StyledThemeButton> */}
          <ButtonSecondary
            onClick={() => closeModal()}
            padding={'16px 10px'}
            style={{ margin: '4px 0 0 0', color: '#000000', fontWeight: 600 }}
          >
            <Trans>Dismiss</Trans>
          </ButtonSecondary>
        </ButtonContainer>
      </Wrapper>
    </Modal>
  )
}
