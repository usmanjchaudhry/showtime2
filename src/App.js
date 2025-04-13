import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import { CSpinner, CContainer } from '@coreui/react';
import './scss/style.scss'; // Ensure this path is correct
import { auth } from './firebase'; // Ensure this path is correct
import { onAuthStateChanged } from 'firebase/auth';
// Import Firestore functions
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Layout
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Page Imports (Assuming paths are correct)
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Schedule = React.lazy(() => import('./views/schedule/Schedule'));
const Memberships = React.lazy(() => import('./views/membership/Membership'));
const ConsentForm = React.lazy(() => import('./views/consent/ConsentForm'));
const QRCodePage = React.lazy(() => import('./views/pages/qrcode/QRCodePage'));
const KioskCheckinPage = React.lazy(() => import('./views/kiosk/KioskCheckinPage')); // Import Kiosk Page
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

// --- Route Guard Components ---

// Protected: Requires login
function ProtectedRoute({ user, userDataLoading, children }) {
  const location = useLocation();
  // Show loading if auth state OR Firestore data is loading
  if (user === undefined || userDataLoading) {
    return <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center"><CSpinner color="primary" /></div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Restricted: Requires NO login (e.g., for Login/Register pages)
function RestrictedRoute({ user, userDataLoading, children }) {
  if (user === undefined || userDataLoading) {
    return <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center"><CSpinner color="primary" /></div>;
  }
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// Admin: Requires login AND isAdmin === true in Firestore userData
function AdminRoute({ user, userData, userDataLoading, children }) {
    const location = useLocation();
    const isAdmin = !!(userData && userData.isAdmin === true); // Check isAdmin status

    if (user === undefined || userDataLoading) {
       return <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center"><CSpinner color="primary" /></div>;
    }
    if (!user) { // Not logged in
       return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!isAdmin) { // Logged in but NOT admin
       console.warn("AdminRoute: Access denied for non-admin user.");
       return <Navigate to="/dashboard" replace />; // Or redirect to an "Access Denied" page
    }
    // If all checks pass (loading done, logged in, isAdmin true)
    return children;
 }

// --- Main App Component ---
const App = () => {
  // State for Firebase Auth user object
  const [user, setUser] = useState(undefined); // undefined = initial loading state
  // State for Firestore user data { isAdmin, ... }
  const [userData, setUserData] = useState(null);
  // State to track if Firestore data is loading
  const [userDataLoading, setUserDataLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore(); // Initialize Firestore

    // Listen for Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      console.log("App.js: Auth State Changed. Current User:", currentUser?.uid || 'null');
      setUser(currentUser); // Update auth user state

      if (currentUser) {
        // If user is logged IN, fetch their Firestore data
        if (!userData || userData.uid !== currentUser.uid) { // Fetch only if data is missing or user changed
            setUserDataLoading(true);
            const userDocRef = doc(db, 'users', currentUser.uid);
            console.log(`App.js: Attempting to fetch Firestore doc for user ${currentUser.uid}...`);
            try {
              const docSnap = await getDoc(userDocRef);
              if (docSnap.exists()) {
                const fetchedData = docSnap.data();
                // *** CONSOLE LOG TO VERIFY FETCHED DATA ***
                console.log("App.js: Fetched Firestore User Data:", fetchedData);
                console.log("App.js: isAdmin field value:", fetchedData.isAdmin);
                // ******************************************
                setUserData({ uid: currentUser.uid, ...fetchedData }); // Store fetched data
              } else {
                console.warn("App.js: No Firestore document found for user:", currentUser.uid);
                setUserData({ uid: currentUser.uid }); // Store UID only if no doc
              }
            } catch (error) {
              console.error("App.js: Error fetching user Firestore data:", error);
              setUserData({ uid: currentUser.uid }); // Store UID on error
            } finally {
              setUserDataLoading(false); // Finish loading Firestore data
            }
        } else {
             // User is the same, no need to refetch, ensure loading is false
             if (userDataLoading) setUserDataLoading(false);
        }
      } else {
        // User is logged OUT, clear Firestore data and finish loading
        setUserData(null);
        setUserDataLoading(false);
      }
    });

    // Cleanup auth listener
    return () => {
        console.log("App.js: Cleaning up auth listener.");
        unsubscribeAuth();
    }
  }, []); // Run only once on mount

  return (
    <HashRouter>
      <Suspense fallback={ <div className="pt-3 text-center vh-100 d-flex align-items-center justify-content-center"><CSpinner color="primary" /></div> }>
        <Routes>
          {/* Login/Register (Outside DefaultLayout, restricted) */}
          <Route path="/login" element={ <RestrictedRoute user={user} userDataLoading={userDataLoading}><Login /></RestrictedRoute>} />
          <Route path="/register" element={ <RestrictedRoute user={user} userDataLoading={userDataLoading}><Register /></RestrictedRoute>} />

          {/* KIOSK ROUTE (Outside DefaultLayout, Admin Only) */}
          <Route
            path="/kiosk"
            element={
                <AdminRoute user={user} userData={userData} userDataLoading={userDataLoading}>
                    <KioskCheckinPage />
                </AdminRoute>
            }
          />

          {/* Main Application Routes (Inside DefaultLayout) */}
          {/* Pass state down for use in nested components like Header/Sidebar/Guards */}
          <Route path="/" element={<DefaultLayout user={user} userData={userData} />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />

            {/* Protected Routes (for any logged-in user) */}
            <Route path="memberships" element={ <ProtectedRoute user={user} userDataLoading={userDataLoading}><Memberships /></ProtectedRoute>} />
            <Route path="consent" element={ <ProtectedRoute user={user} userDataLoading={userDataLoading}><ConsentForm /></ProtectedRoute>} />
            <Route path="qrcode" element={ <ProtectedRoute user={user} userDataLoading={userDataLoading}><QRCodePage /></ProtectedRoute>} />

            {/* ADMIN Routes (Admin Only) */}
            <Route
              path="admin/check-ins"
              element={
                <AdminRoute user={user} userData={userData} userDataLoading={userDataLoading}>
                </AdminRoute>
              }
            />
            {/* Add other admin routes here */}
          </Route>

           {/* Error pages & Catch all */}
           <Route path="/404" element={<Page404 />} />
           <Route path="/500" element={<Page500 />} />
           <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Or to /404 */}

        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;