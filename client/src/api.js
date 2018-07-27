const apiURL = 'https://us-central1-choosabl-1e2ea.cloudfunctions.net/choosabl'

export const getSecret = async token => {
  return await (await fetch(`${apiURL}/secret`, {
    headers: {
      token
    }
  })).json()
}
