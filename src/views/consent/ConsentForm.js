import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { auth } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { CButton, CAlert } from '@coreui/react'

// 1) Import jsPDF and Firebase Storage
import { jsPDF } from 'jspdf'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage'

const PAGE_WIDTH = 612 // letter width in points (8.5in * 72)
const PAGE_HEIGHT = 792 // letter height in points (11in * 72)
const LEFT_MARGIN = 40
const RIGHT_MARGIN = 40
const LINE_SPACING = 15 // vertical spacing between lines

const ConsentForm = () => {
  // Basic Personal Info
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')

  // Emergency Contact
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')

  // Health & Liability Acknowledgments
  const [hasMedicalIssues, setHasMedicalIssues] = useState(false)
  const [medicalIssuesDescription, setMedicalIssuesDescription] = useState('')
  const [liabilityAgreed, setLiabilityAgreed] = useState(false)
  const [rulesAgreed, setRulesAgreed] = useState(false)

  // UI states
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Signature
  const signatureRef = useRef(null)
  const navigate = useNavigate()

  // ---------------------
  // Page Writing Helpers
  // ---------------------
  function wrapAndPrint(doc, text, x, y, maxWidth) {
    // Use jsPDF splitTextToSize to wrap text by maxWidth
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line) => {
      // If we're about to go off the page, add a new page
      if (y > PAGE_HEIGHT - 60) {
        doc.addPage()
        y = 60 // top margin on new page
      }
      doc.text(line, x, y)
      y += LINE_SPACING
    })
    return y
  }

  function checkPageOverflow(doc, currentY) {
    // If there's not enough space for next line or section, add a page
    if (currentY > PAGE_HEIGHT - 60) {
      doc.addPage()
      return 60 // reset y
    }
    return currentY
  }

  // ---------------------
  // Handle Submit
  // ---------------------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        setError('You must be logged in to submit the consent form.')
        setIsSubmitting(false)
        return
      }

      // 1) Capture the signature from canvas
      let signatureDataURL = ''
      if (signatureRef.current) {
        signatureDataURL = signatureRef.current.getCanvas().toDataURL('image/png')
      }

      // 2) Generate PDF with jsPDF
      const doc = new jsPDF('p', 'pt', 'letter') // 8.5x11 inches in points
      let yPos = 60 // top margin

      doc.setFontSize(16)
      doc.text('Boxing Gym Waiver & Release of Liability', LEFT_MARGIN, yPos)
      yPos += 30

      doc.setFontSize(12)

      // Basic Info
      yPos = wrapAndPrint(
        doc,
        `Name: ${name}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )
      yPos = wrapAndPrint(
        doc,
        `Date of Birth: ${dob}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )
      yPos = wrapAndPrint(
        doc,
        `Phone: ${phone}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )
      yPos = wrapAndPrint(
        doc,
        `Email: ${email}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )

      // Emergency Contact
      yPos += 10
      yPos = checkPageOverflow(doc, yPos)
      yPos = wrapAndPrint(
        doc,
        `Emergency Contact: ${emergencyContactName}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )
      yPos = wrapAndPrint(
        doc,
        `Emergency Contact Phone: ${emergencyContactPhone}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )

      // Medical Issues
      yPos += 10
      yPos = checkPageOverflow(doc, yPos)
      if (hasMedicalIssues) {
        yPos = wrapAndPrint(
          doc,
          `Medical Issues: YES`,
          LEFT_MARGIN,
          yPos,
          PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
        )
        yPos = wrapAndPrint(
          doc,
          `Description: ${medicalIssuesDescription}`,
          LEFT_MARGIN,
          yPos,
          PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
        )
      } else {
        yPos = wrapAndPrint(
          doc,
          'Medical Issues: NO',
          LEFT_MARGIN,
          yPos,
          PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
        )
      }

      // Add disclaimers / liability text
      const disclaimers = [
        '1. I acknowledge that boxing, kickboxing, or fitness activities carry inherent risks including injury or death.',
        '2. I confirm that I am physically fit and do not suffer from any condition or injury that would limit my participation.',
        '3. I agree to abide by the gym’s rules and regulations at all times.',
        '4. I assume full responsibility for any and all injuries, losses, or damages that may occur during my participation.',
        '5. I release the gym, its owners, and staff from all liability for any injury, harm, or loss sustained.',
      ]

      yPos += 10
      yPos = checkPageOverflow(doc, yPos)
      disclaimers.forEach((line) => {
        yPos = wrapAndPrint(doc, line, LEFT_MARGIN, yPos, PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN)
      })

      // Indicate agreement
      yPos += 10
      yPos = checkPageOverflow(doc, yPos)
      yPos = wrapAndPrint(
        doc,
        `Liability Agreement: ${liabilityAgreed ? 'Agreed' : 'Not Agreed'}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )
      yPos = wrapAndPrint(
        doc,
        `Rules & Safety Agreement: ${rulesAgreed ? 'Agreed' : 'Not Agreed'}`,
        LEFT_MARGIN,
        yPos,
        PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
      )

      // If signature present
      yPos += 20
      yPos = checkPageOverflow(doc, yPos)
      if (signatureDataURL) {
        // If near bottom, add page so signature doesn't get cut off
        if (yPos > PAGE_HEIGHT - 120) {
          doc.addPage()
          yPos = 60
        }
        doc.addImage(signatureDataURL, 'PNG', LEFT_MARGIN, yPos, 200, 80)
        yPos += 100
      }

      // Date/Time stamp
      yPos += 10
      yPos = checkPageOverflow(doc, yPos)
      doc.text(`Signed on: ${new Date().toLocaleString()}`, LEFT_MARGIN, yPos)

      // 3) Convert to base64 and upload
      const pdfBase64 = doc.output('datauristring')
      const storage = getStorage()
      const filePath = `consents/${currentUser.uid}/consent_${Date.now()}.pdf`
      const storageRef = ref(storage, filePath)
      await uploadString(storageRef, pdfBase64, 'data_url')
      const pdfDownloadURL = await getDownloadURL(storageRef)

      // 4) Send data to backend please
      const token = await currentUser.getIdToken()
      const res = await fetch('http:localhost:8080/api/submit-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          dateOfBirth: dob,
          phone,
          emergencyContactName,
          emergencyContactPhone,
          hasMedicalIssues,
          medicalIssuesDescription,
          liabilityAgreed,
          rulesAgreed,
          signature: signatureDataURL,
          pdfURL: pdfDownloadURL,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(`Error submitting consent: ${text}`)
        setIsSubmitting(false)
        return
      }

      // Success -> navigate
      navigate('/memberships')
    } catch (err) {
      console.error('Error submitting consent:', err)
      setError('Unexpected error submitting consent.')
      setIsSubmitting(false)
    }
  }

  const clearSignature = () => {
    setError('')
    if (signatureRef.current) {
      signatureRef.current.clear()
    }
  }

  // Loading
  if (isSubmitting) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>One moment, we’re submitting your consent form...</h2>
      </div>
    )
  }

  // Render
  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2>Boxing Gym Consent & Waiver Form</h2>
      {error && <CAlert color="danger">{error}</CAlert>}

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="mb-3">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            required
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date of Birth:</label>
          <input
            type="date"
            required
            className="form-control"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number:</label>
          <input
            type="tel"
            required
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            required
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Emergency Contact */}
        <hr />
        <h4>Emergency Contact</h4>
        <div className="mb-3">
          <label className="form-label">Contact Name:</label>
          <input
            type="text"
            required
            className="form-control"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Phone:</label>
          <input
            type="tel"
            required
            className="form-control"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
          />
        </div>

        {/* Medical Condition */}
        <hr />
        <h4>Medical Disclosure</h4>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={hasMedicalIssues}
            onChange={(e) => setHasMedicalIssues(e.target.checked)}
          />
          <label className="form-check-label">
            I have pre-existing medical conditions or injuries.
          </label>
        </div>
        {hasMedicalIssues && (
          <div className="mb-3">
            <label className="form-label">Please describe your condition(s):</label>
            <textarea
              className="form-control"
              rows={3}
              value={medicalIssuesDescription}
              onChange={(e) => setMedicalIssuesDescription(e.target.value)}
            />
          </div>
        )}

        {/* Liability & Rules */}
        <hr />
        <h4>Liability & Rules Agreement</h4>
        <p className="text-muted">
          Please review the following statements:
          <br />
          <br />
          1) I understand that boxing/kickboxing/fitness activities carry inherent risks of physical
          injury.
          <br />
          2) I confirm I am physically and medically able to participate.
          <br />
          3) I release the gym from any liability arising from injuries, losses, or damages.
          <br />
          4) I agree to follow all safety rules and gym regulations.
        </p>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={liabilityAgreed}
            onChange={(e) => setLiabilityAgreed(e.target.checked)}
            required
          />
          <label className="form-check-label">
            I have read and agree to the liability release terms above.
          </label>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={rulesAgreed}
            onChange={(e) => setRulesAgreed(e.target.checked)}
            required
          />
          <label className="form-check-label">
            I agree to follow all gym rules and safety guidelines.
          </label>
        </div>

        {/* Signature */}
        <hr />
        <h4>Signature</h4>
        <p className="text-muted">Please sign below to indicate your acceptance.</p>
        <div
          style={{
            border: '1px solid #ccc',
            width: '100%',
            height: '200px',
            marginBottom: '0.5rem',
          }}
        >
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          />
        </div>
        <CButton color="secondary" type="button" onClick={clearSignature}>
          Clear Signature
        </CButton>

        {/* Submit */}
        <hr />
        <CButton color="primary" className="mt-3" type="submit">
          Submit Consent
        </CButton>
      </form>
    </div>
  )
}

export default ConsentForm
