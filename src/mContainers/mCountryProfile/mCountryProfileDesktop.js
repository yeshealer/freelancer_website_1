// React
import React from 'react';
import numeral from 'numeral';
import { connect } from 'react-redux';
// import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import SearchComponent from './components/SearchComponent';

import Slider from "react-slick";

// import 'pure-react-carousel/dist/react-carousel.es.css';

// Redux
import {
  getKpiScoreAndRankDetailsByCountryAction,
  getKpiBestAndWorstByCountryAction,
  getKpiScoreAndRankDetailsByCountryProfileAction,
  getSelectedCountryNameByCountryId,
  updateSelectedRealm,
  getCountryListAction,
  updateSelectedKpi,
} from '../../redux';

import GraphCard from './components/GraphCard';
import CategoryPanel from './components/CategoryPanel';
import CountrySection from './components/CountrySelection';

import './CountryProfile.css';
import OverAllPanel from './components/OverAllPanel';
import PillarPanelList from './components/PillarPanelList';
import Loader from '../../mComponents/mExplore/mLoader';
import PrintButton from '../../components/commons/PrintButton';
import { _lang, getLanguageKey, getQSParameterByName, isMobile, isTablet } from '../../utils';
import HeaderButtonComponent from './components/HeaderButtonComponent';
import setLanguage from '../../utils/setLanguage';
import CountryProfilePanel from '../../components/commons/CountryProfilePanel/CountryProfilePanel';

export class mCountryProfileDesktop extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      countrySearchResultList: [],
      selectedCountry: {},
      isCategoryPanelOpen: true,
      loadingCounter: 1,
      headerIsFixed: false,
      mobilePanelCollapsed: true,
      leftArrow: false,
      rightArrow: true,
      selectedPillarId: '',
      selectedPillarChildren: [],
      selectedRealm: null,
    };

    const selectedLang = getQSParameterByName('lang') || 'en';
    setLanguage(selectedLang);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    if (!isMobile()) {
      const headerHeight = document.getElementById('countryProfileHeader').clientHeight;
      const navigationHeight = document.getElementById('navigation').clientHeight;

      if (window.pageYOffset > headerHeight + navigationHeight && !this.state.headerIsFixed) {
        this.setState({ headerIsFixed: true });
      }

      if (window.pageYOffset < headerHeight + navigationHeight && this.state.headerIsFixed) {
        this.setState({ headerIsFixed: false });
      }
    }
  }

  handleResize() {
    if (window.innerWidth < 1025) {
      this.setState({ isCategoryPanelOpen: false });
    }
  }

  loadInitialData() {
    const {
      getKpiScoreAndRankDetailsByCountryAction: getKpiScoreAndRankDetailsByCountry,
      getKpiBestAndWorstByCountryAction: getKpiBestAndWorstByCountry,
      getKpiScoreAndRankDetailsByCountryProfileAction: getScoreAndRankByCountryProfile,
      getSelectedCountryNameByCountryId: selectedCountryByCountryId,
      getCountryListAction: getCountryList,
    } = this.props;

    const countryId = this.props.match.params.countryId;

    getCountryList(countryId).then(() => {
      const { countryList } = this.props.countryObj;
      selectedCountryByCountryId(countryId, countryList);
    });

    if (!this.props.kpiObjs.scoreAndRankByCountryProfile.length) {
      getScoreAndRankByCountryProfile(countryId);
    }

    if (!this.props.kpiObjs.bestAndWorst.length) {
      getKpiBestAndWorstByCountry(countryId).then(() => {
        // this.hideLoading();
      });
    }

    if (this.props.countryObj.countryList.length) {
      const { countryList } = this.props.countryObj;

      let selectedCountry = {};
      countryList.forEach((country) => {
        if (country.countryId === countryId) {
          selectedCountry = country;
          return;
        }
      });

      if (selectedCountry.countryId === undefined) {
        this.props.history.push('/404');
      } else {
        this.setState({ selectedCountry });
      }
    }

    if (!this.props.kpiObjs.scoreAndRank.length) {
      getKpiScoreAndRankDetailsByCountry(countryId).then(() => {
        this.setState({
          activeRealmId: this.props.kpiObjs.scoreAndRank[0].id,
        });
        document.getElementById('smallLoader').style.display = 'none';
      }).catch((err) => {
        console.log(err);
      });
    }

    if (this.props.kpiObjs.scoreAndRank.length) {
      const realm = this.props.kpiObjs.scoreAndRank[0].id;
      this.props.updateSelectedRealm(realm);
    }

    this.setState({
      countryId
    });
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.selectedLanguage !== this.props.selectedLanguage) {
    //   this.loadInitialData();
    // }
  }

  componentDidMount() {
    this.loadInitialData();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  // hideLoading() {
  //   setTimeout(() => {
  //     this.setState({ loadingCounter: this.state.loadingCounter - 1 });
  //   }, 50);
  // }

  getHeaderData() {
    const items = [];
    if (this.props.kpiObjs.scoreAndRankByCountryProfile.length) {
      const kpiData = this.props.kpiObjs.scoreAndRankByCountryProfile;
      kpiData.forEach((data) => {
        const { url, id: kpiId, countryData } = data;
        const { title, description_long: description, denominator } = data.kpiTextMap;
        const { title: citationTitle } = data.sourceTextMap;

        const countryDataLength = data.countryData.length;
        const latestCountryData = countryData[countryDataLength - 1];

        items.push(
          <div key={`HeaderCard_${kpiId}`} className="card-wrapper">
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
              countryId={this.state.countryId}
            />
          </div>
        );
      });

      items.push(<div key={'HeaderCard_clearFix'} className="clearfix" />);
    }
    return items;
  }

  printLoadingOverlay() {
    if (this.state.loadingCounter === 0) { return; }

    return (
      <div className={'loadingOverlayM_single'}>

        <div className="loadingContentWrapper">
          <img src="/assets/images/loadingCells1.gif" alt="Loading" />
          <div className="loadingContentM">
            <div className="loadingMessageM">{_lang('loading_message')}</div>
          </div>
        </div>

      </div>
    );
  }

  getShareURL() {
    // return `${window.location.href}/${this.lang.getLangCode()}`;
  }

  getTwitterURL() {
    // if (this.lang.currentEnglish) { return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.lang.getLang().share_text_twitter.replaceArray([':url', ':countryName'], [this.getShareURL(), p(this.props.selectedCountry.countryTextMap.name, this.props.selectedCountry.countryTextMap.countryNameOtherLang)]))}`; }
    // return `https://twitter.com/intent/tweet?lang=ar&text=${encodeURIComponent(this.lang.getLang().share_text_twitter.replaceArray([':url', ':countryName'], [this.getShareURL(), p(this.props.selectedCountry.countryTextMap.name, this.props.selectedCountry.countryTextMap.countryNameOtherLang)]))}`;
  }

  getFacebookURL() {
    return `https://www.facebook.com/sharer/sharer.php?u=${this.getShareURL()}`;
  }

  goBack(e) {
    e.preventDefault();
    this.props.history.go(-1);
  }

  getTabs() {
    return this.props.kpiObjs.scoreAndRank.map((kpi, index) => ({
      title: kpi.label,
      key: index,
      tabClassName: 'tab',
      panelClassName: 'panel',
    }));
  }

  renderCountryProfile = () => {
    const countryProfileData = this.props.kpiObjs.scoreAndRankByCountryProfile;

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
              countryId={this.state.countryId}
              kpiObj={data}
            />
          </div>
          <div key={'HeaderCard_clearFix'} className='clearfix' />
        </div>
      );
    });
  }

  createCarousel = () => {
    const data = this.renderCountryProfile();

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      arrows: false,
      slidesToShow: (isMobile()) ? 1 : 3,
      slidesToScroll: 1
    };

    return (
    <Slider {...settings}>
      {data}
    </Slider>
    );

    // const dragEnabled = !!isMobile();
    //
    // return (
    //   <CarouselProvider
    //     naturalSlideWidth={100}
    //     naturalSlideHeight={100}
    //     totalSlides={6}
    //     visibleSlides={this.props.numOfSlides || 3}
    //     // currentSlide={0}
    //     step={this.props.steps || 3}
    //     dragEnabled={dragEnabled}
    //     touchEnabled={dragEnabled}
    //     slidesToScroll={this.props.slidesToScroll}
    //     arrows={this.props.arrows}
    //   >
    //     <Slider>
    //       {data.map((kpi, index) => (
    //         <Slide key={"slide_" + index} index={index}>
    //           {kpi}
    //         </Slide>
    //       ))}
    //     </Slider>
    //
    //     <ButtonBack
    //       onClick={(() => this.setState({
    //         leftArrow: !this.state.leftArrow,
    //         rightArrow: !this.state.rightArrow,
    //       }))}
    //       className={this.state.leftArrow ? 'backBtn' : 'hidden' + ' backBtn'}
    //     >
    //       <img
    //         style={{ width: '30px', opacity: '0.5', margin: '-34px' }} src="/assets/svg/arrow-left-button.svg"
    //         alt="arrow_left"
    //       />
    //     </ButtonBack>
    //
    //     <ButtonNext
    //       onClick={(() => this.setState({
    //         rightArrow: !this.state.rightArrow,
    //         leftArrow: !this.state.leftArrow,
    //       }))}
    //       className={this.state.rightArrow ? 'nextBtn' : 'hidden'}
    //     >
    //       <img
    //         style={{ width: '30px', opacity: '0.5', margin: '-40px' }} src="/assets/svg/arrow-right-button.svg"
    //         alt="arrow_right"
    //       />
    //     </ButtonNext>
    //
    //   </CarouselProvider>
    // );
  }

  handleChange = (countryId) => {
    window.location = `/country-profile/${countryId}`;
    // this.props.history.push(`/country-profile/${countryId}`);
    // window.location.reload();
  }

  openPillarMenu() {
    this.setState({ mobilePanelCollapsed: false });
  }

  collapsePanel() {
    this.setState({ mobilePanelCollapsed: true });
  }

  renderMobileView = () => (
    <div className="country-profile-page country-profile-mobile">
      <div
        className={`sticky-pillar-menu ${(this.state.mobilePanelCollapsed) ? 'closed-panel' : 'open-panel'}`}
      >
        {<Loader />}
        <CategoryPanel
          collapsePanel={this.collapsePanel.bind(this)}
        />
      </div>

      <div className="navigation" id="navigation">
        <span className="pillar-menu" onClick={this.openPillarMenu.bind(this)}>
          <img src="/assets/svg/pillars-white.svg" />
        </span>
        <div className="actions">
          <a
            href={this.getTwitterURL()}
            target="_blank"
          >
            <img src="/assets/svg/social-twitter.svg" alt="" />
          </a>

          <a
            href={this.getFacebookURL()}
            target="_blank"
          >
            <img src="/assets/svg/social-facebook.svg" alt="" />
          </a>

          <div
            onClick={() => {
              this.props.history.goBack();
            }}
            className="close-button"
          >
            <img src="/assets/svg/close-panel-white.svg" alt="" />
          </div>
        </div>
        <SearchComponent
          countryList={this.props.countryObj.countryList}
          self={this}
          history={this.props.history}
          handleCountryChange={this.handleChange}
        />
      </div>
      <header id="countryProfileHeader" className="country-profile-header">
        <div className="summary-desktop">
          <div className="country-section-wrapper">
            <CountrySection
              name={this.props.kpiObjs.selectedCountryName}
              countryId={this.props.match.params.countryId}
            />
          </div>
          <div className="carousel-container">
            {this.createCarousel()}
          </div>
        </div>
      </header>
      <span className="clearfix" />
      <div className="kpi-list-mobile">
        <OverAllPanel
          countryId={this.state.countryId}
          overAllKPIData={this.props.kpiObjs.bestAndWorst}
          graphContainerClass={this.state.graphContainerClass}
        />

        <PillarPanelList
          countryId={this.state.countryId}
          selectedKpi={this.props.kpiObjs.selectedKpi}
        />
      </div>
    </div>
  )

  renderDesktopView() {
    let openClosedClassName = '';
    if (this.state.isCategoryPanelOpen) {
      openClosedClassName = '-open';
    } else {
      openClosedClassName = '-close';
    }

    return (
      <div className="country-profile-page country-profile-desktop">
        {/*{this.printLoadingOverlay()}*/}

        {/*{isTablet() && <div className={`sticky-pillar-menu ${(this.state.mobilePanelCollapsed) ? 'closed-panel' : 'open-panel'}`}>*/}
          {/*<Loader />*/}
          {/*<CategoryPanel*/}
            {/*collapsePanel={this.collapsePanel.bind(this)}*/}
          {/*/>*/}
        {/*</div>}*/}

        <div className="navigation" id="navigation">
          {/*{isTablet() && <span className="pillar-menu" onClick={this.openPillarMenu.bind(this)}>*/}
            {/*<img src="/assets/svg/pillars-white.svg" />*/}
          {/*</span>}*/}

          {/*<a className="back-button" onClick={this.goBack.bind(this)} href="#">*/}
            {/*<img src="/assets/svg/back-arrow-white.svg" />*/}
            {/*{_lang('back')}*/}
          {/*</a>*/}

          <div className="actions">
            <a
              href={this.getTwitterURL()}
              target="_blank"
            >
              <img src="/assets/svg/social-twitter.svg" alt="" />
            </a>

            <a
              href={this.getFacebookURL()}
              target="_blank"
            >
              <img src="/assets/svg/social-facebook.svg" alt="" />
            </a>

            <PrintButton />


            <HeaderButtonComponent
              onClick={() => {
                const { location: { origin, pathname } } = window;
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
            self={this}
            history={this.props.history}
            handleCountryChange={this.handleChange}
          />

          <div className="clearfix" />
        </div>
        <header id="countryProfileHeader" className="country-profile-header">
          <div className="summary-desktop">
            <div className="country-section-wrapper">
              <CountrySection
                name={this.props.kpiObjs.selectedCountryName}
                countryId={this.props.match.params.countryId}
              />
            </div>
            <div className="carousel-container">
              {this.createCarousel()}
            </div>
          </div>
        </header>

        <span className="clearfix" />

        <div className="country-profile-content">

          <CountryProfilePanel />
          {/*<div className={`category-panel-wrapper ${(this.state.headerIsFixed) ? ` sticky-panel${openClosedClassName}` : ''}`}>*/}
            {<Loader />}
            {/*<CategoryPanel />*/}
          {/*</div>*/}

          <div
            className={`right-section${(this.state.headerIsFixed) ? ` sticky-panel${openClosedClassName}` : ''}`}
          >
            <div id="scrollContent">
              <OverAllPanel
                countryId={this.state.countryId}
                overAllKPIData={this.props.kpiObjs.bestAndWorst}
                graphContainerClass={this.state.graphContainerClass}
              />

              <PillarPanelList
                countryId={this.state.countryId}
                selectedKpi={this.props.kpiObjs.selectedKpi}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        {/* <div className="betaBadge" /> */}
        {isMobile() ? this.renderMobileView() : this.renderDesktopView()}
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
  updateSelectedKpi,
};

const mapStateToProps = (state) => ({
  kpiObjs: state.countryProfileReducer,
  countryObj: state.countryReducer,
  realmObj: state.realmReducer,
  selectedCountry: state.coreReducer.selectedCountry,
  selectedLanguage: state.coreReducer.selectedLanguage,
});

export default connect(mapStateToProps, actions)(mCountryProfileDesktop);
