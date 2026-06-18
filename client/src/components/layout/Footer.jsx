import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-semibold text-slate-900">
              QuickDeliver
            </h3>
            <p className="text-sm text-slate-600">
              Smart delivery slot scheduling made simple.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex items-center gap-5 text-sm">
            <button className="text-slate-600 hover:text-blue-600 transition">
              Privacy Policy
            </button>
            <button className="text-slate-600 hover:text-blue-600 transition">
              Terms
            </button>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} QuickDeliver
          </p>

        </div>
      </div>
    </footer>
  )
}