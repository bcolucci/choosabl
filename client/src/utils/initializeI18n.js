import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'

const defaultNS = 'commons'
const debug = process.env.NODE_ENV !== 'production'

i18n.use(Backend).use(LanguageDetector).use(reactI18nextModule).init({
  fallbackLng: 'en',
  ns: [defaultNS],
  defaultNS,
  debug,
  interpolation: {
    escapeValue: false
  },
  react: {
    wait: true
  }
})

export default i18n
