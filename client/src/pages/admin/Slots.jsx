import React, { useEffect, useState } from 'react'
import { adminListSlots, createSlot, updateSlot, deleteSlot } from '../../api/slots'
import { formatDateTime } from '../../utils/date'

export default function AdminSlots(){
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ title: '', startAt: '', endAt: '', capacity: 1, notes: '' })
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const data = await adminListSlots()
      setSlots(data || [])
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load slots')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const resetForm = () => {
    setForm({ title: '', startAt: '', endAt: '', capacity: 1, notes: '' })
    setEditingId(null)
  }

  const handleEdit = (s) => {
    setEditingId(s._id)
    setForm({
      title: s.title || '',
      startAt: s.startAt ? new Date(s.startAt).toISOString().slice(0,16) : '',
      endAt: s.endAt ? new Date(s.endAt).toISOString().slice(0,16) : '',
      capacity: s.capacity || 1,
      notes: s.meta?.notes || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const validateForm = () => {
    if (!form.title) return 'Title is required'
    if (!form.startAt || !form.endAt) return 'Start and end times are required'
    if (new Date(form.startAt) >= new Date(form.endAt)) return 'Start time must be before end time'
    if (!Number(form.capacity) || Number(form.capacity) < 1) return 'Capacity must be at least 1'
    return null
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const v = validateForm()
    if (v) { setError(v); return }
    setSaving(true); setError(null)
    const payload = {
      title: form.title,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      capacity: Number(form.capacity),
      meta: { notes: form.notes }
    }
    try{
      if (editingId){
        await updateSlot(editingId, payload)
      } else {
        await createSlot(payload)
      }
      resetForm();
      await load()
    }catch(err){
      setError(err?.response?.data?.message || err.message || 'Save failed')
    }finally{ setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this slot? This action cannot be undone.')) return
    try{
      setSaving(true)
      await deleteSlot(id)
      await load()
    }catch(err){
      setError(err?.response?.data?.message || err.message || 'Delete failed')
    }finally{ setSaving(false) }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Manage Delivery Slots</h1>
            <p className="text-sm text-slate-500">Create and maintain delivery availability in a clean admin panel.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Slot' : 'Create Slot'}</h2>
            <p className="text-sm text-slate-500">Use the form below to add or update a delivery slot.</p>
          </div>
          {error && <div className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span>Title</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Title"
              value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Capacity</span>
            <input
              type="number"
              min="1"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Capacity"
              value={form.capacity}
              onChange={e=>setForm({...form,capacity:e.target.value})}
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Start</span>
            <input
              type="datetime-local"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              value={form.startAt}
              onChange={e=>setForm({...form,startAt:e.target.value})}
            />
            <span className="text-xs text-slate-500">Select the start time in your local browser timezone.</span>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span>End</span>
            <input
              type="datetime-local"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              value={form.endAt}
              onChange={e=>setForm({...form,endAt:e.target.value})}
            />
            <span className="text-xs text-slate-500">Select the end time for the slot in local browser timezone.</span>
          </label>

          <label className="col-span-1 md:col-span-2 space-y-2 text-sm text-slate-700">
            <span>Notes (optional)</span>
            <textarea
              className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={e=>setForm({...form,notes:e.target.value})}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Slot'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
            >
              Reset
            </button>
          </div>
          <p className="text-sm text-slate-500">Slots are visible to customers when marked active.</p>
        </div>
      </form>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] table-auto">
          <thead className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-[0.2em]">
            <tr>
              <th className="p-4">Title / Time</th>
              <th className="p-4 text-center">Capacity</th>
              <th className="p-4 text-center">Booked</th>
              <th className="p-4 text-center">Remaining</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">Loading slots...</td></tr>
            ) : slots.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">No slots found.</td></tr>
            ) : slots.map(s => (
              <tr key={s._id} className="border-t hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{s.title}</div>
                  <div className="text-sm text-slate-500">{formatDateTime(s.startAt)} → {formatDateTime(s.endAt)}</div>
                </td>
                <td className="p-4 text-center text-slate-900">{s.capacity}</td>
                <td className="p-4 text-center text-slate-900">{s.bookedCount ?? 0}</td>
                <td className="p-4 text-center text-slate-900">{Math.max(0, (s.capacity || 0) - (s.bookedCount || 0))}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${s.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={()=>handleEdit(s)}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={()=>handleDelete(s._id)}
                      className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
