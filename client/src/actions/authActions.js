import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setAuthToken from '../utils/setAuthToken'

import { GET_ERRORS, SET_CURRENT_USER } from './types'

// Register

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    )
}

// Login - Get user token

export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Save to local sotorage
      const { token } = res.data
      localStorage.setItem('jwttoken', token)
      // Set token to auth header
      setAuthToken(token)
      // Decode token to get user data
      const decoded = jwt_decode(token)
      // Set current user
      dispatch(setCurrentUser(decoded))
    })
    .catch(error =>
      dispatch({
        type: GET_ERRORS,
        payload: error.response.data
      })
    )
}

// Set logged in user

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Log user out

export const logoutUser = () => dispatch => {
  // Remove token from localstorage
  localStorage.removeItem('jwttoken')
  // Remove auth header for future requests
  setAuthToken(false)
  // Set current user to empty {} which will set is Authenticated to false
  dispatch(setCurrentUser({}))

}
