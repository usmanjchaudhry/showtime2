// src/views/kiosk/KioskCheckinPage.js

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CContainer, CCard, CCardBody, CSpinner } from '@coreui/react'
import './KioskCheckinPage.scss' // Custom kiosk styles

/**
 * Looks for "/checkin/ABC123" in the scanned text.
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
 * Given "/checkin/ABC123", returns "ABC123"
 */
function extractUserId(checkinPath) {
  if (!checkinPath) return null
  const parts = checkinPath.split('/')
  return parts.length === 3 ? parts[2] : null
}

function KioskCheckinPage() {
  const [lastStatus, setLastStatus] = useState(null) // { status, userName, userEmail, message, timestamp }
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const inputBuffer = useRef('')
  const inputTimeoutRef = useRef(null)
  const statusClearTimerRef = useRef(null)
  const containerRef = useRef(null)

  // -- Process the scanned URL path and fetch check-in status
  const processScan = useCallback(async (scannedUrlPath) => {
    console.log('Kiosk: Processing scan for path:', scannedUrlPath)
    setIsLoading(true)
    setError(null)
    setLastStatus(null)

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
      // hitting /api/check-in-status/{userId} on your Go backend
      const response = await fetch(`/api/check-in-status/${userId}`)
      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(
          responseData.message || `Scan Error: ${response.status} ${response.statusText}`
        )
      }
      if (responseData.status === 'Error') {
        throw new Error(responseData.message || 'Backend error.')
      }

      // success
      setLastStatus({ ...responseData, timestamp: Date.now() })

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

  // -- Listen for keystrokes from the scanner
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.length > 1 && event.key !== 'Enter' && event.key !== 'Backspace') {
        return
      }

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
        inputBuffer.current = inputBuffer.current.slice(0, -1)
      } else {
        inputBuffer.current += event.key
      }

      clearTimeout(inputTimeoutRef.current)
      inputTimeoutRef.current = setTimeout(() => {
        if (inputBuffer.current) {
          console.log('Kiosk: Clearing input buffer due to timeout.')
          inputBuffer.current = ''
        }
      }, 750)
    }

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

  // -- Decide how to display UI
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
            {lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}
            {lastStatus.userEmail && <p className="kiosk-email">{lastStatus.userEmail}</p>}
            <p className="kiosk-status">ACTIVE</p>
          </>
        )
        break
      case 'Inactive':
        cardClass = 'kiosk-card status-inactive'
        content = (
          <>
            <h1>Status</h1>
            {lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}
            {lastStatus.userEmail && <p className="kiosk-email">{lastStatus.userEmail}</p>}
            <p className="kiosk-status">INACTIVE / EXPIRED</p>
            {lastStatus.message && <p className="kiosk-message">{lastStatus.message}</p>}
          </>
        )
        break
      case 'NotFound':
        cardClass = 'kiosk-card status-notfound'
        content = (
          <>
            <h1>Status</h1>
            {lastStatus.userName && <p className="kiosk-name">{lastStatus.userName}</p>}
            {lastStatus.userEmail && <p className="kiosk-email">{lastStatus.userEmail}</p>}
            <p className="kiosk-status">NOT FOUND</p>
            {lastStatus.message && <p className="kiosk-message">{lastStatus.message}</p>}
          </>
        )
        break
      default: // "Error" or unknown
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
