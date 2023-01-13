import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { isMobile } from '../../../../mCommons/mUtils';
import { _lang } from '../../../../utils';
import './SideMenu.css';
import getPath from '../../../../utils/getPath';
import MenuItem from './MenuItem';
import setMobileMenuStateAction from '../../../../redux/actions/setMobileMenuStateAction';
import toggleLanguage from '../../../../utils/toggleLanguage';

class SideMenu extends React.Component {
  render() {
    const { isMobileMenuOpen, setMobileMenuStateAction, selectedLanguage, selectedKPI, selectedCountry, selectedGroup } = this.props;

    const menuClassList = ['mobileMenuWrapperM'];
    menuClassList.push((isMobile()) ? 'mobileMenuMode' : 'desktopMenuMode');
    menuClassList.push(isMobileMenuOpen ? 'showM' : 'hideM');

    let kpiName = '';
    if (selectedKPI.id !== undefined) { kpiName = selectedKPI.kpi.kpiTextMap.title; }

    let countryName = _lang('select_countries');
    if (selectedCountry.countryTextMap !== undefined && selectedCountry.countryTextMap.name !== undefined) {
      countryName = selectedCountry.countryTextMap.name;
    }

    let groupName = '';
    if (selectedGroup.countryGroupTextMap !== undefined && selectedGroup.countryGroupTextMap.title !== undefined) {
      groupName = selectedGroup.countryGroupTextMap.title;
    }

    return (
      <div className={menuClassList.join(' ')}>
        <div className="mobileMenuM">
          <div className="logoM bottomBorderM" style={{ position: 'relative' }}>
            <Link to={'/'}>
              <img
                src={selectedLanguage === 'sa_SA' ? '/assets/images/new_logo_ar.png' : '/assets/images/new_logo_en.png'}
                alt="Logo"
              />
            </Link>
            {!isMobile() &&
            <div className="exit-img-icon" onClick={() => setMobileMenuStateAction(false)} />}
          </div>

          <MenuItem
            onClick={() => setMobileMenuStateAction(false)}
            url={getPath('/world-map/kpi')}
            title={_lang('choose_kpi_title')}
            subTitle={kpiName}
            id="kpi"
            menuIcon="kpi-icon marginTop"
          />

          <MenuItem
            onClick={() => setMobileMenuStateAction(false)}
            url={getPath('/world-map/ranking')}
            title={_lang('world_ranking_title')}
            subTitle={groupName}
            id="ranking"
            menuIcon="ranking-img-icon"
          />

          <MenuItem
            onClick={() => setMobileMenuStateAction(false)}
            url={getPath('/world-map/compare')}
            title={_lang('compare_title')}
            subTitle={_lang('menu_multiple_countries')}
            id="compare"
            menuIcon="compare-img-icon"
          />

          <MenuItem
            onClick={() => setMobileMenuStateAction(false)}
            url={getPath('/world-map/detail')}
            title={_lang('search_country_title')}
            subTitle={countryName}
            id="detail"
            menuIcon="search-img-icon"
          />

          <div className="bottomItemM">
            <div
              className="bottomSubItem"
              onClick={() => {
                this.props.history.push('/about');
              }}
            >
              <div className="about-img-icon aboutIconM" />
              {_lang('about')}
            </div>

            <div
              className="bottomSubItem langTextFontM"
              onClick={() => {
                toggleLanguage();
              }}
            >
              {_lang('lang')}
            </div>

            {/*<div*/}
              {/*className="bottomSubItem" onClick={() => {}}*/}
            {/*>*/}
              {/*{_lang('deep_dives')}*/}
            {/*</div>*/}
          </div>
        </div>

        <div onClick={() => setMobileMenuStateAction(false)} className="mobileMenuGapM" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isMobileMenuOpen: state.uiReducer.isMobileMenuOpen,
  selectedLanguage: state.coreReducer.selectedLanguage,
  selectedKPI: state.coreReducer.selectedKPI,
  selectedCountry: state.coreReducer.selectedCountry,
  selectedGroup: state.coreReducer.selectedGroup
});

const actions = {
  setMobileMenuStateAction
};

export default withRouter(connect(mapStateToProps, actions)(SideMenu));
