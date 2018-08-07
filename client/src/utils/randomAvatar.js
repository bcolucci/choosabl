throw new Error('Should not be used anymore.')

const max = 87

const randomAvatar = (sex, exclude) => {
  const r = Math.ceil(Math.random() * max)
  const path = `/fixtures/avatars/${String(r).padStart(3, '0')}${sex}.jpg`
  if (exclude && path === exclude) {
    return randomAvatar(sex, exclude)
  }
  return path
}

export default randomAvatar
