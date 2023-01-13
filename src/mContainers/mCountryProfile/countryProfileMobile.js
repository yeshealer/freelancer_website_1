import React from 'react';

const getCountryProfileMobile = (CountryProfileDesktop) => class countryProfileMobile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
    };
  }

  openPillarMenu = () => {
    this.setState({ menuOpen: true });
  }

  mobileMenuIcon = () => (
    <span className="pillar-menu" onClick={this.openPillarMenu.bind(this)}>
      <img src="/assets/svg/pillars-white.svg" />
    </span>
  )

  render() {
    return (
      <CountryProfileDesktop
        {...this.props}
        numOfSlides={1}
        centerMode
        slidesToScroll={1}
        arrows={false}
        step={1}
        mobileMenuIcon={this.mobileMenuIcon}
      />);
  }
};

export default getCountryProfileMobile;
