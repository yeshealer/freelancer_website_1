import React from 'react';
import { connect } from 'react-redux';
import FullPagePanel from '../../commons/FullPagePanel/FullPagePanel';
import { _lang, isMobile } from '../../../utils';
import { getKpiValueAction, setStatsSelectedCountriesAction } from '../../../redux';
import { withRouter } from 'react-router-dom';
import { colorSetG, getColorByDataV2, getHeight } from '../../../mCommons/mUtils';
import setStatsSelectedGroups from '../../../redux/actions/setStatsSelectedGroups';
import setMobileOverlayStateAction from '../../../redux/actions/setMobileOverlayStateAction'

const _ = require('lodash');

class BenchmarkSelectorMobile extends React.Component {

  closeModal() {

  }

  removeCountry(id) {
    // setStatsSelectedCountriesAction
  }

  clearAll() {

  }

  openCountriesPanel() {
    const { setMobileOverlayStateAction } = this.props;
    setMobileOverlayStateAction('isMobileOverlayCountrySelector', true);
  }

  toggleGroup(value) {
    const {
      setStatsSelectedGroups, statsSelectedGroups
    } = this.props;

    const newList = [...statsSelectedGroups];

    if (statsSelectedGroups.indexOf(value) > -1) {
      _.pull(newList, value);
    } else {
      newList.push(value);
    }

    setStatsSelectedGroups(newList.join(','));
  }

  render() {
    const height = getHeight() - 110;
    const {
      statsSelectedCountries, selectedKPI, selectedLanguage, countryKeyMap, statsSelectedGroups,
      groupList
    } = this.props;

    return (
      <FullPagePanel
        headerType={2}
        isMobile={isMobile()}
        isOpen
        title="Full Stats"
        subTitle=""
      >

        <div className="innerSidePadding overFlowYScroll" style={{ height }}>
          <div className="row">
            <div
              className="col-xs-6 titleM"
              style={{ float: (selectedLanguage === 'en_SA') ? 'left' : 'right' }}
            >{_lang('countries_title')}</div>
            <div className={`col-xs-6 ${(selectedLanguage === 'en_SA') ? 'text-right' : 'text-left'}`}>
              <div
                onClick={this.openCountriesPanel.bind(this)}
                className="addCountriesM"
              >+ <span>{_lang('add_countries')}</span></div>
            </div>
          </div>
          <div className="selectedCountriesM marginTop20">

            {(() => {
              const countryList = [];
              statsSelectedCountries.forEach((x, i) => {
                const color = getColorByDataV2(i);
                countryList.push(
                  <div key={`Country_${x}`} className="countryBubble">
                    <div className="colorDotM" style={{ backgroundColor: color }} />
                    {_.get(countryKeyMap, `${x}.countryTextMap.name`, '')}
                    <span
                      onClick={this.removeCountry.bind(this, x)}
                      className="cross-img-icon"
                    />
                  </div>
                );
              });
              return countryList;
            })()}


            {(() => {
              if (statsSelectedCountries.length > 0) {
                return (<div
                  onClick={this.clearAll.bind(this)}
                  className="clearAll"
                >{_lang('clear_all')}</div>);
              }
            })()}

          </div>

          <div className="row marginTop50">
            <div className="col-xs-12 titleM">{_lang('benchmarks')}</div>
          </div>
          <div className="selectedCountriesM marginTop20">

            {(() => {
              const countryList = [];
              groupList.forEach((x, i) => {
                let activeClass = '';
                if (statsSelectedGroups.indexOf(x.groupId) > -1) {
                  activeClass = 'active';
                }
                countryList.push(
                  <div
                    onClick={this.toggleGroup.bind(this, x.groupId)}
                    key={`Benchmarks_${x.groupId}_${i}`}
                    className={`countryBubble group ${activeClass}`}
                  >
                    <div className="colorDotM" style={{ backgroundColor: colorSetG[i] }} />
                    {x.countryGroupTextMap.title}
                  </div>
                );
              });
              return countryList;
            })()}


            <div className="line1PX marginTop50" />
          </div>

          <div className="marginTop20">
            <div className="detailBlockM">
              <div className="detailTitleM">{_lang('overview')}</div>
              <div className="detailTextM">{selectedKPI.kpi.kpiTextMap.description_long}</div>
            </div>

            <div className="detailBlockM">
              <div className="detailTitleM">{_lang('source')}</div>
              <div className="detailTextM">{selectedKPI.kpi.sourceTextMap.title}</div>
            </div>

            <div className="detailBlockM">
              <div className="detailTitleM">{_lang('updated')}</div>
              {/*<div className="detailTextM">{this.self.state.selectedKPIForModalObj.frequency}</div>*/}
            </div>

          </div>
        </div>

      </FullPagePanel>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedYearStart: state.coreReducer.selectedYearStart,
  selectedYearEnd: state.coreReducer.selectedYearEnd,
  statsSelectedCountries: state.coreReducer.statsSelectedCountries,
  kpiScoreMap: state.kpiReducer.kpiScoreMap,
  selectedKPI: state.coreReducer.selectedKPI,
  selectedLanguage: state.coreReducer.selectedLanguage,
  countryList: state.countryReducer.countryList,
  countryKeyMap: state.countryReducer.countryKeyMap,
  selectedYear: state.coreReducer.selectedYear,
  statsSelectedGroups: state.coreReducer.statsSelectedGroups,
  groupList: state.groupsReducer.groups,
  groupKeyMap: state.groupsReducer.groupKeyMap,
  selectedKPIId: state.coreReducer.selectedKPIId,
  kpiValue: state.kpiReducer.kpiValue
});

const actions = {
  setStatsSelectedCountriesAction,
  getKpiValueAction,
  setStatsSelectedGroups,
  setMobileOverlayStateAction
};

export default withRouter(connect(mapStateToProps, actions)(BenchmarkSelectorMobile));
