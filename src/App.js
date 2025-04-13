// src/App.js

import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import './scss/style.scss'

// Firebase
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Page Imports
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule'))
const Memberships = React.lazy(() => import('./views/membership/Membership'))
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm'))
const QRCodePage = React.lazy(() => import('./views/pages/qrcode/QRCodePage'))
const KioskCheckinPage = React.lazy(() => import('./views/kiosk/KioskCheckinPage'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// NEW: Admin Check-ins Page
const AdminCheckinsPage = React.lazy(() => import('./views/admin/AdminCheckinPage'))

// ---- Route Guard Components ----

// 1) ProtectedRoute: requires login
function ProtectedRoute({ user, userDataLoading, children }) {
  const location = useLocation()
  if (user === undefined || userDataLoading) {
    return (
      <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

// 2) RestrictedRoute: requires NOT logged in
function RestrictedRoute({ user, userDataLoading, children }) {
  if (user === undefined || userDataLoading) {
    return (
      <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// 3) AdminRoute: requires user && isAdmin
function AdminRoute({ user, userData, userDataLoading, children }) {
  const location = useLocation()
  const isAdmin = !!(userData && userData.isAdmin === true)

  if (user === undefined || userDataLoading) {
    return (
      <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center">
        <CSpinner color="primary" />
      </div>
    )
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (!isAdmin) {
    console.warn('AdminRoute: Access denied for non-admin user.')
    return <Navigate to="/dashboard" replace />
  }
  return children
}

// ---- Main App Component ----
const App = () => {
  const [user, setUser] = useState(undefined)    // undefined = initial loading
  const [userData, setUserData] = useState(null) // Firestore data { isAdmin, etc. }
  const [userDataLoading, setUserDataLoading] = useState(true)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log('App.js: Auth State Changed. Current User:', currentUser?.uid || 'null')
      setUser(currentUser)

      if (currentUser) {
        // If user changed or we have no userData, fetch Firestore doc
        if (!userData || userData.uid !== currentUser.uid) {
          setUserDataLoading(true)
          const userDocRef = doc(db, 'users', currentUser.uid)
          console.log(`App.js: Attempting to fetch Firestore doc for user ${currentUser.uid}...`)
          try {
            const docSnap = await getDoc(userDocRef)
            if (docSnap.exists()) {
              const fetchedData = docSnap.data()
              console.log('App.js: Fetched Firestore User Data:', fetchedData)
              setUserData({ uid: currentUser.uid, ...fetchedData })
            } else {
              console.warn('App.js: No Firestore document found for user:', currentUser.uid)
              setUserData({ uid: currentUser.uid }) // minimal info
            }
          } catch (error) {
            console.error('App.js: Error fetching user Firestore data:', error)
            setUserData({ uid: currentUser.uid }) // fallback
          } finally {
            setUserDataLoading(false)
          }
        } else {
          // Same user as before; ensure loading is false
          if (userDataLoading) setUserDataLoading(false)
        }
      } else {
        // Logged out
        setUserData(null)
        setUserDataLoading(false)
      }
    })

    return () => {
      console.log('App.js: Cleaning up auth listener.')
      unsubscribeAuth()
    }
  }, [userData, userDataLoading])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center">
            <CSpinner color="primary" />
          </div>
        }
      >
        <Routes>
          {/* Restricted Routes (only for logged-out users) */}
          <Route
            path="/login"
            element={
              <RestrictedRoute user={user} userDataLoading={userDataLoading}>
                <Login />
              </RestrictedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RestrictedRoute user={user} userDataLoading={userDataLoading}>
                <Register />
              </RestrictedRoute>
            }
          />

          {/* Admin-only Kiosk page (outside DefaultLayout) */}
          <Route
            path="/kiosk"
            element={
              <AdminRoute user={user} userData={userData} userDataLoading={userDataLoading}>
                <KioskCheckinPage />
              </AdminRoute>
            }
          />

          {/* Main app routes (inside DefaultLayout) */}
          <Route
            path="/"
            element={
              <DefaultLayout user={user} userData={userData} />
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />

            {/* Protected routes (login required) */}
            <Route
              path="memberships"
              element={
                <ProtectedRoute user={user} userDataLoading={userDataLoading}>
                  <Memberships />
                </ProtectedRoute>
              }
            />
            <Route
              path="consent"
              element={
                <ProtectedRoute user={user} userDataLoading={userDataLoading}>
                  <ConsentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="qrcode"
              element={
                <ProtectedRoute user={user} userDataLoading={userDataLoading}>
                  <QRCodePage />
                </ProtectedRoute>
              }
            />

            {/* New Admin-only route for Check-Ins inside default layout */}
            <Route
              path="admin/check-ins"
              element={
                <AdminRoute user={user} userData={userData} userDataLoading={userDataLoading}>
                  <AdminCheckinsPage />
                </AdminRoute>
              }
            />
          </Route>

          {/* Error pages */}
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />

          {/* Catch-all: redirect to /dashboard or /404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
