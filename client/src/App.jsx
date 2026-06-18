import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerBookings from './pages/customer/Bookings'
import AdminDashboard from './pages/admin/Dashboard'
import AdminSlots from './pages/admin/Slots'
import AdminBookings from './pages/admin/Bookings'
import AdminStats from './pages/admin/Stats'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import PageContainer from './components/layout/PageContainer'
import ProtectedRoute from './routes/ProtectedRoute'
import SlotDetails from './pages/SlotDetails'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/customer/*"
            element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>}
          />

          <Route
            path="/admin/*"
            element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
          />

          <Route
            path="/admin/slots"
            element={<ProtectedRoute role="admin"><AdminSlots /></ProtectedRoute>}
          />

          <Route
            path="/admin/bookings"
            element={<ProtectedRoute role="admin"><AdminBookings /></ProtectedRoute>}
          />

          <Route
            path="/admin/stats"
            element={<ProtectedRoute role="admin"><AdminStats /></ProtectedRoute>}
          />

          <Route
            path="/customer/bookings"
            element={<ProtectedRoute role="customer"><CustomerBookings /></ProtectedRoute>}
          />

          <Route path="/slot/:id" element={<SlotDetails />} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </PageContainer>
      <Footer />
    </div>
  )
}
