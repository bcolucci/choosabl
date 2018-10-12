import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { reactI18nextModule } from 'react-i18next'
import config from '../i18n.config'

let initialized = false
if (!initialized) {
  i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(reactI18nextModule)
    .init(config)
  initialized = true
}

export default i18n
