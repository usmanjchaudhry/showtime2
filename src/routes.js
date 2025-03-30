import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Schedule = React.lazy(() => import('./views/schedule/Schedule.js'))
const Trainers = React.lazy(() => import('./views/trainer/Trainer.js'))
const Login = React.lazy(() => import('./views/pages/login/Login.js'))
const Register = React.lazy(() => import('./views/pages/register/Register.js'))
const Membership = React.lazy(() => import('./views/membership/Membership.js'))
const QRCodePage = React.lazy(() => import('./views/pages/qrcode/QRCodePage.js'))
// NEW: Lazy import the ConsentForm
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm.js'))

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

]

export default routes
