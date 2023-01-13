// React
import React from 'react'
import {colorSetM, colorSetG, colorChartData, getColorByDataV2} from "../../mCommons/mUtils";
import {getHeight, getColorByData} from '../../mCommons/mUtils';

class mCountryBenchmarkSelector {
    constructor(self) {
        this.self = self;
        this.state = {
            showSource: false
        };
    }

    didUpdated() {

    }

    onBackClick() {
        this.self.setState({selectedClosableModal: "fullStats"})
    }

    clearAll() {
        this.self.setState({statsSelectedCountries: []});
    }

    addCountriesClick() {
        // this.self.mSelectCountries.onDoneClick = () => {
        //     this.self.setState({selectedClosableModal: "benchmarkSelector"})
        // };
        this.self.setState({selectedClosableModal: "selectCountries"});
    }

    getTitle() {
        return "";
    }

    toggleDataSource() {
        this.self.setState({showSource: !this.self.state.showSource});
    }

    render() {
        let height = getHeight() - 110;
        let dataForSelectedYear = this.self.state.scoreDataAllYears[this.self.state.selectedYear];

        return (
            <div className="fullScreenModal Stats-Table">
                <div className="modalHeaderM">
                    <div onClick={this.onBackClick.bind(this)} className="back-img-icon"/>
                    <div className="titleM">{this.getTitle()}</div>
                    <div className="border1PXM"/>
                </div>

                <div className="innerSidePadding overFlowYScroll" style={{height: height}}>
                    <div className="row">
                        <div className="col-xs-6 titleM"
                             style={{float: (this.self.lang.currentEnglish) ? "left" : "right"}}>{this.self.state.lang.countries_title}</div>
                        <div className={"col-xs-6 " + ((this.self.lang.currentEnglish) ? "text-right" : "text-left")}>
                            <div onClick={this.addCountriesClick.bind(this)}
                                 className="addCountriesM">+ <span>{this.self.state.lang.add_countries}</span></div>
                        </div>
                    </div>
                    <div className="selectedCountriesM marginTop20">

                        {(() => {
                            let countryList = [];
                            this.self.state.statsSelectedCountries.forEach((x, i) => {
                                let color = getColorByDataV2(i);
                                countryList.push(
                                    <div key={x} className="countryBubble">
                                        <div className="colorDotM" style={{backgroundColor: color}}/>
                                        {this.self._e(this.self.state.countryIdMap[x], 'countryName')}
                                        <span onClick={this.self.mSelectCountries.toggleCountry.bind(this, x)}
                                              className="cross-img-icon"/>
                                    </div>
                                )
                            });
                            return countryList;
                        })()}


                        {(() => {
                            if (this.self.state.statsSelectedCountries.length > 0)
                                return (<div onClick={this.clearAll.bind(this)}
                                             className="clearAll">{this.self.state.lang.clear_all}</div>);
                        })()}

                    </div>

                    <div className="row marginTop50">
                        <div className="col-xs-12 titleM">{this.self.state.lang.benchmarks}</div>
                    </div>
                    <div className="selectedCountriesM marginTop20">

                        {(() => {
                            let countryList = [];
                            this.self.state.groupListData.forEach((x, i) => {
                                let activeClass = "";
                                if (this.self.state.statsSelectedGroups.indexOf(x['groupUid']) > -1)
                                    activeClass = "active";
                                countryList.push(
                                    <div
                                        onClick={() => {
                                            let indexOf = this.self.state.statsSelectedGroups.indexOf(x['groupUid']);
                                            if (indexOf > -1) {
                                                let newStatesSelectedC = this.self.state.statsSelectedGroups;
                                                newStatesSelectedC.splice(indexOf, 1);
                                                this.self.setState({statsSelectedGroups: newStatesSelectedC});
                                            } else {
                                                let newStatesSelectedC = this.self.state.statsSelectedGroups;
                                                newStatesSelectedC.push(x['groupUid']);
                                                this.self.setState({statsSelectedGroups: newStatesSelectedC});
                                            }
                                        }}
                                        key={x['groupName']}
                                        className={"countryBubble group " + activeClass}>
                                        <div className="colorDotM" style={{backgroundColor: colorSetG[i]}}/>
                                        {x['groupName']}
                                    </div>
                                )
                            });
                            return countryList;
                        })()}


                        <div className="line1PX marginTop50"/>
                    </div>

                    {/*<div className="marginTop20">*/}
                    {/*<span onClick={this.toggleDataSource.bind(this)}>{this.self.state.lang.show_data_source}</span>*/}
                    {/*</div>*/}

                    {/*<div className="marginTop20" style={{display: (this.self.state.showSource) ? "block": "none"}}>*/}
                    <div className="marginTop20">
                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.overview}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIForModalObj.descriptionLong}</div>
                        </div>

                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.source}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIForModalObj.sourceName}</div>
                        </div>

                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.updated}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIForModalObj.frequency}</div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default mCountryBenchmarkSelector;