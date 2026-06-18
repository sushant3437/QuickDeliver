import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSlot } from '../api/slots'
import { createBooking } from '../api/bookings'
import { useAuth } from '../context/AuthContext'
import BookingModal from '../components/modals/BookingModal'
import SuggestionModal from '../components/modals/SuggestionModal'
import Loading from '../components/common/Loading'
import Alert from '../components/common/Alert'
import EmptyState from '../components/common/EmptyState'
import { formatDateTime } from '../utils/date'

export default function SlotDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [slot, setSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [suggestionOpen, setSuggestionOpen] = useState(false)
  const [suggestion, setSuggestion] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const s = await getSlot(id)
        if (mounted) setSlot(s)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load slot')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [id])

  const onStartBooking = () => {
    if (!user) return navigate('/login')
    if (user.role === 'admin') return
    setConfirmOpen(true)
  }

  const confirmBooking = async (slotToBookId) => {
    setBookingLoading(true)
    try {
      await createBooking(slotToBookId || slot._id)
      setConfirmOpen(false)
      setSuccess('Booking confirmed successfully! Redirecting...')
      setTimeout(() => navigate('/customer/bookings', { replace: true }), 2000)
    } catch (err) {
      const payload = err.response?.data || err
      const s = payload?.details?.suggestion || payload?.suggestion
      if (s) {
        setSuggestion(s)
        setSuggestionOpen(true)
        setConfirmOpen(false)
      } else {
        setError(payload?.message || err.message || 'Booking failed')
      }
    } finally {
      setBookingLoading(false)
    }
  }

  const acceptSuggestion = async (s) => {
    setBookingLoading(true)
    try {
      const idToBook = s.id || s._id
      await createBooking(idToBook)
      setSuggestionOpen(false)
      setSuccess('Booking confirmed successfully! Redirecting...')
      setTimeout(() => navigate('/customer/bookings', { replace: true }), 2000)
    } catch (err) {
      const payload = err.response?.data || err
      setError(payload?.message || err.message || 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <Loading text="Loading slot details..." />
  
  if (!slot) return (
    <EmptyState
      title="Slot Not Found"
      message="This delivery slot doesn't exist or has been removed."
      action={<button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition">Back to slots</button>}
    />
  )

  if (error) return (
    <Alert 
      type="error" 
      title="Error Loading Slot" 
      message={error}
      onClose={() => setError(null)}
    />
  )

  const available = slot.bookedCount < slot.capacity && slot.isActive
  const remaining = Math.max(0, (slot.capacity || 0) - (slot.bookedCount || 0))
  const capacityPercent = slot.capacity > 0 ? Math.round((slot.bookedCount / slot.capacity) * 100) : 0

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/')} 
        className="text-slate-700 hover:text-slate-900 text-sm font-medium"
      >
        Back to slots
      </button>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500 mb-2">Slot Details</p>
              <h1 className="text-3xl font-semibold text-slate-900">{slot.title}</h1>
              <p className="mt-2 text-sm text-slate-600">Reserve a delivery window with simple, predictable scheduling.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 border border-slate-200 text-slate-700">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Available</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{remaining} spots</p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-6 sm:px-8 sm:py-8 space-y-6">
          {success && (
            <Alert type="success" title="Success!" message={success} />
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">Start</p>
              <p className="text-lg font-semibold text-slate-900">{formatDateTime(slot.startAt)}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">End</p>
              <p className="text-lg font-semibold text-slate-900">{formatDateTime(slot.endAt)}</p>
            </div>
          </div>

          {slot.meta?.location && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">Location</p>
              <p className="text-slate-900">{slot.meta.location}</p>
            </div>
          )}

          {slot.meta?.notes && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-3">Additional info</p>
              <p className="text-slate-900">{slot.meta.notes}</p>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-2">Occupancy</p>
                <p className="text-xl font-semibold text-slate-900">{slot.bookedCount} / {slot.capacity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-2">Usage</p>
                <p className="text-xl font-semibold text-slate-900">{capacityPercent}%</p>
              </div>
            </div>
            <div className="mt-4 rounded-full bg-slate-200 h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${remaining > 0 ? 'bg-slate-900' : 'bg-rose-500'}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            <p className={`mt-3 text-sm font-medium ${remaining > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {remaining > 0 ? `${remaining} spot${remaining === 1 ? '' : 's'} available` : 'Fully booked'}
            </p>
          </div>

          {user?.role === 'admin' ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 text-center">
              Admin users cannot book slots from this view.
            </div>
          ) : (
            <button
              onClick={onStartBooking}
              disabled={bookingLoading || !available}
              className={`w-full rounded-3xl px-6 py-4 text-sm font-semibold transition ${available ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-500 cursor-not-allowed'}`}
            >
              {bookingLoading ? 'Processing...' : available ? 'Book this slot' : 'Fully booked'}
            </button>
          )}
        </div>
      </div>

      <BookingModal
        open={confirmOpen}
        title={`Confirm Booking: ${slot.title}`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => confirmBooking()}
        loading={bookingLoading}
      >
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Slot:</span> {slot.title}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Date & Time:</span> {formatDateTime(slot.startAt)}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Once confirmed, you can view and manage this booking from your booking history.
          </p>
        </div>
      </BookingModal>

      <SuggestionModal
        open={suggestionOpen}
        suggestion={suggestion}
        onClose={() => setSuggestionOpen(false)}
        onAccept={(s) => acceptSuggestion(s)}
        loading={bookingLoading}
      />
    </div>
  )
}
