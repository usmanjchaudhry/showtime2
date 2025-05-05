import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  CSpinner,
  CTable, CTableHead, CTableRow,
  CTableHeaderCell, CTableBody, CTableDataCell,
} from '@coreui/react';

function AdminAllUsersPage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError('You must be signed-in as an admin.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const token = await user.getIdToken(true);
        const res   = await fetch('http://localhost:8080/api/admin/raw-users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(await res.text() || `HTTP ${res.status}`);

        const dump = await res.json();           // array of user objects
        console.log('FULL /users DUMP:', dump);  // keep for debugging

        /* -------- flatten Firestore structure into simple rows -------- */
        const flat = dump.map(u => {
          const waiver      = u.subcollections?.consent?.waiver || {};
          const memberships = u.subcollections?.memberships    || {};

          // find a membership with isActive === true, otherwise "none"
          const activeEntry = Object.values(memberships).find(m => m.isActive);

          return {
            uid:        u.uid,
            name:       waiver.name  || '(unknown)',
            email:      waiver.email || '(unknown)',
            phone:      waiver.phone || '(unknown)',
            membership: activeEntry ? activeEntry.type : 'none',
          };
        });

        setRows(flat);
      } catch (e) {
        setError(e.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* --------------------------- UI states --------------------------- */
  if (loading) {
    return (
      <div className="text-center py-5">
        <CSpinner color="primary" />
        <p>Loading users…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <h4 style={{ color: 'red' }}>Error: {error}</h4>
      </div>
    );
  }

  /* ------------------------------ table ------------------------------ */
  return (
    <div style={{ padding: '1rem' }}>
      <h2>All Users ({rows.length})</h2>

      {rows.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Phone</CTableHeaderCell>
              <CTableHeaderCell>Active Membership</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {rows.map(r => (
              <CTableRow key={r.uid}>
                <CTableDataCell>{r.name}</CTableDataCell>
                <CTableDataCell>{r.email}</CTableDataCell>
                <CTableDataCell>{r.phone}</CTableDataCell>
                <CTableDataCell>{r.membership}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      )}
    </div>
  );
}

export default AdminAllUsersPage;
