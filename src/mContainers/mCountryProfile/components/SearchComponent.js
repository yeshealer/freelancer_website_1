import React from 'react';
import Highlighter from 'react-highlight-words';
import { _lang, getLanguageKey } from '../../../utils';
// import { isMobile } from '../../../mCommons/mUtils';
// import * as generalUtils from '../../../mCommons/mUtils/generalUtils';
// import './SearchComponent.css';

export default class SearchComponent extends React.Component {

  state = {
    searchKeywordForKPI: '',
    countrySearchResultList: []
  }

  countryItem(countryItem) {
    return (
      <div
        onClick={() => {
          window.location = `./${countryItem.countryId}?lang=${getLanguageKey()}`;
        }}
        key={`countrySearchItem_${countryItem.countryId}`}
      >
        <Highlighter
          highlightClassName='highLightKeyword'
          searchWords={[this.state.searchKeywordForKPI]}
          autoEscape
          textToHighlight={countryItem.countryTextMap.name}
        />
      </div>
    );
  }

  searchOnCountryList(value) {
    const listCountry = this.props.countryList;
    return listCountry.filter((x) => x.countryTextMap.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  handleSearch(event) {
    if (event.target.value.length <= 2) {
      this.setState({
        countrySearchResultList: [],
        showNoResult: false,
        isSearchActive: false
      });
    } else {
      const filteredResultForCountry = this.searchOnCountryList(event.target.value);

      this.setState({
        countrySearchResultList: filteredResultForCountry,
        showNoResult: true,
        isSearchActive: true,
        searchKeywordForKPI: event.target.value
      });
    }
  }

  render() {
    const selfState = this.state;
    return (
      <div style={{ float: (getLanguageKey() === 'ar') ? 'left' : 'right' }} className="search-component">
        <div className="sc-input-wrapper">
          <div ref="searchInputM" className="sc-input">
            <i className="fa fa-search" />
            <input
              ref="searchInput"
              placeholder={_lang('search_country')}
              onChange={this.handleSearch.bind(this)}
            />
          </div>

          <div className="sc-detail">
            {(() => {
              if (selfState.countrySearchResultList.length === 0) {
                return;
              }

              let resultCount = selfState.countrySearchResultList.length;

              if (selfState.showNoResult && resultCount <= 0) {
                return (<span key="noResultM" className="no-result">{_lang('no_results')}</span>);
              }
              const list = [];

              resultCount = 0;

              resultCount += selfState.countrySearchResultList.length;
              if (selfState.countrySearchResultList.length > 0) {
                const countryList = [];
                selfState.countrySearchResultList.forEach((x) => {
                  countryList.push(this.countryItem(x));
                });

                list.unshift(
                  <div key="countrySearchContainer" className="searchItemsM">
                    <div
                      className="pillarNameM"
                    >{_lang('search_country_title')}</div>
                    <div className="kpiListM">
                      {countryList}
                    </div>
                  </div>
                );
              }

              if (selfState.isSearchActive && resultCount > 0) {
                list.unshift(<span key="resultsFound" className="results-found">
                  {resultCount} {_lang('result_not_found')}
                  </span>);
              }

              return list;
            })()}
          </div>
        </div>
      </div>
    );
  }
}
