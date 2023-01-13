import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPath, getStyleClassForModal, isMobile } from '../../../utils';

import './style.css';
import ExportToExcelButton from '../ExportToExcelButton';
import setMobileMenuStateAction from '../../../redux/actions/setMobileMenuStateAction';
import { setStatsSelectedCountriesAction } from '../../../redux';

const _ = require('lodash');

class PagePanel extends React.Component {
  generateTwitterUrl() {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.generateMessage())}`;
  }

  generateFacebookUrl() {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getPath(`${window.location.origin}/world-map/detail`))}`;
  }

  generateMessage() {
    const { selectedCountry, selectedKPI, selectedYear, rankingKpiList } = this.props;
    if (selectedCountry.countryTextMap === undefined || selectedKPI.kpi === undefined) {
      return null;
    }
    const countryName = selectedCountry.countryTextMap.name;
    const kpiName = selectedKPI.kpi.kpiTextMap.title;

    const rankCountryM = rankingKpiList.filter((kpi) => (kpi.countryId === selectedCountry.countryId));

    if (!rankCountryM.length) {
      return null;
    }

    return `${window.location.origin}/${getPath('world-map/detail')} ${countryName} ${kpiName} ${rankCountryM[0].dataValue} out of ${this.getMaxRankingData()} ${this.renderMessageSignOff()}`;
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

  renderMessageSignOff() {
    return 'Learn more at #IPH via @iph_SaudiArabia';
  }

  renderExportButtons() {
    const {
      exportToExcel,
      selectedYear,
      selectedKpiId,
      selectedGroup,
      pillarId,
      countryList,
      groupList,
      entityPageName,
      groupName
    } = this.props;

    switch (exportToExcel) {
      case 'world-ranking':
        return (
          <ExportToExcelButton
            type='world-ranking'
            selectedYear={selectedYear}
            kpiId={selectedKpiId}
            selectedGroup={selectedGroup}
            groupName={groupName}
          />
        );
      case 'full-stats':
        return (
          <ExportToExcelButton
            type="full-stats"
            selectedYear={selectedYear}
            pillarId={pillarId}
            countryList={countryList}
            groupList={groupList}
            entityPageName={entityPageName}
          />
        );
      default:
        return null;
    }
  }

  renderShareIcons() {
    const { share } = this.props;

    if (share) {
      return (
        <div>
          <a href={this.generateTwitterUrl()} target="_blank">
            <img src="/assets/svg/twitter-outlined.svg" alt="" />
          </a>

          <a href={this.generateFacebookUrl()} target="_blank">
            <img src="/assets/svg/facebook-outlined.svg" alt="" />
          </a>
        </div>
      );
    }

    return null;
  }

  renderTitleContent() {
    const { title, subTitle } = this.props;

    return (
      <div className="textContentM">
        <div className="titleM">
          {title}
        </div>
        <div className="subTitleM">
          {subTitle}
        </div>
      </div>
    );
  }

  render() {
    const {
      isOpen,
      gradientClass,
      onClickCloseIcon,
      children,
      setMobileMenuStateAction,
      setStatsSelectedCountriesAction
    } = this.props;

    return (
      <div className={`modalContentM ${gradientClass} ${getStyleClassForModal(isOpen)}`}>
        <div className="flexBoxParent wrapperOfModalM">

          <div className="flexBoxItem flexBoxModalHeaderBar headerOfModalM">
            <div
              className="mobileMenuIconM"
              onClick={() => setMobileMenuStateAction(true)}
            />

            {!isMobile() && <Link to={getPath('/world-map')}>
              <i
                onClick={onClickCloseIcon}
                className="exit-img-icon-desktop"
              /></Link>}

            <div className="rightTopOptions">
              {/*{this.renderExportButtons()}*/}
              {this.renderShareIcons()}
            </div>

            {this.renderTitleContent()}
          </div>
          {children}
        </div>
      </div>
    );
  }
}

PagePanel.defaultProps = {
  isOpen: false,
  onClickCloseIcon: () => {}
}

PagePanel.propTypes = {
  children: PropTypes.any,
  countryList: PropTypes.any,
  entityPageName: PropTypes.any,
  exportToExcel: PropTypes.any,
  gradientClass: PropTypes.string.isRequired,
  groupList: PropTypes.any,
  groupName: PropTypes.any,
  isOpen: PropTypes.bool.isRequired,
  onClickCloseIcon: PropTypes.func,
  pillarId: PropTypes.any,
  rankingKpiList: PropTypes.any,
  selectedCountry: PropTypes.any,
  selectedGroup: PropTypes.any,
  selectedKPI: PropTypes.any,
  selectedKpiId: PropTypes.any,
  selectedYear: PropTypes.any,
  setMobileMenuStateAction: PropTypes.any,
  setStatsSelectedCountriesAction: PropTypes.any,
  share: PropTypes.any,
  subTitle: PropTypes.any,
  title: PropTypes.string
};

const mapStateToProps = (state) => ({
  rankingKpiList: state.kpiReducer.rankingKpiList,
  selectedPillar: state.coreReducer.selectedPillar,
  selectedCountry: state.coreReducer.selectedCountry,
  selectedKPI: state.coreReducer.selectedKPI,
  selectedYear: state.coreReducer.selectedYear,
  selectedKpiId: _.get(state, 'coreReducer.selectedKPI.kpi.id', null),
  selectedGroup: _.get(state, 'coreReducer.selectedGroup.groupId', null),
  groupName: _.get(state, 'coreReducer.selectedGroup.countryGroupTextMap.title', null)
});

const actions = {
  setMobileMenuStateAction,
  setStatsSelectedCountriesAction
};

export default connect(mapStateToProps, actions)(PagePanel);
