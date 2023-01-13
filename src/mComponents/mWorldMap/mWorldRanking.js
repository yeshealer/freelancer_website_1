// React
import React from 'react'
import Select from 'react-select';
import SDK from "../../mCommons/mSDK";
import {downloadAsXLS, getHeight} from '../../mCommons/mUtils';



import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

// function priceFormatter(cell, row){
//     return cell;
// }

class mWorldRanking  {

    constructor(self) {
        this.self = self;
        this.hideExport=true;
    }

    // Data Layer
    load_WorldRankingData(group, year, kpi) {
        if(kpi !== null){
            SDK.getRankingByKPIAndYearAndCountryGroup(
                kpi,
                year,
                group,
                (statusCode, response) => {
                    this.self.setState({selectedGroupRankingData: response});
                },
                () => {

                }
            );
        }

    }

    generateDownloadableData(){
        let downloadData = [];
        downloadData.push([this.self.state.lang.table_rank, this.self.state.lang.table_countries, this.self.state.lang.table_score]);
        this.self.state.selectedGroupRankingData.forEach((x) => {
            downloadData.push([x.score.toString(), x.countryName.toString(), x.data.toString()]);
        });

        return downloadData;
    }

    // Year Listener
    onYearChanged(year) {
        this.load_WorldRankingData(this.self.state.selectedGroup, year, this.self.state.selectedKPI);
    }

    columnClassNameFormat(fieldValue, row, rowIdx, colIdx) {
        if(row.weightedScore < 0.5){
            return 'td-range1';
        } else if(row.weightedScore < 1){
            return 'td-range2';
        } else if(row.weightedScore < 1.5){
            return 'td-range3';
        } else if(row.weightedScore < 2){
            return 'td-range4';
        } else if(row.weightedScore < 2.5){
            return 'td-range5';
        } else if(row.weightedScore < 3){
            return 'td-range6';
        } else if(row.weightedScore < 3.5){
            return 'td-range7';
        } else if(row.weightedScore < 4){
            return 'td-range8';
        } else if(row.weightedScore < 4.5){
            return 'td-range9';
        } else {
            return 'td-range10';
        }
    }

    formatCountryName(cell, row){
        return this.self.state.countryIdMap[cell]['countryName'];
    }

    didUpdated(){

        let tableDiv = document.getElementsByClassName("react-bs-container-body");
        if(tableDiv.length > 0){
            tableDiv[0].style.height = "0px";
        }

        let heightOfScrollDiv = 260;
        let heightOfPage = getHeight() - heightOfScrollDiv;

        if(tableDiv.length > 0){
            tableDiv[0].style.height = heightOfPage + "px";
        }
    }


    onSortChange(sortName, sortOrder) {
        let scrollContent = document.getElementsByClassName("react-bs-container-body");
        if(scrollContent.length > 0)
            scrollContent[0].scrollTop = 0;
    }

    // View Layer
    render() {
        const options = {
            onSortChange: this.onSortChange.bind(this)
        };
        return (
            <div className={"modalContentM darkRedM " + this.self.state.desktopModeClass}>
                <div className="wrapperOfModalM">

                    <div className="headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)} />
                        {this.self.closeDesktopModalButton()}

                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.world_ranking_title}

                                {!this.hideExport&&(() => {
                                    if(this.self.state.selectedGroupRankingData.length > 0)
                                        return (
                                            <i
                                                className="download-icon"
                                                onClick={() => {
                                                    if((/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent))) {
                                                        window.open(SDK.getDownloadURL_Ranking(
                                                            this.self.state.selectedKPI,
                                                            this.self.state.selectedYear,
                                                            this.self.state.selectedGroup,
                                                            this.self.state.selectedGroupName
                                                        ));
                                                    }else{
                                                        downloadAsXLS(`${this.self.state.selectedGroupName}_${this.self.state.selectedYear.toString()}_${this.self.getKPIName()}`, "Ranking", this.generateDownloadableData(), false);
                                                    }
                                                }}
                                            />
                                        );
                                })()}
                            </div>
                            <div className="subTitleM">
                                { this.self.getPillarKPIBreadcrumb() }
                            </div>
                        </div>
                    </div>

                    <div className="searchBoxM">
                        <Select
                            clearable={false}
                            simpleValue
                            searchable={false}
                            labelKey="groupName"
                            valueKey="groupId"
                            value={this.self.state.selectedGroup}
                            options={this.self.state.groupListData}
                            onChange={(value) => {
                                this.self.setState({ selectedGroup: value , selectedGroupName: this.self.state.groupListDataMap[value.toString()]['groupName']});
                                if(this.self.state.selectedKPI !== null)
                                    this.load_WorldRankingData(value, this.self.state.selectedYear, this.self.state.selectedKPI);
                            }} />
                    </div>

                    <div className="modalBodyM" id="countryTableM">
                        {(() => {
                            if(this.self.state.selectedGroupRankingData.length <= 0)
                                return (<div className="noDataMessageM">{this.self.state.lang.no_data_message}</div>);

                            return (
                                <div className="global-ranking-tableM">
                                    <BootstrapTable options={options} data={this.self.state.selectedGroupRankingData} striped={false} hover={true} scrollTop={'5'}>
                                        <TableHeaderColumn dataField="score" dataAlign="left" dataSort={true}>{this.self.state.lang.table_rank}</TableHeaderColumn>
                                        <TableHeaderColumn dataField="countryName" className="sec-column" dataAlign="left" isKey={true} dataSort={true}>{this.self.state.lang.table_countries}</TableHeaderColumn>
                                        <TableHeaderColumn dataField="data" columnClassName={ this.columnClassNameFormat } dataAlign="right">{this.self.state.lang.table_score}</TableHeaderColumn>
                                    </BootstrapTable>
                                </div>
                            );
                        })()}
                    </div>

                </div>
            </div>
        );
    }

}

export default mWorldRanking;