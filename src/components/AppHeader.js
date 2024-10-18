import React, { useState } from 'react'
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
  CBadge,
} from '@coreui/react'
import { cilCart } from '@coreui/icons'

import ShowtimeLogo from '../assets/images/SHOWTIME_LOGO_BLACK-removebg-preview.png'

const AppHeader = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      {/* Inline CSS Styles */}
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
            height: 2px; /* Adjust the height to change the underline thickness */
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
          {/* Logo Image */}
          <img src={ShowtimeLogo} alt="Showtime Logo" width={80} height={80} />
          {/* Brand for Large Screens */}
          <CNavbarBrand href="#" className="text-black fw-bold ps-2 d-none d-lg-block">
            Showtime Boxing Fitness
          </CNavbarBrand>
          {/* Brand for Small and Medium Screens */}
          <CNavbarBrand
            href="#"
            className="text-black fw-bold ps-2 d-block d-lg-none"
          ></CNavbarBrand>
          {/* Toggler */}
          <CNavbarToggler
            className="bg-white border"
            aria-label="Toggle navigation"
            aria-expanded={visible}
            onClick={() => setVisible(!visible)}
          />
          {/* Navbar Collapse */}
          <CCollapse className="navbar-collapse" visible={visible}>
            <CNavbarNav className="ms-auto mb-2 mb-lg-0">
              <CNavItem>
                <CNavLink href="#" className="text-black nav-link-hover-underline">
                  Home
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/trainers" className="text-black nav-link-hover-underline">
                  Trainers
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink href="#/schedule" className="text-black nav-link-hover-underline">
                  Schedule
                </CNavLink>
              </CNavItem>
            </CNavbarNav>
            {/*<CNavbarNav className="ms-auto mb-2 mb-lg-0">
              <CNavItem>
                <CButton className="position-relative bg-white text-black">
                  Cart
                  <CBadge color="danger" position="top-end" shape="rounded-pill">
                    0 <span className="visually-hidden">unread messages</span>
                  </CBadge>
                </CButton>
              </CNavItem>
            </CNavbarNav>*/}
          </CCollapse>
        </CContainer>
      </CNavbar>
    </>
  )
}

export default AppHeader
