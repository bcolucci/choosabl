const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

const toLocaleString = (number, locale) => {
  let result = number
  if (typeof locale === 'string') {
    result = number.toLocaleString(locale)
  } else if (locale === true) {
    result = number.toLocaleString()
  }
  return result
}

export default (number, options) => {
  if (!Number.isFinite(number)) {
    throw new TypeError(
      `Expected a finite number, got ${typeof number}: ${number}`
    )
  }

  options = Object.assign({}, options)
  if (options.signed && number === 0) {
    return ' 0 B'
  }

  const isNegative = number < 0
  const prefix = isNegative ? '-' : options.signed ? '+' : ''

  if (isNegative) {
    number = -number
  }

  if (number < 1) {
    const numberString = toLocaleString(number, options.locale)
    return prefix + numberString + ' B'
  }

  const exponent = Math.min(
    Math.floor(Math.log10(number) / 3),
    UNITS.length - 1
  )
  number = Number((number / Math.pow(1000, exponent)).toPrecision(3))
  const numberString = toLocaleString(number, options.locale)

  const unit = UNITS[exponent]

  return prefix + numberString + ' ' + unit
}
