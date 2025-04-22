// src/views/admin/AdminAllUsersPage.js
import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase' // Adjust path to your firebase.js if needed
import { CSpinner, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'

function AdminAllUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        // 1) Get the Firebase auth token
        const token = await auth.currentUser.getIdToken()
        // 2) Call your backend endpoint
        const res = await fetch('http://localhost:8080/api/admin/all-users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) {
          // If the response isn't OK, throw an error to be caught below
          const msg = `Failed to fetch all users. Status: ${res.status}`
          throw new Error(msg)
        }
        // 3) Parse JSON
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('Error fetching all users:', err)
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
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
              <CTableHeaderCell>UID</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Is Admin?</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((u) => (
              <CTableRow key={u.uid}>
                <CTableDataCell>{u.uid}</CTableDataCell>
                <CTableDataCell>{u.name || ''}</CTableDataCell>
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
