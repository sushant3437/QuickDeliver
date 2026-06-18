import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats, getSlotStats } from '../../api/stats'
import { formatDateTime } from '../../utils/date'

const accentClasses = {
  blue: 'bg-blue-100 text-blue-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  rose: 'bg-rose-100 text-rose-700',
}

function StatCard({ title, value, icon, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accentClasses[accent] || 'bg-slate-100 text-slate-700'}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard(){
  const [stats, setStats] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const [bookingStats, slotData] = await Promise.all([
          getStats(),
          getSlotStats(),
        ])
        setStats(bookingStats || [])
        setSlots(slotData || [])
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Unable to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const totalSlots = slots.length
  const bookedCount = stats.find((item) => item._id === 'booked')?.count || 0
  const cancelledCount = stats.find((item) => item._id === 'cancelled')?.count || 0
  const totalBookings = bookedCount + cancelledCount

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
             <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-semibold mb-3">
  Admin Dashboard
</p>
              <h1 className="text-3xl font-semibold text-slate-900">Overview of your delivery system</h1>
              <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-7">
                Review slot availability, booking activity, and system health from one clean admin workspace.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 border border-slate-200 text-slate-700">
              <p className="text-sm font-semibold text-slate-700">Last updated</p>
              <p className="text-base font-semibold text-slate-900">{formatDateTime(new Date())}</p>
            </div>
          </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        ) : loading ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
            Loading dashboard metrics...
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              title="Total Slots"
              value={totalSlots}
              accent="blue"
              icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2v-7H3v7a2 2 0 0 0 2 2z"/></svg>}
            />
            <StatCard
              title="Total Bookings"
              value={totalBookings}
              accent="indigo"
              icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M5 11h14M7 11v10m10-10v10"/></svg>}
            />
            <StatCard
              title="Active Bookings"
              value={bookedCount}
              accent="emerald"
              icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m1-5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10z"/></svg>}
            />
            <StatCard
              title="Cancelled Bookings"
              value={cancelledCount}
              accent="rose"
              icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>}
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3 mb-4">
        <Link
          to="/admin/slots"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">Manage Slots</span>
            <div className="rounded-2xl bg-blue-100 p-2 text-blue-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Create, edit & delete slots</h2>
          <p className="text-sm text-slate-600">Keep your delivery schedule up to date with fast slot management.</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">View Bookings</span>
            <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Review customer reservations</h2>
          <p className="text-sm text-slate-600">Monitor booking status and ensure deliveries stay on track.</p>
        </Link>

        <Link
          to="/admin/stats"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-slate-700">Statistics</span>
            <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-6m4 6V7m4 10v-4"/></svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">View system analytics</h2>
          <p className="text-sm text-slate-600">See capacity, booking trends, and system health at a glance.</p>
        </Link>
      </section>
    </div>
  )
}
