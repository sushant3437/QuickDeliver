import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function navLinkClass({ isActive }) {
  return `font-medium text-sm transition ${
    isActive
      ? 'text-slate-900 border-b-2 border-blue-600 pb-1'
      : 'text-slate-600 hover:text-slate-900'
  }`
}

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[10000] border-b border-slate-200 bg-white shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            QuickDeliver
          </Link>

          {/* Desktop Navigation Center */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 lg:flex items-center gap-8 text-slate-600">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            {user?.role === 'customer' && (
              <NavLink to="/customer/bookings" className={navLinkClass}>
                My Bookings
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/admin/slots" className={navLinkClass}>
                  Slots
                </NavLink>
                <NavLink to="/admin/bookings" className={navLinkClass}>
                  Bookings
                </NavLink>
                <NavLink to="/admin/stats" className={navLinkClass}>
                  Stats
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <>
                  <span className="max-w-[160px] truncate text-sm text-slate-600">
                    {user.name}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="space-y-3 px-4 py-4 text-sm text-slate-700">

            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-medium"
            >
              Home
            </NavLink>

            {user?.role === 'customer' && (
              <NavLink
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium"
              >
                My Bookings
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium"
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/slots"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium"
                >
                  Slots
                </NavLink>

                <NavLink
                  to="/admin/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium"
                >
                  Bookings
                </NavLink>

                <NavLink
                  to="/admin/stats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-medium"
                >
                  Stats
                </NavLink>
              </>
            )}

            <div className="border-t border-slate-200 pt-3">
              {user ? (
                <>
                  <p className="mb-2 text-sm text-slate-600">
                    {user.name}
                  </p>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mb-2 block font-medium text-slate-700"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  )
}