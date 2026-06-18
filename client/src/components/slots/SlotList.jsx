import React, { useEffect, useState } from 'react'
import { listSlots } from '../../api/slots'
import SlotCard from './SlotCard'
import Loading from '../common/Loading'
import EmptyState from '../common/EmptyState'
import Alert from '../common/Alert'
import { Link } from 'react-router-dom'

export default function SlotList(){
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      try {
        const data = await listSlots()
        if (mounted) setSlots(data)
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load slots')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [])

  if (loading) return <Loading text="Loading available slots..." />
  
  if (error) return (
    <Alert 
      type="error" 
      title="Error" 
      message={error}
      onClose={() => setError(null)}
    />
  )

  if (slots.length === 0) return (
    <EmptyState
      icon="📭"
      title="No Slots Available"
      message="There are currently no delivery slots available. Please check back later."
    />
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {slots.map(s => (
        <SlotCard key={s._id} slot={s} />
      ))}
    </div>
  )
}
