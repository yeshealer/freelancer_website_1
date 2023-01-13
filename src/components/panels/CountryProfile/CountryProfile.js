import React from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';

import '../../../mContainers/mCountryProfile/CountryProfile.css';

import {
  getCountryListAction,
  getWholeRealmTreeAction,
  setLoadingState,
  setSearchableKpiListAction
} from '../../../redux';
import PrintButton from '../../commons/PrintButton';
import HeaderButtonComponent from '../../../mContainers/mCountryProfile/components/HeaderButtonComponent';
import { _lang, getLanguageKey, getQSParameterByName, isMobile } from '../../../utils';
import CountrySection from '../../../mContainers/mCountryProfile/components/CountrySelection';
import CountryProfilePanel from '../../commons/CountryProfilePanel/CountryProfilePanel';
import {
  getKpiBestAndWorstByCountryAction,
  getKpiScoreAndRankDetailsByCountryAction,
  getKpiScoreAndRankDetailsByCountryProfileAction,
  getSelectedCountryNameByCountryId, setActivePathAction, updateSelectedKpi, updateSelectedRealm
} from '../../../redux/actions/countryProfile';
import GraphCard from '../../../mContainers/mCountryProfile/components/GraphCard';
import numeral from 'numeral';
import setLanguage from '../../../utils/setLanguage';
import OverAllPanel from '../../../mContainers/mCountryProfile/components/OverAllPanel';
import PillarPanelList from '../../../mContainers/mCountryProfile/components/PillarPanelList';
import { getWidth } from '../../../mCommons/mUtils';

import './style.css';
import SearchComponent from '../../../mContainers/mCountryProfile/components/SearchComponent';
import LoadingComponent from '../../commons/LoadingComponent';
import { SampleNextArrow, SamplePrevArrow } from '../../commons/Arrows'

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  arrows: true,
  slidesToShow: (isMobile()) ? 1 : 3,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

class CountryProfile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      headerIsFixed: false,
      isCategoryPanelVisible: false,
      kpiList: [],
      transparentBackground: true,
    };

    const selectedLang = getQSParameterByName('lang') || 'en';
    setLanguage(selectedLang);

    if (getWidth() <= 768) {
      sliderSettings.slidesToShow = 1;
    } else {
      sliderSettings.slidesToShow = 3;
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

  getShareURL() {
    return `${window.location.href}`;
  }

  getFacebookURL() {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.getShareURL()}`;
  }

  getTwitterURL(countryName) {
    if (getLanguageKey() === 'en') {
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(_lang('share_text_twitter').replaceArray([':url', ':countryName'], [this.getShareURL(), countryName]))}`;
    }
    return `https://twitter.com/intent/tweet?lang=ar&text=${encodeURIComponent(_lang('share_text_twitter').replaceArray([':url', ':countryName'], [this.getShareURL(), countryName]))}`;
  }


  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    const handleScroll = (event) => {
      if (!isMobile()) {
        const headerHeight = document.getElementById('countryProfileHeader').clientHeight;
        const navigationHeight = document.getElementById('navigation').clientHeight;

        if (window.pageYOffset <= 0) {
          this.setState({
            transparentBackground: true,
          });
        } else {
          this.setState({
            transparentBackground: false,
          });
        }
        
        if (window.pageYOffset > headerHeight + navigationHeight && !this.state.headerIsFixed) {
          this.setState({ headerIsFixed: true });
        }

        if (window.pageYOffset < headerHeight + navigationHeight && this.state.headerIsFixed) {
          this.setState({ headerIsFixed: false });
        }
      }
    };

    this.handleScroll = handleScroll.bind(this);

    window.addEventListener('scroll', this.handleScroll);

    this.loadInitialData();
  }

  loadInitialData() {
    const {
      getKpiScoreAndRankDetailsByCountryAction: getKpiScoreAndRankDetailsByCountry,
      getKpiBestAndWorstByCountryAction: getKpiBestAndWorstByCountry,
      getKpiScoreAndRankDetailsByCountryProfileAction: getScoreAndRankByCountryProfile, updateSelectedKpi,
      getSelectedCountryNameByCountryId: selectedCountryByCountryId, updateSelectedRealm, setActivePathAction,
      getCountryListAction: getCountryList, setLoadingState, getWholeRealmTreeAction, setSearchableKpiListAction
    } = this.props;
    const countryId = this.props.match.params.countryId;

    console.log('loadInitialData of CountryProfile');

    setLoadingState(true);

    setActivePathAction([]);
    updateSelectedKpi([]);

    getWholeRealmTreeAction()
      .then((response) => {
        const kpiList = this.createKpiList(response.realmTreeList);
        setSearchableKpiListAction(kpiList);
      });

    getCountryList()
      .then(({ countryList }) => selectedCountryByCountryId(countryId, countryList))
      .then(() => getScoreAndRankByCountryProfile(countryId))
      .then(() => getKpiBestAndWorstByCountry(countryId))
      .then(() => getKpiScoreAndRankDetailsByCountry(countryId))
      .then(({ scoreAndRank }) => updateSelectedRealm(scoreAndRank[0].id))
      .then(() => setLoadingState(false));
  }

  getSliderItems() {
    const countryProfileData = this.props.kpiObjs.scoreAndRankByCountryProfile;
    const { match: { params: { countryId } } } = this.props;

    return countryProfileData.map((data, index) => {
      const { url, id: kpiId, countryData } = data;
      const { title, description_long: description, denominator } = data.kpiTextMap;
      const { title: citationTitle } = data.sourceTextMap;

      const countryDataLength = data.countryData.length;
      const latestCountryData = countryData[countryDataLength - 1];

      return (
        <div key={`HeaderCard_${kpiId}_${index}`}>
          <div className="card-wrapper">
            <GraphCard
              title={title}
              description={description}
              currentValue={numeral(latestCountryData.score).format('0.00a')}
              score={denominator}
              year={latestCountryData.year}
              rank={latestCountryData.rank}
              rate={latestCountryData.rankChange}
              total={latestCountryData.rankOutOf}
              sourceTitle={citationTitle}
              sourceURL={url}
              showSource={false}
              graphData={countryData}
              pillarId={kpiId}
              kpiId={kpiId}
              countryId={countryId}
              kpiObj={data}
              typeClass="card-type-header"
            />
          </div>
          <div key={'HeaderCard_clearFix'} className='clearfix' />
        </div>
      );
    });
  }

  render() {
    const { location: { origin, pathname } } = window;
    const { countryObj: { countryList }, match: { params: { countryId } }, scoreAndRank, showLoading } = this.props;
    const selectedCountry = countryList.find(country => country.countryId === countryId);

    if (!selectedCountry) {
      return <div />;
    }

    const sliderItems = this.getSliderItems();
    const categoryWrapperStyleList = [];
    categoryWrapperStyleList.push('category-panel-wrapper');
    if (this.state.headerIsFixed) {
      categoryWrapperStyleList.push('sticky-panel-open');
    }

    if (this.state.isCategoryPanelVisible) {
      categoryWrapperStyleList.push('mobile-visible');
    } else {
      categoryWrapperStyleList.push('mobile-hidden');
    }

    return (
      <div className="country-profile-page country-profile-desktop">
        {showLoading && <LoadingComponent />}

        <style
          dangerouslySetInnerHTML={{ __html: 'body { overflow-x: hidden;}' }}
        />
        <div className={this.state.transparentBackground ? 'clear-navigation navigation' : 'navigation'} id="navigation">
          <a className="back-button" onClick={() => this.props.history.goBack()} href="#">
            <img src="/assets/svg/back-arrow-white.svg" />
            {_lang('back')}
          </a>


          <span className="pillar-menu">
            <img src="/assets/svg/pillars-white.svg" onClick={() => this.setState({ isCategoryPanelVisible: true })} />
          </span>

          <div className="actions">
            <a href={this.getTwitterURL(selectedCountry.countryTextMap.name)} target="_blank">
              <img src="/assets/svg/social-twitter.svg" alt="" />
            </a>
            <a href={this.getFacebookURL()} target="_blank">
              <img src="/assets/svg/social-facebook.svg" alt="" />
            </a>
            <span className="print-button">
              <PrintButton />
            </span>
            <HeaderButtonComponent
              onClick={() => {
                if (getLanguageKey() === 'en') {
                  window.location = `${origin + pathname}?lang=ar`;
                } else {
                  window.location = `${origin + pathname}?lang=en`;
                }
              }}
              wrapperClassName='langTextFontM'
              itemText={_lang('lang')}
              iconClassName=''
            />

          </div>
          <SearchComponent
            countryList={this.props.countryObj.countryList}
            history={this.props.history}
          />

          <div className="clearfix" />
        </div>

        <header id="countryProfileHeader" className="country-profile-header">
          <div className="summary-desktop">

            <div className="country-section-wrapper">
              <CountrySection
                name={selectedCountry.countryTextMap.name}
                countryId={countryId}
              />
            </div>

            <div className="carousel-container">
              <Slider {...sliderSettings}>
                {sliderItems}
              </Slider>
            </div>

          </div>
        </header>

        <span className="clearfix" />

        <div className="country-profile-content">
          <div className={categoryWrapperStyleList.join(' ')}>
            {scoreAndRank.length > 0 &&
            <CountryProfilePanel onClose={() => this.setState({ isCategoryPanelVisible: false })} />}
          </div>

          <div
            className={`right-section ${(this.state.headerIsFixed) ? 'sticky-panel-open' : ''}`}
          >
            <div id="scrollContent">
              <OverAllPanel
                countryId={countryId}
                overAllKPIData={this.props.kpiObjs.bestAndWorst}
                // graphContainerClass={this.state.graphContainerClass}
              />

              <PillarPanelList
                countryId={countryId}
                selectedKpi={this.props.kpiObjs.selectedKpi}
              />
            </div>
          </div>


        </div>
      </div>
    );
  }
}

const actions = {
  getKpiScoreAndRankDetailsByCountryAction,
  getKpiBestAndWorstByCountryAction,
  getKpiScoreAndRankDetailsByCountryProfileAction,
  getSelectedCountryNameByCountryId,
  updateSelectedRealm,
  getCountryListAction,
  setLoadingState,
  updateSelectedKpi,
  getWholeRealmTreeAction,
  setSearchableKpiListAction,
  setActivePathAction,
};

const mapStateToProps = (state) => ({
  kpiObjs: state.countryProfileReducer,
  countryObj: state.countryReducer,
  realmObj: state.realmReducer,
  selectedCountry: state.coreReducer.selectedCountry,
  selectedLanguage: state.coreReducer.selectedLanguage,
  scoreAndRank: state.countryProfileReducer.scoreAndRank,
  showLoading: state.uiReducer.showLoading
});

export default connect(mapStateToProps, actions)(CountryProfile);
