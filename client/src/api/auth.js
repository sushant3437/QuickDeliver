import axios from './axios'

export const login = async (email, password) => {
  const res = await axios.post('/auth/login', { email, password })
  return res.data.data
}

export const register = async (name, email, password, passwordConfirm) => {
  const res = await axios.post('/auth/register', {
    name,
    email,
    password,
    passwordConfirm,
  })
  // Backend now returns { token, user } instead of just user
  return res.data.data
}

export const getCurrentUser = async () => {
  const res = await axios.get('/auth/me')
  return res.data.data
}
