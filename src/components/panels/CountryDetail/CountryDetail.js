import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import { _lang, getLanguageKey, getPath, updatePath } from '../../../utils'
import mCircularProgress from '../../../mComponents/mWorldMap/mCircularProgress';
import PagePanel from '../../commons/PagePanel/PagePanel';

import {
  setSelectedCountryAction,
  getCountryListAction,
  setStatsSelectedCountriesAction,
} from '../../../redux/';

import './styles/CountryDetail.css';
import BreadCrumbComponent from '../../commons/BreadCrumbComponent';

const _ = require('lodash');

const PlaceHolder = (props) => (
  <div><i className="placeholder-search-icon search-img-icon-mini" /> {props.text}</div>
);

class CountryDetail extends React.Component {
  constructor(props) {
    super(props);

    this.self = {
      state: {

      },
    };
  }

  componentDidMount() {
  }

  getMaxRankingData() {
    let maxOfData = '';
    const lengthOfSet = this.props.rankingKpiList.length;
    if (lengthOfSet > 0) {
      const maxOfDataObj = this.props.rankingKpiList[lengthOfSet - 1];
      if (maxOfDataObj !== undefined && maxOfDataObj !== null) {
        maxOfData = maxOfDataObj.score;
      }
    }

    return maxOfData;
  }

  // handleSelectChange(value, countryListMap) {
  //   this.props.setSelectedCountryAction(countryListMap[value]);
  //   this.props.setStatsSelectedCountriesAction(value);
  // }
  //
  // createBreadCrumb() {
  //   if (!this.props.breadcrumb.length) {
  //     return null;
  //   }
  //
  //   const { breadcrumb } = this.props;
  //   const realmName = breadcrumb[0].nodeTextMap.title_short || 'Missing title_short';
  //   const pillarName = breadcrumb[1].nodeTextMap.title;
  //   const subPillarName = breadcrumb[2].nodeTextMap.title;
  //   const kpiName = breadcrumb[3].kpi.kpiTextMap.title;
  //
  //   return trimString(`${realmName} > ${pillarName} > ${subPillarName} > ${kpiName}`);
  // }

  renderKpiDetailBlock() {
    const { kpi } = this.props.selectedKPI;
    if (kpi === undefined) {
      return null;
    }

    const { kpiTextMap, url, sourceTextMap, frequency } = kpi;
    return (
      <div>
        <div className="border1PXM marginBottom20 marginTop10" />

        <div className="detailBlockM">
          <div className="detailTitleM">{_lang('overview')}</div>
          <div className="detailTextM">{kpiTextMap.description_long}</div>
        </div>

        <div className="detailBlockM">
          <div className="detailTitleM">{_lang('source')}</div>
          <div className="detailTextM">
            <a target="_blank" rel="noopener noreferrer" href={url}>{sourceTextMap.citation}</a>
          </div>
        </div>

        <div className="detailBlockM">
          <div className="detailTitleM">{_lang('additional_notes')}</div>
          <div className="detailTextM">{kpiTextMap.additionalKpiNotes}</div>
        </div>


        <div className="detailBlockM">
          <div className="detailTitleM">{_lang('updated')}</div>
          <div className="detailTextM">{frequency}</div>
        </div>
      </div>
    );
  }

  renderCountryRankDetailBlock() {
    if (this.props.selectedCountry === null || this.props.selectedCountry === undefined) {
      return null;
    }

    const {
      selectedCountry,
      countryObj,
      rankingKpiList,
      selectedKPI
    } = this.props;

    const countryDetailM = countryObj.countryList.filter((country) => (country.countryId === selectedCountry.countryId))[0];
    if (!countryDetailM) {
      return;
    }

    const denominator = _.get(selectedKPI, 'kpi.kpiTextMap.denominator', '');

    const rankCountryM = rankingKpiList.find((kpi) => (kpi.countryId === selectedCountry.countryId));

    return (
      <div className="modalCenterM">
        <div className="bodyTitleM">
          <div
            className={`country-flag sprite sprite-${selectedCountry.countryCode}`}
          />
          <span>
						<Link
              className="whiteURL"
              to={`/country-profile/${selectedCountry.countryId}?lang=${getLanguageKey()}`}
						>
							{countryDetailM.countryTextMap.name}
						</Link>
					</span>
        </div>
        <div className="circularM">
          {(rankCountryM) ? mCircularProgress(rankCountryM.dataValue, rankCountryM.weightedScore) : mCircularProgress()}
        </div>

        <div className="bodySubTitleM kpiNameFieldM">
          {denominator}
        </div>

        {(() => {
          if (rankCountryM && rankCountryM.score) {
            const colorCode = parseInt((parseInt(rankCountryM.weightedScore, 10) * 2), 10);
            return (
              <div className="worldRankDetailM">
                {_lang('world_rank')}
                <span className={`fontRange-${colorCode}`}> {rankCountryM.score}</span> / {this.getMaxRankingData()}
              </div>
            );
          }
        })()}
      </div>
    );
  }

  renderDetailBlock() {
    const { kpi } = this.props.selectedKPI;
    if (kpi === undefined) {
      return null;
    }
    const { kpiTextMap, url, sourceTextMap, frequency } = kpi;

    return (
      <div
        className={'flexBoxItem flexBoxButtonBar marginBottom40 '}
      >
        <div className={'bottomButtonsM'}>
          <div className="lockedClassOverlay" />
          <div
            style={{ width: '70%', margin: '0 auto', display: 'block' }}
          >
            <div
              onClick={() => this.props.history.push(getPath('/world-map/detail/graph'))}
              className="generateGraphicsM"
            >
              {_lang('generate_graphics')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { match, selectedCountry, countryObj, countryKeyMap, setStatsSelectedCountriesAction, setSelectedCountryAction } = this.props;

    const isOpen = (match.params.pageId === 'detail');

    let countryName = '';

    const countryModifiedList = countryObj.countryList.map((country) => ({
      ...country,
      countryName: country.countryTextMap.name
    }));

    if (selectedCountry.countryId !== undefined) {
      countryName = selectedCountry.countryTextMap.name;
    }

    return (
      <PagePanel
        gradientClass="darkGreenGradientM"
        isOpen={isOpen}
        title={_lang('country_details_title')}
        subTitle={<BreadCrumbComponent />}
        share
        onClickCloseIcon={() => {
          setSelectedCountryAction({});
          setStatsSelectedCountriesAction('');
        }}
      >
        {
          <div className="customScrollBar">
            <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
              <Select
                clearable={false}
                simpleValue
                searchable
                placeholder={countryName || <PlaceHolder text={_lang('search_another_country')} />}
                labelKey="countryName"
                valueKey="countryId"
                noResultsText={_lang('no_results')}
                value={countryName}
                options={countryModifiedList}
                onChange={((value) => {
                  setStatsSelectedCountriesAction(value);
                  setSelectedCountryAction(countryKeyMap[value]);

                  updatePath();
                })}
              />
            </div>
            <div
              className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar marginBottom20"
            >
              <div className="flexBoxItemGrow">
                {this.renderCountryRankDetailBlock()}
                {this.renderKpiDetailBlock()}
              </div>
            </div>
            {this.renderDetailBlock()}
          </div>
        }
      </PagePanel>
    );
  }
}

CountryDetail.propTypes = {};

const mapStateToProps = (state) => ({
  selectedCountry: state.coreReducer.selectedCountry,
  countryObj: state.countryReducer,
  selectedKPI: state.coreReducer.selectedKPI,
  rankingKpiList: state.kpiReducer.rankingKpiList,
  selectedRealm: state.coreReducer.selectedRealm,
  realmList: state.realmReducer.realmList,
  breadcrumb: state.coreReducer.breadcrumb,
  countryKeyMap: state.countryReducer.countryKeyMap,
});

const actions = {
  setSelectedCountryAction,
  getCountryListAction,
  setStatsSelectedCountriesAction,
};

export default withRouter(connect(mapStateToProps, actions)(CountryDetail));
