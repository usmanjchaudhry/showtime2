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

const AppHeader = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsExpanded(false)
      // Automatically navigate user to dashboard upon successful logout
      navigate('/dashboard')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      <style>
        {`
          .nav-link-hover-underline {
            position: relative;
            overflow: hidden;
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
          {/* Logo & Brand */}
          <a href="#/">
            <img src={ShowtimeLogo} alt="Showtime Logo" width={80} height={80} />
          </a>
          <CNavbarBrand href="#/" className="text-black fw-bold ps-2 d-none d-lg-block">
            Showtime Boxing
          </CNavbarBrand>
          <CNavbarBrand href="#/" className="text-black fw-bold ps-2 d-block d-lg-none" />

          {/* Toggler (for mobile) */}
          <CNavbarToggler
            className="bg-black border"
            aria-label="Toggle navigation"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          />

          {/* Collapsible Nav */}
          <CCollapse className="navbar-collapse" visible={isExpanded}>
            <CNavbarNav className="ms-auto mb-2 mb-lg-0">
              {/* Links always visible */}
              <CNavItem>
                <CNavLink href="#/dashboard" className="nav-link-hover-underline text-black">
                  Home
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/schedule" className="nav-link-hover-underline text-black">
                  Schedule
                </CNavLink>
              </CNavItem>
              {/* Memberships link now always visible */}
              <CNavItem>
                <CNavLink href="#/memberships" className="nav-link-hover-underline text-black">
                  Memberships
                </CNavLink>
              </CNavItem>

              {user ? (
                <>
                  {/* Logged-in Links */}
                  <CNavItem>
                    <CButton color="link" onClick={handleLogout} className="px-0 text-black">
                      Logout
                    </CButton>
                  </CNavItem>
                </>
              ) : (
                <>
                  {/* Logged-out Links */}
                  <CNavItem>
                    <CNavLink href="#/login" className="nav-link-hover-underline text-black">
                      Login
                    </CNavLink>
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
