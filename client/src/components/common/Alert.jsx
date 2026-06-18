import React from 'react'

const styleMap = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-rose-50 border-rose-200 text-rose-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-slate-50 border-slate-200 text-slate-900',
}

export default function Alert({ type = 'info', title, message, onClose }) {
  return (
    <div className={`border rounded-lg p-4 bg-white shadow-sm ${styleMap[type]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          {title && <p className="text-sm font-semibold text-slate-900">{title}</p>}
          <p className="text-sm text-slate-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
