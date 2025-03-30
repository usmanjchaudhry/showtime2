import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import './scss/style.scss' // Ensure this path is correct
import { auth } from './firebase' // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth'

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Public Pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule')) // Assuming Schedule is public

// Auth Pages (restricted if logged in)
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

// Protected Pages
const Memberships = React.lazy(() => import('./views/membership/Membership'))
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm'))
// *** NEW: Import the QRCodePage component ***
const QRCodePage = React.lazy(() => import('./views/pages/qrcode/QRCodePage'))
// ******************************************

// Error Pages
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// --- Helper Components for Route Protection ---

// ProtectedRoute: only allows access if user is logged in
function ProtectedRoute({ user, children }) {
  // If the user state is still resolving (e.g., initial check hasn't finished),
  // you might want to show a loading indicator instead of redirecting immediately.
  // However, the current implementation redirects if `user` is null.
  if (user === undefined) {
     // Optional: Show loading spinner while auth state resolves
     // This prevents redirecting before auth check completes
     return (
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
     );
  }

  if (!user) {
    // If not logged in (and auth check finished), redirect to login
    return <Navigate to="/login" replace /> // Use replace to avoid login in history
  }
  // If logged in, render the requested component
  return children
}

// RestrictedRoute: only allows access if user is logged out
function RestrictedRoute({ user, children }) {
   if (user === undefined) {
      // Optional: Show loading spinner while auth state resolves
      return (
         <div className="pt-3 text-center">
           <CSpinner color="primary" variant="grow" />
         </div>
      );
   }

  if (user) {
    // If already logged in (and auth check finished), redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }
  // If logged out, render the requested component (Login/Register)
  return children
}

// --- Main App Component ---
const App = () => {
  // Initialize user state to undefined to represent "loading" or "unresolved"
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Update state: currentUser will be null if logged out, or user object if logged in
      setUser(currentUser)
    })
    // Cleanup listener on component unmount
    return () => unsubscribe()
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <HashRouter>
      <Suspense
        fallback={
          // Global fallback spinner for lazy loaded components
          <div className="pt-3 text-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* =====================
               ROUTES INSIDE DEFAULT LAYOUT (Header, Sidebar, etc.)
               ===================== */}
          <Route path="/" element={<DefaultLayout />}>
            {/* Publicly accessible routes within the layout */}
            {/* index route for '/' -> renders Dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            {/* Add other public routes like Trainers if they use DefaultLayout */}
            {/* <Route path="trainers" element={<Trainers />} /> */}

            {/* PROTECTED ROUTES (require login) */}
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
            {/* *** NEW: Add the QRCodePage route definition *** */}
            <Route
              path="qrcode" // Path matches the link in AppHeader
              element={
                <ProtectedRoute user={user}> {/* Protect this route */}
                  <QRCodePage />            {/* Render the component */}
                </ProtectedRoute>
              }
            />
            {/* ********************************************* */}

            {/* Add other protected routes here */}

          </Route> {/* End of DefaultLayout routes */}


          {/* =====================
               ROUTES OUTSIDE DEFAULT LAYOUT
               ===================== */}

          {/* RESTRICTED ROUTES (Login/Register - only for logged-out users) */}
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

          {/* ERROR PAGES */}
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />


          {/* =====================
               CATCH-ALL / FALLBACK
               ===================== */}
          {/* This will catch any route not matched above */}
          {/* Redirects to dashboard, or could show Page404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          {/* Or redirect to 404: <Route path="*" element={<Navigate to="/404" replace />} /> */}

        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App