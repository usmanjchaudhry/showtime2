// src/views/admin/AdminCheckinsPage.js

import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  CContainer,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/react'

// Import our custom SCSS for styling
import './AdminCheckinsPage.scss'

const BACKEND_URL = 'https://showtime-backend-1.onrender.com'

function AdminCheckinPage() {
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(undefined)

  // 1) Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        console.log('[AdminCheckinsPage] Auth user loaded:', user.uid)
        setFirebaseUser(user)
      } else {
        console.log('[AdminCheckinsPage] No user is logged in.')
        setFirebaseUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  // 2) Fetch Admin Check-ins (Once we know the auth user)
  useEffect(() => {
    // If we're still determining auth state, do nothing
    if (firebaseUser === undefined) return

    // If no user is logged in, show error
    if (!firebaseUser) {
      setError('No authenticated user found. Cannot fetch admin data.')
      setLoading(false)
      return
    }

    const fetchCheckIns = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = await firebaseUser.getIdToken(false)
        const resp = await fetch(`${BACKEND_URL}/api/admin/check-ins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!resp.ok) {
          throw new Error(`Failed to fetch check-ins. Status: ${resp.status}`)
        }
        const data = await resp.json()
        setCheckIns(data)
      } catch (err) {
        console.error('[AdminCheckinsPage] Error fetching logs:', err)
        setError(err.message || 'Unknown error fetching logs')
      } finally {
        setLoading(false)
      }
    }

    fetchCheckIns()
  }, [firebaseUser])

  // 3) Render Loading/Error/Success UI
  if (loading) {
    return (
      <CContainer className="py-5 text-center">
        <CSpinner color="primary" />
        <p>Loading check-in logs...</p>
      </CContainer>
    )
  }

  if (error) {
    return (
      <CContainer className="py-5 text-center">
        <h2>Error</h2>
        <p>{error}</p>
      </CContainer>
    )
  }

  // 4) Render Table of Check-ins
  return (
    <CContainer className="py-4">
      {/* Our custom container for styling */}
      <div className="admin-checkins-container">
        <h1 className="admin-checkins-heading">Recent Check-Ins</h1>
        {checkIns.length === 0 ? (
          <p>No check-in logs found.</p>
        ) : (
          <CTable hover responsive>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell>User Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Membership Type</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Timestamp</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {checkIns.map((log) => {
                // Convert Firestore timestamp to local string
                const dateStr = new Date(log.timestamp).toLocaleString()

                // If status isn't "Active", highlight row in red (table-danger)
                const rowClass =
                  log.statusAtCheckin && log.statusAtCheckin !== 'Active'
                    ? 'table-danger'
                    : ''

                return (
                  <CTableRow key={log.id} className={rowClass}>
                    <CTableDataCell>{log.userName || '—'}</CTableDataCell>
                    <CTableDataCell>{log.userEmail || '—'}</CTableDataCell>
                    <CTableDataCell>
                      {log.membershipTypeAtCheckin || '—'}
                    </CTableDataCell>
                    <CTableDataCell>{log.statusAtCheckin || '—'}</CTableDataCell>
                    <CTableDataCell>{dateStr}</CTableDataCell>
                  </CTableRow>
                )
              })}
            </CTableBody>
          </CTable>
        )}
      </div>
    </CContainer>
  )
}

export default AdminCheckinPage
