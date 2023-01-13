// React
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import Select from 'react-select';
import {Table, Column, Cell} from 'fixed-data-table';
import numeral from 'numeral';

import {getWidth, getHeight, getPullClassForLang} from '../../../mCommons/mUtils';
import {_lang} from '../../../utils';

const getColorDiv = (weightedScore) => {
    if (weightedScore < 0.5) {
        return 'td-range1';
    } else if (weightedScore < 1) {
        return 'td-range2';
    } else if (weightedScore < 1.5) {
        return 'td-range3';
    } else if (weightedScore < 2) {
        return 'td-range4';
    } else if (weightedScore < 2.5) {
        return 'td-range5';
    } else if (weightedScore < 3) {
        return 'td-range6';
    } else if (weightedScore < 3.5) {
        return 'td-range7';
    } else if (weightedScore < 4) {
        return 'td-range8';
    } else if (weightedScore < 4.5) {
        return 'td-range9';
    }
    return 'td-range10';
};

const ColorDataCell = ({rowIndex, data, col, ...props}) => {
    let selectedClass = "";
    if (props.selectedKPI !== null && data[rowIndex]['kpi']['id'] === props.selectedKPI)
        selectedClass = "selectedKPIColCell";

    let ifCond = data[rowIndex]['data'][col]['data'] !== undefined &&
        data[rowIndex]['data'][col]['data'] !== null &&
        data[rowIndex]['data'][col]['data'] !== "";

    return (<Cell className={selectedClass} {...props}>
    <span className={
        (ifCond) ? getColorDiv(data[rowIndex]['data'][col]['weightedScore']) : ""}>
      {(ifCond) ? numeral(data[rowIndex]['data'][col]['data']).format('0.00a') : "-"}
    </span>
    </Cell>);
};

const KPINameCell = ({rowIndex, data, col, ...props}) => {
    let selectedClass = "";
    if (props.selectedKPI != null && data[rowIndex]['kpi']['id'] == props.selectedKPI)
        selectedClass = "selectedKPIColCell";

    return (<Cell onClick={(() => {
        return props.onSelectKPI(data[rowIndex]['kpi']);
    })} className={selectedClass} {...props}>
    <span className="kpiNameTableCellM">
      {data[rowIndex]['kpi']['name']}
    </span>
    </Cell>);
};

class FullStats_R extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollContentGraph: null,
            scrollLeft: null,
            scrollTop: null,
            scrollX: null,
            scrollY: null,
            overflowX: null,
            overflowY: null,
            countryIdMap: {},
            groupListUIdDataMap: {},
            selectedKPIForModalObj: {},
        }
    }

    componentDidMount() {
    }

    __onScrollEnd(x, y) {
        if (!this.touching) {
            this.setState({scrollLeft: x, scrollTop: y});
        }
    }

    __onTouchStart(e) {
        this.setState({overflowX: 'hidden', overflowY: 'hidden'});
        this.touching = true;
        this.touchStart = this.__getTouchCoordinates(e);
    }

    __onTouchMove(e) {
        e.preventDefault();
        this.__scrollGrid(e)
    }

    __onTouchEnd(e) {
        this.touching = false;
        this.setState({overflowX: 'auto', overflowY: 'auto'});
    }

    __scrollGrid(e) {
        let touchEnd = this.__getTouchCoordinates(e);
        let scrollX = touchEnd.x - this.touchStart.x;
        let scrollY = touchEnd.y - this.touchStart.y;

        let deltaX = scrollX < 0 ? scrollX * -1 : scrollX;
        let deltaY = scrollY < 0 ? scrollY * -1 : scrollY;

        let scrollLeft, scrollTop;
        if (deltaX > deltaY) {
            scrollLeft = Math.max(0, this.self.state.scrollLeft - scrollX);
            scrollTop = this.self.state.scrollTop;
        } else {
            scrollLeft = this.self.state.scrollLeft;
            scrollTop = Math.max(this.self.state.scrollTop - scrollY);
        }

        this.self.setState({scrollLeft, scrollTop});
        this.touchStart = touchEnd;
    }

    __getTouchCoordinates(e) {
        let touches = e.nativeEvent.changedTouches;
        if (touches && touches.length > 0) {
            return {x: touches.item(0).clientX, y: touches.item(0).clientY};
        }
        return false;
    }

    onSelectKPI(kpiObj) {
        this.self.setState({selectedKPIForModalObj: kpiObj, selectedKPIForModal: kpiObj.id});
    }

    renderForDesktop(statsMap, countryList, groupList) {
        const countryIdMap = {};
        countryList.forEach((country) => {
            countryIdMap[country.countryId] = country;
        });

        const widthOfKpiCol = 300;
        let width = (getWidth - 88) * 0.7;
        let height = getHeight() - 230;


        const marginLeftM = width - widthOfKpiCol;
        let widthOfCol = 180;
        if (!_lang('currentEnglish')) {
            countryList.reverse();
            groupList.reverse();

            if ((countryList.length + groupList.length) <= 1) {
                widthOfCol = getWidth() - widthOfKpiCol - 40;
            }
        }

        const totalDataCount = countryList.length + groupList.length;

        return (
            <div className="fullScreenModal Stats-Table desktopModeModal">
                {(() => {
                    if (_lang('currentEnglish') !== 'currentEnglish') {
                        return (
                            <style
                                dangerouslySetInnerHTML={{__html: `.fixedDataTableRowLayout_rowWrapper .fixedDataTableRowLayout_body .fixedDataTableCellGroupLayout_cellGroupWrapper:nth-child(1) .fixedDataTableCellGroupLayout_cellGroup { margin-left: ${marginLeftM}px !important; }`}}/>
                        );
                    }
                })()}
                {/* <div onClick={this.closeModal.bind(this)} className="exit-img-icon" /> */}
                <div className="modalHeaderM">
                    <div className="titleM">
                        {_lang('full_stats_title')} {this.props.selectedYear}
                    </div>
                    <div
                        className="subTitleM">{_lang('kpis')} ({statsMap.length})
                    </div>
                </div>

                <div className="gapM20"/>

                <div style={{marginTop: "20px"}}>
                    <div className={getPullClassForLang(this.self)} style={{width: "70%"}}>

                        <div className="overlayForEmptyState"
                             style={{display: (totalDataCount <= 0) ? "block" : "none"}}>
                            <div className="emptyStateM">
                                <img src="/assets/images/nocountry.png"/>
                                <div className="emptyTitleM">{_lang('compare_empty_title')}</div>
                                <div className="emptyTextM">{_lang('compare_empty_text')}</div>
                            </div>
                        </div>

                        <div
                            style={{opacity: (totalDataCount <= 0) ? "0.1" : "1"}}
                            className="innerSidePadding"
                            ref={ref => {
                                this.container = ref
                            }}
                            onTouchStart={e => this.__onTouchStart(e)}
                            onTouchEnd={e => this.__onTouchEnd(e)}
                            onTouchMove={e => this.__onTouchMove(e)}>
                            <Table
                                isColumnResizing={false}
                                onScrollEnd={(x, y) => this.__onScrollEnd(x, y)}
                                scrollTop={this.state.scrollTop}
                                scrollLeft={this.state.scrollLeft}
                                overflowX={this.state.overflowX}
                                overflowY={this.state.overflowY}

                                rowHeight={50}
                                headerHeight={65}
                                rowsCount={statsMap.length}
                                width={width}
                                height={height}
                                {...this.props}>

                                {(() => {
                                    let colList = [];
                                    countryList.forEach((x) => {
                                        colList.push(
                                            <Column
                                                key={x}
                                                header={<Cell>
                                                    <span className={"country-flag-small table-flag sprite-" + x}/>
                                                    <Link to={'/country-profile/' + x}
                                                          target="_blank">{countryIdMap[x.countryId]['countryName']}</Link>
                                                </Cell>}
                                                cell={<ColorDataCell data={statsMap} col={x}
                                                                     selectedKPI={this.props.selectedKPI}/>}
                                                width={widthOfCol}/>
                                        );
                                    });

                                    // groupList.forEach((x) => {
                                    //   colList.push(
                                    //     <Column
                                    //       key={x}
                                    //       header={
                                    //         <Cell>{this.state.groupListUIdDataMap[x]['groupName']}</Cell>}
                                    //       cell={<ColorDataCell data={statsMap} col={x}
                                    //         selectedKPI={this.self.state.selectedKPIForModal} />}
                                    //       width={widthOfCol} />
                                    //   );
                                    // });
                                    console.log(this.props.countryList);

                                    return colList;
                                })()}

                                <Column
                                    cell={<KPINameCell onSelectKPI={this.onSelectKPI.bind(this)} data={statsMap}
                                                       selectedKPI={this.state.selectedKPIForModal}/>}
                                    fixed={true}
                                    width={widthOfKpiCol}/>
                            </Table>
                        </div>
                    </div>

                    <div className={getPullClassForLang(this.self) + " graphStatContent"}
                         style={{width: "27%"}}>

                        <div className="contentDetailH1">
                            {_lang('add_countries')} ({this.props.statsSelectedCountries.length}/5)
                        </div>

                        <div className="searchBoxM">
                            <Select
                                simpleValue
                                multi={true}
                                clearable={false}
                                searchable={true}
                                placeholder={_lang('select_countries_placeholder')}
                                labelKey={"countryName"}
                                valueKey="countryId"
                                value={this.props.statsSelectedCountries}
                                options={this.props.countryObj.countryList}
                                noResultsText={_lang('select_no_results')}
                                onChange={(value) => {
                                    // this.self.onCountriesChanged(value);
                                }}
                            />
                            {(() => {
                                if (this.props.statsSelectedCountries.length > 0)
                                    return (
                                        <div
                                            className="clearInputM">
                                            {_lang('clear_all')}
                                        </div>
                                    );
                            })()}
                        </div>

                        <div className="contentDetailH1">
                            {_lang('benchmarks')} ({this.props.statsSelectedGroups.length}/5)
                        </div>
                        <div className="searchBoxM">
                            <Select
                                simpleValue
                                multi={true}
                                clearable={false}
                                searchable={true}
                                placeholder={_lang('select_groups_placeholder')}
                                labelKey={"groupName"}
                                valueKey="groupUid"
                                value={this.props.statsSelectedGroups}
                                options={this.props.groupListData}
                                noResultsText={_lang('select_no_results')}
                                onChange={(value) => {
                                    // this.self.onGroupsChanged(value);
                                }}
                            />
                            {(() => {
                                if (this.props.statsSelectedGroups.length > 0)
                                    return (
                                        <div
                                            className="clearInputM">
                                            {_lang('clear_all')}
                                        </div>
                                    );
                            })()}
                        </div>

                        <div className="scrollContentGraph customScrollbar">
                            <div className="">
                                <div className="hideBelow720">
                                    <div className="contentDetailH1">{_lang('overview')}</div>
                                    <div
                                        className="contentDetailP">{this.props.selectedKPI.kpi.kpiTextMap.deescription_long}</div>
                                </div>

                                <div
                                    className="contentDetailH1">{this.props.selectedKPI.kpi.sourceTextMap.citation}</div>
                                <div className="contentDetailP">
                                    <a target="_blank" href={this.props.selectedKPI.kpi.url}>
                                        {this.props.selectedKPI.kpi.sourceTextMap.title}
                                    </a>
                                </div>

                                <div className="hideBelow720">
                                    <div className="contentDetailH1">{_lang('updated')}</div>
                                    <div className="contentDetailP"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="clearfix"/>

                </div>
            </div>
        );
    }

    render() {
        const {countryList} = this.props.countryObj;
        const {groups: groupList, kpiValue, searchableKPIList} = this.props;
        const statsMap = [];

        if (kpiValue && kpiValue.kpiCountryMap) {
            const countryIdMap = {};
            const countryKPIMap = {};

            countryList.forEach((country) => {
                countryIdMap[country.countryId] = country;
            });

            Object.keys(kpiValue.kpiCountryMap).forEach((country) => {
                if (countryIdMap[country]) {
                    const selectedCountry = kpiValue.kpiCountryMap[country];
                    countryKPIMap[country] = {kpiMap: {}};
                    selectedCountry.kpiValues.forEach((kpi) => {
                        countryKPIMap[country].kpiMap[kpi.kpiId] = kpi;
                    });
                }
            });

            const groupKPIMap = {};
            Object.keys(kpiValue.kpiGroupsmap).forEach((country) => {
                if (countryIdMap[country]) {
                    const selectedGroup = kpiValue.kpiGroupsmap[country];
                    const groupId = selectedGroup.groupUid;

                    if (groupList.indexOf(groupId) > -1) {
                        groupKPIMap[groupId] = {kpiMap: {}};
                        selectedGroup.kpiValues.forEach((kpi) => {
                            groupKPIMap[groupId].kpiMap[kpi.kpiId] = kpi;
                        });
                    }
                }
            });

            const kpiList = [];

            if (searchableKPIList.length > 0) {
                searchableKPIList.forEach((kpi) => {
                    if (kpi.id === this.props.selectedKPI.id) {
                        kpiList.push(kpi);
                        return false;
                    }
                });
            }

            kpiList.forEach((kpi) => {
                let data = {};

                countryList.forEach((country) => {
                    if (countryKPIMap[country.countryId] !== undefined) {
                        data[country] = countryKPIMap[country.countryId].kpiMap[kpi.id];
                    } else {
                        data[country] = {};
                    }
                });

                groupList.forEach((group) => {
                    if (groupKPIMap[group] !== undefined) {
                        data[group] = groupKPIMap[group].kpiMap[kpi.id];
                    } else {
                        data[group] = {};
                    }
                });

                statsMap.push({kpi, data});
            });
        }

        return this.props.closeableModal === 'fullStats' ? this.renderForDesktop(statsMap, countryList, groupList) : null;
    }
}

FullStats_R.propTypes = {};

const mapStateToProps = (state) => {
    return {
        countryObj: state.countryReducer,
        groups: state.groupsReducer.groups,
        closeableModal: state.coreReducer.closeableModal,
        kpiValue: state.kpiReducer.kpiValue,
        searchableKPIList: state.coreReducer.searchableKPIList,
        selectedYear: state.coreReducer.selectedYear,
        statsSelectedCountries: state.coreReducer.statsSelectedCountries,
        statsSelectedGroups: state.coreReducer.statsSelectedGroups,
        selectedKPI: state.coreReducer.selectedKPI,
    };
};

const actions = {};

export default withRouter(connect(mapStateToProps, actions)(FullStats_R));
