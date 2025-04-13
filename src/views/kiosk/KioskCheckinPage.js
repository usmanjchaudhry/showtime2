// src/views/kiosk/KioskCheckinPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CContainer, CCard, CCardBody, CSpinner, CAlert } from '@coreui/react';
import './KioskCheckinPage.scss'; // We'll create this file next

// Helper functions to extract data from scanned URL text
const extractCheckinPath = (text) => {
    try {
        // Looks for '/checkin/' followed by alphanumeric chars
        const match = text.match(/\/checkin\/([a-zA-Z0-9]+)/);
        return match ? match[0] : null; // Returns "/checkin/USERID" or null
    } catch (e) { return null; }
};

const extractUserId = (checkinPath) => {
    if (!checkinPath) return null;
    const parts = checkinPath.split('/');
    // Expecting ["", "checkin", "USERID"] after split
    return parts.length === 3 ? parts[2] : null;
};

function KioskCheckinPage() {
    const [lastStatus, setLastStatus] = useState(null); // { status, userName, message, timestamp }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputBuffer = useRef('');         // Accumulates scanner input
    const inputTimeoutRef = useRef(null);   // Timer to clear buffer if scan is slow/interrupted
    const statusClearTimerRef = useRef(null); // Timer to clear the status message
    const containerRef = useRef(null);      // Ref to focus the container

    // Function to process the scanned URL path
    const processScan = useCallback(async (scannedUrlPath) => {
        console.log("Kiosk: Processing scan for path:", scannedUrlPath);
        setIsLoading(true);
        setError(null);
        setLastStatus(null); // Clear previous status display

        const userId = extractUserId(scannedUrlPath);
        if (!userId) {
            console.error("Kiosk: Could not extract UserID from path:", scannedUrlPath);
            setError("Invalid QR code scanned.");
            setIsLoading(false);
            // Clear error message after a delay
            clearTimeout(statusClearTimerRef.current);
            statusClearTimerRef.current = setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            // *** Fetch from the NEW backend JSON API endpoint ***
            // Assumes backend is running on the same origin or CORS is configured
            const response = await fetch(`/api/check-in-status/${userId}`);

            const responseData = await response.json(); // Try to parse JSON regardless of status

            if (!response.ok) {
                // Use message from backend JSON if available, otherwise use status text
                throw new Error(responseData.message || `Scan Error: ${response.status} ${response.statusText}`);
            }

            if (responseData.status === 'Error') { // Handle operational errors reported by backend
                 throw new Error(responseData.message || "Backend processing error.");
            }

            // Success! Store status and timestamp
            setLastStatus({ ...responseData, timestamp: Date.now() });

            // Set timer to clear the status display
            clearTimeout(statusClearTimerRef.current);
            statusClearTimerRef.current = setTimeout(() => setLastStatus(null), 4000); // Display for 4 secs

        } catch (err) {
            console.error("Kiosk: Error during API call:", err);
            setError(err.message || "Failed to process check-in.");
            setLastStatus(null); // Clear any previous status
            // Set timer to clear the error message
            clearTimeout(statusClearTimerRef.current);
            statusClearTimerRef.current = setTimeout(() => setError(null), 4000);
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback ensures this function reference is stable

    // Effect to listen for keyboard events (from the scanner)
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Ignore modifier keys, function keys etc.
            if (event.key.length > 1 && event.key !== 'Enter' && event.key !== 'Backspace') {
                return;
            }

            // If Enter is pressed, process the buffer
            if (event.key === 'Enter') {
                const scannedText = inputBuffer.current.trim();
                console.log("Kiosk: Enter detected, buffer content:", scannedText);
                if (scannedText) {
                    const checkinPath = extractCheckinPath(scannedText);
                    if (checkinPath) {
                        processScan(checkinPath);
                    } else {
                        console.warn("Kiosk: Invalid data scanned:", scannedText);
                        setError("Invalid QR Code");
                        clearTimeout(statusClearTimerRef.current);
                        statusClearTimerRef.current = setTimeout(() => setError(null), 2000);
                    }
                }
                inputBuffer.current = ''; // Clear buffer after processing
                event.preventDefault(); // Prevent any default 'Enter' action
            } else if (event.key === 'Backspace') {
                 // Allow manual backspace if needed (less likely for scanner)
                 inputBuffer.current = inputBuffer.current.slice(0, -1);
            } else {
                // Append character to buffer
                inputBuffer.current += event.key;
            }

            // Reset buffer if no 'Enter' received quickly after input starts
            clearTimeout(inputTimeoutRef.current);
            inputTimeoutRef.current = setTimeout(() => {
                if (inputBuffer.current) {
                    console.log("Kiosk: Clearing input buffer due to timeout.");
                    inputBuffer.current = '';
                }
            }, 750); // Adjust timeout if scans are slower/faster
        };

        // Set focus to the container div to help capture events initially
        if(containerRef.current) {
            containerRef.current.focus();
        }

        window.addEventListener('keydown', handleKeyDown);
        console.log("Kiosk: Event listener added.");

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(inputTimeoutRef.current);
            clearTimeout(statusClearTimerRef.current);
            console.log("Kiosk: Event listener removed.");
        };
    }, [processScan]); // Rerun if processScan changes (it shouldn't due to useCallback)

    // Determine UI content and card style based on state
     let cardClass = 'kiosk-card status-ready';
     let content = <h1>Ready to Scan</h1>;

     if (isLoading) {
         cardClass = 'kiosk-card status-loading';
         content = <><h1>Processing...</h1><CSpinner style={{ width: '3rem', height: '3rem' }} /></>;
     } else if (error) {
         cardClass = 'kiosk-card status-error';
         content = <><h1>Error</h1><p className="kiosk-message">{error}</p></>;
     } else if (lastStatus) {
         switch (lastStatus.status) {
             case 'Active':
                 cardClass = 'kiosk-card status-active';
                 content = <><h1>Welcome!</h1>{lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}<p className="kiosk-status">ACTIVE</p></>;
                 break;
             case 'Inactive':
                 cardClass = 'kiosk-card status-inactive';
                 content = <><h1>Status</h1>{lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}<p className="kiosk-status">INACTIVE / EXPIRED</p>{lastStatus.message && <p className="kiosk-message">{lastStatus.message}</p>}</>;
                 break;
             case 'NotFound':
                 cardClass = 'kiosk-card status-notfound';
                 content = <><h1>Status</h1>{lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}<p className="kiosk-status">NOT FOUND</p>{lastStatus.message && <p className="kiosk-message">{lastStatus.message}</p>}</>;
                 break;
             default: // Includes 'Error' status from backend JSON
                 cardClass = 'kiosk-card status-error';
                 content = <><h1>Error</h1><p className="kiosk-message">{lastStatus.message || 'An unknown error occurred.'}</p></>;
         }
     }

    return (
        // Add ref and tabIndex=-1 to allow the div to receive focus for key events
        <CContainer fluid ref={containerRef} tabIndex={-1} className="kiosk-container d-flex justify-content-center align-items-center">
            <CCard className={cardClass}>
                <CCardBody className="d-flex flex-column justify-content-center align-items-center">
                    {content}
                </CCardBody>
            </CCard>
        </CContainer>
    );
}

export default KioskCheckinPage;