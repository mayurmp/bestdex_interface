import { CurrencyAmount, Percent, Token } from '@tech-alchemy/best-dex/sdk-core'
import { Pair } from '@tech-alchemy/best-dex/v2-sdk'
import { Trans } from '@lingui/macro'
import JSBI from 'jsbi'
// import { transparentize } from 'polished'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components/macro'

import { BIG_INT_ZERO } from '../../constants/misc'
import { useColor } from '../../hooks/useColor'
import { useTotalSupply } from '../../hooks/useTotalSupply'
import { useActiveWeb3React } from '../../hooks/web3'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/unwrappedToken'
import { ButtonEmpty, ButtonPrimary, ButtonSecondary } from '../Button'
import { LightCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
// import { CardNoise } from '../earn/styled'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'
// import { darken } from 'polished'
import { FixedHeightRow } from '.'
import { MouseoverTooltip } from 'components/Tooltip'

const StyledPositionCard = styled(LightCard)<{ bgColor: any }>`
  border: none;
  position: relative;
  overflow: hidden;
`
const WarningButton = styled(ButtonSecondary)`
  background-color: ${({ theme }) => theme.red1};
  color: ${({ theme }) => theme.white};
  border: none;
  :hover,
  :focus,
  :active {
    background-color: ${({ theme }) => theme.redHover};
  }
`
const ResponsiveFixedHeightRow = styled(FixedHeightRow)`
  @media screen and (max-width: 450px) {
    flex-direction: column;
    height: 50px;
  }
`
const TextWithEllipsis = styled(Text)`
  @media screen and (max-width: 600px) {
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

interface PositionCardProps {
  pair: Pair
  showUnwrapped?: boolean
  border?: string
  stakedBalance?: CurrencyAmount<Token> // optional balance to indicate that liquidity is deposited in mining pool
}

export default function V2PositionCard({ pair, border, stakedBalance }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)
  const [showMore, setShowMore] = useState(false)

  const userDefaultPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // if staked balance balance provided, add to standard liquidity amount
  const userPoolBalance = stakedBalance ? userDefaultPoolBalance?.add(stakedBalance) : userDefaultPoolBalance

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const backgroundColor = useColor(pair?.token0)

  return (
    <StyledPositionCard border={border} bgColor={backgroundColor}>
      {/* <CardNoise /> */}
      <AutoColumn gap="12px">
        <FixedHeightRow>
          <AutoRow gap="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            {!currency0 || !currency1 ? (
              <TextWithEllipsis fontWeight={500} fontSize={20}>
                <Dots>
                  <Trans>Loading</Trans>
                </Dots>
              </TextWithEllipsis>
            ) : (
              <MouseoverTooltip text={`${currency0.symbol}/${currency1.symbol}`}>
                <TextWithEllipsis fontWeight={500} fontSize={20}>
                  {`${currency0.symbol}/${currency1.symbol}`}
                </TextWithEllipsis>
              </MouseoverTooltip>
            )}
          </AutoRow>
          <RowFixed gap="8px">
            <ButtonEmpty
              padding="6px 8px"
              $borderRadius="12px"
              width="fit-content"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? (
                <>
                  <Trans>Manage</Trans>
                  <ChevronUp size="20" style={{ marginLeft: '10px' }} />
                </>
              ) : (
                <>
                  <Trans>Manage</Trans>
                  <ChevronDown size="20" style={{ marginLeft: '10px' }} />
                </>
              )}
            </ButtonEmpty>
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <ResponsiveFixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                <Trans>Your total pool tokens:</Trans>
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </ResponsiveFixedHeightRow>
            {stakedBalance && (
              <ResponsiveFixedHeightRow>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Pool tokens in rewards pool:</Trans>
                </Text>
                <Text fontSize={16} fontWeight={500}>
                  {stakedBalance.toSignificant(4)}
                </Text>
              </ResponsiveFixedHeightRow>
            )}
            <ResponsiveFixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Pooled {currency0.symbol}:</Trans>
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </ResponsiveFixedHeightRow>

            <ResponsiveFixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  <Trans>Pooled {currency1.symbol}:</Trans>
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} marginLeft={'6px'}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </ResponsiveFixedHeightRow>

            <ResponsiveFixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                <Trans>Your pool share:</Trans>
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'}
              </Text>
            </ResponsiveFixedHeightRow>

            {userDefaultPoolBalance && JSBI.greaterThan(userDefaultPoolBalance.quotient, BIG_INT_ZERO) && (
              <RowBetween marginTop="10px">
                <ButtonPrimary
                  padding="8px"
                  $borderRadius="18px"
                  as={Link}
                  to={`/migrate/v2/${pair.liquidityToken.address}`}
                  width="64%"
                >
                  <Trans>Migrate</Trans>
                </ButtonPrimary>
                <WarningButton
                  padding="8px"
                  $borderRadius="18px"
                  as={Link}
                  width="32%"
                  to={`/remove/v2/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  <Trans>Remove</Trans>
                </WarningButton>
              </RowBetween>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StyledPositionCard>
  )
}
