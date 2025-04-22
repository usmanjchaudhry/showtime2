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
} from '@coreui/react'
import BrickHouseImg1 from '../../assets/images/brickHouseBoxing.webp'
import BrickHouseImg2 from '../../assets/images/brickHouseBoxing2.webp'
import ShowTimeImg1 from '../../assets/images/showtimeBoxing.webp'
import ShowTimeImg2 from '../../assets/images/showtimeBoxing2.webp'
import BrickHouseImg3 from '../../assets/images/brickHouseBoxingFlipped.png'
import showTimeImg3 from '../../assets/images/showTime4.png'
import showTimeImg4 from '../../assets/images/showTime6.png'
import showTimeImg5 from '../../assets/images/showTime8.png'
import showTimeImg6 from '../../assets/images/showTime9.jpg'
import showTimeImg7 from '../../assets/images/showTimeOutside.png'
import showTimeImg8 from '../../assets/images/showTime2.png'
import coachIvan from '../../assets/images/coachIvan.jpg'

const Dashboard = () => {
  return (
    <>
      {/* Inline CSS Styles */}
      <style>
        {`
          .full-width-carousel {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
          }

          .carousel-item-content {
            width: 100vw;
            height: 80vh; /* Set desired consistent height */
            overflow: hidden;
            position: relative;
          }

          .carousel-item-content img,
          .carousel-item-content iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
          }

          body {
            margin: 0;
            padding: 0;
          }

          /* Custom styles for carousel controls and indicators */
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
            background-color: red;
            width: 50px;
            height: 50px;
          }

          .carousel-indicators [data-coreui-target] {
            background-color: red;
            width: 15px;
            height: 15px;
          }

          .carousel-indicators [data-coreui-target].active {
            background-color: darkred;
          }

          .carousel-caption {
            position: absolute;
            bottom: 20%;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }

          .carousel-title {
            font-size: 3rem; /* Adjust the size as needed */
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
          }

          .carousel-button {
            background-color: red;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1.25rem;
            margin-top: 1rem;
            text-transform: uppercase;
            cursor: pointer;
          }

          .carousel-button:hover {
            background-color: darkred;
            color: white;
          }

          @media (max-width: 768px) {
            .carousel-title {
              font-size: 2rem;
            }
            .carousel-button {
              font-size: 1rem;
              padding: 0.5rem 1rem;
            }
          }

          /* Styles for the new section title */
          .section-title-container {
            text-align: center;
            margin-top: 2rem;
          }

          .section-title {
            font-size: 2.5rem; /* Adjust as needed */
            font-weight: bold;
            color: #333; /* Adjust the color as needed */
          }

          .section-subtitle {
            font-size: 1.2rem; /* Adjust as needed */
            color: #666; /* Adjust the color as needed */
            max-width: 800px;
            margin: 0.5rem auto 0; /* Centers the paragraph and adds top margin */
            line-height: 1.6;
          }

          @media (max-width: 768px) {
            .section-subtitle {
              font-size: 1rem;
              padding: 0 1rem;
            }
          }

          /* Custom styles for the card grid */
          .custom-gap {
            --cui-row-gap: 4rem; /* Increased row gap */
            --cui-column-gap: 4rem; /* Increased column gap */
            margin: 2rem 0; /* Optional: add top and bottom margin to the grid */
          }

          /* Remove border around cards */
          .card-borderless {
            border: none;
          }

          /* Ensure all card images are the same size */
          .card-image {
            width: 100%;
            height: 300px; /* Set desired image height */
            object-fit: cover;
          }

          /* Full-width card */
          .full-width-card {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            margin-right: calc(50% - 50vw);
          }

          .full-width-card-image {
            width: 100%;
            height: 700px; /* Adjust this value to reduce the height */
            object-fit: cover;
          }

          /* Custom input styles */
          .custom-input {
            background-color: white !important;
            color: black !important;
          }

          /* Placeholder styling */
          .custom-input::placeholder {
            color: gray;
            opacity: 1;
          }

          .custom-input::-webkit-input-placeholder {
            color: gray;
          }

          .custom-input::-moz-placeholder {
            color: gray;
          }

          .custom-input:-ms-input-placeholder {
            color: gray;
          }

          .custom-input::-ms-input-placeholder {
            color: gray;
          }
        `}
      </style>
      {/* Carousel */} {/* Carousel */}
      <div className="full-width-carousel">
        <CCarousel controls indicators interval={false}>
          {/* First Carousel Item: YouTube Video */}
          {/*  <CCarouselItem>
            <div className="carousel-item-content">
              <iframe
                src="https://www.youtube.com/embed/RBFmH5qd-mg?autoplay=1&mute=1"
                title="YouTube video player"
                frameBorder="0"
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
          </CCarouselItem>

          {/* Second Carousel Item: Image */}
          <CCarouselItem>
            <div className="carousel-item-content">
              <img
                src={showTimeImg5} // Replace with your image path
                alt="Slide 2"
              />
            </div>
            <div className="carousel-caption">
              <h1 className="carousel-title">Premier Boxing Performance Center</h1>
              <CButton href="#/schedule" className="carousel-button">
                See Programs
              </CButton>
            </div>
          </CCarouselItem>

          {/* Third Carousel Item: Image */}
          <CCarouselItem>
            <div className="carousel-item-content">
              <img
                src={showTimeImg8} // Replace with your image path
                alt="Slide 3"
              />
            </div>
            <div className="carousel-caption">
              <h1 className="carousel-title">Our Daily Class Schedule</h1>
              <CButton href="#/schedule" className="carousel-button">
                See Schedule
              </CButton>
            </div>
          </CCarouselItem>
        </CCarousel>
      </div>
      {/* New Title and Paragraph Underneath the Carousel */}
      <div className="section-title-container">
        <h2 className="section-title">Welcome to Our Gym</h2>
        <p className="section-subtitle mb-3">
          Experience the ultimate training environment with state-of-the-art facilities and expert
          trainers dedicated to your success.
        </p>
      </div>
      {/* Card Grid */}
      <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="custom-gap">
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={ShowTimeImg2} className="card-image" />
            <CCardBody>
              <CCardTitle className="text-center text-black">Training Programs</CCardTitle>
              <CCardText className="text-black text-center">
                Discover our diverse training programs designed for all fitness levels.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={coachIvan} className="card-image" />
            <CCardBody>
              <CCardTitle className="text-center text-black">Expert Trainers</CCardTitle>
              <CCardText className="text-black text-center">
                Meet our team of professional trainers committed to your success.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={showTimeImg4} className="card-image" />
            <CCardBody>
              <CCardTitle className="text-center text-black">
                State-of-the-Art Facilities
              </CCardTitle>
              <CCardText className="text-black text-center">
                Experience training in our modern, fully-equipped facilities.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* Full-Width Card */}
      <CCard className="mb-3 bg-dark text-white full-width-card">
        <CCardImage src={showTimeImg6} className="full-width-card-image" />
        <CCardImageOverlay>
          <CCardTitle className="carousel-title">Join Our Community</CCardTitle>
          <CCardText>
            Become a part of our vibrant community where fitness meets fun. Our members support and
            motivate each other to reach new heights.
          </CCardText>
          <CCardText>
            Access top-notch training programs designed by industry experts to help you achieve your
            personal fitness goals.
          </CCardText>
          <CCardText>
            Enjoy our state-of-the-art facilities equipped with the latest technology and equipment.
          </CCardText>
          <CButton href="#/schedule" className="carousel-button">
            View Schedule
          </CButton>
        </CCardImageOverlay>
      </CCard>
      {/* Email List Section */}
      {/*  <div className="section-title-container">
        <h2 className="section-title">Email List</h2>
        <p className="section-subtitle mb-3">
          Add yourself to our mailing list to keep up with special events and guest visits.
        </p>
      </div>
      <CForm className="mb-3">
        <div className="d-flex justify-content-center">
          <CInputGroup style={{ maxWidth: '500px' }}>
            <CFormInput
              type="email"
              id="exampleFormControlInput1"
              placeholder="name@example.com"
              aria-describedby="exampleFormControlInputHelpInline"
              className="custom-input"
              style={{
                backgroundColor: 'white',
                color: 'black',
              }}
            />
            <CButton type="submit" className="bg-black text-white">
              Submit
            </CButton>
          </CInputGroup>
        </div>
        <CFormText id="exampleFormControlInputHelpInline" className="text-black text-center">
          Must be 8-20 characters long.
        </CFormText>
      </CForm>*/}
 <div className="section-title-container contact-info">
        <h2 className="section-title">Location & Contact</h2>
        <p>
          <strong>Address:</strong> 6817 Balboa Blvd B, Lake Balboa, CA 91406
        </p>
        <p>
          <strong>Phone:</strong> <a href="tel:+18186164486">(818) 616-4486</a>
        </p>
    {/* --- Instagram Link Added Below --- */}
    <p>
          <strong>Instagram:</strong> <a href="https://www.instagram.com/showtimeboxingla/?hl=en" target="_blank" rel="noopener noreferrer">@showtimeboxingla</a>
        </p>
      </div>
    </>
  )
}

export default Dashboard
