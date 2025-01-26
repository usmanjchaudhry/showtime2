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
        // If there's no user, skip fetching (no error, so the page can still show public info)
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
        // Backend also returns 409 if membership is active
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

  const handleCancel = async (subscriptionId) => {
    setError('')
    try {
      const user = auth.currentUser
      // If not logged in (edge case), redirect or show error
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
    <div style={{ padding: '2rem' }}>
      <h1 className="mb-4">Memberships</h1>

      {error && (
        <CAlert color="danger" className="mb-3">
          {error}
        </CAlert>
      )}

      {/* Purchase Section */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Buy a new membership</strong>
        </CCardHeader>
        <CCardBody>
          <p className="text-secondary">Choose one of our available membership plans below:</p>
          <CRow className="g-3">
            <CCol xs="12" sm="6">
              <CButton
                color="primary"
                className="w-100"
                disabled={isBasicActive} // disable if user has "basic" active
                onClick={() => {
                  if (isBasicActive) {
                    alert('You already have this subscription!')
                  } else {
                    handlePurchase('basic')
                  }
                }}
              >
                Buy Basic Membership
              </CButton>
            </CCol>
            <CCol xs="12" sm="6">
              <CButton
                color="info"
                className="w-100"
                disabled={isPremiumActive} // disable if user has "premium" active
                onClick={() => {
                  if (isPremiumActive) {
                    alert('You already have this subscription!')
                  } else {
                    handlePurchase('premium')
                  }
                }}
              >
                Buy Premium Membership
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Current Memberships Section */}
      <CCard>
        <CCardHeader>
          <strong>My Current Memberships</strong>
        </CCardHeader>
        <CCardBody>
          {Array.isArray(memberships) && memberships.length > 0 ? (
            <div className="d-flex flex-wrap gap-3">
              {memberships.map((m) => (
                <CCard
                  key={m.type}
                  className="p-3"
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
              {!auth.currentUser
                ? 'Log in to see your memberships.'
                : 'No memberships found.'}
            </p>
          )}
        </CCardBody>
        <CCardFooter className="bg-light">
          <small className="text-muted">
            Here you can manage or cancel your existing memberships.
          </small>
        </CCardFooter>
      </CCard>
    </div>
  )
}

export default Memberships
