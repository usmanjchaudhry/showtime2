// src/views/pages/qrcode/QRCodePage.js
import React, { useState, useEffect, useRef } from 'react'; // *** Import useRef ***
import { auth } from '../../../firebase'; // Adjust path if needed
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CCard, CCardBody, CCardHeader, CSpinner, CAlert } from '@coreui/react';

function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize user state to undefined to better handle initial loading
  const [user, setUser] = useState(undefined);

  // Use a ref to store the current blob URL to ensure correct cleanup
  const currentObjectUrlRef = useRef(null);

  // Effect 1: Monitor authentication state
  useEffect(() => {
    const authInstance = getAuth();
    // onAuthStateChanged returns the unsubscribe function directly
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      setUser(firebaseUser); // Update user state (null if logged out)
    });

    // Return the unsubscribe function to be called on component unmount
    return unsubscribe;
  }, []); // Empty dependency array: Runs only once on mount


  // Effect 2: Fetch QR code when user state changes (login/logout)
  useEffect(() => {
    // --- Define the cleanup logic ---
    // This function will be returned by the effect and called:
    // 1. BEFORE the effect runs again (if 'user' changes)
    // 2. When the component unmounts
    const cleanupBlobUrl = () => {
      if (currentObjectUrlRef.current) {
        console.log("Cleaning up Blob URL:", currentObjectUrlRef.current); // Debug log
        URL.revokeObjectURL(currentObjectUrlRef.current);
        currentObjectUrlRef.current = null; // Reset the ref
      }
    };

    // --- Main effect logic ---
    if (user) { // User is logged in
      const fetchQrCode = async () => {
        cleanupBlobUrl(); // Clean up any *previous* URL before fetching

        setIsLoading(true);
        setError(null);
        setQrCodeUrl(null); // Clear display while loading

        let token;
        try {
            token = await user.getIdToken();
        } catch (tokenError) {
            console.error("Error getting ID token:", tokenError);
            setError("Authentication error fetching token.");
            setIsLoading(false);
            return;
        }

        try {
          // Fetch from localhost
          //const response = await fetch(`http://localhost:8080/api/user-qr-code`, {
           const response = await fetch(`https://showtime-backend-1.onrender.com/api/user-qr-code`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            let errorText = `Failed to load QR code (Status: ${response.status})`;
            try {
              const backendError = await response.text();
              if (backendError) errorText += `: ${backendError}`;
            } catch (_) {}
            throw new Error(errorText);
          }

          const imageBlob = await response.blob();
          const newObjectUrl = URL.createObjectURL(imageBlob);

          // Store the newly created URL in the ref
          currentObjectUrlRef.current = newObjectUrl;
          // Update state to display the new image
          setQrCodeUrl(newObjectUrl);

        } catch (err) {
          console.error("Error fetching or processing QR code:", err);
          setError(err.message || "Could not load QR code.");
          setQrCodeUrl(null); // Clear image on error
          // No need to call cleanupBlobUrl here, the main cleanup handles it
        } finally {
          setIsLoading(false);
        }
      };

      fetchQrCode();

    } else if (user === null) { // User is explicitly logged out
        cleanupBlobUrl(); // Revoke URL if user logs out
        setIsLoading(false);
        setError('Please log in to view your QR code.');
        setQrCodeUrl(null); // Clear image display
    } else { // User is undefined (initial auth check likely hasn't completed)
        setIsLoading(true); // Keep showing loading indicator
        setError(null);
        setQrCodeUrl(null);
    }

    // Return the cleanup function
    return cleanupBlobUrl;

  // --- Dependency array only contains 'user' ---
  // This effect now ONLY re-runs if the 'user' object changes.
  // It will NOT re-run just because setQrCodeUrl was called.
  }, [user]);
  // ---------------------------------------------


  // --- Render component UI ---
  return (
    <div style={{ padding: '2rem' }}>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>My Membership QR Code</strong>
        </CCardHeader>
        <CCardBody style={{ textAlign: 'center' }}>
          {isLoading ? (
            // Show loading spinner
            <>
              <p>Loading your QR Code...</p>
              <CSpinner color="primary" />
            </>
          ) : error ? (
            // Show error message
            <CAlert color="danger">{error}</CAlert>
          ) : qrCodeUrl ? (
            // Show QR code image
            <>
              <img
                src={qrCodeUrl}
                alt="Membership QR Code"
                style={{
                  width: '250px',
                  height: '250px',
                  maxWidth: '100%',
                  border: '1px solid #dee2e6',
                  marginBottom: '1rem',
                }}
              />
              <p className="text-muted">
                Scan this code at the gym front desk for quick check-in.
              </p>
            </>
          ) : (
            // Fallback: Show if not loading, no error, but no QR code (likely logged out)
            // Check user state directly here for more accurate message
            user === null && <CAlert color="info">Please log in to view your QR code.</CAlert>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
}

export default QRCodePage;