// src/views/pages/register/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  CButton,
  CCard,
  CCardBody,
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

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      alert('Passwords do not match!')
      return
    }
    try {
      //more comments
      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created successfully!')
      // Navigate to login after registering
      navigate('/login')
    } catch (error) {
      console.error(error)
      alert(`Registration failed: ${error.message}`)
    }
  }

  return (
    <>
      {/* Inline CSS Styles (copied from Dashboard) */}
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

          /* Custom styles for carousel controls and indicators */
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
            background-color: red;
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

          /* Section titles */
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

          /* Card Grid */
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

          /* Full-width card */
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

          /* Custom input */
          .custom-input {
            background-color: white !important;
            color: black !important;
          }
          .custom-input::placeholder {
            color: gray;
            opacity: 1;
          }
          .custom-input::-webkit-input-placeholder {
            color: gray;
          }
          .custom-input::-moz-placeholder {
            color: gray;
          }
          .custom-input:-ms-input-placeholder {
            color: gray;
          }
          .custom-input::-ms-input-placeholder {
            color: gray;
          }
        `}
      </style>

      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <p className="text-body-secondary">Create your account</p>

                    {/* Username */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Email */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Password */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    {/* Confirm Password */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </CInputGroup>

                    <div className="d-grid">
                      <CButton type="submit" className="carousel-button">
                        Create Account
                      </CButton>
                    </div>
                  </CForm>

                  {/* Return Buttons with spacing */}
                  <div className="mt-4 d-flex">
                    <CButton
                      className="carousel-button me-3"
                      onClick={() => navigate('/dashboard')}
                    >
                      Return to Dashboard
                    </CButton>
                    <CButton
                      className="carousel-button ms-3"
                      onClick={() => navigate('/login')}
                    >
                      Return to Login
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Register
