import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { headerMenuStaticComponent, headerMenuStaticComponentWithHref, isMobile } from '../../../../mCommons/mUtils';
import { setMobileMenuStateAction } from '../../../../redux';
import { _lang } from '../../../../utils';
import getPath from '../../../../utils/getPath';
import HeaderMenuComponent from './HeaderMenuComponent';
import { withRouter, Link } from 'react-router-dom';

import './style.css';
import HeaderMenuBComponent from './HeaderMenuBComponent';
import toggleLanguage from '../../../../utils/toggleLanguage';
import toggleMobileMenuStateAction from '../../../../redux/actions/toggleMobileMenuStateAction'

const _ = require('lodash');

class DesktopHeader extends React.Component {

  constructor(props) {
    super(props);

    // window.ref2 = this.forceUpdate.bind(this);
  }

  render() {
    const { selectedCountry, selectedKPI, toggleMobileMenuStateAction, match } = this.props;

    const isDesktopMode = !(isMobile());

    if (isDesktopMode) {
      let countryName = _lang('select_countries');
      if (selectedCountry.countryTextMap !== undefined && selectedCountry.countryTextMap.name !== undefined) {
        countryName = selectedCountry.countryTextMap.name;
      }

      const kpiName = _.get(selectedKPI, 'kpi.kpiTextMap.title', '');
      const mailto = `mailto:info@iph.sa?subject=${_lang('share_mail_subject').replaceArray(
        [':countryName'],
        [countryName]
      )}`;

      return (
        <div className="mapHeaderM">

          <div className="logoM">
            <a href="/">
              <img src={_lang('logo_home')} alt="Logo" />
            </a>
          </div>

          <div className="menuM">
            <HeaderMenuComponent
              id='kpi'
              url={getPath('/world-map/kpi')}
              itemTitle={_lang('choose_kpi_title')}
              itemSubtitle={kpiName}
              itemIcon='kpi-icon'
              extraClass={['maxWidth340']}
            />

            <HeaderMenuComponent
              id='ranking'
              url={getPath('/world-map/ranking')}
              itemTitle={_lang('world_ranking_title')}
              itemSubtitle={_lang('countries')}
              itemIcon='ranking-img-icon'
            />

            <HeaderMenuComponent
              id='compare'
              url={getPath('/world-map/compare')}
              itemTitle={_lang('compare_title')}
              itemSubtitle={_lang('menu_multiple_countries')}
              itemIcon='compare-img-icon'
            />

            <HeaderMenuComponent
              id='detail'
              url={getPath('/world-map/detail')}
              itemTitle={_lang('search_country_title')}
              itemSubtitle={countryName}
              itemIcon='search-img-icon'
            />

          </div>

          <div className="menuM staticMenu">
            <div className="secondMenu">

              <HeaderMenuBComponent
                href={mailto}
                itemTitle={_lang('contact')}
                itemIcon='mail-icon-24'
                styleClass='iconMenuItem'
              />

              <HeaderMenuBComponent
                itemTitle={_lang('about')}
                itemIcon='about-icon-24'
                styleClass='iconMenuItem'
                onClick={() => {
                  this.props.history.push('/about');
                }}
              />

              <HeaderMenuBComponent
                itemTitle={_lang('lang')}
                itemIcon=''
                styleClass='langTextFontM'
                onClick={() => {
                  toggleLanguage();
                }}
              />
            </div>
          </div>

          {!isMobile() && (match.params.pageId === undefined || match.params.pageId === null) &&
          <div className="hamburgerMenuM">
            <div
              className="menu-icon"
              onClick={() => toggleMobileMenuStateAction()}
            />
          </div>}
        </div>
      );
    }
    return null;
  }
}

const mapStateToProps = (state) => ({
  selectedCountry: state.coreReducer.selectedCountry,
  selectedKPI: state.coreReducer.selectedKPI,
  isMobileMenuOpen: state.uiReducer.isMobileMenuOpen,
  selectedLanguage: state.coreReducer.selectedLanguage
});

const actions = {
  toggleMobileMenuStateAction
};

export default withRouter(connect(mapStateToProps, actions)(DesktopHeader));
