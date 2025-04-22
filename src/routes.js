// src/routes.js
import React from 'react'

// Existing lazy imports
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule.js'))
const Trainers = React.lazy(() => import('./views/trainer/Trainer.js'))
const Login = React.lazy(() => import('./views/pages/login/Login.js'))
const Register = React.lazy(() => import('./views/pages/register/Register.js'))
const Membership = React.lazy(() => import('./views/membership/Membership.js'))
const QRCodePage = React.lazy(() => import('./views/pages/qrcode/QRCodePage.js'))
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm.js'))
const KioskCheckinPage = React.lazy(() => import('./views/kiosk/KioskCheckinPage.js'))

// NEW: AdminCheckinsPage
const AdminCheckinsPage = React.lazy(() => import('./views/admin/AdminCheckinPage.js'))

// NEW: AdminAllUsersPage (the page that lists all users)
const AdminAllUsersPage = React.lazy(() => import('./views/admin/AdminAllUsersPage.js'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/schedule', name: 'Schedule', element: Schedule },
  { path: '/trainers', name: 'Trainers', element: Trainers },
  { path: '/login', name: 'Login', element: Login },
  { path: '/register', name: 'Register', element: Register },
  { path: '/memberships', name: 'Membership', element: Membership },
  { path: '/consent', name: 'Consent', element: ConsentForm },
  { path: '/qrcode', name: 'QR Code', element: QRCodePage },
  { path: '/kiosk', name: 'Kiosk', element: KioskCheckinPage, adminOnly: true },

  // Admin check-ins route
  { path: '/admin/check-ins', name: 'AdminCheckIns', element: AdminCheckinsPage, adminOnly: true },

  // NEW: Admin All Users route
  { path: '/admin/all-users', name: 'AdminAllUsers', element: AdminAllUsersPage, adminOnly: true },
]

export default routes
