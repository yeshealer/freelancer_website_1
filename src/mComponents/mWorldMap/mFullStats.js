// React
import React from 'react';
import Select from 'react-select';
import 'fixed-data-table/dist/fixed-data-table.css';
import {Table, Column, Cell} from 'fixed-data-table';
import numeral from 'numeral';
import {getWidth, getHeight, downloadAsXLS, getPullClassForLang, colorSetG} from '../../mCommons/mUtils';
import SDK from "../../mCommons/mSDK";
import langUtils from "../../mCommons/mUtils/langUtils";
import {Link} from 'react-router-dom';

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

class mFullStats {
    constructor(self) {
        this.self = self;
        this.hideExport = true;
    }

    didUpdated() {

    }

    onBenchmarkClick() {
        this.self.mSelectCountries.onDoneClick = () => {
            this.self.mSelectCountries.resetSearch();
            this.self.setState({selectedClosableModal: "benchmarkSelector"})
        };
        this.self.mCountryBenchmarkSelector.getTitle = () => {
            return this.self.state.lang.full_stats;
        };
        this.self.mCountryBenchmarkSelector.onBackClick = () => {
            this.self.setState({selectedClosableModal: "fullStats"});
        };
        this.self.setState({selectedClosableModal: "benchmarkSelector"})
    }

    __onScrollEnd(x, y) {
        if (!this.touching) {
            this.self.state.scrollLeft = x;
            this.self.state.scrollTop = y;
        }
    }

    __onTouchStart(e) {
        this.self.setState({overflowX: 'hidden', overflowY: 'hidden'});
        this.touching = true;
        this.touchStart = this.__getTouchCoordinates(e);
    }

    __onTouchMove(e) {
        e.preventDefault();
        this.__scrollGrid(e)
    }

    __onTouchEnd(e) {
        this.touching = false;
        this.self.setState({overflowX: 'auto', overflowY: 'auto'});
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

        this.self.setState({scrollLeft: scrollLeft, scrollTop: scrollTop});
        this.touchStart = touchEnd;
    }

    __getTouchCoordinates(e) {
        let touches = e.nativeEvent.changedTouches;
        if (touches && touches.length > 0) {
            return {x: touches.item(0).clientX, y: touches.item(0).clientY};
        }
        return false;
    }

    closeModal() {
        this.self.setState({selectedClosableModal: ""});
        if (this.self.state.selectedModal === "countryDetails") {
            this.self.closeGraphAndStatsModalReturnFirstState();
        }
    }

    generateDownloadableData(statsData, countryList, groupList) {
        let downloadData = [];

        let titleLine = ["#"];
        countryList.forEach((x) => {
            titleLine.push(x);
        });
        groupList.forEach((x) => {
            titleLine.push(x);
        });

        downloadData.push(titleLine);

        //-------
        let tempLine;
        statsData.forEach((x) => {
            tempLine = [];
            tempLine.push(x['kpi']['name']);

            countryList.forEach((y) => {
                tempLine.push(x['data'][y]['data']);
            });
            groupList.forEach((y) => {
                tempLine.push(x['data'][y]['data']);
            });
            downloadData.push(tempLine);
        });

        return downloadData;
    }

    onSelectKPI(kpiObj) {
        this.self.setState({selectedKPIForModalObj: kpiObj, selectedKPIForModal: kpiObj.id});
    }

    renderForMobile(statsMap, countryList, groupList) {
        let width = getWidth() - 40;
        let height = getHeight() - 170;
        let marginLeftM = width - 160;
        let widthOfCol = 80;

        if (!this.self.lang.currentEnglish) {
            countryList.reverse();
            groupList.reverse();

            if ((countryList.length + groupList.length) <= 1) {
                widthOfCol = getWidth() - 160 - 40;
            }
        }

        return (
            <div className="fullScreenModal Stats-Table">
                {(() => {
                    if (!this.self.lang.currentEnglish)
                        return (
                            <style
                                dangerouslySetInnerHTML={{__html: `.fixedDataTableRowLayout_rowWrapper .fixedDataTableRowLayout_body .fixedDataTableCellGroupLayout_cellGroupWrapper:nth-child(1) .fixedDataTableCellGroupLayout_cellGroup { margin-left: ${marginLeftM}px !important; }`}}/>
                        );
                })()}
                <div onClick={this.closeModal.bind(this)} className="exit-img-icon"/>
                <div className="modalHeaderM">
                    <div className="titleM">
                        {this.self.state.lang.full_stats}
                    </div>
                    <div className="subTitleM">{this.self.getPillarName()} ({statsMap.length})</div>
                </div>

                <div className="gapM10"/>

                <div onClick={this.onBenchmarkClick.bind(this)} className="benchmarkButtonM fullStatsBenchmarkButton">
                    <img alt="Floating Button" src="/assets/images/floating-btn-normal@x2.png"/>
                </div>

                <div
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
                        scrollTop={this.self.state.scrollTop}
                        scrollLeft={this.self.state.scrollLeft}
                        overflowX={this.self.state.overflowX}
                        overflowY={this.self.state.overflowY}

                        rowHeight={70}
                        headerHeight={50}
                        rowsCount={statsMap.length}
                        width={width}
                        height={height}
                        {...this.self.props}>

                        {(() => {
                            let colList = [];
                            countryList.forEach((x) => {
                                colList.push(
                                    <Column
                                        key={x}
                                        header={<Cell>{x}</Cell>}
                                        cell={<ColorDataCell data={statsMap} col={x}
                                                             selectedKPI={this.self.state.selectedKPIForModal}/>}
                                        width={widthOfCol}/>
                                );
                            });

                            groupList.forEach((x) => {
                                colList.push(
                                    <Column
                                        key={x}
                                        header={<Cell>{x}</Cell>}
                                        cell={<ColorDataCell data={statsMap} col={x}
                                                             selectedKPI={this.self.state.selectedKPIForModal}/>}
                                        width={widthOfCol}/>
                                );
                            });

                            return colList;
                        })()}

                        <Column
                            cell={<KPINameCell onSelectKPI={this.onSelectKPI.bind(this)} data={statsMap}
                                               selectedKPI={this.self.state.selectedKPIForModal}/>}
                            fixed={true}
                            width={160}/>
                    </Table>
                </div>
            </div>
        );
    }

    renderForDesktop(statsMap, countryList, groupList) {
        let widthOfKpiCol = 300;
        let width = (getWidth() - 88) * 0.7;
        let height = getHeight() - 170;

        if (this.self.state.isDesktopMode)
            height = getHeight() - 230;

        let marginLeftM = width - widthOfKpiCol;
        let widthOfCol = 180;
        if (!this.self.lang.currentEnglish) {
            countryList.reverse();
            groupList.reverse();

            if ((countryList.length + groupList.length) <= 1) {
                widthOfCol = getWidth() - widthOfKpiCol - 40;
            }
        }

        let totalDataCount = countryList.length + groupList.length;

        return (
            <div className="fullScreenModal Stats-Table desktopModeModal">
                {(() => {
                    if (!this.self.lang.currentEnglish)
                        return (
                            <style
                                dangerouslySetInnerHTML={{__html: `.fixedDataTableRowLayout_rowWrapper .fixedDataTableRowLayout_body .fixedDataTableCellGroupLayout_cellGroupWrapper:nth-child(1) .fixedDataTableCellGroupLayout_cellGroup { margin-left: ${marginLeftM}px !important; }`}}/>
                        );
                })()}
                <div onClick={this.closeModal.bind(this)} className="exit-img-icon"/>
                <div className="modalHeaderM">
                    <div className="titleM">
                        {this.self.state.lang.full_stats_title} {this.self.state.selectedYear}
                    </div>
                    <div
                        className="subTitleM">{this.self.getPillarName()} {this.self.state.lang.kpis} ({statsMap.length})
                    </div>
                </div>

                <div className="gapM20"/>

                <div style={{marginTop: "20px"}}>
                    <div className={getPullClassForLang(this.self)} style={{width: "70%"}}>

                        <div className="overlayForEmptyState"
                             style={{display: (totalDataCount <= 0) ? "block" : "none"}}>
                            <div className="emptyStateM">
                                <img src="/assets/images/nocountry.png"/>
                                <div className="emptyTitleM">{this.self.state.lang.compare_empty_title}</div>
                                <div className="emptyTextM">{this.self.state.lang.compare_empty_text}</div>
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
                                scrollTop={this.self.state.scrollTop}
                                scrollLeft={this.self.state.scrollLeft}
                                overflowX={this.self.state.overflowX}
                                overflowY={this.self.state.overflowY}

                                rowHeight={50}
                                headerHeight={65}
                                rowsCount={statsMap.length}
                                width={width}
                                height={height}
                                {...this.self.props}>

                                {(() => {
                                    let colList = [];
                                    countryList.forEach((x) => {
                                        colList.push(
                                            <Column
                                                key={x}
                                                header={<Cell>
                                                    <span className={"country-flag-small table-flag sprite-" + x}/>
                                                    <Link to={'/country-profile/' + x} target="_blank">{this.self.state.countryIdMap[x]['countryName']}</Link>
                                                </Cell>}
                                                cell={<ColorDataCell data={statsMap} col={x}
                                                                     selectedKPI={this.self.state.selectedKPIForModal}/>}
                                                width={widthOfCol}/>
                                        );
                                    });

                                    groupList.forEach((x) => {
                                        colList.push(
                                            <Column
                                                key={x}
                                                header={
                                                    <Cell>{this.self.state.groupListUIdDataMap[x]['groupName']}</Cell>}
                                                cell={<ColorDataCell data={statsMap} col={x}
                                                                     selectedKPI={this.self.state.selectedKPIForModal}/>}
                                                width={widthOfCol}/>
                                        );
                                    });

                                    return colList;
                                })()}

                                <Column
                                    cell={<KPINameCell onSelectKPI={this.onSelectKPI.bind(this)} data={statsMap}
                                                       selectedKPI={this.self.state.selectedKPIForModal}/>}
                                    fixed={true}
                                    width={widthOfKpiCol}/>
                            </Table>
                        </div>
                    </div>

                    <div className={getPullClassForLang(this.self) + " graphStatContent"}
                         style={{width: "27%"}}>

                        <div className="contentDetailH1">
                            {this.self.state.lang.add_countries} ({this.self.state.statsSelectedCountries.length}/5)
                        </div>

                        <div className="searchBoxM">
                            <Select
                                simpleValue
                                multi={true}
                                clearable={false}
                                searchable={true}
                                placeholder={this.self.state.lang.select_countries_placeholder}
                                labelKey={"countryName"}
                                valueKey="countryId"
                                value={this.self.state.statsSelectedCountries}
                                options={this.self.state.countries}
                                noResultsText={this.self.state.lang.select_no_results}
                                onChange={(value) => {
                                    this.self.onCountriesChanged(value);
                                }}
                            />
                            {(() => {
                                if (this.self.state.statsSelectedCountries.length > 0)
                                    return (
                                        <div onClick={this.self.clearAllCountries.bind(this.self)}
                                             className="clearInputM">
                                            {this.self.state.lang.clear_all}
                                        </div>
                                    );
                            })()}
                        </div>

                        <div className="contentDetailH1">
                            {this.self.state.lang.benchmarks} ({this.self.state.statsSelectedGroups.length}/5)
                        </div>
                        <div className="searchBoxM">
                            <Select
                                simpleValue
                                multi={true}
                                clearable={false}
                                searchable={true}
                                placeholder={this.self.state.lang.select_groups_placeholder}
                                labelKey={"groupName"}
                                valueKey="groupUid"
                                value={this.self.state.statsSelectedGroups}
                                options={this.self.state.groupListData}
                                noResultsText={this.self.state.lang.select_no_results}
                                onChange={(value) => {
                                    this.self.onGroupsChanged(value);
                                }}
                            />
                            {(() => {
                                if (this.self.state.statsSelectedGroups.length > 0)
                                    return (
                                        <div onClick={this.self.clearAllGroups.bind(this.self)}
                                             className="clearInputM">
                                            {this.self.state.lang.clear_all}
                                        </div>
                                    );
                            })()}
                        </div>

                        <div className="scrollContentGraph customScrollbar">
                            <div className="">
                                <div className="hideBelow720">
                                    <div className="contentDetailH1">{this.self.state.lang.overview}</div>
                                    <div className="contentDetailP">{this.self.state.selectedKPIForModalObj.descriptionLong}</div>
                                </div>

                                <div className="contentDetailH1">{this.self.state.lang.source}</div>
                                <div className="contentDetailP">
                                    <a target="_blank" href={this.self.state.selectedKPIObj.sourceUrl}>
                                        {this.self.state.selectedKPIForModalObj.sourceName}
                                    </a>
                                </div>

                                <div className="hideBelow720">
                                    <div className="contentDetailH1">{this.self.state.lang.updated}</div>
                                    <div className="contentDetailP">{this.self.state.selectedKPIForModalObj.frequency}</div>
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
        let statsMap = [];
        let countryList = JSON.parse(JSON.stringify(this.self.state.statsSelectedCountries));
        let groupList = JSON.parse(JSON.stringify(this.self.state.statsSelectedGroups));

        if (this.self.state.kpiValuesForStats !== null) {
            let countryKPIMap = {};

            Object.keys(this.self.state.kpiValuesForStats.kpiCountryMap).forEach((k) => {
                if (countryList.indexOf(k) > -1) {
                    let selectedCountry = this.self.state.kpiValuesForStats.kpiCountryMap[k];
                    countryKPIMap[k] = {kpiMap: {}};
                    selectedCountry.kpiValues.forEach((t) => {
                        countryKPIMap[k]['kpiMap'][t.kpiId] = t;
                    });
                }
            });

            let groupKPIMap = {};
            Object.keys(this.self.state.kpiValuesForStats.kpiGroupsmap).forEach((k) => {
                let selectedGroup = this.self.state.kpiValuesForStats.kpiGroupsmap[k];
                let groupId = selectedGroup['groupUid'];

                if (groupList.indexOf(groupId) > -1) {
                    groupKPIMap[groupId] = {kpiMap: {}};
                    selectedGroup.kpiValues.forEach((t) => {
                        groupKPIMap[groupId]['kpiMap'][t.kpiId] = t;
                    });
                }
            });

            let kpiList = [];

            if (this.self.state.searchableKPIList.length > 0) {
                this.self.state.searchableKPIList.forEach((x) => {
                    if (x.pillarId == this.self.state.selectedPillar) {
                        kpiList = x.kpiList;
                        return false;
                    }
                });
            }

            kpiList.forEach((x) => {
                let data = {};

                countryList.forEach((y) => {
                    if (countryKPIMap[y] !== undefined) {
                        data[y] = countryKPIMap[y]['kpiMap'][x.id];
                    } else
                        data[y] = {};
                });

                groupList.forEach((y) => {
                    if (groupKPIMap[y] !== undefined) {
                        data[y] = groupKPIMap[y]['kpiMap'][x.id];
                    } else
                        data[y] = {};
                });

                statsMap.push({kpi: x, data: data});
            });
        }

        if (this.self.state.isDesktopMode)
            return this.renderForDesktop(statsMap, countryList, groupList);
        else
            return this.renderForMobile(statsMap, countryList, groupList);
    }
}

export default mFullStats;
