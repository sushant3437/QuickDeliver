import React, { useEffect, useState } from 'react'
import { getStats, getSlotStats } from '../../api/stats'

function StatCard({ title, value, accent }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500 mb-3">{title}</p>
      <p className="text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function CapacityBar({ used, total }) {
  const percentage = total > 0 ? Math.round((used / total) * 100) : 0
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 text-sm text-slate-500">
        <span>Capacity usage</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-slate-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-3">{used} booked out of {total} available capacity.</p>
    </div>
  )
}

export default function AdminStats() {
  const [bookingStats, setBookingStats] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const [bookStats, slotData] = await Promise.all([
        getStats(),
        getSlotStats(),
      ])

      setBookingStats(bookStats)
      setSlots(slotData || [])
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to load statistics'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const totalSlots = slots.length
  const totalCapacity = slots.reduce((sum, s) => sum + (s.capacity || 0), 0)
  const totalBooked = slots.reduce((sum, s) => sum + (s.bookedCount || 0), 0)
  const remainingCapacity = Math.max(0, totalCapacity - totalBooked)

  const bookedCount = bookingStats?.find((s) => s._id === 'booked')?.count || 0
  const cancelledCount = bookingStats?.find((s) => s._id === 'cancelled')?.count || 0
  const totalBookings = bookedCount + cancelledCount

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
           <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-semibold mb-3">
  Admin statistics
</p>
            <h1 className="text-3xl font-semibold text-slate-900">Platform health at a glance</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Review capacity, booking activity, and delivery slot performance in one polished statistics view.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
            <p className="text-sm text-slate-500">Current slots</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{totalSlots}</p>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600 shadow-sm">
          Loading statistics...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard title="Total Slots" value={totalSlots} />
            <StatCard title="Total Capacity" value={totalCapacity} />
            <StatCard title="Active Bookings" value={bookedCount} />
            <StatCard title="Cancelled Bookings" value={cancelledCount} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-semibold mb-3">
  Capacity Overview
</p>
                <h2 className="text-xl font-semibold text-slate-900">Booked vs available delivery capacity</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalCapacity}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Booked</p>
                  <p className="text-2xl font-semibold text-slate-900">{totalBooked}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Remaining</p>
                  <p className="text-2xl font-semibold text-slate-900">{remainingCapacity}</p>
                </div>
              </div>
            </div>
            <CapacityBar used={totalBooked} total={totalCapacity} />
          </div>

          {bookingStats && bookingStats.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-semibold mb-3">
  Booking status
</p>
                <h2 className="text-xl font-semibold text-slate-900">Reservation breakdown</h2>
              </div>
              <div className="space-y-3">
                {bookingStats.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {stat._id === 'booked' ? 'Active' : 'Cancelled'} bookings
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${stat._id === 'booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {stat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
            Monitor capacity usage closely so customers can always find available delivery windows.
          </div>
        </div>
      )}
    </div>
  )
}
