import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import './scss/style.scss'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Public Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule'))

// Auth Pages (restricted if logged in)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

// Protected Pages
const Memberships = React.lazy(() => import('./views/membership/Membership'))
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm'))

// Error Pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// A ProtectedRoute: only for logged-in users
function ProtectedRoute({ user, children }) {
  if (!user) {
    // If not logged in, go to login
    return <Navigate to="/login" />
  }
  return children
}

// A RestrictedRoute: only for logged-out users
function RestrictedRoute({ user, children }) {
  if (user) {
    // If already logged in, go to dashboard
    return <Navigate to="/dashboard" />
  }
  return children
}

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* =====================
              PUBLIC LAYOUT
             ===================== */}
          <Route path="/" element={<DefaultLayout />}>
            {/* Publicly accessible routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />

            {/* PROTECTED ROUTES (for logged-in users) */}
            <Route
              path="memberships"
              element={
                <ProtectedRoute user={user}>
                  <Memberships />
                </ProtectedRoute>
              }
            />
            <Route
              path="consent"
              element={
                <ProtectedRoute user={user}>
                  <ConsentForm />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* =====================
              RESTRICTED ROUTES
              (only if logged-out)
             ===================== */}
          <Route
            path="/login"
            element={
              <RestrictedRoute user={user}>
                <Login />
              </RestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute user={user}>
                <Register />
              </RestrictedRoute>
            }
          />

          {/* =====================
              ERROR / CATCH-ALL
             ===================== */}
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Fallback for any unmatched route -> redirect to /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
