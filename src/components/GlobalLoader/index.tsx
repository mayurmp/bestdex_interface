import styled from 'styled-components/macro'
// import GlobalLoadingSVG from '../../assets/svg/global-loading.svg'
import { useAppSelector } from 'state/hooks'

const GlobalLoading = styled.div<{ show: boolean }>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 23;
  width: 100vw;
  height: 100vh;
  background-color: #808080ba;
  justify-content: center;
  align-items: center;
`
const LoadingRoot = styled.div`
  width: 50px;
  height: 50px;
`
const LoaderContainer = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  opacity: 1;
  padding: 14px;
`
const CircularLoader = styled.div`
  width: 36px;
  height: 36px;
  // margin: 110px auto 0;
  border: solid 4px #5a63ff;
  border-radius: 50%;
  // border-right-color: #cecece;
  border-right: solid 4px #cecece;
  // border-bottom-color: transparent;
  -webkit-transition: all 0.5s ease-in;
  -webkit-animation-name: rotate;
  -webkit-animation-duration: 1s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;

  transition: all 0.5s ease-in;
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;

  @-webkit-keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
const GlobalLoader = () => {
  const showGlobalLoader = useAppSelector((state) => state.application.showGlobalLoader)
  return (
    <GlobalLoading show={showGlobalLoader}>
      <LoadingRoot>
        <LoaderContainer>
          <CircularLoader></CircularLoader>
        </LoaderContainer>
      </LoadingRoot>
    </GlobalLoading>
  )
}

export default GlobalLoader
