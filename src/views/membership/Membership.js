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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const token = await firebaseUser.getIdToken()
        // Fetch memberships + consent
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

  async function fetchUserMemberships(token) {
    setError('')
    setIsLoading(true)
    try {
      console.log('[Memberships] Fetching memberships...')
      const res = await fetch('http://localhost:8080/api/get-memberships', {
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

  async function fetchUserConsent(token) {
    setIsConsentLoading(true)
    try {
      console.log('[Memberships] Fetching consent status...')
      const res = await fetch('http://localhost:8080/api/fetch-consent', {
        headers: { Authorization: `Bearer ${token}` },
      })

      console.log('[Memberships] fetch-consent status:', res.status)
      if (!res.ok) {
        setHasConsent(false)
      } else {
        const data = await res.json()
        setHasConsent(data.hasAgreed === true)
        console.log('[Memberships] hasAgreed =', data.hasAgreed)
      }
    } catch (err) {
      console.error('Error fetching consent status:', err)
      setHasConsent(false)
    } finally {
      setIsConsentLoading(false)
    }
  }

  const handlePurchase = async (membershipType) => {
    setError('')
    try {
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

  const hasActiveMembership = (type) => {
    return memberships.some((m) => m.type === type && m.isActive)
  }

  if (isLoading || isConsentLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Loading...</h2>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>Please log in to see your memberships.</h2>
      </div>
    )
  }

  const isBasicActive = hasActiveMembership('basic')
  const isPremiumActive = hasActiveMembership('premium')
  const isTipActive = hasActiveMembership('tip')

  return (
    <div className="membership-page-container" style={{ padding: '2rem' }}>
      <h1 className="mb-4">Memberships</h1>

      {error && <CAlert color="danger">{error}</CAlert>}

      {/* CONSENT FORM STATUS */}
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
            <span style={{ color: hasConsent ? 'green' : 'red', fontWeight: 'bold', marginLeft: '0.5rem' }}>
              {hasConsent ? 'Completed' : 'Not Completed'}
            </span>
          </div>
          {!hasConsent && (
            <CButton color="primary" onClick={() => navigate('/consent')}>
              Fill Out Consent Form
            </CButton>
          )}
        </CCardBody>
      </CCard>

      {/* MEMBERSHIP PURCHASE */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Buy a New Membership</strong>
        </CCardHeader>
        <CCardBody>
          <p className="text-secondary mb-4">
            Choose one of our membership plans below to start your fitness journey with us.
          </p>
          <CRow className="g-3">
            {/* Basic */}
            <CCol xs={12} sm={4}>
              <CCard className="h-100 membership-card">
                <CCardHeader className="membership-card-header">
                  <h4 className="mb-0">Basic Membership</h4>
                </CCardHeader>
                <CCardBody>
                  <div className="membership-price">$140</div>
                  <p className="text-muted">Great for newcomers or casual gym-goers.</p>
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
            {/* Premium */}
            <CCol xs={12} sm={4}>
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
            {/* Tip */}
            <CCol xs={12} sm={4}>
              <CCard className="h-100 membership-card">
                <CCardHeader className="membership-card-header">
                  <h4 className="mb-0">Tip</h4>
                </CCardHeader>
                <CCardBody>
                  <div className="membership-price">$1</div>
                  <p className="text-muted">Show your support by leaving a tip!</p>
                  <CButton
                    className="membership-action-btn"
                    disabled={isTipActive}
                    onClick={() => {
                      if (isTipActive) {
                        alert('You already have this subscription!')
                      } else {
                        handlePurchase('tip')
                      }
                    }}
                  >
                    {isTipActive ? 'Already Tipped' : 'Leave a Tip'}
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Current Memberships */}
      <CCard>
        <CCardHeader className="current-memberships-header">
          <strong>My Current Memberships</strong>
        </CCardHeader>
        <CCardBody>
          {Array.isArray(memberships) && memberships.length > 0 ? (
            <div className="d-flex flex-wrap gap-3">
              {memberships.map((m) => (
                <CCard key={m.type} className="p-3 membership-card" style={{ minWidth: '220px', maxWidth: '300px' }}>
                  <CCardHeader className="bg-light border-0">
                    <h5 className="mb-0 text-capitalize">{m.type} Membership</h5>
                  </CCardHeader>
                  <CCardBody>
                    <p className="text-muted mb-0">
                      Status:{' '}
                      <span style={{ color: m.isActive ? 'green' : 'red', fontWeight: 'bold' }}>
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
  )
}

export default Memberships
