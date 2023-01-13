// React
import React from 'react';
import numeral from 'numeral';
import Select from 'react-select';
import ClipboardButton from 'react-clipboard.js';
import * as ReactDOM from 'react-dom';
import {
  Label,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import SDK from '../../mCommons/mSDK';

import {
  getHeight, colorSetM, colorSetRefM, downloadAsXLS, getColorByData, colorSetG,
  getColorByDataV2, getPullClassForLang
} from '../../mCommons/mUtils';
import { shapeArray } from './mGraphicsUtil';

import './mGraphics.css';

const CustomLabelEN = (data) => {
  const xPos = data.x - 60;
  const yPos = data.y + 2;

  return (<g>
    <rect x={xPos - 8} y={yPos - 13} width={72} height="20" rx="3" ry="3" style={{ fill: data.fill }} />
    ,
    <text x={xPos} y={yPos} style={{ fill: 'white', fontSize: '11px' }}>{data.name}</text>
  </g>);
};

const CustomLabelAR = (data) => {
  const xPos = data.x;
  const yPos = data.y;

  const lM = data.name.length;
  let widthM;

  if (lM < 8) { widthM = lM * 7.5; } else if (lM < 16) { widthM = lM * 6; } else { widthM = lM * 4.5; }

  return (<g>
    <rect x={xPos - widthM - 8} y={yPos - 14} width={widthM} height="20" rx="3" ry="3" style={{ fill: data.fill }} />
    ,
    <text x={xPos - (16)} y={yPos} style={{ fill: 'white', fontSize: '11px' }}>{data.name}</text>
  </g>);
};

const HoverDivWithValue = (self, countryCode, value, color) => {
  const x = self.state.mousePosition.x;
  const y = self.state.mousePosition.y;
  const html = `<div style="left:${12 + x}px; top:${y}px; padding: 8px 32px;" class="tooltipM">` +
    `<div style="margin: 0 auto;" class="country-flag-small sprite sprite-${countryCode}"></div>` +
    `<span class="countryHover">${self._e(self.state.countryIdMap[countryCode], 'countryName')}</span>` +
    `<span style="color: ${color}" class="valueAndDenominator">${numeral(value).format('0.0a')}/${self.getDenominatorName()}</span>` +
    '</div>';
  self.setState({ tooltipContainerLine: html });
};

const CustomizedDot = React.createClass({
  onMouseOver() {
    HoverDivWithValue(this.props.self, this.props.countryCode, this.props.value, this.props.color);
  },

  onMouseLeave() {
    this.props.self.setState({ tooltipContainerLine: '' });
  },

  render() {
    const { cx, cy, stroke, payload, value, countryCode, countryArray, i } = this.props;
    if (this.props.payload[this.props.countryCode] === undefined) { return null; }

    return (
      <svg
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        {shapeArray[i](cx, cy)}
      </svg>
    );
  }
});

class mGraphics {
  constructor(self) {
    this.self = self;
    this.hideExport = true;
  }

  didUpdated() {

  }

  generateShareURL = () => `${window.location.origin}/world-map/detail/${this.self.state.selectedPillar}/${this.self.state.selectedKPI}/${this.self.state.selectedCountry}/${this.self.state.selectedYear}/${SDK.locale}`

  onBenchmarkClick() {
    this.self.mCountryBenchmarkSelector.getTitle = () => this.self.state.lang.graphic_stats;
    this.self.mCountryBenchmarkSelector.onBackClick = () => {
      this.self.setState({ selectedClosableModal: 'graphics' });
    };
    this.self.mSelectCountries.onDoneClick = () => {
      this.self.mSelectCountries.resetSearch();
      this.self.setState({ selectedClosableModal: 'graphics' });
    };
    this.self.setState({ selectedClosableModal: 'benchmarkSelector' });
  }

  closeModal() {
    this.self.setState({ selectedClosableModal: '' });
    if (this.self.state.selectedModal === 'countryDetails') {
      this.self.closeGraphAndStatsModalReturnFirstState();
    }
  }

  normalizeSliderYear(year) {
    const number = parseInt(year.toString().substr(0, 4));
    if (number < 2009) { return 2009; } else if (number > 2020) { return 2020; }
    return number;
  }

  generateGraphicDataForLineChart() {
    if (this.self.state.scoreDataAllYears === undefined || this.self.state.scoreDataAllYears === null) { return [[], []]; }

    let isData = false;
    const data = [];

    for (let year = this.normalizeSliderYear(this.self.state.selectedYearStart); year <= this.normalizeSliderYear(this.self.state.selectedYearEnd); year++) {
      const dataLine = { year };
      const dataForSelectedYear = this.self.state.scoreDataAllYears[year];

      if (dataForSelectedYear !== undefined) {
        this.self.state.statsSelectedCountries.forEach((country) => {
          const countryData = dataForSelectedYear.areas[country];
          if (countryData !== undefined && countryData !== null && countryData.value != '-1') {
            dataLine[country] = countryData.dataValue;
            isData = true;
          }
        });

        if (this.self.state.statsSelectedGroups.length > 0) {
          dataForSelectedYear.groups.forEach((x) => {
            if (this.self.state.statsSelectedGroups.indexOf(x.groupUid) > -1 && x.groupScore !== undefined && x.groupScore !== null && x.groupScore > 0) {
              dataLine[x.groupUid] = x.groupScore;
            }
          });
        }
      }

      data.push(dataLine);
    }

    return [data, isData];
  }

  generateGraphicData(selectedYear) {
    if (this.self.state.scoreDataAllYears === null || selectedYear === null) { return [[], []]; }

    const itemsCountry = [];
    const itemsGroup = [];
    let isDownloadable = false;

    const dataForSelectedYear = this.self.state.scoreDataAllYears[selectedYear];
    if (dataForSelectedYear === undefined || dataForSelectedYear === null) { return [[], []]; }

    const groupDataMap = {};
    dataForSelectedYear.groups.forEach((x) => {
      groupDataMap[x.groupUid] = x;
    });

    this.self.state.statsSelectedCountries.forEach((x) => {
      const selectedCountryInfo = dataForSelectedYear.areas[x];

      // if(selectedCountryInfo.value !== undefined && selectedCountryInfo.value === "-1"){
      //     itemsCountry.push({name: x, data: 0, value: 0});
      // }
      if (selectedCountryInfo !== null && selectedCountryInfo !== undefined) {
        itemsCountry.push({
          fullName: this.self._e(this.self.state.countryIdMap[x], 'countryName'),
          name: x,
          data: selectedCountryInfo.dataValue,
          value: selectedCountryInfo.value
        });
        if (selectedCountryInfo.value !== '-1') { isDownloadable = true; }
      }
    });

    this.self.state.statsSelectedGroups.forEach((x) => {
      const selectedGroupInfo = groupDataMap[x];
      if (selectedGroupInfo !== null && selectedGroupInfo !== undefined && selectedGroupInfo.groupScore !== undefined && selectedGroupInfo.groupScore !== 0) {
        itemsGroup.push({
          name: selectedGroupInfo.groupName,
          data: selectedGroupInfo.groupScore
        });
      }
    });
    return [itemsCountry, itemsGroup, isDownloadable];
  }

  generateDownloadableData(dataCountry, dataGroup) {
    const downloadData = [];

    if (this.self.state.selectedKPIObj.name !== undefined) { downloadData.push(['#', this.self.state.selectedKPIObj.name]); }

    //-------
    dataCountry.forEach((x) => {
      downloadData.push([x.name, x.data.toString()]);
    });
    dataGroup.forEach((x) => {
      downloadData.push([x.name, x.data.toString()]);
    });
    return downloadData;
  }

  formatTick(x) {
    if (x > 1000000000) {
      return `${Math.round(x * 10 / 1000000000) / 10}B`;
    }
    return numeral(x).format('0.00a');
  }

  _onLineOverGroup(groupCode) {
    const x = this.self.state.mousePosition.x;
    const y = this.self.state.mousePosition.y;
    const html = `<div style="left:${12 + x}px; top:${y}px; padding: 8px 32px;" class="tooltipM">` +
      `<span class="countryHover">${this.self.state.groupListUIdDataMap[groupCode].groupName}</span>` +
      '</div>';
    this.self.setState({ tooltipContainerLine: html });
  }

  _onLineOverCountry(countryCode) {
    const x = this.self.state.mousePosition.x;
    const y = this.self.state.mousePosition.y;

    if (typeof countryCode === 'object') { countryCode = countryCode.name; }

    const html = `<div style="left:${12 + x}px; top:${y}px; padding: 8px 32px;" class="tooltipM">` +
      `<div style="margin: 0 auto;" class="country-flag-small sprite sprite-${countryCode}"></div>` +
      `<span class="countryHover">${this.self._e(this.self.state.countryIdMap[countryCode], 'countryName')}</span>` +
      '</div>';
    this.self.setState({ tooltipContainerLine: html });
  }

  _onBarLineOverCountry(x, y, z) {
    HoverDivWithValue(this.self, x.name, x.data, x.fill);
  }

  _onLineOutside() {
    this.self.setState({ tooltipContainerLine: '' });
  }

  getLineChart(dataSet) {
    const data = dataSet[0];
    const isData = dataSet[1];
    const lines = [];
    this.self.state.statsSelectedCountries.forEach((country, i) => {
      lines.push(<Line
        onMouseLeave={this._onLineOutside.bind(this)}
        onMouseMove={this._onLineOverCountry.bind(this, country)}
        dot={<CustomizedDot
          i={i} countryArray={this.self.state.statsSelectedCountries} countryCode={country} self={this.self}
          color={this.self.state.statsSelectedCountriesColorMap[country]}
        />}
        isAnimationActive={false}
        key={`line_${country}`}
        type="monotone"
        dataKey={country}
        stroke={this.self.state.statsSelectedCountriesColorMap[country]}
        strokeWidth={2}
      />);
    });

    this.self.state.statsSelectedGroups.forEach((group, i) => {
      lines.push(<Line
        onMouseLeave={this._onLineOutside.bind(this)}
        onMouseMove={this._onLineOverGroup.bind(this, group)}
        dot={<CustomizedDot />}
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
          orientation={(this.self.lang.currentEnglish) ? 'left' : 'right'}
          tickCount={10}
          tickFormatter={(x) => this.formatTick(x)}
        />
        {lines}
      </LineChart>
    );
  }

  getBarChart(dataCountry, dataGroup, isData) {
    return (
      <BarChart data={dataCountry} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="fullName" />
        <YAxis
          orientation={(this.self.lang.currentEnglish) ? 'left' : 'right'}
          tickCount={10}
          tick={isData}
          tickFormatter={(x) => this.formatTick(x)}
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
          onMouseMove={this._onBarLineOverCountry.bind(this)}
          onMouseLeave={this._onLineOutside.bind(this)}
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

  getSelectedYearsForHeader(isSingleYear) {
    if (isSingleYear) {
      const avgOfYear = (this.self.state.selectedYearEnd + this.self.state.selectedYearStart) / 2;
      const lastDigit = avgOfYear.toString().split('').pop();
      return this.normalizeSliderYear(avgOfYear);
    }
    return `${this.normalizeSliderYear(this.self.state.selectedYearStart)} - ${this.normalizeSliderYear(this.self.state.selectedYearEnd)}`;
  }

  renderSelectBoxValue(option) {
    return (<strong>
            <span
              className="colorDotM"
              style={{ background: this.self.state.statsSelectedCountriesColorMap[option.countryId] }}
            /> {(this.self.lang.currentEnglish) ? option.countryName : option.countryName}
    </strong>);
  }

  renderSelectBoxValueGroup(option, i) {
    return (<strong>
            <span
              className="colorDotM"
              style={{ background: colorSetG[i] }}
            /> {option.groupName}
    </strong>);
  }

  _onMouseMove(e) {
    // console.log(e, {x: e.clientX, y: e.clientY});
    // window.abde = e;
    // this.self.setState({mousePosition: {x: e.screenX, y: e.screenY}});
  }

  renderForMobile(dataCountry, dataGroup, isData, isDownloadable, height) {
    return (
      <div className="fullScreenModal Stats-Table">
        <div onClick={this.closeModal.bind(this)} className="exit-img-icon" />
        <div className="modalHeaderM">
          <div className="titleM">
            {this.self.state.lang.graphic_stats}
            {!this.hideExport && (() => {
              if (isDownloadable) {
                return (
                  <i
                    className="download-icon"
                    onClick={() => {
                      if ((/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent))) {
                        window.open(SDK.getDownloadURL_Graph(
                          this.self.state.selectedKPI,
                          this.self.state.statsSelectedCountries.join(),
                          this.self.groupUIDToID(this.self.state.statsSelectedGroups).join(),
                          this.self.state.selectedYear,
                          this.self.state.selectedKPIObj.name
                        ));
                      } else {
                        downloadAsXLS('Graphics', 'Graphics', this.generateDownloadableData(dataCountry, dataGroup), false);
                      }
                    }}
                  />
                );
              }
            })()}
          </div>
          <div className="subTitleM">{this.self.getPillarKPIBreadcrumb()}</div>
        </div>

        <div className="gapM20" />

        <div onClick={this.onBenchmarkClick.bind(this)} className="benchmarkButtonM">
          <img alt="Floating Button" src="/assets/images/floating-btn-normal@x2.png" />
        </div>

        {(() => {
          if ((this.self.state.statsSelectedCountries.length) > 0) {
            return (
              <div style={{ paddingLeft: '15px', paddingRight: '15px', paddingBottom: 60 }}>
                <ResponsiveContainer width="100%" height={height}>
                  {this.getBarChart(dataCountry, dataGroup, isData)}
                </ResponsiveContainer>
                <div className="benchmarkListM">
                  {(() => {
                    const groupListM = [];
                    this.self.state.groupListData.forEach((x, i) => {
                      if (this.self.state.statsSelectedGroups.indexOf(x.groupUid) > -1) {
                        groupListM.push(
                          <div key={x.groupName} className={'countryBubble group'}>
                            <div
                              className="colorDotM"
                              style={{ backgroundColor: colorSetG[i] }}
                            />
                            {x.groupName}
                          </div>);
                      }
                    });
                    return groupListM;
                  })()}
                </div>
              </div>
            );
          }

          return (
            <div className="emptyStateM">
              <img src="/assets/images/nocountry.png" />
              <div className="emptyTitleM">{this.self.state.lang.compare_empty_title}</div>
              <div className="emptyTextM">{this.self.state.lang.compare_empty_text}</div>
            </div>
          );
        })()}
      </div>
    );
  }

  renderForDesktop(dataCountry, dataGroup, isData, isDownloadable, height, isSingleYear) {
    let isDataForLine = false;
    let dataSet;
    if ((this.self.state.statsSelectedCountries.length) > 0) {
      dataSet = this.generateGraphicDataForLineChart();
      isDataForLine = dataSet[1];
    }

    return (
      <div className="fullScreenModal Stats-Table desktopModeModal">
        <ClipboardButton
          onSuccess={() => {
            ReactDOM.findDOMNode(this.self.refs.tooltipTextCopied).style.visibility = 'visible';
            setTimeout(() => {
              ReactDOM.findDOMNode(this.self.refs.tooltipTextCopied).style.visibility = 'hidden';
            }, 1000);
          }}
          className="shareButton copyToClipboard"
          data-clipboard-text={this.generateShareURL()}
        >
          <i className="fa fa-clipboard" style={{ fontSize: '20px' }} />
        </ClipboardButton>
        <div onClick={this.closeModal.bind(this)} className="exit-img-icon" />
        <div className="modalHeaderM">
          <div className="titleM wrapTitleM">
            {this.self.state.lang.graphic_title} {this.self.getKPIName()} {this.getSelectedYearsForHeader(isSingleYear)}
            {!this.hideExport && (() => {
              if (isDownloadable) {
                return (
                  <i
                    className="download-icon"
                    onClick={() => {
                      if ((/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent))) {
                        window.open(SDK.getDownloadURL_Graph(
                          this.self.state.selectedKPI,
                          this.self.state.statsSelectedCountries.join(),
                          this.self.groupUIDToID(this.self.state.statsSelectedGroups).join(),
                          this.self.state.selectedYear,
                          this.self.state.selectedKPIObj.name
                        ));
                      } else {
                        downloadAsXLS('Graphics', 'Graphics', this.generateDownloadableData(dataCountry, dataGroup), false);
                      }
                    }}
                  />
                );
              }
            })()}
          </div>
          <div className="subTitleM wrapTitleM">{this.self.getPillarKPIBreadcrumb()}</div>
        </div>

        <div className="gapM20" />

        {(() => (
          <div style={{ marginTop: '20px' }}>
            <div className={getPullClassForLang(this.self)} style={{ width: '70%' }}>
              {(() => {
                if ((this.self.state.statsSelectedCountries.length) > 0) {
                  if (isDataForLine) {
                    return (
                      <div>

                        <div className="graph-wrapper">
                          <div className="denominator-name">
                            {this.self.getDenominatorName()}
                          </div>
                          <ResponsiveContainer width="100%" height={height}>
                            {(!isSingleYear) ? this.getLineChart(dataSet) : this.getBarChart(dataCountry, dataGroup, isData)}
                          </ResponsiveContainer>
                        </div>
                        <div
                          className="graphBottomText"
                        >{(!isSingleYear) ? this.self.state.lang.years : this.self.state.lang.countries_title}</div>
                      </div>
                    );
                  }
                  return (
                    <div className="emptyStateM">
                      <img src="/assets/images/nocountry.png" />
                      <div
                        className="emptyTitleM"
                      >{this.self.state.lang.compare_empty_title}</div>
                      {/*<div*/}
                      {/*className="emptyTextM">{this.self.state.lang.compare_empty_text}</div>*/}
                    </div>
                  );
                }
                return (
                  <div className="emptyStateM">
                    <img src="/assets/images/nocountry.png" />
                    <div
                      className="emptyTitleM"
                    >{this.self.state.lang.compare_empty_title}</div>
                    <div
                      className="emptyTextM"
                    >{this.self.state.lang.compare_empty_text}</div>
                  </div>
                );
              })()}
            </div>

            <div
              className={`${getPullClassForLang(this.self)} graphStatContent`}
              style={{ width: '27%' }}
            >

              <div className="">
                <div className="">
                  <div
                    className="contentDetailH1"
                  >{this.self.state.lang.add_countries} ({this.self.state.statsSelectedCountries.length}/5)
                  </div>
                  <div className="searchBoxM">
                    <Select
                      simpleValue
                      valueRenderer={this.renderSelectBoxValue.bind(this)}
                      multi
                      clearable={false}
                      searchable
                      placeholder={this.self.state.lang.select_countries_placeholder}
                      labelKey="countryName"
                      valueKey="countryId"
                      value={this.self.state.statsSelectedCountries}
                      options={this.self.state.countries}
                      noResultsText={this.self.state.lang.select_no_results}
                      onChange={(value) => {
                        this.self.onCountriesChanged(value);
                      }}
                    />
                    {(() => {
                      if (this.self.state.statsSelectedCountries.length > 0) {
                        return (
                          <div
                            onClick={this.self.clearAllCountries.bind(this.self)}
                            className="clearInputM"
                          >
                            {this.self.state.lang.clear_all}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <div
                    className="contentDetailH1"
                  >{this.self.state.lang.benchmarks} ({this.self.state.statsSelectedGroups.length}/5)
                  </div>
                  <div className="searchBoxM">
                    <Select
                      simpleValue
                      valueRenderer={this.renderSelectBoxValueGroup.bind(this)}
                      multi
                      clearable={false}
                      searchable
                      placeholder={this.self.state.lang.select_groups_placeholder}
                      labelKey={'groupName'}
                      valueKey="groupUid"
                      value={this.self.state.statsSelectedGroups}
                      options={this.self.state.groupListData}
                      noResultsText={this.self.state.lang.select_no_results}
                      onChange={(value) => {
                        this.self.onGroupsChanged(value);
                      }}
                    />
                    {(() => {
                      if (this.self.state.statsSelectedGroups.length > 0) {
                        return (
                          <div
                            onClick={this.self.clearAllGroups.bind(this.self)}
                            className="clearInputM"
                          >
                            {this.self.state.lang.clear_all}
                          </div>
                        );
                      }
                    })()}
                  </div>

                  <div className="scrollContentGraph customScrollbar">
                    <div className="">

                      <div className="hideBelow720">
                        <div
                          className="contentDetailH1"
                        >{this.self.state.lang.overview}</div>
                        <div
                          className="contentDetailP"
                        >{this.self.state.selectedKPIForModalObj.descriptionLong}</div>
                      </div>

                      <div className="contentDetailH1">{this.self.state.lang.source}</div>
                      <div className="contentDetailP">
                        <a target="_blank" href={this.self.state.selectedKPIObj.sourceUrl}>
                          {this.self.state.selectedKPIForModalObj.sourceName}
                        </a>
                      </div>

                      <div className="hideBelow720">
                        <div
                          className="contentDetailH1"
                        >{this.self.state.lang.updated}</div>
                        <div
                          className="contentDetailP"
                        >{this.self.state.selectedKPIForModalObj.frequency}</div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="clearfix" />
          </div>
        ))()}
      </div>
    );
  }

  render() {
    let isSingleYear = false;
    let selectedSingleYear;
    if (this.self.state.selectedYearEnd - this.self.state.selectedYearStart === 10) {
      const avgOfYear = (this.self.state.selectedYearEnd + this.self.state.selectedYearStart) / 2;
      const lastDigit = avgOfYear.toString().split('').pop();
      selectedSingleYear = this.normalizeSliderYear(avgOfYear);
      if (lastDigit === '0') { isSingleYear = true; }
    }

    let maxValue = 0;
    let minValue = 0;
    let isData = false;
    const height = getHeight() - 240;

    const [dataCountry, dataGroup, isDownloadable] = this.generateGraphicData(selectedSingleYear);

    dataGroup.forEach((entry, index) => {
      if (entry.data !== null && entry.data !== undefined) {
        if (entry.data > maxValue) { maxValue = entry.data * 1.1; }
        if (entry.data < minValue) { minValue = entry.data; }

        if (entry.data !== 0) { isData = true; }
      }
    });
    dataCountry.forEach((entry, index) => {
      if (entry.data !== null && entry.data !== undefined) {
        if (entry.data > maxValue) { maxValue = entry.data; }
        if (entry.data < minValue) { minValue = entry.data; }

        if (entry.value !== '-1') { isData = true; }
      }
    });

    if (!isData) { maxValue = 100; }

    if (this.self.state.isDesktopMode) { return this.renderForDesktop(dataCountry, dataGroup, isData, isDownloadable, height, isSingleYear); }
    return this.renderForMobile(dataCountry, dataGroup, isData, isDownloadable, height);
  }
}

export default mGraphics;
