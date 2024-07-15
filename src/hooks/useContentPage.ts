import { useLocation } from 'react-router-dom'

const useContentPage = () => {
  const location = useLocation()
  const isContentPage =
    location.pathname === '/home' ||
    location.pathname === '/airdrop' ||
    location.pathname === '/partner' ||
    location.pathname === '/terms' ||
    location.pathname === '/privacy' ||
    location.pathname === '/cookies' ||
    location.pathname === '/pagenotfound'
  return isContentPage
}

export default useContentPage
