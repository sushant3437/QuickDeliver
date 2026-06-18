import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as authApi from '../api/auth'
import {
  validateEmail,
  validatePassword,
  mapErrorMessage
} from '../utils/validation'
import Alert from '../components/common/Alert'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const [touched, setTouched] = useState({})

  const errors = {
    name:
      touched.name && !form.name
        ? 'Name is required'
        : '',

    email:
      touched.email && !form.email
        ? 'Email is required'
        : touched.email && !validateEmail(form.email)
        ? 'Invalid email'
        : '',

    password:
      touched.password && !form.password
        ? 'Password is required'
        : touched.password && !validatePassword(form.password)
        ? 'Minimum 8 characters with uppercase, number and special character'
        : '',

    passwordConfirm:
      touched.passwordConfirm && !form.passwordConfirm
        ? 'Confirm password is required'
        : touched.passwordConfirm &&
          form.password !== form.passwordConfirm
        ? 'Passwords do not match'
        : '',
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleBlur = (e) => {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setTouched({
      name: true,
      email: true,
      password: true,
      passwordConfirm: true,
    })

    if (Object.values(errors).some(Boolean)) return

    setLoading(true)
    setError(null)

    try {
      const data = await authApi.register(
        form.name,
        form.email,
        form.password,
        form.passwordConfirm
      )

      const { token, user } = data

      login(token, user)

      navigate(
        user.role === 'admin'
          ? '/admin'
          : '/customer',
        { replace: true }
      )

    } catch (err) {
      setError(mapErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4">

      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-slate-900">
            Create Account
          </h2>

          <p className="text-sm text-slate-600 mt-2">
            Set up your account to book delivery slots
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Registration Failed"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.name
                  ? "border-rose-500 bg-rose-50"
                  : "border-slate-200"
              }`}
            />

            {errors.name && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.name}
              </p>
            )}
          </div>


          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.email
                  ? "border-rose-500 bg-rose-50"
                  : "border-slate-200"
              }`}
            />

            {errors.email && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.password
                  ? "border-rose-500 bg-rose-50"
                  : "border-slate-200"
              }`}
            />

            <p className="text-xs text-slate-500 mt-1">
              Minimum 8 characters with uppercase, number and special character.
            </p>
          </div>


          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm password
            </label>

            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full px-4 py-3 rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                errors.passwordConfirm
                  ? "border-rose-500 bg-rose-50"
                  : "border-slate-200"
              }`}
            />

            {errors.passwordConfirm && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {errors.passwordConfirm}
              </p>
            )}
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

        </form>


        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-slate-900 hover:text-slate-700"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}