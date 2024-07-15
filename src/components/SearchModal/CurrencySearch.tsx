// eslint-disable-next-line no-restricted-imports
import { Currency, Token } from '@tech-alchemy/best-dex/sdk-core'
// eslint-disable-next-line no-restricted-imports
import { t, Trans } from '@lingui/macro'
import { SupportedChainId } from 'constants/chains'
import { BinanceTokenInfo, MaticTokenInfo, ERC20_MATIC_ADDRESS } from 'constants/tokens'
import useDebounce from 'hooks/useDebounce'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import useToggle from 'hooks/useToggle'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Edit } from 'react-feather'
import ReactGA from 'react-ga'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
import { Search } from 'react-feather'
import { ExtendedEther } from '../../constants/tokens'
import { useAllTokens, useIsUserAddedToken, useSearchInactiveTokenLists, useToken } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks/web3'
import { ButtonText, CloseIcon, IconWrapper, ThemedText } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import Row, { RowBetween, RowFixed } from '../Row'
import CommonBases from './CommonBases'
import { MemoizedCurrencyList } from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import ImportRow from './ImportRow'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import { ScrollbarTheme } from './ManageLists'

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`

const BorderlessInput = styled(SearchInput)`
  border: none !important;
  padding-left: 0px;
  :hover,
  :active,
  :focus {
    border: none !important;
  }
`
const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  transition: border 100ms;
  :focus,
  :hover,
  :active {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`
const TokensWrapper = styled(ScrollbarTheme)`
  flex: 1;
`
const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 25px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${({ theme }) => theme.bg10};
  border-top: 1px solid ${({ theme }) => theme.bg2};
`
const SearchIcon = styled(Search)`
  width: 45px;
  stroke-width: 1.5;
  color: ${({ theme }) => theme.text3};
`
const TextWrapper = styled.span`
  color: ${({ theme }) => theme.blue5};
  font-weight: 500;
`
interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showCurrencyAmount?: boolean
  disableNonToken?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showCurrencyAmount,
  disableNonToken,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken,
}: CurrencySearchProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useTheme()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)

  const searchToken = useToken(debouncedQuery)

  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch,
      })
    }
  }, [isAddressSearch])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  let filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)
  // hiding ERC-20 MATIC as we have native matic token already
  if (chainId === 137) {
    filteredSortedTokens = filteredSortedTokens.filter((token: Token) => {
      return token.address !== ERC20_MATIC_ADDRESS
    })
  }
  const ether = useMemo(() => chainId && ExtendedEther.onChain(chainId), [chainId])
  let nativeToken: any
  if ((chainId === SupportedChainId.POLYGON_MUMBAI || chainId === SupportedChainId.POLYGON) && ether) {
    nativeToken = Object.create(ether)
    nativeToken.name = MaticTokenInfo.name
    nativeToken.symbol = MaticTokenInfo.symbol
  } else if ((chainId === SupportedChainId.BINANCE || chainId === SupportedChainId.BINANCE_TESTNET) && ether) {
    nativeToken = Object.create(ether)
    nativeToken.name = BinanceTokenInfo.name
    nativeToken.symbol = BinanceTokenInfo.symbol
  } else {
    nativeToken = ether
  }

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {
      return ether && nativeToken ? [nativeToken, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, ether, nativeToken, filteredSortedTokens])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth' && ether) {
          handleCurrencySelect(ether)
        } else if (filteredSortedTokensWithETH.length > 0) {
          if (
            filteredSortedTokensWithETH[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokensWithETH.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokensWithETH[0])
          }
        }
      }
    },
    [debouncedQuery, ether, filteredSortedTokensWithETH, handleCurrencySelect]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            <Trans>Select a token</Trans>
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Row>
          <InputContainer>
            <SearchIcon></SearchIcon>
            <BorderlessInput
              type="text"
              id="token-search-input"
              placeholder={t`Search name or paste address`}
              autoComplete="off"
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </InputContainer>
        </Row>
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
      </PaddedColumn>
      <Separator />
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%', border: '1px solid white' }}>
          <ImportRow
            onSelect={handleCurrencySelect}
            token={searchToken}
            showImportView={showImportView}
            setImportToken={setImportToken}
          />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <TokensWrapper>
          <AutoSizer disableWidth>
            {({ height }) => (
              <MemoizedCurrencyList
                height={height}
                currencies={disableNonToken ? filteredSortedTokens : filteredSortedTokensWithETH}
                otherListTokens={filteredInactiveTokens}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
                showCurrencyAmount={showCurrencyAmount}
              />
            )}
          </AutoSizer>
        </TokensWrapper>
      ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <ThemedText.Main color={theme.text3} textAlign="center" mb="20px">
            <Trans>No results found.</Trans>
          </ThemedText.Main>
        </Column>
      )}
      <Footer>
        <Row justify="center">
          <ButtonText onClick={showManageView} color={theme.primary1} className="list-token-manage-button">
            <RowFixed>
              <IconWrapper size="16px" marginRight="6px" stroke={theme.blue5}>
                <Edit />
              </IconWrapper>
              <TextWrapper color={theme.blue5}>
                <Trans>Manage Token Lists</Trans>
              </TextWrapper>
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer>
    </ContentWrapper>
  )
}
