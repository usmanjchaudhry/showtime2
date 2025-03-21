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
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const [hasConsent, setHasConsent] = useState(false)
  const [isConsentLoading, setIsConsentLoading] = useState(true)

  const navigate = useNavigate()

  // 1) Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const token = await firebaseUser.getIdToken()
        fetchUserMemberships(token)
        fetchUserConsent(token)
      } else {
        setUser(null)
        setMemberships([])
        setIsLoading(false)
        setIsConsentLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // 2) Fetch user memberships
  async function fetchUserMemberships(token) {
    setError('')
    setIsLoading(true)
    try {
      //const res = await fetch('https://showtime-backend-1.onrender.com/api/get-memberships', {
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

  // 3) Fetch user consent status
  async function fetchUserConsent(token) {
    setIsConsentLoading(true)
    try {
     // const res = await fetch('https://showtime-backend-1.onrender.com/api/fetch-consent', {
      const res = await fetch('https://showtime-backend-1.onrender.com/api/fetch-consent', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        setHasConsent(false)
      } else {
        const data = await res.json()
        setHasConsent(data.hasAgreed === true)
      }
    } catch (err) {
      console.error('Error fetching consent status:', err)
      setHasConsent(false)
    } finally {
      setIsConsentLoading(false)
    }
  }

  // 4) Handle user clicking "Buy" membership
  const handlePurchase = async (membershipType) => {
    setError('')
    try {
      if (!user) {
        navigate('/login')
        return
      }
      const token = await user.getIdToken()
      //const res = await fetch('https://showtime-backend-1.onrender.com/api/create-checkout-session', {
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
//extra comment
  // 5) Helper to check if user has an active membership of a certain type
  const hasActiveMembership = (type) => {
    return memberships.some((m) => m.type === type && m.isActive)
  }

  // A) If memberships or consent is still loading
  if (isLoading || isConsentLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  // B) If user is not logged in
  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Please log in to see your memberships.</h2>
      </div>
    )
  }

  // Check if user already has certain memberships
  const isBasicActive = hasActiveMembership('basic')
  const isPremiumActive = hasActiveMembership('premium')
  const isCoachSpecialActive = hasActiveMembership('coach_special')
  const isDoubleMembershipActive = hasActiveMembership('double_membership')
  const isOpenGymAccessActive = hasActiveMembership('open_gym_access')
  const isTwoClassesActive = hasActiveMembership('two_classes')
  const isOneDayPassActive = hasActiveMembership('one_day_pass')

  // --- Styles ---
  return (
    <>
      <style>
        {`
          .membership-page-container {
            padding: 2rem;
          }
          .membership-card {
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border: none;
          }
          .membership-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.15);
          }
          .membership-card-header {
            background-color: #f8f9fa;
            border-bottom: none;
          }
          .membership-price {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }
          .membership-action-btn {
            background-color: #5c5c5c !important;
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

        {/* CONSENT STATUS */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Consent Form Status</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-secondary mb-4">
              Please ensure you have completed our gym consent form.
            </p>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status: </strong>
              <span
                style={{
                  color: hasConsent ? 'green' : 'red',
                  fontWeight: 'bold',
                  marginLeft: '0.5rem',
                }}
              >
                {hasConsent ? 'Completed' : 'Not Completed'}
              </span>
            </div>

            {!hasConsent && (
              <CButton
                color="primary"
                onClick={() => {
                  navigate('/consent')
                }}
              >
                Fill Out Consent Form
              </CButton>
            )}
          </CCardBody>
        </CCard>

        {/* MEMBERSHIP PURCHASE SECTION */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Buy a New Membership</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-secondary mb-4">
              Choose one of our membership plans below to start your fitness journey with us.
            </p>

            {/* 
              We'll display these in multiple rows:
                Row 1: Basic / Premium
                Row 2: Coach Special / Double Membership
                Row 3: Open Gym Access / Two Classes
                Row 4: One Day Pass (alone)
            */}
            
            <CRow className="g-3 mb-3">
              {/* Basic Membership */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Basic Membership</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$140</div>
                    <p className="text-muted">
                      Great for newcomers or casual gym-goers.
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

              {/* Premium Membership */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Premium Membership</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$199</div>
                    <p className="text-muted">
                      Exclusive perks, advanced sessions, and more personalized guidance.
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

            <CRow className="g-3 mb-3">
              {/* Coach Special */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Coach Special</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$75</div>
                    <p className="text-muted">
                      Personalized coaching sessions and advanced training.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isCoachSpecialActive}
                      onClick={() => {
                        if (isCoachSpecialActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('coach_special')
                        }
                      }}
                    >
                      {isCoachSpecialActive ? 'Already Active' : 'Buy Coach Special'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Double Membership */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Double Membership Discount</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$178</div>
                    <p className="text-muted">
                      Perfect for couples or two training partners looking to join together.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isDoubleMembershipActive}
                      onClick={() => {
                        if (isDoubleMembershipActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('double_membership')
                        }
                      }}
                    >
                      {isDoubleMembershipActive ? 'Already Active' : 'Buy Double Membership'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="g-3 mb-3">
              {/* Open Gym Access */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Open Gym Access</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$104</div>
                    <p className="text-muted">
                      Access to the gym facilities on your own schedule.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isOpenGymAccessActive}
                      onClick={() => {
                        if (isOpenGymAccessActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('open_gym_access')
                        }
                      }}
                    >
                      {isOpenGymAccessActive ? 'Already Active' : 'Buy Open Gym'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              {/* Two Classes */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">Two Classes A Week</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$140</div>
                    <p className="text-muted">
                      Get two specialized classes per week for targeted improvement.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      disabled={isTwoClassesActive}
                      onClick={() => {
                        if (isTwoClassesActive) {
                          alert('You already have this subscription!')
                        } else {
                          handlePurchase('two_classes')
                        }
                      }}
                    >
                      {isTwoClassesActive ? 'Already Active' : 'Buy Two Classes'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <CRow className="g-3">
              {/* One Day Pass (non-subscription) */}
              <CCol xs={12} sm={6}>
                <CCard className="h-100 membership-card">
                  <CCardHeader className="membership-card-header">
                    <h4 className="mb-0">One Day Pass</h4>
                  </CCardHeader>
                  <CCardBody>
                    <div className="membership-price">$15</div>
                    <p className="text-muted">
                      Perfect for guests or occasional visits.
                    </p>
                    <CButton
                      className="membership-action-btn"
                      // If you want multiple one-day passes, you might remove disabled logic
                      disabled={isOneDayPassActive}
                      onClick={() => {
                        if (isOneDayPassActive) {
                          alert('You already have this pass active!')
                        } else {
                          handlePurchase('one_day_pass')
                        }
                      }}
                    >
                      {isOneDayPassActive ? 'Already Active' : 'Buy One Day Pass'}
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>

        {/* CURRENT MEMBERSHIPS SECTION */}
     {/* CURRENT MEMBERSHIPS SECTION */}
<CCard>
  <CCardHeader className="current-memberships-header">
    <strong>My Current Memberships</strong>
  </CCardHeader>
  <CCardBody>
    {Array.isArray(memberships) && memberships.length > 0 ? (
      <div className="d-flex flex-wrap gap-3">
        {memberships
          .filter((m) => m.type !== 'tip')   // remove tip
          .filter((m) => m.isActive)         // remove inactive
          .map((m) => (
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
