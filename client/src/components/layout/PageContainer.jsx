import React from 'react'

export default function PageContainer({ children }) {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 pt-24 pb-8">
      {children}
    </main>
  )
}