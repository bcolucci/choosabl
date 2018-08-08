import { initializeApp, auth } from 'firebase'

initializeApp(
  (() => {
    switch (window.location.host) {
      case 'choosabl.com':
      case 'choosabl-1e2ea.firebaseapp.com':
        return {
          apiKey: 'AIzaSyCBxztWJoF0DFBwvJ0GfuKnF7IKCOnQkm4',
          authDomain: 'choosabl-1e2ea.firebaseapp.com',
          databaseURL: 'https://choosabl-1e2ea.firebaseio.com',
          projectId: 'choosabl-1e2ea',
          storageBucket: 'choosabl-1e2ea.appspot.com',
          messagingSenderId: '489139856067'
        }
      case 'localhost:3000':
      case 'choosabl-test.firebaseapp.com':
        return {
          apiKey: 'AIzaSyDDFhTCTsO33jjjp9XL6VnH2sm0D-n8ZPg',
          authDomain: 'choosabl-test.firebaseapp.com',
          databaseURL: 'https://choosabl-test.firebaseio.com',
          projectId: 'choosabl-test',
          storageBucket: 'choosabl-test.appspot.com',
          messagingSenderId: '201683634396'
        }
      default:
        throw new Error('Unknown host (Firebase).')
    }
  })()
)

auth().useDeviceLanguage()
