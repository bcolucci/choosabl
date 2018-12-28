import { wakeUpAPI } from '../api'
const tick = () => {
  wakeUpAPI()
  setTimeout(tick, 30000)
}
tick()
