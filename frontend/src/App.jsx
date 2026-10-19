import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import HomePage        from './pages/HomePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import ServicesPage    from './pages/ServicesPage'
import ServiceDetail   from './pages/ServiceDetailPage'
import DashboardPage   from './pages/DashboardPage'
import ProfilePage     from './pages/ProfilePage'
import BookingsPage    from './pages/BookingsPage'
import MessagesPage    from './pages/MessagesPage'
import CreateService   from './pages/CreateServicePage'
import EditService     from './pages/EditServicePage'
import ProviderProfile from './pages/ProviderProfilePage'
import OAuth2Redirect  from './pages/OAuth2RedirectPage'
import NotFound        from './pages/NotFoundPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: "'Plus Jakarta Sans', sans-serif", borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#6272f3', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/"              element={<HomePage />} />
          <Route path="/services"      element={<ServicesPage />} />
          <Route path="/services/:id"  element={<ServiceDetail />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />
          <Route path="/auth/callback" element={<OAuth2Redirect />} />

          {/* Guest-only */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Protected */}
          <Route path="/dashboard"        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile"          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/bookings"         element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
          <Route path="/messages"         element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/messages/:userId" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/services/new"     element={<ProtectedRoute><CreateService /></ProtectedRoute>} />
          <Route path="/services/:id/edit" element={<ProtectedRoute><EditService /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
