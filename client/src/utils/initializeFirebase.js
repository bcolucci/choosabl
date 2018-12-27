import { initializeApp, auth } from 'firebase'
import conf from '../firebase-conf.json'

const env = ['choosabl.com', 'choosabl-4a2ec.firebaseapp.com'].includes(
  window.location.host
)
  ? 'prod'
  : 'test'

initializeApp(conf[env])

auth().useDeviceLanguage()
