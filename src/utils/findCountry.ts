// country.ts
export const geotargetly_loaded = function geotargetly_loaded(): string | undefined {
  try {
    // @ts-ignore
    const country_name = window?.geotargetly_country_code()
    return country_name
  } catch (e) {
    console.log(e)
    return undefined
  }
}
