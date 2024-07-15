import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state/hooks'

import { updateMatchesDarkMode, updateOriginCountry } from './actions'

export default function Updater(): null {
  const dispatch = useAppDispatch()

  // geo targetly
  const [country, setCountry] = useState('')
  // @ts-ignore
  window.geotargetly_loaded = function geotargetly_loaded() {
    try {
      // @ts-ignore
      const country_name = window?.geotargetly_country_code()
      setCountry(country_name)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (country) {
      dispatch(updateOriginCountry({ country }))
    }
  }, [country, dispatch])
  // keep dark mode in sync with the system
  useEffect(() => {
    const darkHandler = (match: MediaQueryListEvent) => {
      dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))
    }
    // fetch('https://geolocation-db.com/json/')
    //   .then((res) => {
    //     res.json().then((data) => {
    //       dispatch(updateOriginCountry({ country: data.country_code }))
    //     })
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
    // console.log('geotargetly_country_name()', window.geotargetly_city_name && window.geotargetly_country_code())
    // @ts-ignore
    // dispatch(updateOriginCountry({ country: window.geotargetly_country_code() }))
    const match = window?.matchMedia('(prefers-color-scheme: dark)')
    dispatch(updateMatchesDarkMode({ matchesDarkMode: match.matches }))

    if (match?.addListener) {
      match?.addListener(darkHandler)
    } else if (match?.addEventListener) {
      match?.addEventListener('change', darkHandler)
    }

    return () => {
      if (match?.removeListener) {
        match?.removeListener(darkHandler)
      } else if (match?.removeEventListener) {
        match?.removeEventListener('change', darkHandler)
      }
    }
  }, [dispatch])

  return null
}
