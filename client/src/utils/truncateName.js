const inner = '[...]'

export default (name, len = 24) => {
  const trimExt = name
    .split('.')
    .reverse()
    .slice(1)
    .reverse()
    .join('.')
  const toRem = trimExt.length - len
  const mid = Math.ceil(len / 2)
  console.log(
    trimExt,
    toRem,
    mid,
    trimExt.substr(0, mid),
    '=>',
    trimExt.substr(mid + inner.length + toRem)
  )
  return toRem <= 0
    ? name.includes('.') ? trimExt : name
    : trimExt.substr(0, mid) +
        '[...]' +
        trimExt.substr(mid + inner.length + toRem)
}
