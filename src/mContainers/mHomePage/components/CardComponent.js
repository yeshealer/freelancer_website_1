import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PillarComponent from './PillarComponent';
import SDGComponent from './SDGComponent';
import CountryProfileComponent from './CountryProfileComponent';
import DeepDivesComponent from './DeepDivesComponent';
import CarouselComponent from './CarouselComponent';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <img
        style={{ width: '50px', opacity: '0.5', margin: '-40px' }} src="/assets/svg/arrow-right-button.svg"
        alt="arrow_right"
      />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <img
        style={{ width: '50px', opacity: '0.5', margin: '-34px' }} src="/assets/svg/arrow-left-button.svg"
        alt="arrow_left"
      />
    </div>
  );
}

class CardComponent extends React.Component {
  render() {
    const realmData = this.props.data;
    const dataCount = this.props.dataCount;

    /**
     * TO DO Refactor
     **/
    const carouselIndex = realmData.map((realm, i) => {
      if (i < 2) {
        return (
          <div key={`realm${i}`}>
            <CarouselComponent
              carouselId={realm.id}
              carouselCount={dataCount.mainEntityPageCount[realm.id]}
              carouselTitle={realm.nodeTextMap.title}
              descriptionShort={realm.nodeTextMap.description_short || 'Missing description'}
              carouselLabel={realm.label}
              carouselShortTitle={realm.nodeTextMap.title_short}
              handleClick={this.props.handleClick}
            />
          </div>
        );
      }
    });

    const carouselIndex2 = realmData.map((realm, i) => {
      if (i > 1) {
        return (
          <div key={`realm${i}`}>
            <CarouselComponent
              carouselId={realm.id}
              carouselCount={dataCount.mainEntityPageCount[realm.id]}
              carouselTitle={realm.nodeTextMap.title || 'Missing title'}
              descriptionShort={realm.nodeTextMap.description_short || 'Missing description'}
              carouselLabel={realm.label}
              carouselShortTitle={realm.nodeTextMap.title_short || 'Missing title_short'}
              handleClick={this.props.handleClick}
            />
          </div>
        );
      }
    });

    /***
     *
     **/

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 920,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            initialSlide: 2,
            arrows: false
          }
        },
        {
          breakpoint: 810,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            initialSlide: 2,
            centerMode: true,
          }
        },
        {
          breakpoint: 765,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            centerMode: true,
          }
        },
        {
          breakpoint: 550,
          settings: {
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            centerMode: true,
          }
        }
      ]
    };
    return (
      <Slider {...settings}>
        {carouselIndex}
        <CountryProfileComponent countryCount={dataCount.countryCount} />
        {carouselIndex2}
      </Slider>
    );
  }
}

export default CardComponent;
