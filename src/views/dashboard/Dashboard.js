import React from 'react';
import { CCarousel, CCarouselItem } from '@coreui/react';
import ReactImg from '../../assets/images/react.jpg';

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

          .carousel-video,
          .carousel-image {
            width: 100vw;
            height: auto;
          }

          .responsive-video {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
          }

          .responsive-video iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
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
            color: red;
            font-weight: bold;
          }
        `}
      </style>
      <div className="full-width-carousel">
        <CCarousel controls indicators>
          {/* First Carousel Item: YouTube Video */}
          <CCarouselItem>
            <div className="responsive-video">
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
            <img className="carousel-image" src={ReactImg} alt="slide 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Slide 2 Title</h5>
              <p>Slide 2 Description</p>
            </div>
          </CCarouselItem>
          {/* Third Carousel Item: Image */}
          <CCarouselItem>
            <img className="carousel-image" src={ReactImg} alt="slide 3" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Slide 3 Title</h5>
              <p>Slide 3 Description</p>
            </div>
          </CCarouselItem>
        </CCarousel>
      </div>
    </>
  );
};

export default Dashboard;
