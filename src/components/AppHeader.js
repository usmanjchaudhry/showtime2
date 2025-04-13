// src/components/AppHeader.js
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
import { auth } from '../firebase'
import ShowtimeLogo from '../assets/images/SHOWTIME_LOGO_BLACK-removebg-preview.png'
import { useNavigate } from 'react-router-dom'

// Import Firestore so we can fetch isAdmin
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const AppHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)  // Track if user is admin

  const navigate = useNavigate()

  // 1) Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // 2) Fetch Firestore doc to see if user is admin
  useEffect(() => {
    const db = getFirestore()

    if (!user) {
      // If no user, definitely not admin
      setIsAdmin(false)
      return
    }

    // If user is logged in, fetch the user doc
    const checkIsAdmin = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(userDocRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          // If docSnap has isAdmin === true, set isAdmin
          setIsAdmin(!!data.isAdmin)
        } else {
          console.warn('No Firestore document found for user:', user.uid)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Error fetching Firestore user data:', error)
        setIsAdmin(false)
      }
    }

    checkIsAdmin()
  }, [user])

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsExpanded(false)
      navigate('/dashboard')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Function to handle navigation
  const handleNavClick = (path) => {
    navigate(path)
    setIsExpanded(false)
  }

  return (
    <>
      <style>
        {`
          .nav-link-hover-underline {
            position: relative;
            overflow: hidden;
            cursor: pointer;
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
        `}
      </style>

      <CNavbar expand="lg" className="bg-white shadow" placement="sticky-top">
        <CContainer fluid>
          {/* Logo + Brand (clickable) */}
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

          <CNavbarBrand
            onClick={() => handleNavClick('/dashboard')}
            className="text-black fw-bold ps-2 d-block d-lg-none"
            style={{ cursor: 'pointer' }}
          />

          {/* Toggler for mobile */}
          <CNavbarToggler
            className="border"
            aria-label="Toggle navigation"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />

          <CCollapse className="navbar-collapse" visible={isExpanded}>
            <CNavbarNav className="ms-auto mb-2 mb-lg-0 align-items-lg-center">
              {/* Commonly visible nav links */}
              <CNavItem>
                <CNavLink
                  onClick={() => handleNavClick('/dashboard')}
                  className="nav-link-hover-underline text-black"
                >
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

              {/* Conditional: if user is logged in */}
              {user ? (
                <>
                  {/* My QR Code link */}
                  <CNavItem>
                    <CNavLink
                      onClick={() => handleNavClick('/qrcode')}
                      className="nav-link-hover-underline text-black"
                    >
                      My QR Code
                    </CNavLink>
                  </CNavItem>

                  {/* Admin-only links (Kiosk & AdminCheckinsPage) */}
                  {isAdmin && (
                    <>
                      <CNavItem>
                        <CNavLink
                          onClick={() => handleNavClick('/kiosk')}
                          className="nav-link-hover-underline text-black"
                        >
                          Kiosk
                        </CNavLink>
                      </CNavItem>

                      {/* NEW: Admin Check-Ins link */}
                      <CNavItem>
                        <CNavLink
                          onClick={() => handleNavClick('/admin/check-ins')}
                          className="nav-link-hover-underline text-black"
                        >
                          Admin Check-Ins
                        </CNavLink>
                      </CNavItem>
                    </>
                  )}

                  <CNavItem className="ms-lg-2">
                    <CButton
                      color="secondary"
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="text-black"
                    >
                      Logout
                    </CButton>
                  </CNavItem>
                </>
              ) : (
                // If user is not logged in
                <>
                  <CNavItem className="ms-lg-2">
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavClick('/login')}
                    >
                      Login
                    </CButton>
                  </CNavItem>
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
