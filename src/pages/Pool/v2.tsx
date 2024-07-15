import { Trans } from '@lingui/macro'
import { Pair } from '@tech-alchemy/best-dex/v2-sdk'
import Button from 'components/@common/button'
import { L2_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import { BinanceTokenInfo, MaticTokenInfo } from 'constants/tokens'
import JSBI from 'jsbi'
import { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components/macro'

import Card, { GreyCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { CardSection } from '../../components/earn/styled'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import FullPositionCard from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Row'
import { Dots } from '../../components/swap/styleds'
import { SwitchLocaleLink } from '../../components/SwitchLocaleLink'
import { BIG_INT_ZERO } from '../../constants/misc'
import { useV2Pairs } from '../../hooks/useV2Pairs'
import { useActiveWeb3React } from '../../hooks/web3'
import { useStakingInfo } from '../../state/stake/hooks'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { HideSmall, ThemedText } from '../../theme'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Layer2Prompt = styled(EmptyProposals)`
  margin-top: 16px;
`

const ButtonLink = styled(Link)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
width: 90%;
`};
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account, chainId } = useActiveWeb3React()
  // fetch the user's balances of all tracked V2 LP tokens
  const tokenName = () => {
    let nativeToken
    if (chainId === SupportedChainId.POLYGON_MUMBAI || chainId === SupportedChainId.POLYGON) {
      nativeToken = MaticTokenInfo.symbol
    } else if (chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.BINANCE_TESTNET) {
      nativeToken = BinanceTokenInfo.symbol
    } else {
      nativeToken = 'ETH'
    }
    return nativeToken
  }
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2Pairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter((pool) =>
    JSBI.greaterThan(pool.stakedAmount.quotient, BIG_INT_ZERO)
  )
  const stakingPairs = useV2Pairs(stakingInfosWithBalance?.map((stakingInfo) => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter((v2Pair) => {
    return (
      stakingPairs
        ?.map((stakingPair) => stakingPair[1])
        .filter((stakingPair) => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  const ON_L2 = chainId && L2_CHAIN_IDS.includes(chainId)

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <GreyCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <ThemedText.Black fontWeight={600}>
                  <Trans>Liquidity provider rewards</Trans>
                </ThemedText.Black>
              </RowBetween>
              <RowBetween>
                <ThemedText.Black fontSize={16}>
                  <Trans>
                    Liquidity providers earn a 0.3% fee on all trades proportional to their share of the pool. Fees are
                    added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.
                  </Trans>
                </ThemedText.Black>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </GreyCard>

        {ON_L2 ? (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <Layer2Prompt>
                <ThemedText.Body color={theme.text3} textAlign="center">
                  <Trans>Current version is not available on Layer 2. Switch to Layer 1 Ethereum.</Trans>
                </ThemedText.Body>
              </Layer2Prompt>
            </AutoColumn>
          </AutoColumn>
        ) : (
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="md" style={{ width: '100%' }}>
              <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
                <HideSmall>
                  <ThemedText.MediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                    <Trans>Your liquidity</Trans>
                  </ThemedText.MediumHeader>
                </HideSmall>
                <ButtonRow>
                  <ButtonLink to={`/add/v2/${tokenName()}`} style={{ textDecoration: 'none' }}>
                    <Button
                      type={'SECONDARY'}
                      size={'MEDIUM'}
                      center={true}
                      fillWidth={true}
                      backgroundColor={'#5a63ff'}
                      fontColor={'white'}
                      fontWeight={'500'}
                    >
                      <Text>
                        <Trans>Create a pair</Trans>
                      </Text>
                    </Button>
                  </ButtonLink>
                  <ButtonLink to="/pool/v2/find" style={{ textDecoration: 'none' }}>
                    <Button
                      id="find-pool-button"
                      type={'PRIMARY'}
                      on={'LIGHT'}
                      size={'MEDIUM'}
                      center={true}
                      fillWidth={true}
                      backgroundColor={'#e4e5ff'}
                      fontColor={'#5a63ff'}
                      fontWeight={'500'}
                    >
                      <Trans>Import Pool</Trans>
                    </Button>
                  </ButtonLink>
                  <ButtonLink to="/add/v2/ETH" style={{ textDecoration: 'none' }}>
                    <Button
                      id="join-pool-button"
                      type={'PRIMARY'}
                      on={'LIGHT'}
                      size={'MEDIUM'}
                      center={true}
                      fillWidth={true}
                      backgroundColor={'#F9F5FF'}
                      fontColor={'#53389E'}
                      fontWeight={'500'}
                    >
                      <Trans>Add Liquidity</Trans>
                    </Button>
                  </ButtonLink>
                  {/* <ResponsiveButtonSecondary as={Link} padding="6px 8px" to="/add/v2/ETH"></ResponsiveButtonSecondary> */}
                  {/* <ResponsiveButtonPrimary id="find-pool-button" as={Link} to="/pool/v2/find" padding="6px 8px">
                    <Text fontWeight={500} fontSize={16}>
                      <Trans>Import Pool</Trans>
                    </Text>
                  </ResponsiveButtonPrimary>
                  <ResponsiveButtonPrimary id="join-pool-button" as={Link} to="/add/v2/ETH" padding="6px 8px">
                    <Text fontWeight={500} fontSize={16}>
                      <Trans>Add Liquidity</Trans>
                    </Text>
                  </ResponsiveButtonPrimary> */}
                </ButtonRow>
              </TitleRow>

              {!account ? (
                <Card padding="40px">
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Trans>Connect to a wallet to view your liquidity.</Trans>
                  </ThemedText.Body>
                </Card>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Dots>
                      <Trans>Loading</Trans>
                    </Dots>
                  </ThemedText.Body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  {/* <ButtonSecondary>
                    <RowBetween>
                      <Trans>
                        <ExternalLink href={'https://v2.info.uniswap.org/account/' + account}>
                          Account analytics and accrued fees
                        </ExternalLink>
                        <span> ↗ </span>
                      </Trans>
                    </RowBetween>
                  </ButtonSecondary> */}
                  {v2PairsWithoutStakedAmount.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                  {/* <RowFixed justify="center" style={{ width: '100%' }}>
                    <ButtonOutlined
                      as={Link}
                      to="/migrate/v2"
                      id="import-pool-link"
                      style={{
                        padding: '8px 16px',
                        margin: '0 4px',
                        borderRadius: '12px',
                        width: 'fit-content',
                        fontSize: '14px',
                      }}
                    >
                      <ChevronsRight size={16} style={{ marginRight: '8px' }} />
                      <Trans>Migrate Liquidity to V3</Trans>
                    </ButtonOutlined>
                  </RowFixed> */}
                </>
              ) : (
                <EmptyProposals>
                  <ThemedText.Body color={theme.text3} textAlign="center">
                    <Trans>No liquidity found.</Trans>
                  </ThemedText.Body>
                </EmptyProposals>
              )}
            </AutoColumn>
          </AutoColumn>
        )}
      </PageWrapper>
      <SwitchLocaleLink />
    </>
  )
}
