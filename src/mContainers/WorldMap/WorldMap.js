/* eslint-disable no-shadow */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import CountryDetail from '../../components/panels/CountryDetail/CountryDetail';
import Graphics from '../../components/panels/Graphics/Graphics';
import { isMobile, getWidth } from '../../mCommons/mUtils';
import { connect } from 'react-redux';
import setSelectedLangAction from '../../redux/actions/setSelectedLangAction';
import setSelectedYearAction from '../../redux/actions/setSelectedYearAction';
import { DesktopHeader, YearSlider, Map } from './components';
import { WorldRanking, CompareCountries, ChooseKPI, FullStats } from '../../components';
import {
  getKpiScoreMapAction,
  getRankingKpiAction,
  getGroupsAction,
  getRealmListAction,
  getWholeRealmTreeAction,
  setSelectedKPIAction,
  getCountryListAction,
  getKpiValueAction,
  setSearchableKpiListAction, setSelectedCountryAction, setLoadingState, setStatsSelectedCountriesAction,
} from '../../redux';

import SideMenu from './components/SideMenu/SideMenu';
import sdkV2 from '../../mCommons/network/sdkV2';
import YearSliderRC from './components/YearSlider/YearSliderRC';
import CountrySelectorMobile from '../../components/panels/CountrySelectorMobile/CountrySelectorMobile';
import BenchmarkSelectorMobile from '../../components/panels/BenchmarkSelectorMobile/BenchmarkSelectorMobile';

import 'react-rangeslider/lib/index.css';
import './style.css';
import './flexStyle.css';

import '../../mCommons/css/mIcons.css';
import '../../mCommons/css/mSelect.css';
import '../../mCommons/css/mCountry.css';
import '../../mCommons/css/mCircularProgressbar.css';
import getDataFromPath from '../../utils/getDataFromPath';
import setSelectedGroupAction from '../../redux/actions/setSelectedGroupAction';
// import { _lang } from '../../utils';
import LegendBar from './components/LegendBar';
import MapZoom from './components/MapZoom';
import setBreadcrumbV2Action from '../../redux/actions/setBreadcrumbV2Action';
import LoadingComponent from '../../components/commons/LoadingComponent';

const _get = require('lodash/get');
const _ = require('lodash');

class WorldMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kpiList: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedLanguage } = this.props;
    // let { selectedYear } = this.props;
    //
    // if (!selectedYear) {
    //   selectedYear = (Object.keys(kpiScoreMap)[Object.keys(kpiScoreMap).length - 1]);
    // }

    if (prevProps.selectedYear !== this.props.selectedYear) {
      console.log('Set time line scroll.', this.props.selectedYear);
      setTimeout(() => {
        const timeLineElement = document.getElementById('timeLineM');
        const activeMenu = document.getElementById('activeMenu');
        if (timeLineElement !== null) {
          if (selectedLanguage === 'en_SA') {
            if (activeMenu) {
              timeLineElement.scrollLeft = activeMenu.offsetLeft - (getWidth() / 2);
            }
          } else if (/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)) {
            const elementScrollEqForMobile = (x) => (75.667 * x - 803.22);
            timeLineElement.scrollLeft = elementScrollEqForMobile((2018 - parseInt(this.props.selectedYear, 10)));
          } else {
            const initScrollEq = (-0.5416 * getWidth()) + 337.88;
            const elementScrollEq = (x) => ((-0.0312 * x) + 68.567);
            timeLineElement.scrollLeft = (initScrollEq + (elementScrollEq(getWidth()) * (2018 - parseInt(this.props.selectedYear, 10))));
          }
        }
      }, 100);
    }
  }

  loadInitialData() {
    const {
      getGroupsAction, getCountryListAction, getRealmListAction, setSelectedKPIAction, setBreadcrumbV2Action,
      setSearchableKpiListAction, getWholeRealmTreeAction, setLoadingState
    } = this.props;

    setLoadingState(true);

    // Start promise chain
    return Promise
      .all([
        setBreadcrumbV2Action([]),
        setSelectedKPIAction([], null),
        getGroupsAction(),
        getCountryListAction(),
        getRealmListAction(),
      ])
      .then(() => getWholeRealmTreeAction())
      .then((response) => {
        const kpiList = this.createKpiList(response.realmTreeList);
        setSearchableKpiListAction(kpiList);
        setLoadingState(false);
      });
  }

  loadRankingData() {
    const {
      getRankingKpiAction, selectedGroup, getKpiScoreMapAction,
      getKpiValueAction, selectedKPI, setLoadingState, selectedYear
    } = this.props;

    setLoadingState(true);

    const selectedKPIId = _get(selectedKPI, 'kpi.id', null);

    setLoadingState(true);

    let p1 = new Promise(resolve => resolve());

    if (selectedKPIId && selectedYear && selectedGroup) {
      p1 = p1.then(() => getRankingKpiAction(selectedKPIId, selectedYear, selectedGroup.groupId));
    }

    if (selectedKPIId && selectedYear) {
      p1 = p1.then(() => getKpiValueAction(selectedKPI.parentId, selectedYear));
    }

    if (selectedKPIId) {
      p1 = p1.then(() => getKpiScoreMapAction(selectedKPIId));
    }

    p1 = p1.then(() => setLoadingState(false));
    return p1;
  }

  async setDefaultsFromQS(resolve) {
    const {
      setSelectedKPIAction, setSelectedCountryAction, setSelectedGroupAction,
      setSelectedYearAction, setStatsSelectedCountriesAction,
      countryObj, groups, setLoadingState, setBreadcrumbV2Action,
      getKpiScoreMapAction
    } = this.props;

    setLoadingState(true);

    const { groupKeyMap } = groups;
    const { countryKeyMap } = countryObj;

    const qsData = getDataFromPath();

    const selectedKPIId = _get(qsData, 'selectedKPIId', null);
    const selectedKPIPath = _get(qsData, 'selectedKPIPath', null);
    const selectedCountryId = _get(qsData, 'countryId', null);
    const selectedGroupId = _get(qsData, 'selectedGroup', 'GLO');
    const selectedYear = _get(qsData, 'selectedYear', (new Date()).getFullYear());

    let promiseChain = new Promise((resolve) => resolve());

    if (selectedKPIId) {
      promiseChain = promiseChain
        .then(() => getKpiScoreMapAction(selectedKPIId))
        .then((response) => {
          const latestYear = Object.keys(response.kpiScoreMap)[Object.keys(response.kpiScoreMap).length - 1];
          setSelectedYearAction(latestYear || selectedYear);
        });
    } else {
      promiseChain = promiseChain.then(() => setSelectedYearAction(selectedYear));
    }

    if (selectedKPIId !== null && selectedKPIPath !== null) {
      const kpiDetail = await sdkV2.getKPIDetail(selectedKPIId);
      promiseChain = promiseChain
        .then(() => setSelectedKPIAction(selectedKPIPath, {
          kpi: kpiDetail.data,
          parentId: _.last(selectedKPIPath)
        }))
        .then(() => setBreadcrumbV2Action(selectedKPIPath));
    }

    const selectedCountry = countryKeyMap[selectedCountryId];
    if (selectedCountry) {
      promiseChain
        .then(() => setStatsSelectedCountriesAction(selectedCountry.countryId))
        .then(() => setSelectedCountryAction(selectedCountry));
    }

    const selectedGroup = groupKeyMap[selectedGroupId];
    if (selectedGroup) {
      promiseChain = promiseChain.then(() => setSelectedGroupAction(selectedGroup));
    }

    promiseChain.then(() => setLoadingState(false))
      .then(() => resolve());
  }

  componentDidMount() {
    this.loadInitialData()
      .then(() => {
        const p = new Promise(this.setDefaultsFromQS.bind(this));
        p.then(() => this.loadRankingData());
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedLanguage !== this.props.selectedLanguage) {
      this.loadInitialData()
        .then(() => {
          const p = new Promise(this.setDefaultsFromQS.bind(this));
          p.then(() => this.loadRankingData());
        });
    }
  }

  // TODO: Need refactor.
  createKpiList(realms, path = []) {
    if (realms.length) {
      realms.forEach((child) => {
        child.children = child.children.filter(c => c !== null);
        if (child.children && child.children.some(kpi => kpi.tag === 'kpi_page')) {
          const lastPath = [...path, child.id];
          this.setState({
            kpiList: this.state.kpiList.concat(child.children.map(value => ({
              ...value,
              path: lastPath
            })))
          });
        } else {
          this.createKpiList(child.children, [...path, child.id]);
        }
      });

      return this.state.kpiList;
    }
  }

  render() {
    const {
      match, isMobileOverlayCountrySelector, isMobileOverlayBenchmarkSelector, showLoading
    } = this.props;

    const isDesktopMode = !(isMobile());

    return (
      <div className="worldMapWrapperM">
        {(() => {
          if (!isDesktopMode) {
            if (this.state.selectedClosableModal !== 'graphics') {
              return (
                <style
                  dangerouslySetInnerHTML={{ __html: 'body {position: fixed; overflow: hidden; width: 100%; height: 100%;}' }}
                />
              );
            }
          } else {
            return [
              <style
                key="WorldMapStyle"
                dangerouslySetInnerHTML={{ __html: 'body {overflow: hidden;}' }}
              />,
              // <div key="betaBadge" className="betaBadge" />
            ];
          }
        })()}

        {showLoading && <LoadingComponent />}


        <DesktopHeader />

        <SideMenu />

        {match.params.subPageId === 'graph' && <Graphics />}
        {match.params.subPageId === 'full-stats' && <FullStats />}

        {isMobileOverlayCountrySelector && <CountrySelectorMobile />}
        {isMobileOverlayBenchmarkSelector && <BenchmarkSelectorMobile />}

        <WorldRanking />
        <ChooseKPI />
        <CompareCountries />
        <CountryDetail />

        {!isMobile() ? <LegendBar /> : null}
        {!isMobile() && !match.params.pageId ? <MapZoom /> : null}

        <Map />
        {
          (() => {
            if (isMobileOverlayCountrySelector || isMobileOverlayBenchmarkSelector) {
              return null;
            }

            if (match.params.subPageId === 'graph' && !isMobile()) {
              return <YearSliderRC />;
            }
            return <YearSlider />;
          })()
        }

      </div>
    );
  }

}

WorldMap.propTypes = {
  pageTitle: PropTypes.string
};

const actions = {
  getKpiScoreMapAction,
  getRankingKpiAction,
  getGroupsAction,
  getRealmListAction,
  getWholeRealmTreeAction,
  setSelectedKPIAction,
  getCountryListAction,
  setSelectedYearAction,
  setSelectedLangAction,
  getKpiValueAction,
  setSearchableKpiListAction,
  setSelectedCountryAction,
  setSelectedGroupAction,
  setLoadingState,
  setBreadcrumbV2Action,
  setStatsSelectedCountriesAction
};

const mapStateToProps = (state) => ({
  kpiObj: state.kpiReducer,
  realmObj: state.realmReducer,
  selectedCountry: state.coreReducer.selectedCountry,
  selectedKPI: state.coreReducer.selectedKPI,
  selectedKPIId: state.coreReducer.selectedKPIId,
  selectedYear: state.coreReducer.selectedYear,
  selectedGroup: state.coreReducer.selectedGroup,
  rankingKpiList: state.kpiReducer.rankingKpiList,
  selectedLanguage: state.coreReducer.selectedLanguage,
  closeableModal: state.coreReducer.closeableModal,
  countryObj: state.countryReducer,
  groups: state.groupsReducer,
  kpiScoreMap: state.kpiReducer.kpiScoreMap,
  searchableKPIList: state.coreReducer.searchableKPIList,
  isMobileOverlayCountrySelector: state.coreReducer.isMobileOverlayCountrySelector,
  isMobileOverlayBenchmarkSelector: state.coreReducer.isMobileOverlayBenchmarkSelector,
  showLoading: state.uiReducer.showLoading
});

export default withRouter(
  connect(mapStateToProps, actions)(WorldMap)
);
