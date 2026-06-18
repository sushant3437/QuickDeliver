import React from 'react'
import SlotList from '../components/slots/SlotList'

export default function Home(){
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.16em] text-blue-600 font-semibold mb-3">
  Available Delivery Slots
</p>
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Choose a convenient time for your delivery</h1>
          <p className="text-sm text-slate-600">Browse active delivery slots and reserve the best option for your schedule in a few clicks.</p>
        </div>
      </section>

      <SlotList />
    </div>
  )
}
