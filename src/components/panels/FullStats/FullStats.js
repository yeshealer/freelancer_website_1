import React from 'react';
import { connect } from 'react-redux';

import { getKpiValueAction, setStatsSelectedCountriesAction } from '../../../redux';
import { _lang, getLanguageKey, getPath, isMobile } from '../../../utils';
import FullPagePanel from '../../commons/FullPagePanel/FullPagePanel';
import Select from 'react-select';

import { Link, withRouter } from 'react-router-dom';
import { getHeight, getPullClassForLang, getWidth } from '../../../mCommons/mUtils';
import renderSelectBoxValueGroup from '../Graphics/utils/renderSelectBoxValueGroup';
import renderSelectBoxValue from '../Graphics/utils/renderSelectBoxValue';

import './style.css';
import KPICell from './components/KPICell';
import CountryCell from './components/CountryCell';
import setStatsSelectedGroups from '../../../redux/actions/setStatsSelectedGroups';
import setMobileOverlayStateAction from '../../../redux/actions/setMobileOverlayStateAction';
import GroupCell from './components/GroupCell';

const { Table, Column, Cell } = require('fixed-data-table-2');
const _ = require('lodash');

class FullStats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      scrollTop: 0,
      overflowX: 'hidden',
      overflowY: 'hidden'
    };
  }

  closeModal() {
    const { match } = this.props;
    this.props.history.push(getPath(`/world-map/${match.params.pageId}`));
  }

  onBenchmarkClick() {
    // this.self.mSelectCountries.onDoneClick = () => {
    //     this.self.mSelectCountries.resetSearch();
    //     this.self.setState({selectedClosableModal: "benchmarkSelector"})
    // };
    // this.self.mCountryBenchmarkSelector.getTitle = () => {
    //     return this.self.state.lang.full_stats;
    // };
    // this.self.mCountryBenchmarkSelector.onBackClick = () => {
    //     this.self.setState({selectedClosableModal: "fullStats"});
    // };
    // this.self.setState({selectedClosableModal: "benchmarkSelector"})


    const { setMobileOverlayStateAction } = this.props;
    setMobileOverlayStateAction('isMobileOverlayBenchmarkSelector', true);
  }

  componentDidMount() {

  }

  clearAllGroups() {

  }

  render() {
    const {
      statsSelectedCountries, selectedKPI, selectedLanguage, countryKeyMap,
      countryList, setStatsSelectedCountriesAction, statsSelectedGroups,
      groupList, groupKeyMap, kpiValue, match, setStatsSelectedGroups
    } = this.props;

    let width = getWidth();

    if (!isMobile()) {
      width = (width - 88) * 0.7;
    } else {
      width -= 40;
    }

    const widthOfKpiCol = 300;
    let widthOfCol = 180;
    let height = getHeight() - 170;
    const marginLeft = width - widthOfKpiCol;

    const countryModifiedList = countryList.map((country) => ({
      ...country,
      countryName: country.countryTextMap.name
    }));

    const groupModifiedList = groupList.map((group) => ({
      ...group,
      groupName: group.countryGroupTextMap.title
    }));

    const totalDataCount = statsSelectedCountries.length + statsSelectedGroups.length;

    // const isOpen = (match.params.subPageId === 'full-stats');

    /**
     * Table Settings
     * This parts changes depending on device.
     **/
    let tableSettings = {};
    if (isMobile()) {
      tableSettings = {
        rowHeight: 70,
        headerHeight: 50,
        headerA: (countryCode) => <Cell>{_.get(countryKeyMap, `${countryCode}.countryCode`, '')}</Cell>,
        headerB: (groupCode) => <Cell>{_.get(groupKeyMap, `${groupCode}.groupId`, '')}</Cell>,
        widthOfKPI: 160
      };
    } else {
      height = getHeight() - 230;
      if ((statsSelectedCountries.length + statsSelectedGroups.length) <= 1) {
        widthOfCol = getWidth() - widthOfKpiCol - 40;
      }
      tableSettings = {
        rowHeight: 50,
        headerHeight: 65,
        headerA: (countryCode) => <Cell>
          <span
            className={`country-flag-small table-flag sprite-${_.get(countryKeyMap, `${countryCode}.countryCode`, '')}`}
          />
          <Link
            to={`/country-profile/${_.get(countryKeyMap, `${countryCode}.countryId`, '')}`}
            target="_blank"
          >
            {_.get(countryKeyMap, `${countryCode}.countryTextMap.name`, '')}
          </Link>
        </Cell>,
        headerB: (groupCode) => (
          <Cell>
            {_.get(groupKeyMap, `${groupCode}.countryGroupTextMap.title`, '')}
          </Cell>
        ),
        widthOfKPI: widthOfKpiCol
      };
    }

    const { kpiMap, kpiCountryMap } = kpiValue;

    const countryGroupList = [
      ...statsSelectedCountries,
      ...statsSelectedGroups
    ];

    const kpiList = Object.values(kpiMap);
    const kpiIdList = Object.keys(kpiMap);

    const classByLang = ((selectedLanguage === 'en_SA') ? 'pull-left' : 'pull-right');

    if (!selectedKPI.kpi) {
      return null;
    }

    return (
      <FullPagePanel
        isMobile={isMobile()}
        closeModal={this.closeModal.bind(this)}
        isOpen
        isPrintButton
        isExportToPDFButton
        title={`${_lang('graphic_title')} ${selectedKPI.kpi.kpiTextMap.title}`}
        subTitle={selectedKPI.kpi.kpiTextMap.title}
        subPageId={match.params.subPageId}

      >
        <div className="graphContentWrapper">
          {(() => {
            if (getLanguageKey() === 'ar') {
              return (
                <style
                  dangerouslySetInnerHTML={{ __html: `.fixedDataTableRowLayout_rowWrapper .fixedDataTableRowLayout_body .fixedDataTableCellGroupLayout_cellGroupWrapper:nth-child(1) .fixedDataTableCellGroupLayout_cellGroup { margin-left: ${marginLeft}px !important; }` }}
                />
              );
            }
          })()}

          <div onClick={this.onBenchmarkClick.bind(this)} className="benchmarkButtonM fullStatsBenchmarkButton">
            <img alt="Floating Button" src="/assets/images/floating-btn-normal@x2.png" />
          </div>

          <div className={`${classByLang} graphContent`}>
            <div
              className="overlayForEmptyState"
              style={{ display: (totalDataCount <= 0) ? 'block' : 'none' }}
            >
              <div className="emptyStateM">
                <img src="/assets/images/nocountry.png" />
                <div className="emptyTitleM">{_lang('compare_empty_title')}</div>
                <div className="emptyTextM">{_lang('compare_empty_text')}</div>
              </div>
            </div>

            <div
              style={{ opacity: (totalDataCount <= 0) ? '0' : '1' }}
              className="innerSidePadding"
            >
              <Table
                rowHeight={tableSettings.rowHeight}
                rowsCount={kpiList.length}
                headerHeight={tableSettings.headerHeight}
                touchScrollEnabled
                width={width}
                height={height}
              >
                <Column
                  key="col_kpiObj"
                  columnKey="kpiObj"
                  header={<Cell />}
                  cell={<KPICell data={kpiList} />}
                  fixed
                  fixedRight
                  width={tableSettings.widthOfKPI}
                />

                {statsSelectedCountries.map(countryCode => (
                  <Column
                    key={`col_${countryCode}`}
                    columnKey={countryCode}
                    header={tableSettings.headerA(countryCode)}
                    cell={<CountryCell
                      kpiIdList={kpiIdList}
                      data={_.get(kpiCountryMap, `${countryCode}.kpiValues`, [])}
                    />}
                    fixed={false}
                    width={180}
                  />
                ))}

                {statsSelectedGroups.map(group => (
                  <Column
                    key={`col_${group}`}
                    columnKey={group}
                    header={tableSettings.headerB(group)}
                    cell={<GroupCell
                      data={groupKeyMap[group]}
                    />}
                    fixed={false}
                    width={180}
                  />
                ))}

              </Table>
            </div>
          </div>

          {(() => {
            if (!isMobile()) {
              return (
                <div
                  className={`${classByLang} graphStatContent`}
                  style={{ width: '27%' }}
                >
                  <div className="contentDetailH1">
                    {_lang('add_countries')} ({statsSelectedCountries.length}/5)
                  </div>
                  <div className="searchBoxM">
                    <Select
                      simpleValue
                      valueRenderer={renderSelectBoxValue.bind(this)}
                      multi
                      clearable={false}
                      searchable
                      placeholder={_lang('select_countries_placeholder')}
                      labelKey="countryName"
                      valueKey="countryId"
                      value={statsSelectedCountries}
                      options={countryModifiedList}
                      noResultsText={_lang('select_no_results')}
                      onChange={(value) => {
                        setStatsSelectedCountriesAction(value);
                      }}
                    />
                    {(() => {
                      if (statsSelectedCountries.length > 0) {
                        return (
                          <div
                            onClick={() => setStatsSelectedCountriesAction('')}
                            className="clearInputM"
                          >
                            {_lang('clear_all')}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <div className="contentDetailH1">
                    {_lang('benchmarks')} ({statsSelectedGroups.length}/5)
                  </div>
                  <div className="searchBoxM">
                    <Select
                      simpleValue
                      valueRenderer={renderSelectBoxValueGroup}
                      multi
                      clearable={false}
                      searchable
                      placeholder={_lang('select_groups_placeholder')}
                      labelKey='groupName'
                      valueKey="groupId"
                      value={statsSelectedGroups}
                      options={groupModifiedList}
                      noResultsText={_lang('select_no_results')}
                      onChange={(value) => {
                        setStatsSelectedGroups(value);
                      }}
                    />
                    {(() => {
                      if (statsSelectedGroups.length > 0) {
                        return (
                          <div
                            onClick={() => setStatsSelectedGroups(null)}
                            className="clearInputM"
                          >
                            {_lang('clear_all')}
                          </div>
                        );
                      }
                    })()}
                  </div>


                  <div className="scrollContentGraph customScrollbar">
                    <div className="">

                      <div className="hideBelow720">
                        <div className="contentDetailH1">
                          {_lang('overview')}
                        </div>
                        <div className="contentDetailP">
                          {selectedKPI.kpi.kpiTextMap.description_long}
                        </div>
                      </div>

                      <div className="contentDetailH1">{_lang('source')}</div>
                      <div className="contentDetailP">
                        <a target="_blank" href={selectedKPI.kpi.url}>
                          {selectedKPI.kpi.sourceTextMap.title}
                        </a>
                      </div>

                      <div className="hideBelow720">
                        <div className="contentDetailH1">{_lang('updated')}</div>
                        <div className="contentDetailP">
                          {selectedKPI.kpi.kpiTextMap.denominator}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            }
          })()}

          <div className="clearfix" />

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

export default withRouter(connect(mapStateToProps, actions)(FullStats));
