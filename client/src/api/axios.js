import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor to unwrap data or map errors
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data)
    }
    return Promise.reject(err)
  }
)

export default instance
