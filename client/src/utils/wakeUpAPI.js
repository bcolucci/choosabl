import { wakeUpAPI } from '../api'
// if (window.location.host === 'localhost:3000') {
  ;(async function tick () {
  try {
    await wakeUpAPI()
  } catch (err) {
    console.error(err)
  }
  setTimeout(tick, 5000)
})()
// }
