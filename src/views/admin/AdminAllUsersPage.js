import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase' // Adjust path if needed
import {
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

function AdminAllUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      console.log('[AdminAllUsersPage] Starting to fetch users...')
      setLoading(true)
      setError('')

      try {
        // 1) Get the Firebase Auth ID token (must be admin)
        const token = await auth.currentUser.getIdToken()
        console.log('[AdminAllUsersPage] Fetched ID token:', token)

        // 2) Call your backend endpoint
        console.log('[AdminAllUsersPage] Sending request to /api/admin/all-users...')
        const res = await fetch('http://localhost:8080/api/admin/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('[AdminAllUsersPage] Response status:', res.status)

        if (!res.ok) {
          throw new Error(`Failed to fetch all users. Status: ${res.status}`)
        }

        // 3) Parse JSON
        const data = await res.json()
        console.log('[AdminAllUsersPage] Received data:', data)
        setUsers(data)
      } catch (err) {
        console.error('[AdminAllUsersPage] Error fetching all users:', err)
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
        console.log('[AdminAllUsersPage] Finished fetchUsers.')
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h4 style={{ color: 'red' }}>Error: {error}</h4>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Users (Admin Only)</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>First Name</CTableHeaderCell>
              <CTableHeaderCell>Last Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Admin?</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((u, idx) => (
              <CTableRow key={idx}>
                <CTableDataCell>{u.firstName || ''}</CTableDataCell>
                <CTableDataCell>{u.lastName || ''}</CTableDataCell>
                <CTableDataCell>{u.email || ''}</CTableDataCell>
                <CTableDataCell>{u.phone || ''}</CTableDataCell>
                <CTableDataCell>{u.isAdmin ? 'Yes' : 'No'}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  )
}

export default AdminAllUsersPage
