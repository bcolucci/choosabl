const defaultNS = 'commons'
const langs = ['en_GB', 'fr_FR']
const namespaces = [defaultNS, 'langs', 'battles', 'profile', 'gallery']

module.exports = {
  debug: false, // process.env.NODE_ENV !== 'production',
  langs,
  defaultNS,
  ns: namespaces,
  fallbackLng: 'en_GB',
  interpolation: {
    escapeValue: false
  },
  react: {
    wait: true
  }
}
