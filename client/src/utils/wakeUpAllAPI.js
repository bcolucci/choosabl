import { wakeUpAllAPI } from '../api'
if (window.location.host === 'localhost:3000') {
  ;(async function tick () {
    await wakeUpAllAPI()
    setTimeout(tick, 5000)
  })()
}
