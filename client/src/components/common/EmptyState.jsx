import React from 'react'

export default function EmptyState({ title, message, action }) {
  return (
    <div className="text-center py-12 px-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-6">{message}</p>
      {action && (
        <div className="inline-flex">{action}</div>
      )}
    </div>
  )
}
