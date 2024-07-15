export const setSessionData = (key: string, value: unknown) => {
  if (window && window.sessionStorage) {
    let stringifiedValue = ''
    if (typeof value === 'string') {
      stringifiedValue = value
    } else if (typeof value === 'object' || typeof value === 'number') {
      stringifiedValue = JSON.stringify(value)
    } else {
      throw new Error('invalid type, cannot store in session storage')
    }
    sessionStorage.setItem(key, stringifiedValue)
  }
}

export const getSessionData = (key: string) => {
  try {
    const storedValue = sessionStorage.getItem(key)
    if (storedValue) {
      return JSON.parse(storedValue)
    }
  } catch (e) {
    throw e
  }
}

export const removeSessionData = (key: string) => {
  try {
    sessionStorage.removeItem(key)
  } catch (e) {
    throw e
  }
}
