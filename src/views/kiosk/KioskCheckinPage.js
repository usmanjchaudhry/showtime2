// src/views/kiosk/KioskCheckinPage.js

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CContainer, CCard, CCardBody, CSpinner } from '@coreui/react'
import './KioskCheckinPage.scss'

// Replace with your actual backend domain or environment variable:
const BACKEND_URL = 'https://showtime-backend-1.onrender.com'

/**
 * Looks for "/checkin/ABC123" in the scanned text.
 * Example: "https://example.com/checkin/ABC123" -> "/checkin/ABC123".
 */
function extractCheckinPath(text) {
  try {
    const match = text.match(/\/checkin\/([a-zA-Z0-9]+)/)
    return match ? match[0] : null
  } catch {
    return null
  }
}

/**
 * Given "/checkin/ABC123", returns "ABC123".
 */
function extractUserId(checkinPath) {
  if (!checkinPath) return null
  const parts = checkinPath.split('/')
  // Expect: ["", "checkin", "USERID"]
  return parts.length === 3 ? parts[2] : null
}

function KioskCheckinPage() {
  const [lastStatus, setLastStatus] = useState(null) // { status, userName, userEmail, message, timestamp }
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Refs for scanner input buffering & status timers
  const inputBuffer = useRef('')
  const inputTimeoutRef = useRef(null)
  const statusClearTimerRef = useRef(null)

  // Ref to focus the container (for key events)
  const containerRef = useRef(null)

  // 1) Process the scanned URL path
  const processScan = useCallback(async (scannedUrlPath) => {
    console.log('Kiosk: Processing scan for path:', scannedUrlPath)
    setIsLoading(true)
    setError(null)
    setLastStatus(null)

    // Extract user ID from "/checkin/USERID"
    const userId = extractUserId(scannedUrlPath)
    if (!userId) {
      console.error('Kiosk: Could not extract UserID from path:', scannedUrlPath)
      setError('Invalid QR code scanned.')
      setIsLoading(false)

      clearTimeout(statusClearTimerRef.current)
      statusClearTimerRef.current = setTimeout(() => setError(null), 3000)
      return
    }

    try {
      // Call your backend: https://showtime-backend-1.onrender.com/api/check-in-status/...
      const response = await fetch(`${BACKEND_URL}/api/check-in-status/${userId}`)
      const responseData = await response.json()

      if (!response.ok) {
        // If server responded with non-200, parse message
        throw new Error(
          responseData.message || `Scan Error: ${response.status} ${response.statusText}`
        )
      }

      if (responseData.status === 'Error') {
        throw new Error(responseData.message || 'Backend error.')
      }

      // Success! Store status with a local timestamp
      setLastStatus({ ...responseData, timestamp: Date.now() })

      // Clear the status after 4 seconds
      clearTimeout(statusClearTimerRef.current)
      statusClearTimerRef.current = setTimeout(() => setLastStatus(null), 4000)

    } catch (err) {
      console.error('Kiosk: Error during API call:', err)
      setError(err.message || 'Failed to process check-in.')
      setLastStatus(null)
      clearTimeout(statusClearTimerRef.current)
      statusClearTimerRef.current = setTimeout(() => setError(null), 4000)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 2) Listen for scanner keystrokes
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.length > 1 && event.key !== 'Enter' && event.key !== 'Backspace') {
        return
      }

      // If Enter, process the accumulated text
      if (event.key === 'Enter') {
        const scannedText = inputBuffer.current.trim()
        console.log('Kiosk: Enter detected, buffer:', scannedText)

        if (scannedText) {
          const checkinPath = extractCheckinPath(scannedText)
          if (checkinPath) {
            processScan(checkinPath)
          } else {
            console.warn('Kiosk: Invalid data scanned:', scannedText)
            setError('Invalid QR Code')
            clearTimeout(statusClearTimerRef.current)
            statusClearTimerRef.current = setTimeout(() => setError(null), 2000)
          }
        }
        inputBuffer.current = ''
        event.preventDefault()
      } else if (event.key === 'Backspace') {
        // Manually handle backspace
        inputBuffer.current = inputBuffer.current.slice(0, -1)
      } else {
        // Append typed character
        inputBuffer.current += event.key
      }

      // Reset buffer if no Enter within 750ms
      clearTimeout(inputTimeoutRef.current)
      inputTimeoutRef.current = setTimeout(() => {
        if (inputBuffer.current) {
          console.log('Kiosk: Clearing input buffer due to timeout.')
          inputBuffer.current = ''
        }
      }, 750)
    }

    // Focus the container so we capture key events
    if (containerRef.current) {
      containerRef.current.focus()
    }

    window.addEventListener('keydown', handleKeyDown)
    console.log('Kiosk: Event listener added.')

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(inputTimeoutRef.current)
      clearTimeout(statusClearTimerRef.current)
      console.log('Kiosk: Event listener removed.')
    }
  }, [processScan])

  // 3) Decide how to display UI
  let cardClass = 'kiosk-card status-ready'
  let content = <h1>Ready to Scan</h1>

  if (isLoading) {
    cardClass = 'kiosk-card status-loading'
    content = (
      <>
        <h1>Processing...</h1>
        <CSpinner style={{ width: '3rem', height: '3rem' }} />
      </>
    )
  } else if (error) {
    cardClass = 'kiosk-card status-error'
    content = (
      <>
        <h1>Error</h1>
        <p className="kiosk-message">{error}</p>
      </>
    )
  } else if (lastStatus) {
    switch (lastStatus.status) {
      case 'Active':
        cardClass = 'kiosk-card status-active'
        content = (
          <>
            <h1>Welcome!</h1>
            {lastStatus.userName && (
              <p className="kiosk-name">{lastStatus.userName}</p>
            )}
            {lastStatus.userEmail && (
              <p className="kiosk-email">{lastStatus.userEmail}</p>
            )}
            <p className="kiosk-status">ACTIVE</p>
          </>
        )
        break

      case 'Inactive':
        cardClass = 'kiosk-card status-inactive'
        content = (
          <>
            <h1>Status</h1>
            {lastStatus.userName && (
              <p className="kiosk-name">{lastStatus.userName}</p>
            )}
            {lastStatus.userEmail && (
              <p className="kiosk-email">{lastStatus.userEmail}</p>
            )}
            <p className="kiosk-status">INACTIVE / EXPIRED</p>
            {lastStatus.message && (
              <p className="kiosk-message">{lastStatus.message}</p>
            )}
          </>
        )
        break

      case 'NotFound':
        cardClass = 'kiosk-card status-notfound'
        content = (
          <>
            <h1>Status</h1>
            {lastStatus.userName && (
              <p className="kiosk-name">{lastStatus.userName}</p>
            )}
            {lastStatus.userEmail && (
              <p className="kiosk-email">{lastStatus.userEmail}</p>
            )}
            <p className="kiosk-status">NOT FOUND</p>
            {lastStatus.message && (
              <p className="kiosk-message">{lastStatus.message}</p>
            )}
          </>
        )
        break

      default:
        // "Error" or unknown
        cardClass = 'kiosk-card status-error'
        content = (
          <>
            <h1>Error</h1>
            <p className="kiosk-message">
              {lastStatus.message || 'An unknown error occurred.'}
            </p>
          </>
        )
    }
  }

  // 4) Render kiosk UI
  return (
    <CContainer
      fluid
      ref={containerRef}
      tabIndex={-1}
      className="kiosk-container d-flex justify-content-center align-items-center"
    >
      <CCard className={cardClass}>
        <CCardBody className="d-flex flex-column justify-content-center align-items-center">
          {content}
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default KioskCheckinPage
