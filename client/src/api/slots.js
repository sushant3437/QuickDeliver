import axios from './axios'

export const listSlots = async (params = {}) => {
  const res = await axios.get('/slots', { params })
  return res.data.data
}

export const getSlot = async (id) => {
  const res = await axios.get(`/slots/${id}`)
  return res.data.data
}

export const createSlot = async (payload) => {
  const res = await axios.post('/admin/slots', payload)
  return res.data.data
}

export const updateSlot = async (id, payload) => {
  const res = await axios.put(`/admin/slots/${id}`, payload)
  return res.data.data
}

export const deleteSlot = async (id) => {
  const res = await axios.delete(`/admin/slots/${id}`)
  return res.data.data
}

export const adminListSlots = async (params = {}) => {
  const res = await axios.get('/admin/slots', { params })
  return res.data.data
}
