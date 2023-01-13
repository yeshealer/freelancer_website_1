import React from 'react';
import { connect } from 'react-redux';
import FullPagePanel from '../../commons/FullPagePanel/FullPagePanel';
import { _lang, isMobile } from '../../../utils';
import { getCountryAlphaListAction, getKpiValueAction, setStatsSelectedCountriesAction } from '../../../redux';
import { withRouter } from 'react-router-dom';
import { colorSetG, getColorByDataV2, getHeight } from '../../../mCommons/mUtils';
import setStatsSelectedGroups from '../../../redux/actions/setStatsSelectedGroups';
import searchOnCountryList from './utils/searchOnCountryList';

const _ = require('lodash');

class CountrySelectorMobile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      alertIsShow: false,
      countryListSearchIsActive: false,

      countryListSearchResultList: [],
      countryListAlphabetic: []

    };

    const { getCountryAlphaListAction } = this.props;
    getCountryAlphaListAction();
  }

  closeModal() {

  }

  onDoneClick() {

  }

  handleSearch(event) {
    if (event.target.value.length <= 1) {
      this.setState({ countryListSearchResultList: [], countryListSearchIsActive: false });
    } else {
      const { countryAlphaListObj } = this.props;

      const filteredResult = searchOnCountryList(countryAlphaListObj, event.target.value);
      this.setState({ countryListSearchResultList: filteredResult, countryListSearchIsActive: true });
    }
  }

  toggleCountry(value) {
    const {
      statsSelectedCountries, setStatsSelectedCountriesAction
    } = this.props;

    const newList = [...statsSelectedCountries];

    if (statsSelectedCountries.indexOf(value) > -1) {
      _.pull(newList, value);
    } else {
      newList.push(value);
    }

    setStatsSelectedCountriesAction(newList.join(','))
      .then(response => {
        if (response === false) {
          this.setState({ alertIsShow: true });
        }
      });
  }

  printAlertModal() {
    if (!this.state.alertIsShow) { return; }

    return (<div>
      <div className="alertBackOverlayM" />
      <div className="alertModalM">
        <div className="warningHeaderM">
          <img src="/assets/svg/warning.svg" />
        </div>

        <div className="warningContentM">
          <div className="warningTitleM">{_lang('oh_snap')}</div>
          <div className="warningDescM">{_lang('max_5_country')}</div>
          <div className="okButtonM" onClick={() => this.setState({ alertIsShow: false })}>{_lang('ok_btn')}</div>
        </div>
      </div>
    </div>);
  }

  render() {
    const height = getHeight() - 150;
    const {
      statsSelectedCountries, countryAlphaListObj
    } = this.props;

    return (
      <FullPagePanel
        zIndex={100}
        headerType={3}
        isMobile={isMobile()}
        isOpen
        title={`${_lang('add_countries')} (${statsSelectedCountries.length}/5)`}
        subTitle=""
      >
        <div>
          {this.printAlertModal()}
          <div className="gapM30" />

          <div className="searchBoxM">
            <div className="searchInputWrapper">
              <div className="searchInputM">
                <i className="placeholder-search-icon search-img-icon" />
                <input ref="searchInput" placeholder={_lang('search_country')} onChange={this.handleSearch.bind(this)} />
              </div>
            </div>
          </div>

          <div className="countryListAlpha innerSidePadding overFlowYScroll" style={{ height }}>
            <div className="row">

              {(() => {
                const list = [];
                let tempList = null;
                if (this.state.countryListSearchIsActive) { tempList = this.state.countryListSearchResultList; } else { tempList = countryAlphaListObj; }

                const selectedCountryList = statsSelectedCountries;
                tempList.forEach((x) => {
                  const countryItemList = [];

                  x.countriesList.forEach((y) => {
                    countryItemList.push(
                      <div
                        onClick={this.toggleCountry.bind(this, y.countryId)}
                        key={`key-${y.countryId}`}
                        className={((selectedCountryList.indexOf(y.countryId) > -1) ? 'active countryNameM' : 'countryNameM')}
                      >
                        {y.countryTextMap.name}
                        <div className="check-img-icon" />
                      </div>
                    );
                  });
                  const listItem = (<div key={`key-alp-${x.alphabet}`} className="col-xs-6 langFloat">
                    <div className="letterTitleM">{x.alphabet}</div>
                    {countryItemList}
                  </div>);

                  list.push(listItem);
                });

                if (list.length > 0) { return list; }
                return (<div className="col-xs-12 marginTop30">{_lang('no_results')}</div>);
              })()}

            </div>
          </div>

        </div>
      </FullPagePanel>
    );
  }
}

const mapStateToProps = (state) => ({
    selectedYearStart: state.coreReducer.selectedYearStart,
    selectedYearEnd: state.coreReducer.selectedYearEnd,
    statsSelectedCountries: state.coreReducer.statsSelectedCountries,
    kpiScoreMap: state.kpiReducer.kpiScoreMap,
    selectedKPI: state.coreReducer.selectedKPI,
    selectedLanguage: state.coreReducer.selectedLanguage,
    countryList: state.countryReducer.countryList,
    countryKeyMap: state.countryReducer.countryKeyMap,
    selectedYear: state.coreReducer.selectedYear,
    statsSelectedGroups: state.coreReducer.statsSelectedGroups,
    groupList: state.groupsReducer.groups,
    groupKeyMap: state.groupsReducer.groupKeyMap,
    selectedKPIId: state.coreReducer.selectedKPIId,
    kpiValue: state.kpiReducer.kpiValue,
    countryAlphaListObj: state.countryReducer.countryAlphaListObj
  });

const actions = {
  setStatsSelectedCountriesAction,
  getKpiValueAction,
  setStatsSelectedGroups,
  getCountryAlphaListAction
};

export default withRouter(connect(mapStateToProps, actions)(CountrySelectorMobile));
