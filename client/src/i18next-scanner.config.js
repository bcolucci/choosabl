// const fs = require('fs')
const { ns, defaultNS } = require('./i18n.config')
const lngs = ['en_GB', 'fr_FR']

module.exports = {
  options: {
    // debug: true,
    func: {
      list: ['t', 'props.t'],
      extensions: ['.js', '.jsx']
    },
    lngs,
    ns,
    defaultNs: defaultNS,
    defaultLng: lngs[0],
    nsSeparator: ':',
    keySeparator: false,
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    }
  }
}
