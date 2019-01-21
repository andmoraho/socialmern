import axios from 'axios'

const setAuthToken = token => {
  const authScehma = 'Bearer '
  const authToken = authScehma.concat(token)
  if (authToken) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = authToken
  } else {
    // Delete the auth header
    delete axios.defaults.headers.common['Authorization']
  }
}

export default setAuthToken
