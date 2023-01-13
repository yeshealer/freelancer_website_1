import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';
import { connect } from 'react-redux';

import './SearchFilter.css';
import {
  getKpiScoreMapAction, getKpiValueAction,
  getRankingKpiAction, setLoadingState,
  setSelectedKPIAction
} from '../../../redux'
import setBreadcrumbV2Action from '../../../redux/actions/setBreadcrumbV2Action'
import { _lang, updatePath } from '../../../utils';
import setBreadcrumbFromPathAction from '../../../redux/actions/setBreadcrumbFromPathAction';

class SearchFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showNoResult: false,
      isSearchActive: false,
      searchKeywordForKPI: '',
      searchInput: '',
      kpiSearchResultList: [],
    };
  }

  searchOnKPIList(value) {
    const kpiList = JSON.parse(JSON.stringify(this.props.kpiList));

    return kpiList.slice(0).filter((k) => k.label.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  handleSearch(event) {
    if (event.target.value.length <= 2) {
      this.setState({
        kpiSearchResultList: [],
        showNoResult: false,
        isSearchActive: false,
        searchInput: event.target.value,
      });
    } else {
      const filteredResult = this.searchOnKPIList(event.target.value);

      this.setState({
        kpiSearchResultList: filteredResult,
        showNoResult: false,
        isSearchActive: true,
        searchKeywordForKPI: event.target.value,
        searchInput: event.target.value,
      });
    }
  }

  kpiItemList(kpi) {
    const { setSelectedKPIAction, getRankingKpiAction, setLoadingState, getKpiValueAction, selectedYear,
      getKpiScoreMapAction, setBreadcrumbFromPathAction, setBreadcrumbV2Action } = this.props;

    return (
      <div
        onClick={() => {
          setLoadingState(true);

          this.setState({
            kpiSearchResultList: [],
            showNoResult: false,
            searchInput: '',
          });

          getKpiValueAction(kpi.parentId, selectedYear);

          setBreadcrumbV2Action(kpi.path);
          setSelectedKPIAction(kpi.path, kpi);
          getKpiScoreMapAction(kpi.kpi.id)
            .then(() => getRankingKpiAction(kpi.kpi.id, null, null))
            .then(() => {
              setLoadingState(false);
              updatePath();
            });

        }} key={kpi.id}
      >
        <Highlighter
          highlightClassName='highLightKeyword'
          searchWords={[this.state.searchKeywordForKPI]}
          autoEscape
          textToHighlight={kpi.label}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
        <div className="searchInputWrapper">
          <div ref="searchInputM" className="searchInputM">
            <i className="placeholder-search-icon search-img-icon-mini" />
            <input
              placeholder={_lang('kpi_search_placeholder')}
              ref="searchInput"
              onChange={this.handleSearch.bind(this)}
              value={this.state.searchInput}
            />
          </div>

          <div className="searchDetail customScrollbar">
            {(() => {
              const list = [];
              resultCount = 0;

              if (this.state.kpiSearchResultList === undefined) {
                return;
              }

              let resultCount = this.state.kpiSearchResultList.length;

              if (this.state.showNoResult) {
                return (
                  <span key="noResultM" className="noResultM">No results</span>
                );
              }

              this.state.kpiSearchResultList.forEach((kpi) => {
                list.push(
                  this.kpiItemList(kpi)
                );
              });

              if (this.state.isSearchActive && resultCount > 0) {
                list.unshift(
                  <span
                    key='resultsFound'
                    className="resultsFound"
                  >
                      {resultCount} result(s) found.
                  </span>);
              }

              return (
                <div className="searchItemsM">
                  <div className="kpiListM">
                    {list}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }
}

SearchFilter.propTypes = {};

const mapStateToProps = (state) => ({
  selectedYear: state.coreReducer.selectedYear
});

const actions = {
  setSelectedKPIAction,
  getRankingKpiAction,
  setLoadingState,
  getKpiScoreMapAction,
  setBreadcrumbFromPathAction,
  setBreadcrumbV2Action,
  getKpiValueAction
};

export default connect(mapStateToProps, actions)(SearchFilter);
