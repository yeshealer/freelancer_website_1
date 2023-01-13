import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCountryAlphaListAction, getWorldCountriesAction, setFilteredCountriesAction, getCountryListAction } from '../../redux';
import Loader from '../../mComponents/mExplore/mLoader';
import { getWidth, isMobile } from '../../mCommons/mUtils';

import SingleCountryComponent from './Components/SingleCountyComponent';

import './mWorldCountries.css';
import { _lang, getLanguageKey } from '../../utils';

class mWorldCountriesPage extends Component {

  state = {
    showSearch: false
  }

  onInputChange = (event) => {
    const { value: searchTerm } = event.target;
    this.props.setFilteredCountriesAction(searchTerm);
  }

  toggleSearch = () => {
    setTimeout(() => document.getElementById('countrySearchM').focus());
    this.setState({ showSearch: !this.state.showSearch });
  }

  onBlurInput = () => {
    this.setState({ showSearch: false });
  }

  renderLoader = () => {
    if (!this.state.worldCountries) {
      return <Loader />;
    }
  }

  createBreadCrumbs = () => (
    <Link to='/'>
      <img
        src={(getLanguageKey() === 'ar') ? '/assets/images/arrow-right.svg' : '/assets/images/arrow-left.svg'}
        alt='placeholder'
      />
      <span>{_lang('home')}</span>
    </Link>
  )

  renderSubCountries = (worldCountriesAlpha) => {
    if (worldCountriesAlpha) {
      return Object.keys(worldCountriesAlpha).map((key => (
        <div key={key} className='countryGroupM'>
          <p style={{ color: '#000 !important' }}>{worldCountriesAlpha[key].alphabet}</p>
          <div className='countryGroupListM'>
            {
              worldCountriesAlpha[key].countriesList.map(country =>
                <SingleCountryComponent country={country} key={country.countryId} />
              )
            }
          </div>
        </div>
      )));
    }
  }

  componentDidMount() {
    document.title = _lang('countries');
    const { getCountryAlphaListAction, countryList, getCountryListAction } = this.props;
    if (!countryList.length) {
      getCountryListAction().catch(() => {
        console.log('Error on getCountryListAction');
      });
    }

    this.props.setFilteredCountriesAction(null);
    getCountryAlphaListAction();
  }

  render() {
    let mColClass = '';

    if (isMobile()) {
      mColClass = 'mCol2';
    } else if (getWidth() >= 1200) {
      mColClass = 'mCol4';
    } else if (getWidth() >= 1024) {
      mColClass = 'mCol3';
    } else {
      mColClass = 'mCol2';
    }

    const { countryAlphaListObj, filteredCountriesAlphaListObj } = this.props;
    let countryList = [];

    if (filteredCountriesAlphaListObj.length > 0) {
      countryList = filteredCountriesAlphaListObj;
    } else {
      countryList = countryAlphaListObj;
    }

    return (
      <div className={`worldCountriesContainerM ${isMobile() ? 'wizardMobile' : 'wizardDesktop'}`}>
        <div className='topM'>
          {this.createBreadCrumbs()}
        </div>
        <div className='middleM'>
          <h1>{_lang('countries')}</h1>
          <p style={{ color: '#fff', opacity: '0.3' }}>{_lang('not_all_world_countries_included')}</p>
          <button
            onClick={this.toggleSearch} style={{ display: (this.state.showSearch) ? 'none' : 'block' }}
            className="searchButtonCountryM"
          >
            <img src='/assets/images/search-light.svg' alt='placeholder' />
          </button>
          <span
            className="searchCountryContentM"
            style={{ display: (this.state.showSearch || isMobile()) ? 'block' : 'none' }}
          >
            <img src='/assets/images/search-light.svg' alt='placeholder' />
            <input
              placeholder={this.state.search_country}
              id="countrySearchM"
              onBlur={this.onBlurInput}
              onChange={this.onInputChange}
            />
            <span className="clearfix" />
          </span>
        </div>
        <div className="bottomM customScrollbar">
          <div className={`countryGroupWrapperM ${mColClass}`}>
            {this.renderSubCountries(countryList)}

            {/*{this.renderSubCountries(worldCountriesAlpha)}*/}
          </div>
        </div>
      </div>
    );
  }
}

const actions = {
  setFilteredCountriesAction,
  getWorldCountriesAction,
  getCountryAlphaListAction,
  getCountryListAction,
};

const mapStateToProps = (state) => ({
  countryList: state.countryReducer.countryList,
  countryObj: state.countryReducer,
  countryAlphaListObj: state.countryReducer.countryAlphaListObj,
  filteredCountriesAlphaListObj: state.countryReducer.filteredCountriesAlphaListObj,

});

export default connect(mapStateToProps, actions)(mWorldCountriesPage);
