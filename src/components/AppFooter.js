import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4 bg-black">
      <div>
        <a target="_blank" rel="noopener noreferrer" className="text-white">
          Showtime Boxing Fitness, LLC. All rights reserved.
        </a>
        <span className="ms-1">&copy; 2024</span>
      </div>
      <div className="ms-auto">
        <span className="me-1 text-white">Powered by</span>
        <a target="_blank" rel="noopener noreferrer" className="text-white">
          Usman Chaudhry
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
