import { wakeUpAPI } from '../api'
// if (window.location.host === 'localhost:3000') {
  ;(async function tick () {
  await wakeUpAPI()
  setTimeout(tick, 5000)
})()
// }
