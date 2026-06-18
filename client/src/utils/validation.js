export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number, 1 special char
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
  return regex.test(password)
}

export const mapErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.status === 429) return 'Too many requests — please try again later'
  if (error?.status === 401) return 'Invalid email or password'
  if (error?.status === 409) return error.message || 'Email already registered'
  return 'An error occurred'
}
