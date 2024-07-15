// import { useSearchParams } from 'react-router-dom'
import { getMobileModalSize } from '../../utils/screen'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { QUERY_PARAMS } from 'constants/routing'
import { isMobile } from 'utils/userAgent'
import styled from 'styled-components/macro'
import { useActiveWeb3React } from 'hooks/web3'
import { CLIENT_BEST_WALLET } from 'constants/params'

const OnramperContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 24px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-top: 100px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 100px;
  `};
`
const IframeWrapper = styled.iframe`
  @media screen and (max-width: 300px) {
    width: 120%;
    margin: 0 0 0 -20px;
  }
`
function OnRamperComponent({ mode }: { mode: string }) {
  const { networkWallets, apiKey, themeName, client } = useParsedQueryString()
  const { account } = useActiveWeb3React()
  const onRamperKey = apiKey ?? process.env.REACT_APP_ON_RAMPER_KEY
  let walletsParam = networkWallets ?? ''
  if (networkWallets) {
    walletsParam = networkWallets
  } else if (account) {
    // networkWallets=ethereum:0x635849bf204C87630f235A3789D58A0d7EDb5387,polygon:0x635849bf204C87630f235A3789D58A0d7EDb5387
    walletsParam = ['ethereum', 'polygon', 'bsc'].reduce((acc, val) => {
      return `${acc},${val}:${account}`
    }, '')
  }
  const theme =
    themeName === 'light' || client === CLIENT_BEST_WALLET
      ? 'themeName=light&containerColor=ffffff&primaryColor=5a63ffff&secondaryColor=ffffffff&cardColor=f9fafbff&primaryTextColor=344054ff&secondaryTextColor=98a2b3ff&borderRadius=1&wgBorderRadius=1'
      : 'themeName=dark&cardColor=3b3838ff&containerColor=272a2aff&primaryColor=757dffff&secondaryColor=272a2aff&primaryTextColor=ffffffff&secondaryTextColor=949e9eff&borderRadius=1&wgBorderRadius=1'
  const currentUrl = encodeURIComponent(window.location.href) // ${QUERY_PARAMS.MODE}=${modeParam}
  const onRamperURL = `https://buy.onramper.com?mode=${mode}&${QUERY_PARAMS.API_KEY}=${onRamperKey}&${QUERY_PARAMS.WALLETS}=${walletsParam}&${theme}&${QUERY_PARAMS.SUCCESS_REDIRECT_URL}=${currentUrl}&${QUERY_PARAMS.FAILURE_REDIRECT_URL}=${currentUrl}` //
  console.log('onRamperURL', onRamperURL)
  const modalSize = getMobileModalSize()
  const height = isMobile ? modalSize.height : '630px'
  const width = isMobile ? modalSize.width : '520px'

  if (!onRamperKey) {
    return <div>No Env vars present</div>
  }
  return (
    <OnramperContainer className="container">
      <IframeWrapper
        src={onRamperURL}
        title="BestDEX Onramper Widget"
        height={height}
        width={width}
        allow="accelerometer; autoplay; camera; gyroscope; payment"
      />
    </OnramperContainer>
  )
}

export default OnRamperComponent
