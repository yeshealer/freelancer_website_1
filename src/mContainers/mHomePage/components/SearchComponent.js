import React from 'react';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';

import {
  setFilteredCountriesAction,
  setSelectedCountryAction,
  setFilteredKpiListAction,
  setSelectedKPIAction, setStatsSelectedCountriesAction,
} from '../../../redux'

import { isMobile } from '../../../mCommons/mUtils';
import * as generalUtils from '../../../mCommons/mUtils/generalUtils';

import './SearchComponent.css';
import { _lang, getLanguageKey, getPath } from '../../../utils'

class SearchComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  countryItem(countryItem) {
    return (
      <div
        onClick={() => {
          this.props.setFilteredCountriesAction(null);
          this.props.setFilteredKpiListAction(null);
          this.props.setSelectedCountryAction(countryItem);

          this.props.history.push(`/country-profile/${countryItem.countryId}?lang=${getLanguageKey()}`);
        }}
        key={`countrySearchItem_${countryItem.countryId}`}
      >
        <Highlighter
          highlightClassName='highLightKeyword'
          searchWords={[this.props.self.state.searchKeywordForKPI]}
          autoEscape
          textToHighlight={countryItem.countryTextMap.name}
        />
      </div>
    );
  }

  kpiItemList(pillarId, kpiList) {
    const list = [];
    kpiList.forEach((kpi) => {
      list.push(
        <div
          onClick={() => {
            // console.log("xxx", x);
            // generalUtils.createCookie('kpiId', x.id);
            // generalUtils.createCookie('countryId', '', 7);
            //
            // const { selectedKPIPath } = this.props;
            // const kpiPath = [...selectedKPIPath, ...[]];
            //

            this.props.setSelectedKPIAction(kpi.path, kpi);
            this.props.setSelectedCountryAction({});
            this.props.setStatsSelectedCountriesAction('');

            let path;
            if (isMobile()) {
              path = getPath('/world-map/ranking', { selectedKPIId: kpi.kpi.id, selectedKPIPath: kpi.path });
            } else {
              path = getPath('/world-map', { selectedKPIId: kpi.kpi.id, selectedKPIPath: kpi.path });
            }

            this.props.history.push(path);
          }} key={kpi.id}
        >
          <Highlighter
            highlightClassName='highLightKeyword'
            searchWords={[this.props.self.state.searchKeywordForKPI]}
            autoEscape
            textToHighlight={kpi.kpi.kpiTextMap.title}
          />
        </div>
      );
    });
    return list;
  }

  pillarItem(pillarObj) {
    if (pillarObj === undefined) { return; }
    if (pillarObj.kpiList.length <= 0) { return; }

    return (
      <div key={pillarObj.pillarId} className="searchItemsM">
        <div className="pillarNameM">{pillarObj.pillarName}</div>
        <div className="kpiListM">
          {this.kpiItemList(pillarObj.pillarId, pillarObj.kpiList)}
        </div>
      </div>
    );
  }

  searchOnKPIList(value) {
    const listS = JSON.parse(JSON.stringify(this.props.searchableKPIList));
    return listS.filter((x) => x.kpi.kpiTextMap.title.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  searchOnCountryList(value) {
    const listCountry = this.props.countryList;

    return listCountry.filter((x) => x.countryTextMap.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  handleSearch(event) {
    if (event.target.value.length <= 2) {
      this.props.setFilteredCountriesAction(null);
      this.props.setFilteredKpiListAction(null);
      this.props.self.setState({
        showNoResult: false,
        isSearchActive: false,
      });
    } else {
      this.props.setFilteredCountriesAction(event.target.value);
      this.props.setFilteredKpiListAction(event.target.value);

      this.props.self.setState({
        showNoResult: false,
        isSearchActive: true,
        searchKeywordForKPI: event.target.value
      });
    }
  }

  render() {
    const selfState = this.props.self.state;

    return (
      <div className="search-component">
        <div className="sc-input-wrapper">
          <div ref="searchInputM" className="sc-input">
            <i className="fa fa-search" />
            <input
              ref="searchInput"
              placeholder={_lang('search_placeholder')}
              onChange={this.handleSearch.bind(this)}
            />
          </div>

          <div className="sc-detail">
            {(() => {
              if (this.props.filteredKpiList.length === 0 &&
                this.props.filteredCountries.length === 0) {
                return;
              }

              let resultCount = this.props.filteredKpiList.length +
                this.props.filteredCountries.length;

              if (selfState.showNoResult && resultCount <= 0) {
                return (<span
                  key="noResultM"
                  className="no-result"
                >{_lang('no_results')}</span>);
              }

              if (selfState.showNoResult) {
                return;
              }

              const list = [];

              resultCount = 0;

              resultCount += this.props.filteredCountries.length;
              if (this.props.filteredCountries.length > 0 || this.props.filteredKpiList.length) {
                const countryList = [];
                this.props.filteredCountries.forEach((x) => {
                  countryList.push(this.countryItem(x));
                });

                if (this.props.filteredKpiList.length) {
                  list.push(this.kpiItemList(null, this.props.filteredKpiList));
                }

                return (
                  <div key="countrySearchContainer" className="searchItemsM">
                    <div
                      className="pillarNameM"
                    >{_lang('search_country_title')}</div>
                    <div className="kpiListM">
                      {countryList}
                    </div>
                    <div
                      className="pillarNameM"
                    >{_lang('kpis')}</div>
                    <div className="kpiListM">
                      {list}
                    </div>
                  </div>
                );
              }

              if (selfState.isSearchActive && resultCount > 0) {
                return (<span
                  key="resultsFound"
                  className="results-found"
                >
                  {resultCount} {(getLanguageKey() === 'en') ? 'result(s) found.' : 'نتائج'}
                  </span>);
              }
            })()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  filteredCountries: state.countryReducer.filteredCountries,
  selectedKPIPath: state.coreReducer.selectedKPIPath,
  filteredKpiList: state.kpiReducer.filteredKpiList,
  searchableKPIList: state.coreReducer.searchableKPIList,
  countryList: state.countryReducer.countryList,
  selectedLanguage: state.coreReducer.selectedLanguage,
});

const actions = {
  setSelectedCountryAction,
  setFilteredCountriesAction,
  setFilteredKpiListAction,
  setSelectedKPIAction,
  setStatsSelectedCountriesAction
};

export default connect(mapStateToProps, actions)(SearchComponent);
