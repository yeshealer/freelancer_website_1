// React
import React from 'react'
import {downloadAsXLS, getHeight} from '../../mCommons/mUtils';
import SDK from "../../mCommons/mSDK";

class mChooseKPI {

    constructor(self) {
        this.self = self;
        this.hideExport=true;
    }

    handleSearch(event){
        if(event.target.value.length <= 2){
            this.self.setState({kpiSearchResultList: [], showNoResult: false});
        } else{
            let filteredResult = this.self.searchOnKPIList(event.target.value);
            this.self.setState({kpiSearchResultList: filteredResult, showNoResult: true});
        }
    }

    // View components

    // KPI Item List - Search List
    kpiItemList(pillarId, kpiList){
        let list = [];
        kpiList.forEach((x) => {
            list.push(
                <div onClick={() => {
                    this.self.refs.searchInput.value = "";
                    this.self.setState({kpiSearchResultList: [], showNoResult: false});
                    this.self.onKPIChanged(pillarId, x.subPillarId, x.id);
                }} key={x.id}>{x.name}</div>
            );
        });
        return list;
    }

    pillarItem(pillarObj){
        if(pillarObj === undefined)
            return;
        if(pillarObj.kpiList.length <= 0)
            return;
        return (
            <div key={pillarObj.pillarId} className="searchItemsM">
                <div className="pillarNameM">{pillarObj.pillarName}</div>
                <div className="kpiListM">
                    {this.kpiItemList(pillarObj.pillarId, pillarObj.kpiList)}
                </div>
            </div>
        );
    }

    pillarBubbles(){
        if(this.self.state.pillarList === undefined)
            return;

        let pillarList = [];

        this.self.state.pillarList.forEach((x) => {
            let isActivePillar = (this.self.state.chooseKPISelectedPillar === x.pillarId) ? "active" : "";
            pillarList.push(<span onClick={() => {this.self.setState({chooseKPISelectedPillar: x.pillarId})}} className={isActivePillar} key={x.pillarId}>{x.pillarName}</span>);
            pillarList.push(" ");
        });

        return pillarList;
    }

    // KPI Item List - List
    kpiList(){
        if(this.self.state.pillarList.length <= 0)
            return;
        let kpiList = [];
        let kpiCount = 0;
        let downloadData = [];
        let pillarName = "";

        this.self.state.pillarList.forEach((z) => {
            if(z.pillarId === this.self.state.chooseKPISelectedPillar){
                pillarName = z.pillarName;
                z.subTopicList.forEach((x) => {

                    let tempDataList = [];
                    tempDataList.push(x.topicName);

                    kpiList.push(<div key={"subTopic" + x.subTopicId} className="subPillarNameM">{x.topicName} ({x.kpiList.length})</div>);
                    kpiList.push(" ");

                    kpiCount += x.kpiList.length;
                    x.kpiList.forEach((y) => {
                        tempDataList.push(`${y.name} (${y.denominator})`);
                        kpiList.push(
                            <div
                                key={"kpi" + y.id}
                                onClick={() => {
                                    this.self.onKPIChanged(z.pillarId, x.subTopicId, y.id);
                                    this.self.setState({selectedModal: "worldRanking"});
                                }}
                                className={"kpiNameM " + ((y.id === this.self.state.selectedKPI) ? "active" : "")}>
                                {y.name} ({y.denominator})
                                <div className={((y.id === this.self.state.selectedKPI) ? "check-img-icon" : "")} />
                            </div>
                        );
                        kpiList.push(" ");
                    });

                    downloadData.push(tempDataList);
                });
            }
        });

        return {kpiCount, kpiList, downloadData, pillarName};
    }

    didUpdated(){

    }

    // View Layer
    render() {

        let kpiListGenerator = this.kpiList();

        let heightOfScrollDiv = 101 + 10 + 44 + 30;
        let heightOfPage = getHeight() - heightOfScrollDiv;

        return (
            <div className={"modalContentM darkGreenGradientM " + this.self.state.desktopModeClass}>
                <div className="wrapperOfModalM">
                    <div className="headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)} />
                        {this.self.closeDesktopModalButton()}
                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.choose_kpi_title}
                            </div>
                            <div className="subTitleM">
                                { this.self.getPillarKPIBreadcrumb() }
                            </div>
                        </div>
                    </div>

                    <div className="searchBoxM">
                        <div className="searchInputWrapper">
                            <div className="searchInputM">
                                <i className="placeholder-search-icon search-img-icon-mini" />
                                <input ref="searchInput" placeholder={this.self.state.lang.kpi_search_placeholder} onChange={this.handleSearch.bind(this)}/>
                            </div>

                            <div className="searchDetail">
                                {(() => {
                                    if(this.self.state.kpiSearchResultList === undefined)
                                        return;
                                    if(this.self.state.showNoResult && this.self.state.kpiSearchResultList <= 0)
                                        return (<span className="noResultM">{this.self.state.lang.no_results}</span>);

                                    let list = [];
                                    this.self.state.kpiSearchResultList.forEach((x) => {
                                        list.push(this.pillarItem(x));
                                    });
                                    return list;
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="modalBodyM customScrollbar" style={{height: heightOfPage}}>
                        <div className="bodyTitle2M">{this.self.state.lang.pillars}</div>
                        <div className="pillarBubblesM">
                            {this.pillarBubbles()}x
                        </div>

                        <div className="bodyTitle2M marginTop20">
                            {this.self.state.lang.sub_pillars} ({kpiListGenerator.kpiCount})


                            {!this.hideExport&&(() => {
                                if(kpiListGenerator.downloadData.length > 0)
                                    return (
                                        <i
                                            className="download-icon"
                                            onClick={() => {
                                                if((/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent))){
                                                    window.open(SDK.getDownloadURL_Subpillar(
                                                        this.self.state.chooseKPISelectedPillar
                                                    ));
                                                }else{
                                                    downloadAsXLS("KPIList_" + kpiListGenerator.pillarName, "KPI_List", kpiListGenerator.downloadData, true);
                                                }
                                            }}
                                        />
                                    );
                            })()}

                        </div>
                        <div className="kpiListM">
                            {kpiListGenerator.kpiList}
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
export default mChooseKPI;
