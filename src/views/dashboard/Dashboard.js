import React from 'react';
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
} from '@coreui/react';
import BrickHouseImg1 from '../../assets/images/brickHouseBoxing.webp';
import BrickHouseImg2 from '../../assets/images/brickHouseBoxing2.webp';

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
            --cui-row-gap: 3rem; /* Adjust the row gap */
            --cui-column-gap: 3rem; /* Adjust the column gap */
          }

          /* Remove border around cards */
          .card-borderless {
            border: none;
          }
        `}
      </style>

      <div className="full-width-carousel">
        <CCarousel controls indicators interval={false}>
          {/* First Carousel Item: YouTube Video */}
          <CCarouselItem>
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
                src={BrickHouseImg1} // Replace with your image path
                alt="Slide 2"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h1 className="carousel-title">Premier Boxing Performance Center</h1>
              <CButton className="carousel-button">See Trainers</CButton>
            </div>
          </CCarouselItem>

          {/* Third Carousel Item: Image */}
          <CCarouselItem>
            <div className="carousel-item-content">
              <img
                src={BrickHouseImg2} // Replace with your image path
                alt="Slide 3"
              />
            </div>
            <div className="carousel-caption d-none d-md-block">
              <h1 className="carousel-title">Our Daily Class Schedule</h1>
              <CButton className="carousel-button">See Schedule</CButton>
            </div>
          </CCarouselItem>
        </CCarousel>
      </div>

      {/* New Title and Paragraph Underneath the Carousel */}
      <div className="section-title-container">
        <h2 className="section-title">Welcome to Our Gym</h2>
        <p className="section-subtitle">
          Experience the ultimate training environment with state-of-the-art facilities and expert
          trainers dedicated to your success.
        </p>
      </div>

      {/* Card Grid */}
      <CRow xs={{ cols: 1 }} md={{ cols: 3 }} className="custom-gap">
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={BrickHouseImg1} />
            <CCardBody>
              <CCardTitle>Card Title</CCardTitle>
              <CCardText className="text-black">
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This card has even longer content than the first to show that equal height
                action.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={BrickHouseImg1} />
            <CCardBody>
              <CCardTitle>Card Title</CCardTitle>
              <CCardText className="text-black">
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This card has even longer content than the first to show that equal height
                action.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard className="h-100 card-borderless bg-white">
            <CCardImage orientation="top" src={BrickHouseImg1} />
            <CCardBody>
              <CCardTitle>Card Title</CCardTitle>
              <CCardText className="text-black">
                This is a wider card with supporting text below as a natural lead-in to additional
                content. This card has even longer content than the first to show that equal height
                action.
              </CCardText>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
