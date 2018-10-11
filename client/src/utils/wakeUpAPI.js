import { wakeUpAPI } from '../api'
// if (window.location.host === 'localhost:3000') {
const tick = async () => {
  try {
    await wakeUpAPI()
  } catch (_) {}
  setTimeout(tick, 15000)
}
tick()
// }
