import React from 'react'
import { Link } from 'react-router-dom'

export default function CustomerDashboard(){
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-blue-600 font-semibold mb-3">
  Customer Dashboard
</p>
            <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
            <p className="mt-3 text-sm text-slate-600 max-w-2xl">
              Manage your delivery bookings and explore available slots from a clean dashboard.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 border border-slate-200 px-5 py-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Need help?</p>
            <p className="mt-2 text-sm text-slate-700">Browse slots quickly or manage your bookings in one place.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/customer/bookings"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">Bookings</span>
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16"/></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">My Bookings</h2>
          <p className="text-sm text-slate-600">Track your active deliveries, booking details, and upcoming slots.</p>
        </Link>

        <Link
          to="/"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">Find Slots</span>
            <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"/></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Browse Available Slots</h2>
          <p className="text-sm text-slate-600">Choose the best delivery time for your order with zero hassle.</p>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500 mb-4">Tip</p>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Stay ahead of availability</h2>
          <p className="text-sm text-slate-600">Refresh the slot list often to catch the newest delivery windows before they fill up.</p>
        </div>
      </section>
    </div>
  )
}
