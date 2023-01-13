import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';

import { _lang, isMobile } from '../../../utils'
import { trimString } from '../../../mCommons/mUtils';
import PagePanel from '../../commons/PagePanel/PagePanel';
import mCircularProgress from '../../../mComponents/mWorldMap/mCircularProgress';

import {
  setStatsSelectedCountriesAction,
  setCloseableModalAction,
  toggleStatsSelectedCountriesAction, setSelectedCountryAction
} from '../../../redux'
import getPath from '../../../utils/getPath';
import setMobileOverlayStateAction from '../../../redux/actions/setMobileOverlayStateAction';
import BreadCrumbComponent from '../../commons/BreadCrumbComponent'

const _ = require('lodash');

class CompareCountries extends React.Component {

  createSelectDropDown() {
    const { statsSelectedCountries, setStatsSelectedCountriesAction } = this.props;
    const { countryList } = this.props.countryObj;

    const countryModifiedList = countryList.map((country) => ({
      ...country,
      countryName: country.countryTextMap.name
    }));

    return (
      <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
        <Select
          simpleValue
          multi
          clearable={false}
          searchable
          placeholder={_lang('select_countries_placeholder')}
          labelKey="countryName"
          valueKey="countryId"
          value={statsSelectedCountries.slice(0, 5)}
          options={countryModifiedList}
          onChange={(value) => {
            setStatsSelectedCountriesAction(value);
          }}
        />
        {(() => {
          if (statsSelectedCountries.length > 0) {
            return (
              <div
                onClick={() => setStatsSelectedCountriesAction('')}
                className="clearInputM"
              >
                {_lang('clear_all')}
              </div>
            );
          }
        })()}
      </div>
    );
  }

  noCountryDesktop() {
    return (
      <div className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar">
        <div className="flexBoxItemGrow">
          <div className="noCountryDesktop">
            <img src="/assets/images/nocountry.png" />
            <div className="headerOfMessage">{_lang('no_country_text_line_1')}</div>
            <div className="bodyOfMessage">{_lang('no_country_text_line_2')}</div>
          </div>
        </div>
      </div>
    );
  }

  compareItems() {
    const countryListMap = {};
    const items = [];
    const { statsSelectedCountries, kpiScoreMap, selectedYear, countryKeyMap, toggleStatsSelectedCountriesAction } = this.props;

    return statsSelectedCountries.slice(0, 5).map((val, i) => {
      const data = _.get(kpiScoreMap, `${selectedYear}.areas.${val}`, {});
      const country = _.get(countryKeyMap, `${val}`, {});

      return (
        <div key={`CompareDiv_${i}`} className="compareCircleM col-xs-6 langFloat">
          {mCircularProgress(data.dataValue, data.value)}
          <div className="countryNameM">
            {country.countryTextMap.name}
            <span onClick={() => toggleStatsSelectedCountriesAction(country.countryId)} className="cross-img-icon" />
          </div>
        </div>
      );
    });
  }

  renderAddCountries() {
    if (this.props.statsSelectedCountries.length < 5) {
      const { setMobileOverlayStateAction } = this.props;
      return (
        <div
          className="addCountriesContainer col-xs-6 langFloat"
        >
          <div
            onClick={() => setMobileOverlayStateAction('isMobileOverlayCountrySelector', true)}
            className="addCountriesM"
          >+<span>{_lang('add_countries')}</span></div>
        </div>
      );
    }
  }

  renderCompareCountries() {
    if (this.props.statsSelectedCountries.length <= 0) {
      if(isMobile()){
        this.renderAddCountries();
      }else{
        return this.noCountryDesktop();

      }
    }

    const { setMobileOverlayStateAction } = this.props;

    if(this.props.selectedKPI.kpi === undefined){
      return null;
    }

    return [
      <div
        key="compareItems"
        className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar marginBottom20"
      >
        <div className="flexBoxItemGrow">
          <div className="compareCirclesM row">
            {this.compareItems()}
            {isMobile() && this.renderAddCountries()}
            <div className="clearfix" />
          </div>
          {(() => {
            if (this.props.statsSelectedCountries.length <= 0) {
              return;
            }
            return (
              <div className="bottomButtonsM">
                <div
                  onClick={() => this.props.history.push(getPath('/world-map/compare/graph'))}
                  className="generateGraphicsM"
                >
                  {_lang('generate_graphics')}
                </div>
                <div
                  onClick={() => this.props.history.push(getPath('/world-map/compare/full-stats'))}
                  className="fullStatsM"
                >{`${_lang('full_stats_for')} ${this.props.selectedKPI.kpi.kpiTextMap.title}`}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    ];
  }

  render() {
    const { match, selectedKPI, setStatsSelectedCountriesAction, setSelectedCountryAction } = this.props;
    const isOpen = (match.params.pageId === 'compare');

    // let kpiName = '';
    // if (selectedKPI.id !== undefined) { kpiName = selectedKPI.kpi.kpiTextMap.title; }

    return (
      <PagePanel
        gradientClass="darkGreenGradientM"
        isOpen={isOpen}
        title={_lang('compare_title')}
        subTitle={<BreadCrumbComponent />}
        onClickCloseIcon={() => {
          setStatsSelectedCountriesAction('');
          setSelectedCountryAction({});
        }}
      >
        {!isMobile() && this.createSelectDropDown()}
        {this.renderCompareCountries()}
      </PagePanel>
    );
  }
}

CompareCountries.propTypes = {};

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
  selectedYear: state.coreReducer.selectedYear,
  countryObj: state.countryReducer,
  statsSelectedCountries: state.coreReducer.statsSelectedCountries,
  statsSelectedGroups: state.coreReducer.statsSelectedGroups,
  kpiScoreMap: state.kpiReducer.kpiScoreMap,
  selectedCountry: state.coreReducer.selectedGroup,
  countryKeyMap: state.countryReducer.countryKeyMap
});

const actions = {
  setStatsSelectedCountriesAction,
  setCloseableModalAction,
  setMobileOverlayStateAction,
  toggleStatsSelectedCountriesAction,
  setSelectedCountryAction
};

export default withRouter(connect(mapStateToProps, actions)(CompareCountries));
