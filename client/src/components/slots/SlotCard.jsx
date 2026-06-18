import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime } from '../../utils/date'

export default function SlotCard({ slot }) {
  const { user } = useAuth()
  const available = slot.bookedCount < slot.capacity && slot.isActive
  const remaining = Math.max(0, (slot.capacity || 0) - (slot.bookedCount || 0))
  const capacityPercent = slot.capacity > 0 ? Math.round((slot.bookedCount / slot.capacity) * 100) : 0

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{slot.title}</h3>
          <p className="text-sm text-slate-500 mt-1">{formatDateTime(slot.startAt)} — {formatDateTime(slot.endAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${slot.bookedCount >= slot.capacity ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {slot.bookedCount >= slot.capacity ? 'Full' : 'Open'}
        </span>
      </div>

      {slot.meta?.location && (
        <div className="mb-5 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-medium text-slate-900 mb-1">Location</div>
          <div>{slot.meta.location}</div>
        </div>
      )}

      <div className="mb-5 rounded-3xl bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
          <span>Capacity</span>
          <span>{slot.bookedCount} / {slot.capacity}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${remaining > 0 ? 'bg-slate-900' : 'bg-rose-500'}`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
        <p className={`mt-3 text-sm font-medium ${remaining > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
          {remaining > 0 ? `${remaining} spot${remaining === 1 ? '' : 's'} available` : 'Fully booked'}
        </p>
      </div>

      <Link
        to={`/slot/${slot._id}`}
        className={`block w-full rounded-2xl px-4 py-3 text-sm font-semibold text-center transition ${available ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
      >
        {available ? 'View & Book' : 'Fully Booked'}
      </Link>
    </div>
  )
}
