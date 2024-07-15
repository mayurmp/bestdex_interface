import React from 'react'
import styled from 'styled-components/macro'
import { Z_INDEX } from 'theme'

export const BodyWrapper = styled.main<{ margin?: string; maxWidth?: string; boxShadow?: 'lg' }>`
  position: relative;
  margin-top: ${({ margin }) => margin ?? '0px'};
  max-width: ${({ maxWidth }) => maxWidth ?? '480px'};
  width: 100%;
  background: ${({ theme }) => theme.bg7};
  box-shadow: ${({ boxShadow }) =>
    (boxShadow === 'lg' && `0px 8px 24px rgb(12 93 158 / 10%), 0px 6px 24px rgb(39 34 36 / 10%)`) ||
    `0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01)`};
  border-radius: 24px;
  margin-top: 1rem;
  margin-left: auto;
  margin-right: auto;
  z-index: ${Z_INDEX.deprecated_content};
  ${({ theme }) => theme.mediaWidth.upToMedium`
   margin-top: 100px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
     margin-top: 100px;
  `};
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, ...rest }: { children: React.ReactNode }) {
  return <BodyWrapper {...rest}>{children}</BodyWrapper>
}
