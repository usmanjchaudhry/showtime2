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

function AdminCheckinPage() {
  const [checkIns, setCheckIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // We'll store the Firebase user object here once we know it's loaded
  const [firebaseUser, setFirebaseUser] = useState(undefined)

  useEffect(() => {
    // Listen for Firebase Auth state changes so we know if there's a user
    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        console.log('[AdminCheckinsPage] Auth user loaded:', user.uid)
        setFirebaseUser(user)
      } else {
        console.log('[AdminCheckinsPage] No user is logged in.')
        setFirebaseUser(null)
      }
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    // If we haven't determined the auth state, do nothing yet
    if (firebaseUser === undefined) {
      return
    }

    // If no user is logged in, show error
    if (!firebaseUser) {
      setError('No authenticated user found. Cannot fetch admin data.')
      setLoading(false)
      return
    }

    // Otherwise, we have a valid user, let's fetch the check-ins
    const fetchCheckIns = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get the ID token
        const token = await firebaseUser.getIdToken(false)

        const resp = await fetch('/api/admin/check-ins', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!resp.ok) {
          throw new Error(`Failed to fetch check-ins. Status: ${resp.status}`)
        }

        const data = await resp.json()
        // 'data' should be an array of docs:
        // e.g. {
        //   id: "...",
        //   userName: "Usman Chaudhry",
        //   userEmail: "usmanjc98@gmail.com",
        //   statusAtCheckin: "Inactive",
        //   membershipTypeAtCheckin: "basic",
        //   timestamp: "2025-04-13T08:42:05Z"
        //JUst sshit so it will go in prod
        // }
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

  return (
    <CContainer className="py-4">
      <h1>Admin Check-Ins</h1>
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

              // If status != "Active", highlight the row in red (table-danger)
              const rowClass =
                log.statusAtCheckin && log.statusAtCheckin !== 'Active'
                  ? 'table-danger'
                  : ''
                console.log(log)
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
    </CContainer>
  )
}

export default AdminCheckinPage
