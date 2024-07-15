import { Currency, CurrencyAmount, Price } from '@tech-alchemy/best-dex/sdk-core'
import { Position } from '@tech-alchemy/best-dex/v3-sdk'
import { AutoColumn } from 'components/Column'
import { PositionPreview } from 'components/PositionPreview'
import styled from 'styled-components/macro'

import { Bound, Field } from '../../state/mint/v3/actions'
import { Trans } from '@lingui/macro'

const Wrapper = styled.div`
  padding-top: 12px;
`

export function Review({
  position,
  outOfRange,
  ticksAtLimit,
}: {
  position?: Position
  existingPosition?: Position
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  priceLower?: Price<Currency, Currency>
  priceUpper?: Price<Currency, Currency>
  outOfRange: boolean
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }
}) {
  return (
    <Wrapper>
      <AutoColumn gap="lg">
        {position ? (
          <PositionPreview
            position={position}
            inRange={!outOfRange}
            ticksAtLimit={ticksAtLimit}
            title={<Trans>Selected Range</Trans>}
          />
        ) : null}
      </AutoColumn>
    </Wrapper>
  )
}
