import React, { useState, useEffect } from 'react'
import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavbarNav,
  CNavItem,
  CNavLink,
  CButton,
} from '@coreui/react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase' // Assuming firebase config is here
import ShowtimeLogo from '../assets/images/SHOWTIME_LOGO_BLACK-removebg-preview.png' // Adjust path if needed
import { useNavigate } from 'react-router-dom'

const AppHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsExpanded(false) // Collapse navbar on logout
      navigate('/dashboard') // Navigate to home after logout
    } catch (error) {
      console.error('Logout failed:', error)
      // Optionally: Show an error message to the user
    }
  }

  // Function to handle navigation and collapse the navbar
  const handleNavClick = (path) => {
      // Use navigate for internal routing
      navigate(path);
      // Collapse the navbar (especially important on mobile)
      setIsExpanded(false);
  };


  return (
    <>
      <style>
         {`
           /* --- Your existing styles --- */
           .nav-link-hover-underline {
             position: relative;
             overflow: hidden;
             cursor: pointer; /* Add cursor pointer for clickable links */
           }

           .nav-link-hover-underline::after {
             content: '';
             position: absolute;
             bottom: 0;
             left: 0;
             width: 0%;
             height: 2px;
             background-color: currentColor;
             transition: width 0.3s ease-in-out;
           }

           .nav-link-hover-underline:hover::after {
             width: 100%;
           }
           /* --- End existing styles --- */
         `}
      </style>

      <CNavbar expand="lg" className="bg-white shadow" placement="sticky-top">
        <CContainer fluid>
          {/* Logo & Brand - Use onClick for SPA navigation */}
          <div onClick={() => handleNavClick('/dashboard')} style={{ cursor: 'pointer' }}>
            <img src={ShowtimeLogo} alt="Showtime Logo" width={80} height={80} />
          </div>
          <CNavbarBrand
            onClick={() => handleNavClick('/dashboard')}
            className="text-black fw-bold ps-2 d-none d-lg-block"
            style={{ cursor: 'pointer' }}
            >
            Showtime Boxing
          </CNavbarBrand>
           {/* Mobile brand also clickable */}
          <CNavbarBrand
            onClick={() => handleNavClick('/dashboard')}
            className="text-black fw-bold ps-2 d-block d-lg-none"
            style={{ cursor: 'pointer' }}
            />


          {/* Toggler (for mobile) */}
          <CNavbarToggler
            className="border" // Removed bg-black, style as needed
            aria-label="Toggle navigation"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />

          {/* Collapsible Nav */}
          <CCollapse className="navbar-collapse" visible={isExpanded}>
            {/* Use justify-content-end to push items to the right */}
            <CNavbarNav className="ms-auto mb-2 mb-lg-0 align-items-lg-center"> {/* Align items center on large screens */}

              {/* --- Links always visible --- */}
              <CNavItem>
                 {/* Use onClick for SPA navigation */}
                <CNavLink
                    onClick={() => handleNavClick('/dashboard')}
                    className="nav-link-hover-underline text-black"
                    > {/* Removed style cursor, handled by class */}
                  Home
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                    onClick={() => handleNavClick('/schedule')}
                    className="nav-link-hover-underline text-black"
                    >
                  Schedule
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                    onClick={() => handleNavClick('/memberships')}
                    className="nav-link-hover-underline text-black"
                    >
                  Memberships
                </CNavLink>
              </CNavItem>

              {/* --- Conditional Links (Logged In/Out) --- */}
              {user ? (
                <>
                  {/* Logged-in Links */}

                  {/* *** NEW QR CODE LINK *** */}
                  <CNavItem>
                     <CNavLink
                        onClick={() => handleNavClick('/qrcode')} // Navigate to the new QR code page route
                        className="nav-link-hover-underline text-black"
                        >
                        My QR Code {/* Or just "QR Code" */}
                     </CNavLink>
                  </CNavItem>
                  {/* *********************** */}

                  <CNavItem className="ms-lg-2"> {/* Add margin for spacing on large screens */}
                     {/* Use a button-like appearance for Logout */}
                    <CButton
                        color="secondary"
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="text-black" // Style as needed
                        >
                      Logout
                    </CButton>
                  </CNavItem>
                </>
              ) : (
                <>
                  {/* Logged-out Links */}
                  <CNavItem className="ms-lg-2"> {/* Add margin for spacing */}
                    <CButton
                        color="primary" // Changed to primary for login
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavClick('/login')}
                        // className="text-black" // Let button styles handle text color
                        >
                       Login
                    </CButton>
                  </CNavItem>
                  {/* Optionally add Register/Sign Up button here */}
                   {/* <CNavItem className="ms-lg-2">
                       <CButton color="primary" size="sm" onClick={() => handleNavClick('/register')}>Sign Up</CButton>
                   </CNavItem> */}
                </>
              )}
            </CNavbarNav>
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default AppHeader