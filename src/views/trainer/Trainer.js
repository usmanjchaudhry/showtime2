import React from 'react'
import {
  CCarousel,
  CCarouselItem,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardText,
  CCardTitle,
  CCardImageOverlay,
  CForm,
  CFormInput,
  CFormText,
  CInputGroup,
  CCardFooter,
} from '@coreui/react'
import BrickHouseImg1 from '../../assets/images/brickHouseBoxing.webp'
import BrickHouseImg2 from '../../assets/images/brickHouseBoxing2.webp'
import ShowTimeImg1 from '../../assets/images/showtimeBoxing.webp'
import ShowTimeImg2 from '../../assets/images/showtimeBoxing2.webp'
import BrickHouseImg3 from '../../assets/images/brickHouseBoxingFlipped.png'
import powerSerge from '../../assets/images/powerSerge.png'
import coachIvan from '../../assets/images/coachIvan.jpg'

const Trainer = () => {
  return (
    <>
      Trainers Page
      <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
        <CCol xs>
          <CCard>
            <CCardImage
              orientation="top"
              src={powerSerge}
              style={{ width: '100%', height: '800px' }}
            />
            <CCardBody>
              <CCardTitle>Card title</CCardTitle>
              <CCardText>
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This content is a little bit longer.
              </CCardText>
            </CCardBody>
            <CCardFooter>
              <small className="text-body-secondary">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardImage
              orientation="top"
              src={coachIvan}
              style={{ width: '100%', height: '800px' }}
            />
            <CCardBody>
              <CCardTitle>Card title</CCardTitle>
              <CCardText>
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This content is a little bit longer.
              </CCardText>
            </CCardBody>
            <CCardFooter>
              <small className="text-body-secondary">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardImage orientation="top" src={BrickHouseImg1} />
            <CCardBody>
              <CCardTitle>Card title</CCardTitle>
              <CCardText>
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This content is a little bit longer.
              </CCardText>
            </CCardBody>
            <CCardFooter>
              <small className="text-body-secondary">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs>
          <CCard>
            <CCardImage orientation="top" src={BrickHouseImg1} />
            <CCardBody>
              <CCardTitle>Card title</CCardTitle>
              <CCardText>
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This content is a little bit longer.
              </CCardText>
            </CCardBody>
            <CCardFooter>
              <small className="text-body-secondary">Last updated 3 mins ago</small>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Trainer
