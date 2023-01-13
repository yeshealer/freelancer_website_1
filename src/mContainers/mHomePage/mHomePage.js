import React from 'react';

import './mHomePage.css';
import SearchComponent from './components/SearchComponent';
import CardComponent from './components/CardComponent';
import { store } from '../../App';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  getRealmListAction,
  getCountryListAction,
  getGroupsAction,
  getCountryAlphaListAction,
  getKpiScoreMapAction,
  getKpiScoreAction,
  getKpiValueAction,
  getRankingKpiAction,
  getDataCountInfoAction,
  getWholeRealmTreeAction,
  setSelectedRealmAction,
  setSearchableKpiListAction,
} from '../../redux';
import { _lang, getLanguageKey } from '../../utils';
import toggleLanguage from '../../utils/toggleLanguage';

class mHomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchableKPIList: [],
      kpiSearchResultList: [],
      countries: [],
      countrySearchResultList: [],
      bottomCounts: { kpiCount: 0, pillarCount: 0, countryCount: 0 },
      selectedClosableModal: '',
      kpiList: [],
      showNoResult: true,
      selectedRealm: null,
    };
  }

  setActiveClosableModal(modalId) {
    this.setState({ selectedClosableModal: modalId });
  }

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

  setSearchableKPIList(realmList) {
    this.setState({ kpiList: [] }, () => {
      setTimeout(() => {
        const kpiList = this.createKpiList(realmList);
        this.props.setSearchableKpiListAction(kpiList);
        this.setState({ searchableKPIList: kpiList });
      }, 100);
    });
  }

  loadInitialData() {
    const {
      getRealmListAction,
      getCountryListAction,
      getDataCountInfoAction,
      getWholeRealmTreeAction: getWholeRealmTree,
    } = this.props;

    getWholeRealmTree().then((response) => {
      this.setSearchableKPIList(response.realmTreeList);
    }).catch((err) => {
      console.log('Error on getWholeRealmTreeAction', err);
    });
    getRealmListAction().catch((err) => {
      console.log(err);
    });

    getCountryListAction().catch(() => {
      console.log('Error on getCountryListAction');
    });

    getDataCountInfoAction().catch(() => {
      console.log('Error on getCountryListAction');
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedLanguage !== this.props.selectedLanguage) {
      this.loadInitialData();
    }
  }

  componentDidMount() {
    this.loadInitialData();
  }

  handleSelectedRealm = (realmId) => {
    this.props.setSelectedRealmAction(realmId);
  }

  render() {
    const { countryObj, realmObj, dataCountObj } = this.props;
    const countryCount = countryObj.countryList.length;

    return (
      <div className="home-page">
        {/* <div className="betaBadge" /> */}

        <div className="hp-main-content">
          <div className="hp-top">
            <div className="logo">
              <img src={_lang('logo_home_v2')} />
            </div>

            <div className="menu">
              <span className="menu-item">
                <a href="mailto:info@iph.sa">
                    <img style={{ height: 28 }} src="/assets/svg/mail.svg" />
                    <span className="text-span">{_lang('contact')}</span>
                </a>
              </span>

              <span
                onClick={() => {
                  this.props.history.push('/about');
                }}
                className="menu-item"
              >
                <img style={{ height: 20 }} src="/assets/svg/about-white.svg" />
                <span className="text-span">{_lang('about')}</span>
              </span>

              <span className="menu-item">
                  <a href="https://www.facebook.com/pages/category/Government-Organization/International-Performance-Hub-Saudi-Arabia-570903683258019/" target="_blank">
                      <img style={{ height: 18 }} src="/assets/svg/facebook-outlined.svg" />
                  </a>
              </span>

              <span className="menu-item">
                  <a href="https://twitter.com/IPH_SaudiArabia/" target="_blank">
                      <img style={{ height: 18 }} src="/assets/svg/twitter-outlined.svg" />
                  </a>
              </span>

              <span onClick={() => toggleLanguage()} className="menu-item language">
                  {_lang('lang')}
              </span>

            </div>
            <div className="clearfix" />
          </div>

          <div className="hp-top-text">
            <h1>{_lang('home_welcome')}</h1>
            <p dangerouslySetInnerHTML={{ __html: _lang('home_slogan') }} />
          </div>

          <div className="hp-search">
            <SearchComponent
              self={this}
              history={this.props.history}
              realmList={realmObj.realmTreeList}
              countryList={countryObj.countryList}
            />
          </div>

          <div className="hp-numbers">
            <CardComponent
              data={realmObj.realmList}
              dataCount={dataCountObj.dataCountInfo}
              handleClick={this.handleSelectedRealm}
            />
          </div>
        </div>

        <div className="hp-bottom">
          <div>
            <div className="hp-bottom-vision">
              <div className="title">{_lang('inspired_by')}</div>
              <a target="_blank" href="http://vision2030.gov.sa/">
                <img className="inactive-image" src="/assets/images/landing-page/grey_vision@2x.png" />
                <img className="active-image" src="/assets/images/landing-page/colour_vision@2x.png" />
              </a>
            </div>
            <div className="hp-bottom-adaa">
              <div className="title">{_lang('developed_by_adaa')}</div>
              <a target="_blank" href="http://www.adaa.gov.sa/">
                <img
                  className="inactive-image"
                  src={`/assets/images/landing-page/grey_adaa_${getLanguageKey()}@2x.png`}
                />
                <img
                  className="active-image"
                  src={`/assets/images/landing-page/colour_adaa_${getLanguageKey()}@2x.png`}
                />
              </a>
            </div>
          </div>

          <div>
            <div className="title">{_lang('knowledge_partners')}</div>
            <a target="_blank" href="http://www.worldbank.org/">
              <img className="inactive-image" src="/assets/images/landing-page/grey_world_bank@2x.png" />
              <img className="active-image" src="/assets/images/landing-page/colour_world_bank@2x.png" />
            </a>
            <a target="_blank" href="http://positiveeconomy.co/">
              <img
                className="inactive-image"
                src="/assets/images/landing-page/grey_positive_economy@2x.png"
              />
              <img
                className="active-image"
                src="/assets/images/landing-page/colour_positive_economy@2x.png"
              />
            </a>
            <a target="_blank" href="http://www.li.com/">
              <img
                className="inactive-image"
                src="/assets/images/landing-page/grey_legatum_institute@2x.png"
              />
              <img
                className="active-image"
                src="/assets/images/landing-page/colour_legatum_institute@2x.png"
              />
            </a>
                 <div className="hp-bottom-DGA">
              <div className="re-edited-box-icon "></div>
              <a target="_blank" href="https://raqmi.dga.gov.sa">
                <img src="http://raqmi.dga.gov.sa/platforms/DigitalStamp/GetStampFile/2072" />
              </a>
            </div>
          </div>

          <div>
            <div className="title">{_lang('technology_partners')}</div>
            <a target="_blank" href="https://www.dellemc.com/">
              <img className="inactive-image" src="/assets/images/landing-page/grey_dellemc@2x.png" />
              <img className="active-image" src="/assets/images/landing-page/colour_dellemc@2x.png" />
            </a>
            <a target="_blank" href="https://www.microsoft.com/">
              <img className="inactive-image" src="/assets/images/landing-page/grey_microsoft@2x.png" />
              <img className="active-image" src="/assets/images/landing-page/colour_microsoft@2x.png" />
            </a>
          </div>

          <span className="copyright">
            {_lang('bottom_copyright')} <span onClick={() => {
            this.props.history.push('/disclaimers');
          }}>{_lang('bottom_copyright_2')}</span>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  realmObj: state.realmReducer,
  countryObj: state.countryReducer,
  groupsObj: state.groupsReducer,
  kpiObj: state.kpiReducer,
  dataCountObj: state.dataCountReducer,
  coreReducer: state.coreReducer,
  selectedLanguage: state.coreReducer.selectedLanguage,
});

const actions = {
  getRealmListAction,
  getCountryListAction,
  getGroupsAction,
  getCountryAlphaListAction,
  getKpiScoreMapAction,
  getKpiScoreAction,
  getKpiValueAction,
  getRankingKpiAction,
  getDataCountInfoAction,
  getWholeRealmTreeAction,
  setSelectedRealmAction,
  setSearchableKpiListAction
};

export default withRouter(connect(mapStateToProps, actions)(mHomePage));
