export const getNativeTokenName = (chainId: any) => {
  switch (chainId) {
    case 1:
    case '1':
    case 11155111:
    case '11155111':
      return 'ETH'
    case 137:
    case '137':
    case 80001:
    case '80001':
      return 'MATIC'
    case 56:
    case '56':
    case 97:
    case '97':
      return 'BNB'
    default:
      return 'ETH'
  }
}

export const isNativeToken = (chainId: any, currencySymbol: string) => {
  switch (chainId) {
    case 1:
    case '1':
    case 11155111:
    case '11155111':
      return currencySymbol === 'ETH'
    case 137:
    case '137':
    case 80001:
    case '80001':
      return currencySymbol === 'MATIC'
    case 56:
    case '56':
    case 97:
    case '97':
      return currencySymbol === 'BNB'
    default:
      return false
  }
}
