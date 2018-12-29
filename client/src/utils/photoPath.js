const san = str => btoa(encodeURIComponent(str))

export default (userUID, fileName) =>
  `photos/${userUID}/${san(fileName + String(new Date().getTime()))}`
