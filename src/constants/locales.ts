import UKImage from '../assets/svg/flags/en.svg'
import BalgarianImage from '../assets/svg/flags/bg.svg'
import JPFlag from '../assets/svg/flags/jp.svg'
import ZAFlag from '../assets/svg/flags/jp.svg'
import ARFlag from '../assets/svg/flags/ar.svg'
import CAFlag from '../assets/svg/flags/es.svg'
import CSFlag from '../assets/svg/flags/cz.svg'
import DAFlag from '../assets/svg/flags/de.svg'
import DEFlag from '../assets/svg/flags/de.svg'
import ELFlag from '../assets/svg/flags/es.svg'
import ESFlag from '../assets/svg/flags/es.svg'
import FIFlag from '../assets/svg/flags/fr.svg'
import FRFlag from '../assets/svg/flags/fr.svg'
import HEFlag from '../assets/svg/flags/hu.svg'
import HUFlag from '../assets/svg/flags/hu.svg'
import IDFlag from '../assets/svg/flags/id.svg'
import ITFlag from '../assets/svg/flags/it.svg'
import KOFlag from '../assets/svg/flags/kr.svg'
import NLFlag from '../assets/svg/flags/nl.svg'
import NOFlag from '../assets/svg/flags/nl.svg'
import PLFlag from '../assets/svg/flags/pl.svg'
import PTFlag from '../assets/svg/flags/pt.svg'
import ROFlag from '../assets/svg/flags/ro.svg'
import RUFlag from '../assets/svg/flags/ru.svg'
import SRFlag from '../assets/svg/flags/tr.svg'
// import SVFlag from '../assets/svg/flags/tr.svg'
import SWFlag from '../assets/svg/flags/tr.svg'
import THFlag from '../assets/svg/flags/th.svg'
import TRFlag from '../assets/svg/flags/tr.svg'
import UAFlag from '../assets/svg/flags/vn.svg'
import VNFlag from '../assets/svg/flags/vn.svg'
import ZHFlag from '../assets/svg/flags/cn.svg'
import TWFlag from '../assets/svg/flags/cn.svg'
import SKFlag from '../assets/svg/flags/sk.svg'

export const SUPPORTED_LOCALES = [
  'ar-SA',
  'en-US',
  'bg-BG',
  'zh-CN',
  'zh-TW',
  'cs-CZ',
  'nl-NL',
  'fr-FR',
  'de-DE',
  'hu-HU',
  'id-ID',
  'it-IT',
  'ja-JP',
  'ko-KR',
  'pl-PL',
  'pt-PT',
  'ro-RO',
  'ru-RU',
  'sk-SK',
  'es-ES',
  // 'sv-SE',
  'th-TH',
  'tr-TR',
  'vi-VN',
] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en-US'

export { messages as DEFAULT_MESSAGES } from '../locales/en-US'

export const LOCALE_LABEL: { [locale in SupportedLocale]: string } = {
  // 'af-ZA': 'Afrikaans',
  'ar-SA': 'العربية',
  // 'ca-ES': 'Català',
  'cs-CZ': 'čeština',
  // 'da-DK': 'dansk',
  'de-DE': 'Deutsch',
  // 'el-GR': 'ελληνικά',
  'en-US': 'English',
  'bg-BG': 'Balgarian',
  'es-ES': 'Español',
  // 'fi-FI': 'suomi',
  'fr-FR': 'français',
  // 'he-IL': 'עִברִית',
  'hu-HU': 'Magyar',
  'id-ID': 'bahasa Indonesia',
  'it-IT': 'Italiano',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'nl-NL': 'Nederlands',
  // 'no-NO': 'norsk',
  'pl-PL': 'Polskie',
  // 'pt-BR': 'português',
  'pt-PT': 'português',
  'ro-RO': 'Română',
  'ru-RU': 'русский',
  'sk-SK': 'Slovenčina',
  // 'sr-SP': 'Српски',
  // 'sv-SE': 'svenska',
  'th-TH': 'Thai',
  // 'sw-TZ': 'Kiswahili',
  'tr-TR': 'Türkçe',
  // 'uk-UA': 'Український',
  'vi-VN': 'Tiếng Việt',
  'zh-CN': '简体中文',
  'zh-TW': '繁体中文',
}

export const LocaleFlags = {
  'en-US': {
    image: UKImage,
    label: 'English',
  },
  'bg-BG': {
    image: BalgarianImage,
    label: 'Bulgarian',
  },
  'zh-CN': {
    image: ZHFlag,
    label: 'Chinese (Simplified)',
  },
  'zh-TW': {
    image: TWFlag,
    label: 'Chinese (Traditional)',
  },
  'cs-CZ': {
    image: CSFlag,
    label: 'Czech',
  },
  'nl-NL': {
    image: NLFlag,
    label: 'Dutch',
  },
  'ar-SA': {
    image: ARFlag,
    label: 'Arabic',
  },
  'ca-ES': {
    image: CAFlag,
    label: 'Spanish',
  },
  'da-DK': {
    image: DAFlag,
    label: 'dansk',
  },
  'fr-FR': {
    image: FRFlag,
    label: 'French',
  },
  'de-DE': {
    image: DEFlag,
    label: 'German',
  },
  'el-GR': {
    image: ELFlag,
    label: 'ελληνικά',
  },
  'es-ES': {
    image: ESFlag,
    label: 'Spanish',
  },
  'fi-FI': {
    image: FIFlag,
    label: 'suomi',
  },
  'he-IL': {
    image: HEFlag,
    label: 'עִברִית',
  },
  'hu-HU': {
    image: HUFlag,
    label: 'Hungarian',
  },
  'id-ID': {
    image: IDFlag,
    label: 'Indonesian',
  },
  'it-IT': {
    image: ITFlag,
    label: 'Italian',
  },
  'ja-JP': {
    image: JPFlag,
    label: 'Japanese',
  },
  'ko-KR': {
    image: KOFlag,
    label: 'Korean',
  },
  'no-NO': {
    image: NOFlag,
    label: 'norsk',
  },
  'pl-PL': {
    image: PLFlag,
    label: 'Polish',
  },
  'pt-BR': {
    image: PTFlag,
    label: 'Posrtuguese',
  },
  'pt-PT': {
    image: PTFlag,
    label: 'Portuguese',
  },
  'ro-RO': {
    image: ROFlag,
    label: 'Romanian',
  },
  'ru-RU': {
    image: RUFlag,
    label: 'Russian',
  },
  'sk-SK': {
    image: SKFlag,
    label: 'Slovak',
  },
  'sr-SP': {
    image: SRFlag,
    label: 'Српски',
  },
  // 'sv-SE': {
  //   image: SVFlag,
  //   label: 'svenska',
  // },
  'th-TH': {
    image: THFlag,
    label: 'Thai',
  },
  'sw-TZ': {
    image: SWFlag,
    label: 'Kiswahili',
  },
  'tr-TR': {
    image: TRFlag,
    label: 'Turkish',
  },
  'uk-UA': {
    image: UAFlag,
    label: 'Український',
  },
  'vi-VN': {
    image: VNFlag,
    label: 'Vietnamese',
  },
  'af-ZA': {
    image: ZAFlag,
    label: 'Afrikaans',
  },
}
