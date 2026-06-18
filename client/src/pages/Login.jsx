import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as authApi from '../api/auth'
import { validateEmail, mapErrorMessage } from '../utils/validation'
import Alert from '../components/common/Alert'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [touched, setTouched] = useState({})

  const errors = {
    email:
      touched.email && !form.email
        ? 'Email is required'
        : touched.email && !validateEmail(form.email)
        ? 'Invalid email'
        : '',

    password:
      touched.password && !form.password
        ? 'Password is required'
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
    setError(null)

    setTouched({
      email: true,
      password: true,
    })

    if (errors.email || errors.password) return

    setLoading(true)

    try {
      const data = await authApi.login(
        form.email,
        form.password
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
            Welcome Back
          </h2>

          <p className="text-sm text-slate-600 mt-2">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Login Failed"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

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
              className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${
                errors.email
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-slate-200 bg-white'
              }`}
            />

            {errors.email && (
              <p className="text-rose-600 text-xs mt-1 font-medium">
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
              className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 transition ${
                errors.password
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-slate-200 bg-white'
              }`}
            />

            {errors.password && (
              <p className="text-rose-600 text-xs mt-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>


        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-center text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-slate-900 font-semibold hover:text-slate-700"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}