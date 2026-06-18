import React, { useEffect, useState } from 'react'
import { listBookings, cancelBooking } from '../../api/bookings'
import { formatDateTime } from '../../utils/date'

function CancelModal({ open, booking, onCancel, onConfirm, loading }) {
  if (!open || !booking) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Cancel Booking?</h3>
          <p className="mt-1 text-sm text-slate-500">This action will cancel your reservation and free the slot for other customers.</p>
        </div>
        <div className="px-6 py-6 text-slate-700 space-y-4">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Slot</p>
            <p className="mt-1 font-semibold text-slate-900">{booking.slot?.title}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Date & time</p>
            <p className="mt-1 font-semibold text-slate-900">{formatDateTime(booking.slot?.startAt)}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 transition"
          >
            {loading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BookingRow({ booking, onCancelClick, showReason }) {
  const isActive = booking.status === 'booked'
  const statusLabel = booking.status === 'cancelled_by_admin' ? 'Cancelled by admin' : isActive ? 'Active' : 'Cancelled'

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-5">
        <div className="font-medium text-slate-900">{booking.slot?.title || 'Unknown slot'}</div>
        <div className="text-sm text-slate-500 mt-1">
          {booking.slot?.startAt && booking.slot?.endAt
            ? `${formatDateTime(booking.slot.startAt)} — ${formatDateTime(booking.slot.endAt)}`
            : 'Slot details unavailable'}
        </div>
      </td>
      <td className="p-3 text-center">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            isActive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {statusLabel}
        </span>
      </td>
      <td className="p-3 text-center text-sm text-slate-500">
        {booking.createdAt ? formatDateTime(booking.createdAt) : '-'}
      </td>
      {showReason && (
        <td className="p-3 text-sm text-slate-500 text-left">
          {booking.metadata?.reason || 'No cancellation reason provided'}
        </td>
      )}
      <td className="p-3 text-center">
        {isActive ? (
          <button
            onClick={() => onCancelClick(booking)}
            className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
          >
            Cancel
          </button>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        )}
      </td>
    </tr>
  )
}

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const loadBookings = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await listBookings()
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

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking)
    setCancelModalOpen(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return
    setCancelLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await cancelBooking(selectedBooking._id)
      setSuccess('Booking cancelled successfully.')
      setCancelModalOpen(false)
      setSelectedBooking(null)
      await loadBookings()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Failed to cancel booking'
      )
    } finally {
      setCancelLoading(false)
    }
  }

  const handleCancelModalClose = () => {
    setCancelModalOpen(false)
    setSelectedBooking(null)
  }

  const activeBookings = bookings.filter((b) => b.status === 'booked')
  const cancelledBookings = bookings.filter((b) => b.status !== 'booked')

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-blue-600 font-semibold mb-2">
  My Bookings
</p>
            <h1 className="text-3xl font-semibold text-slate-900">Delivery reservations</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Review your active and cancelled bookings in one modern, easy-to-scan view.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">Active</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{activeBookings.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">Cancelled</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{cancelledBookings.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4 text-center">
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{bookings.length}</p>
            </div>
          </div>
        </div>
      </section>

      {success && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600 shadow-sm">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-slate-500 shadow-sm">
          No bookings yet. Start by booking a slot!
        </div>
      ) : (
        <div className="space-y-6">
          {activeBookings.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Active Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4 text-blue-700 font-semibold">Slot</th>
<th className="px-6 py-4 text-blue-700 font-semibold">Status</th>
<th className="px-6 py-4 text-blue-700 font-semibold">Booked At</th>
<th className="px-6 py-4 text-blue-700 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {activeBookings.map((b) => (
                      <BookingRow
                        key={b._id}
                        booking={b}
                        onCancelClick={handleCancelClick}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {cancelledBookings.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Cancelled Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-6 py-4 text-sm uppercase tracking-[0.16em] text-blue-600 font-bold">
  Slot
</th>
<th className="px-6 py-4 text-sm uppercase tracking-[0.16em] text-blue-600 font-bold">
  Status
</th>
<th className="px-6 py-4 text-sm uppercase tracking-[0.16em] text-blue-600 font-bold">
  Cancelled At
</th>
<th className="px-6 py-4 text-sm uppercase tracking-[0.16em] text-blue-600 font-bold">
  Reason
</th>
<th className="px-6 py-4 text-center text-blue-600 font-bold">
  —
</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {cancelledBookings.map((b) => (
                      <BookingRow
                        key={b._id}
                        booking={b}
                        onCancelClick={() => {}}
                        showReason
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <CancelModal
        open={cancelModalOpen}
        booking={selectedBooking}
        onCancel={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        loading={cancelLoading}
      />
    </div>
  )
}
