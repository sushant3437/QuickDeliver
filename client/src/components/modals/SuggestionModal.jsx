import React from "react";
import { formatDateTime } from "../../utils/date";

export default function SuggestionModal({
  open,
  suggestion,
  onClose,
  onAccept,
  loading,
}) {
  if (!open || !suggestion) return null;

  const s = suggestion;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Slot Fully Booked
          </h3>
        </div>

        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-slate-600">
            This slot is full. You can book the next available slot.
          </p>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">
              {s.title}
            </p>

            <p className="text-sm text-slate-600 mt-1">
              {formatDateTime(s.startAt)} — {formatDateTime(s.endAt)}
            </p>

            <p className="mt-2 text-sm font-medium text-green-700">
              {Math.max(0, s.capacity - s.bookedCount)} spots available
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            Close
          </button>

          <button
            onClick={() => onAccept(s)}
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 transition"
          >
            {loading ? "Booking..." : "Book Alternative"}
          </button>
        </div>
      </div>
    </div>
  );
}