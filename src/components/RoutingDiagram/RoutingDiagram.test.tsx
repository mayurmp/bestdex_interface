import { Currency, Percent } from '@tech-alchemy/best-dex/sdk-core'
import { FeeAmount } from '@tech-alchemy/best-dex/v3-sdk'
import { DAI, USDC, WBTC } from 'constants/tokens'
import { render } from 'test-utils'

import RoutingDiagram, { RoutingDiagramEntry } from './RoutingDiagram'

const percent = (strings: TemplateStringsArray) => new Percent(parseInt(strings[0]), 100)

const singleRoute: RoutingDiagramEntry = { percent: percent`100`, path: [[USDC, DAI, FeeAmount.LOW]] }

const multiRoute: RoutingDiagramEntry[] = [
  { percent: percent`75`, path: [[USDC, DAI, FeeAmount.LOWEST]] },
  {
    percent: percent`25`,
    path: [
      [USDC, WBTC, FeeAmount.MEDIUM],
      [WBTC, DAI, FeeAmount.HIGH],
    ],
  },
]

jest.mock(
  'components/CurrencyLogo',
  () =>
    ({ currency }: { currency: Currency }) =>
      `CurrencyLogo currency=${currency.symbol}`
)

jest.mock(
  'components/DoubleLogo',
  () =>
    ({ currency0, currency1 }: { currency0: Currency; currency1: Currency }) =>
      `DoubleCurrencyLogo currency0=${currency0.symbol} currency1=${currency1.symbol}`
)

jest.mock('../Popover', () => () => 'Popover')

jest.mock('hooks/useTokenInfoFromActiveList', () => ({
  useTokenInfoFromActiveList: (currency: Currency) => currency,
}))

it('renders when no routes are provided', () => {
  const { asFragment } = render(<RoutingDiagram currencyIn={DAI} currencyOut={USDC} routes={[]} />)
  expect(asFragment()).toMatchSnapshot()
})

it('renders single route', () => {
  const { asFragment } = render(<RoutingDiagram currencyIn={USDC} currencyOut={DAI} routes={[singleRoute]} />)
  expect(asFragment()).toMatchSnapshot()
})

it('renders multi route', () => {
  const { asFragment } = render(<RoutingDiagram currencyIn={USDC} currencyOut={DAI} routes={multiRoute} />)
  expect(asFragment()).toMatchSnapshot()
})
