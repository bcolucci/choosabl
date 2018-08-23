export default (userUID, fileName) =>
  `photos/${userUID}/${btoa(fileName + String(new Date().getTime()))}`
