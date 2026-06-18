import React from "react";

export default function BookingModal({
  open,
  title = "Confirm Booking",
  children,
  onCancel,
  onConfirm,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        <div className="px-6 py-5 text-slate-700">
          {children}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 transition"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}