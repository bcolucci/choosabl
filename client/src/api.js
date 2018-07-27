const apiURL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-choosabl-1e2ea.cloudfunctions.net'
  : 'http://localhost:5000/choosabl-1e2ea/us-central1'

export const getSecret = async token => {
  return await (await fetch(`${apiURL}/secret`, {
    headers: {
      token
    }
  })).json()
}
