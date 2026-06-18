import React, { useEffect, useState } from 'react'
import { adminListBookings } from '../../api/bookings'
import { formatDateTime } from '../../utils/date'

const statusClasses = {
  cancelled: 'bg-rose-100 text-rose-700',
  booked: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-blue-100 text-blue-700',
}

function Row({ booking }) {
  const state = booking.status || 'booked'
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-5">
        <div className="font-semibold text-slate-900">{booking.user?.name || booking.user?.email || 'Customer'}</div>
        <div className="text-sm text-slate-500">{booking.user?.email || '—'}</div>
      </td>

      <td className="px-6 py-5">
        <div className="font-semibold text-slate-900">{booking.slot?.title || 'Unknown slot'}</div>
        <div className="text-sm text-slate-500 mt-1">
          {booking.slot?.startAt && booking.slot?.endAt
            ? `${formatDateTime(booking.slot.startAt)} — ${formatDateTime(booking.slot.endAt)}`
            : 'Slot details unavailable'}
        </div>
      </td>

      <td className="p-4 text-center">
        <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[state] || statusClasses.booked}`}>
          {state}
        </span>
      </td>

      <td className="p-4 text-center text-sm text-slate-500">
        {booking.createdAt ? formatDateTime(booking.createdAt) : '-'}
      </td>
    </tr>
  )
}

function SummaryCard({ label, value, tone }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${tone}`}>{value}</p>
    </div>
  )
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await adminListBookings()
      setBookings(data || [])
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to load bookings'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const totalBookings = bookings.length
  const activeBookings = bookings.filter((booking) => booking.status !== 'cancelled').length
  const cancelledBookings = bookings.filter((booking) => booking.status === 'cancelled').length

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-blue-600 font-semibold mb-3">
  Booking Management
</p>
            <h1 className="text-3xl font-semibold text-slate-900">Customer reservations</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Manage booking activity and review reservation details across the platform.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            <SummaryCard label="Total bookings" value={totalBookings} tone="text-slate-900" />
            <SummaryCard label="Active bookings" value={activeBookings} tone="text-emerald-900" />
            <SummaryCard label="Cancelled" value={cancelledBookings} tone="text-rose-900" />
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
          Loading bookings...
        </div>
      ) : totalBookings === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          No bookings found.
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] table-auto">
              <thead className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-[0.2em]">
                <tr>
                 <th className="p-4 text-blue-700 font-semibold">Customer</th>
<th className="p-4 text-blue-700 font-semibold">Slot details</th>
<th className="p-4 text-center text-blue-700 font-semibold">Status</th>
<th className="p-4 text-center text-blue-700 font-semibold">Booked at</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {bookings.map((booking) => (
                  <Row key={booking._id} booking={booking} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
