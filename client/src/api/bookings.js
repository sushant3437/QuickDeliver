import axios from './axios'

export const createBooking = async (slotId) => {
  const res = await axios.post('/bookings', { slotId })
  return res.data.data
}

export const listBookings = async () => {
  const res = await axios.get('/bookings')
  return res.data.data
}

export const adminListBookings = async (params = {}) => {
  const res = await axios.get('/admin/bookings', { params })
  return res.data.data
}

export const cancelBooking = async (id) => {
  const res = await axios.delete(`/bookings/${id}`)
  return res.data.data
}
