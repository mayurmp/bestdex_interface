import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { DEFAULT_LOCALE, DEFAULT_MESSAGES, SupportedLocale } from 'constants/locales'
import { initialLocale, useActiveLocale } from 'hooks/useActiveLocale'
import {
  cs,
  ar,
  de,
  en,
  bg,
  es,
  fr,
  hu,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  PluralCategory,
  pt,
  ru,
  ro,
  sk,
  // sv,
  th,
  tr,
  vi,
  zh,
} from 'make-plural/plurals'
import { useEffect } from 'react'
import { ReactNode } from 'react'
import { useUserLocaleManager } from 'state/user/hooks'

type LocalePlural = {
  [key in SupportedLocale]: (n: number | string, ord?: boolean) => PluralCategory
}

const plurals: LocalePlural = {
  'ar-SA': ar,
  'cs-CZ': cs,
  'de-DE': de,
  'en-US': en,
  'bg-BG': bg,
  'es-ES': es,
  'fr-FR': fr,
  'hu-HU': hu,
  'id-ID': id,
  'it-IT': it,
  'ja-JP': ja,
  'ko-KR': ko,
  'nl-NL': nl,
  'pl-PL': pl,
  'pt-PT': pt,
  'ro-RO': ro,
  'ru-RU': ru,
  'sk-SK': sk,
  // 'sv-SE': sv,
  'th-TH': th,
  'tr-TR': tr,
  'vi-VN': vi,
  'zh-CN': zh,
  'zh-TW': zh,
}

async function dynamicActivate(locale: SupportedLocale) {
  i18n.loadLocaleData(locale, { plurals: () => plurals[locale] })
  const { messages } = locale === DEFAULT_LOCALE ? { messages: DEFAULT_MESSAGES } : await import(`locales/${locale}`)
  i18n.load(locale, messages)
  i18n.activate(locale)
}

dynamicActivate(initialLocale)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useActiveLocale()
  const [, setUserLocale] = useUserLocaleManager()

  useEffect(() => {
    dynamicActivate(locale)
      .then(() => {
        document.documentElement.setAttribute('lang', locale)
        setUserLocale(locale) // stores the selected locale to persist across sessions
      })
      .catch((error) => {
        console.error('Failed to activate locale', locale, error)
      })
  }, [locale, setUserLocale])

  return (
    <I18nProvider forceRenderOnLocaleChange={false} i18n={i18n}>
      {children}
    </I18nProvider>
  )
}
