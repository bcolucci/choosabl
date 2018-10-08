import ellipsize from 'ellipsize'

export default (str, len = 24, ellipse = '[...]') => {
  const toRem = str.length - len
  if (toRem <= 0) {
    return str
  }
  const mid = Math.ceil(len / 2)
  const start = ellipsize(str, mid, { ellipse })
  return start + str.substr(toRem + mid + ellipse.length)
}
