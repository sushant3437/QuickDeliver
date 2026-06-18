import axios from './axios'

export const getStats = async () => {
  const res = await axios.get('/admin/stats')
  return res.data.data
}

export const getSlotStats = async () => {
  const res = await axios.get('/admin/slots')
  return res.data.data
}
