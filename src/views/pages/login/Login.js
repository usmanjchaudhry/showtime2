// src/views/pages/login/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { auth } from '../../../firebase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // On successful login, redirect to your dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('[Login] Error signing in:', error)
      // Show a pop-up specifically saying wrong username or password
      alert('Wrong username or password.')
    }
  }

  return (
    <>
      {/* Inline CSS Styles */}
      <style>
        {`
          .full-width-carousel {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
          }

          .carousel-item-content {
            width: 100vw;
            height: 80vh;
            overflow: hidden;
            position: relative;
          }

          .carousel-item-content img,
          .carousel-item-content iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
            width: 50px;
            height: 50px;
          }

          .carousel-indicators [data-coreui-target] {
            background-color: red;
            width: 15px;
            height: 15px;
          }

          .carousel-indicators [data-coreui-target].active {
            background-color: darkred;
          }

          .carousel-caption {
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }

          .carousel-title {
            font-size: 3rem;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
          }

          .carousel-button {
            background-color: red;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1.25rem;
            margin-top: 1rem;
            text-transform: uppercase;
            cursor: pointer;
          }
          .carousel-button:hover {
            background-color: darkred;
            color: white;
          }

          @media (max-width: 768px) {
            .carousel-title {
              font-size: 2rem;
            }
            .carousel-button {
              font-size: 1rem;
              padding: 0.5rem 1rem;
            }
          }

          .section-title-container {
            text-align: center;
            margin-top: 2rem;
          }
          .section-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #333;
          }
          .section-subtitle {
            font-size: 1.2rem;
            color: #666;
            max-width: 800px;
            margin: 0.5rem auto 0;
            line-height: 1.6;
          }
          @media (max-width: 768px) {
            .section-subtitle {
              font-size: 1rem;
              padding: 0 1rem;
            }
          }

          .custom-gap {
            --cui-row-gap: 4rem;
            --cui-column-gap: 4rem;
            margin: 2rem 0;
          }
          .card-borderless {
            border: none;
          }
          .card-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
          }

          .full-width-card {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
          }
          .full-width-card-image {
            width: 100%;
            height: 700px;
            object-fit: cover;
          }

          .custom-input {
            background-color: white !important;
            color: black !important;
          }
          .custom-input::placeholder {
            color: gray;
          }
        `}
      </style>

      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleLogin}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton type="submit" className="carousel-button px-4">
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                    {/* Button to return to Dashboard */}
                    <div className="mt-3">
                      <CButton className="carousel-button" onClick={() => navigate('/dashboard')}>
                        Return to Dashboard
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-dark py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Don&apos;t have an account yet?</p>
                      {/* Make this register button distinctly red */}
                      <CButton
                        className="mt-3"
                        style={{
                          backgroundColor: 'red',
                          color: '#fff',
                          border: 'none',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1.25rem',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate('/register')}
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
