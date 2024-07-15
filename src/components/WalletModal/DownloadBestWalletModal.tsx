import { Trans } from '@lingui/macro'
import { FC } from 'react'
import { Box } from 'rebass'

import { ThemedText } from 'theme'
import BestWalletLogoBordered from '../../assets/svg/best_wallet_with_border.svg'
import styled from 'styled-components/macro'
import { PrimaryBlueButton } from 'components/Button'

const ModalContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${({ theme }) => theme.bg7};
`
const DownloadButton = styled(PrimaryBlueButton)`
  padding: 12px 24px;
`
const UndecoratedLink = styled.a`
  text-decoration: none;
`
const DownloadBestWalletModal: FC = () => {
  return (
    <ModalContent padding={'12px'}>
      <img src={BestWalletLogoBordered} alt={'Best wallet logo'}></img>
      <Box display={'flex'} alignItems={'center'} padding={'12px 12px 12px 0px'}>
        <Box display={'flex'} flexDirection={'column'} padding={'0px 12px 0px 0px'}>
          <ThemedText.Black fontSize={'15px'}>
            <Trans>{'Don’t have a Best Wallet?'}</Trans>
          </ThemedText.Black>
          <ThemedText.Black fontSize={'12px'}>
            <Trans>{'Download Best Wallet now from App store for security and privacy of your assets.'}</Trans>
          </ThemedText.Black>
        </Box>
        <Box width={'300px'} height={'48px'}>
          <UndecoratedLink href="https://bestwallet.com" target="_blank">
            <DownloadButton>
              <ThemedText.White fontSize={'15px'} fontWeight={700}>
                <Trans>Download</Trans>
              </ThemedText.White>
            </DownloadButton>
          </UndecoratedLink>
        </Box>
      </Box>
    </ModalContent>
  )
}

export default DownloadBestWalletModal
