import React from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Select from 'react-select';
import {
  Bar,
  BarChart,
  CartesianGrid, Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { colorSetG, colorSetRefM, getColorByData, getHeight } from '../../../mCommons/mUtils';
import { colorChartData } from '../../../params';
import { setStatsSelectedCountriesAction } from '../../../redux';
import { _lang, isMobile } from '../../../utils';
import FullPagePanel from '../../commons/FullPagePanel/FullPagePanel';
import generateGraphicData from './utils/generateGraphicData';
import generateGraphicDataForLineChart from './utils/generateGraphicDataForLineChart';
import getYearData from './utils/getYearData';
import renderSelectBoxValue from './utils/renderSelectBoxValue';
import CustomizedDot from './utils/CustomizedDot';
import formatTick from './utils/formatTick';
import getSelectedYearsForHeader from './utils/getSelectedYearsForHeader';
import getHoverComponent from './utils/getHoverComponent';
import renderSelectBoxValueGroup from './utils/renderSelectBoxValueGroup';
import getPath from '../../../utils/getPath';

import './style.css';
import setStatsSelectedGroups from '../../../redux/actions/setStatsSelectedGroups';
import onBarLineOverCountry from './utils/onBarLineOverCountry';
import onLineOutside from './utils/onLineOutside';
import onLineLeaveCountry from './utils/onLineLeaveCountry';
import setMobileOverlayStateAction from '../../../redux/actions/setMobileOverlayStateAction';

const _ = require('lodash');

class Graphics extends React.Component {

  constructor(props) {
    super(props);
    this.self = {
      mousePosition: { x: 0, y: 0 }
    };
  }

  closeModal() {
    const { match } = this.props;
    this.props.history.push(getPath(`/world-map/${match.params.pageId}`));
  }

  setMouseListener() {
    const handler = (e) => {
      e = e || window.event;
      let pageX = e.pageX;
      let pageY = e.pageY;
      // IE 8
      if (pageX === undefined) {
        pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      this.setState({ mousePosition: { x: pageX, y: pageY } });
    };

    this.handlerFunc = handler.bind(this);
      document.addEventListener('mousemove', this.handlerFunc);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handlerFunc);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    // TODO: Need optimization.
    this.setMouseListener();
  }

  getLineChart(dataSet) {
    const { mousePosition } = this.state || { x: 0, y: 0 };
    const { statsSelectedCountries, selectedLanguage, statsSelectedGroups } = this.props;

    const data = dataSet[0];
    const isData = dataSet[1];
    const lines = [];

    statsSelectedCountries.forEach((country, i) => {
      lines.push(
        <Line
          onMouseEnter={this._onLineOverCountry.bind(this, country)}
          onMouseLeave={onLineLeaveCountry.bind(this)}
          dot={<CustomizedDot
            i={i}
            mousePosition={mousePosition}
            countryArray={statsSelectedCountries}
            countryCode={country}
            color={colorChartData[i]}
          />}
          isAnimationActive={false}
          key={`line_${country}`}
          type="monotone"
          dataKey={country}
          stroke={colorChartData[i]}
          strokeWidth={2}
        />);
    });

    statsSelectedGroups.forEach((group, i) => {
      lines.push(<Line
        onMouseLeave={onLineLeaveCountry.bind(this)}
        onMouseEnter={this._onLineOverGroup.bind(this, group)}
        dot={false}
        strokeDasharray="5 5"
        isAnimationActive={false}
        key={`group_${group}`}
        type="monotone"
        dataKey={group}
        stroke={colorSetG[i]}
        strokeWidth={2}
      />);
    });

    return (
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#070707" vertical={isData} horizontal={isData} />
        <XAxis dataKey="year" />
        <YAxis
          orientation={(selectedLanguage === 'en_SA') ? 'left' : 'right'}
          tickCount={10}
          tickFormatter={(x) => formatTick(x)}
        />
        {lines}
      </LineChart>
    );
  }

  _onLineOverCountry(countryCode) {
    const { mousePosition } = this.state || { x: 0, y: 0 };
    const { countryKeyMap } = this.props;
    const country = _.get(countryKeyMap, `${countryCode}`, {});

    const hoverComponent = getHoverComponent(mousePosition.x, mousePosition.y, country.countryTextMap.name,
      country.countryCode);

    ReactDOM.render(hoverComponent, document.getElementById('tooltip-root'));
  }

  _onLineOverGroup(groupCode) {
    const { mousePosition } = this.state;

    const hoverComponent = getHoverComponent(mousePosition.x, mousePosition.y, groupCode);

    ReactDOM.render(hoverComponent, document.getElementById('tooltip-root'));
  }

  getBarChart(dataCountry, dataGroup, isData) {
    const { selectedLanguage } = this.props;
    const { mousePosition } = this.state || { x: 0, y: 0 };

    return (
      <BarChart data={dataCountry} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="countryCode" />
        <YAxis
          orientation={(selectedLanguage === 'en_SA') ? 'left' : 'right'}
          tickCount={10}
          tick={isData}
          tickFormatter={(x) => formatTick(x)}
        />
        <CartesianGrid stroke="#070707" vertical={false} horizontal={isData} />
        {
          dataGroup.map((entry, index) => <ReferenceLine
            alwaysShow
            key={`ref_${entry.name}`}
            y={entry.data}
            isFront
            stroke={colorSetRefM[index]}
            strokeDasharray="3 3"
          />)
        }
        <Bar
          onMouseMove={(graphData) => onBarLineOverCountry(graphData, mousePosition)}
          onMouseLeave={onLineOutside}
          barSize={5}
          dataKey="data"
        >
          {
            dataCountry.map((entry, index) => {
              let color = '#fff';
              if (entry !== null && entry !== undefined && entry.value !== undefined && entry.value !== '-1') {
                color = getColorByData(index);
              }
              return <Cell key={`cell_${index}`} strokeWidth={0} stroke={color} fill={color} />;
            })
          }
        </Bar>
      </BarChart>
    );
  }

  onBenchmarkClick() {
    const {setMobileOverlayStateAction} = this.props;
    setMobileOverlayStateAction('isMobileOverlayBenchmarkSelector', true);
  }

  render() {
    // TODO: Find more proper way.
    // window.scrollTo(0, 0);

    const {
      statsSelectedCountries, selectedKPI, selectedLanguage, kpiScoreMap, countryKeyMap, selectedYear,
      countryList, setStatsSelectedCountriesAction, selectedYearStart, selectedYearEnd, statsSelectedGroups,
      groupList, match, setStatsSelectedGroups
    } = this.props;

    if(!selectedKPI.kpi) {
      return null;
    }

    const classByLang = ((selectedLanguage === 'en_SA') ? 'pull-left' : 'pull-right');
    const yearData = getYearData(selectedYearStart, selectedYearEnd);

    let isDataForLine = false;
    let dataSet;
    if (statsSelectedCountries.length > 0) {
      dataSet = generateGraphicDataForLineChart(
        countryKeyMap,
        kpiScoreMap,
        statsSelectedCountries,
        statsSelectedGroups,
        selectedYearStart,
        selectedYearEnd
      );
      isDataForLine = dataSet[1];
    }
    const height = getHeight() - 240;

    const countryModifiedList = countryList.map((country) => ({
      ...country,
      countryName: country.countryTextMap.name
    }));

    const groupModifiedList = groupList.map((group) => ({
      ...group,
      groupName: group.countryGroupTextMap.title
    }));

    const [dataCountry, dataGroup, isDownloadable] = generateGraphicData(
      countryKeyMap,
      kpiScoreMap,
      statsSelectedCountries,
      statsSelectedGroups,
      selectedYear
    );
    let maxValue = 0;
    let minValue = 0;
    let isData = false;

    dataGroup.forEach((entry, index) => {
      if (entry.data !== null && entry.data !== undefined) {
        if (entry.data > maxValue) {
          maxValue = entry.data * 1.1;
        }
        if (entry.data < minValue) {
          minValue = entry.data;
        }

        if (entry.data !== 0) {
          isData = true;
        }
      }
    });
    dataCountry.forEach((entry, index) => {
      if (entry.data !== null && entry.data !== undefined) {
        if (entry.data > maxValue) {
          maxValue = entry.data;
        }
        if (entry.data < minValue) {
          minValue = entry.data;
        }

        if (entry.value !== '-1') {
          isData = true;
        }
      }
    });

    const widthOfGraphContent = (isMobile()) ? '100%' : '70%';

    return (
      <FullPagePanel
        closeModal={this.closeModal.bind(this)}
        isOpen
        isMobile={isMobile()}
        isPrintButton
        isExportToPDFButton
        title={`${_lang('graphic_title')} ${selectedKPI.kpi.kpiTextMap.title} ${getSelectedYearsForHeader(yearData.isSingleYear, selectedYearEnd, selectedYearStart)}`}
        subTitle={selectedKPI.kpi.kpiTextMap.title}
      >

        <div style={{marginTop: '20px'}}>


          <div onClick={this.onBenchmarkClick.bind(this)} className="benchmarkButtonM fullStatsBenchmarkButton">
            <img alt="Floating Button" src="/assets/images/floating-btn-normal@x2.png" />
          </div>

          <div className={classByLang} style={{ width: widthOfGraphContent }}>
            {(() => {
              if (statsSelectedCountries.length > 0) {
                if (isDataForLine) {
                  return (
                    <div>

                      <div className="graph-wrapper">

                        {!isMobile() && <div className="denominator-name">
                          {selectedKPI.kpi.kpiTextMap.denominator}
                        </div>}

                        <ResponsiveContainer width="100%" height={height}>
                          {(!yearData.isSingleYear) ?
                            this.getLineChart(dataSet, dataGroup) :
                            this.getBarChart(dataCountry, dataGroup, isData)}
                        </ResponsiveContainer>
                      </div>

                      {!isMobile() && <div className="graphBottomText">
                        {(!yearData.isSingleYear) ? _lang('years') : _lang('countries_title')}
                      </div>}
                    </div>
                  );
                }
                return (
                  <div className="emptyStateM">
                    <img src="/assets/images/nocountry.png"/>
                    <div
                      className="emptyTitleM"
                    >{_lang('compare_empty_title')}</div>
                  </div>
                );
              }
              return (
                <div className="emptyStateM">
                  <img src="/assets/images/nocountry.png" />
                  <div
                    className="emptyTitleM"
                  >{_lang('compare_empty_title')}</div>
                  <div
                    className="emptyTextM"
                  >{_lang('compare_empty_text')}</div>
                </div>
              );
            })()}
          </div>

          {(() => {
            if (!isMobile()) {
              return (
                <div className={`graphStatContent ${classByLang}`} style={{width: '27%'}}>
                  <div className="">
                    <div className="">
                      <div className="contentDetailH1">
                        {_lang('add_countries')} ({statsSelectedCountries.length}/5)
                      </div>
                      <div className="searchBoxM">
                        <Select
                          simpleValue
                          valueRenderer={renderSelectBoxValue}
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
                  </div>

                </div>
              );
            }
          })()}
          <div className="clearfix"/>
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
  groupList: state.groupsReducer.groups
});

const actions = {
  setStatsSelectedCountriesAction,
  setStatsSelectedGroups,
  setMobileOverlayStateAction
};

export default withRouter(connect(mapStateToProps, actions)(Graphics));
