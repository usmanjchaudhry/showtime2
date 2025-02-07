import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
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
  const [isLoading, setIsLoading] = useState(true) // Track loading state
  const [user, setUser] = useState(null) // Track the current user
  const navigate = useNavigate()

  // Listen for changes in Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        fetchUserMemberships(firebaseUser)
      } else {
        setUser(null)
        setMemberships([])
        setIsLoading(false)
      }
    })

    return () => unsubscribe() // Cleanup subscription on unmount
  }, [])

  // Fetch user memberships from the backend
  async function fetchUserMemberships(firebaseUser) {
    setError('')
    setIsLoading(true)
    try {
      const token = await firebaseUser.getIdToken()
      const res = await fetch('https://showtime-backend-1.onrender.com/api/get-memberships', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const text = await res.text()
        setError(text)
        setIsLoading(false)
        return
      }

      const data = await res.json()
      setMemberships(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError('Error fetching memberships')
    } finally {
      setIsLoading(false)
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
      // If user is not logged in, redirect to login
      if (!user) {
        navigate('/login')
        return
      }
      const token = await user.getIdToken()

      const res = await fetch('https://showtime-backend-1.onrender.com/api/create-checkout-session', {
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

  const isBasicActive = hasActiveMembership('basic')
  const isPremiumActive = hasActiveMembership('premium')

  // Render a spinner or message while loading
  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Loading memberships...</h2>
      </div>
    )
  }

  // If user is not logged in, show a message
  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Please log in to see your memberships.</h2>
      </div>
    )
  }

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
                      <p className="text-muted mb-0">
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
                    </CCardBody>
                  </CCard>
                ))}
              </div>
            ) : (
              <p className="text-secondary">No memberships found.</p>
            )}
          </CCardBody>
          <CCardFooter className="bg-light">
            <small className="text-muted">
              Here you can view your existing memberships at any time.
            </small>
          </CCardFooter>
        </CCard>
      </div>
    </>
  )
}

export default Memberships
