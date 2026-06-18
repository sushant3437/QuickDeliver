import { format } from 'date-fns'

const DISPLAY_DATE_TIME = 'MMMM d, yyyy • hh:mm a'
const DISPLAY_TIME = 'hh:mm a'
const DISPLAY_DATE = 'MMMM d, yyyy'

function parseToDate(value) {
  if (!value) return null
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed
    return null
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  return null
}

export function formatDateTime(value) {
  const date = parseToDate(value)
  if (!date) return ''
  return format(date, DISPLAY_DATE_TIME)
}

export function formatDate(value) {
  const date = parseToDate(value)
  if (!date) return ''
  return format(date, DISPLAY_DATE)
}

export function formatTime(value) {
  const date = parseToDate(value)
  if (!date) return ''
  return format(date, DISPLAY_TIME)
}
