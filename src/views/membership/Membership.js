import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CAlert,
  CRow,
  CCol,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Memberships = () => {
  const [error, setError] = useState('')
  const [memberships, setMemberships] = useState([])
  const navigate = useNavigate()

  // We only fetch user memberships if user is logged in
  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      fetchUserMemberships()
    }
  }, [])

  async function fetchUserMemberships() {
    setError('')
    try {
      const user = auth.currentUser
      if (!user) {
        // If there's no user, skip fetching
        return
      }

      const token = await user.getIdToken()
      const res = await fetch('http://localhost:8080/api/get-memberships', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text)
        return
      }

      const data = await res.json()
      if (!Array.isArray(data)) {
        setMemberships([])
      } else {
        setMemberships(data)
      }
    } catch (err) {
      console.error(err)
      setError('Error fetching memberships')
    }
  }

  // Helper to check if the user has an active membership of a certain type
  const hasActiveMembership = (type) => {
    return memberships.some((m) => m.type === type && m.isActive)
  }

  // Handle user clicking "Buy" membership
  const handlePurchase = async (membershipType) => {
    setError('')
    try {
      const user = auth.currentUser
      // If user is not logged in, redirect to login
      if (!user) {
        navigate('/login')
        return
      }
      const token = await user.getIdToken()

      const res = await fetch('http://localhost:8080/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ membershipType }),
      })

      if (res.status === 409) {
        setError(`You already have the ${membershipType} membership.`)
        return
      }
      if (!res.ok) {
        const text = await res.text()
        setError(`Failed to create checkout session: ${text}`)
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('No URL returned from server')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setError('Error creating checkout session')
    }
  }

  // Handle user canceling an existing membership
  const handleCancel = async (subscriptionId) => {
    setError('')
    try {
      const user = auth.currentUser
      if (!user) {
        navigate('/login')
        return
      }
      const token = await user.getIdToken()

      const res = await fetch('http://localhost:8080/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId }),
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text)
        return
      }
      // Refresh memberships
      fetchUserMemberships()
    } catch (err) {
      console.error(err)
      setError('Error canceling subscription')
    }
  }

  // Determine if user has basic/premium active
  const isBasicActive = hasActiveMembership('basic')
  const isPremiumActive = hasActiveMembership('premium')

  return (
    <>
      <style>
        {`
          /* Apply subtle styling for a sleek, modern feel */
          .membership-page-container {
            padding: 2rem;
          }

          /* Card styling for each membership option */
          .membership-card {
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border: none;
          }
          .membership-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
          }

          /* Headers */
          .membership-card-header {
            background-color: #f8f9fa; /* a light gray */
            border-bottom: none; 
          }

          /* Price styling */
          .membership-price {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          /* Action button styling */
          .membership-action-btn {
            background-color: #5c5c5c !important; /* or #333, #555, etc. */
            color: #fff !important;
            border: none !important;
          }
          .membership-action-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .current-memberships-header {
            background-color: #f8f9fa;
            border-bottom: none;
          }
        `}
      </style>

      <div className="membership-page-container">
        <h1 className="mb-4">Memberships</h1>

        {error && (
          <CAlert color="danger" className="mb-3">
            {error}
          </CAlert>
        )}

        {/* Purchase Section */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Buy a New Membership</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-secondary mb-4">
              Choose one of our membership plans below to start your fitness journey with us.
            </p>
            <CRow className="g-3">
              {/* Basic Membership Card */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Basic Membership</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$140</div>
                    <p className="text-muted">
                      Our Basic plan offers great value and is perfect for newcomers or casual gym-goers.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isBasicActive}
                      onClick={() => {
                        if (isBasicActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('basic')
                        }
                      }}
                    >
                      {isBasicActive ? 'Already Active' : 'Buy Basic'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Premium Membership Card */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Premium Membership</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$199</div>
                    <p className="text-muted">
                      Step up to Premium for exclusive perks, advanced training sessions, and more personalized guidance.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isPremiumActive}
                      onClick={() => {
                        if (isPremiumActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('premium')
                        }
                      }}
                    >
                      {isPremiumActive ? 'Already Active' : 'Buy Premium'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* Current Memberships Section */}
        <CCard>
          <CCardHeader className="current-memberships-header">
            <strong>My Current Memberships</strong>
          </CCardHeader>
          <CCardBody>
            {Array.isArray(memberships) && memberships.length > 0 ? (
              <div className="d-flex flex-wrap gap-3">
                {memberships.map((m) => (
                  <CCard
                    key={m.type}
                    className="p-3 membership-card"
                    style={{ minWidth: '220px', maxWidth: '300px' }}
                  >
                    <CCardHeader className="bg-light border-0">
                      <h5 className="mb-0 text-capitalize">{m.type} Membership</h5>
                    </CCardHeader>
                    <CCardBody>
                      <p className="text-muted mb-2">
                        Status:{' '}
                        <span
                          style={{
                            color: m.isActive ? 'green' : 'red',
                            fontWeight: 'bold',
                          }}
                        >
                          {m.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </p>
                      {m.isActive && m.subscriptionId && (
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleCancel(m.subscriptionId)}
                        >
                          Cancel
                        </CButton>
                      )}
                    </CCardBody>
                  </CCard>
                ))}
              </div>
            ) : (
              <p className="text-secondary">
                {!auth.currentUser ? 'Log in to see your memberships.' : 'No memberships found.'}
              </p>
            )}
          </CCardBody>
          <CCardFooter className="bg-light">
            <small className="text-muted">
              Here you can manage or cancel your existing memberships at any time.
            </small>
          </CCardFooter>
        </CCard>
      </div>
    </>
  )
}

export default Memberships
