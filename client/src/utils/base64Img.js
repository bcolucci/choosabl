const canvasBase64 = canvas =>
  canvas
    .toDataURL()
    .split('base64,')
    .pop()

export const getDimensions = ({ type, base64 }) => {
  const img = new Image()
  img.src = `data:${type};base64,${base64}`
  return new Promise((resolve, _) => {
    img.onload = () => resolve({ width: img.width, height: img.height })
  })
}

export const crop = ({ type, base64, x, y, width, height }) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  img.src = `data:${type};base64,${base64}`
  return new Promise((resolve, _) => {
    img.onload = () => {
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
      resolve(canvasBase64(canvas))
    }
  })
}

export const resize = ({ type, base64, width /*, height */ }) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const canvasCopy = document.createElement('canvas')
  const copyContext = canvasCopy.getContext('2d')
  const img = new Image()
  img.src = `data:${type};base64,${base64}`
  return new Promise((resolve, _) => {
    img.onload = () => {
      let ratio = 1
      if (img.width > width) {
        ratio = width / img.width
      }
      // else if (img.height > height) {
      //   ratio = height / img.height
      // }
      canvasCopy.width = img.width
      canvasCopy.height = img.height
      copyContext.drawImage(img, 0, 0)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      ctx.drawImage(
        canvasCopy,
        0,
        0,
        canvasCopy.width,
        canvasCopy.height,
        0,
        0,
        canvas.width,
        canvas.height
      )
      resolve(canvasBase64(canvas))
    }
  })
}
