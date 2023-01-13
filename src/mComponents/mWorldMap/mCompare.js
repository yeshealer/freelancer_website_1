// React
import React from 'react'
import Select from 'react-select';
import mCircularProgress from './mCircularProgress';
import {getHeight} from '../../mCommons/mUtils';

class mCompare {

    constructor(self) {
        this.self = self;
    }

    onCountriesChanged(countriesM){
        this.self.addSingleCountry(countriesM);
        // if(countriesM !== "" && this.self.state.selectedCountries !== null){
        //     if(countriesM.split(",").length > 4)
        //         return;
        // }
        //
        // this.self.setState({selectedCountries: countriesM});
        // this.load_dataForCountries(countriesM);
    }

    clearAllCountries(){
        // this.self.setState({selectedCountries: ""});
    }

    addCountriesClick(){
        this.self.mSelectCountries.onDoneClick = () => {
            this.self.mSelectCountries.resetSearch();
            this.self.setState({selectedClosableModal: ""});
        };
        this.self.setState({selectedClosableModal: "selectCountries"});
    }

    fullStatsClick(){
        this.self.setState({selectedClosableModal: "fullStats"});
    }

    generateGraphics(){
        this.self.setState({selectedClosableModal: "graphics"});
    }

    compareItems(){

        if(this.self.state.scoreDataAllYears === null)
            return;

        let items = [];

        this.self.state.statsSelectedCountries.forEach((x) => {
            let selectedCountryInfo = this.self.state.scoreDataAllYears[this.self.state.selectedYear]['areas'][x];
            items.push(
                <div key={x} className="compareCircleM col-xs-6 langFloat">
                    {mCircularProgress(this.self, selectedCountryInfo.dataValue, selectedCountryInfo.value)}
                    <div className="countryNameM">
                        {this.self._e(this.self.state.countryIdMap[x], "countryName")} <span className="cross-img-icon" onClick={this.self.mSelectCountries.toggleCountry.bind(this, x)}/>
                    </div>
                </div>
            );
        });

        return items;
    }

    didUpdated(){

    }

    render() {
        let heightOfScrollDiv = 101 + 20;
        let heightOfPage = getHeight() - heightOfScrollDiv;

        return (
            <div className={"modalContentM darkGreenGradientM " + this.self.state.desktopModeClass}>
                <div className="wrapperOfModalM">
                    <div className="headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)} />
                        {this.self.closeDesktopModalButton()}

                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.compare_title} <span>({this.self.state.statsSelectedCountries.length}/5)</span>
                            </div>
                            <div className="subTitleM">
                                { this.self.getPillarKPIBreadcrumb() }
                            </div>
                        </div>
                    </div>


                    <div className="searchBoxM">
                        <Select
                            simpleValue
                            multi={true}
                            clearable={false}
                            searchable={true}
                            placeholder={this.self.state.lang.select_countries_placeholder}
                            labelKey={(this.self.lang.currentEnglish) ? "countryName" : "countryNameOtherLang"}
                            valueKey="countryId"
                            // value={this.self.state.selectedCountries}
                            options={this.self.state.countries}
                            onChange={(value) => {
                                this.onCountriesChanged(value);
                            }} />

                        {(() => {
                            if(this.self.state.selectedCountries !== "" && this.self.state.selectedCountries !== null)
                                return (
                                    <div onClick={this.clearAllCountries.bind(this)} className="clearInputM">
                                        {this.self.state.lang.clear_all}
                                    </div>
                                );
                        })()}

                    </div>


                    <div className="modalBodyM" id="compareTableM" style={{height: heightOfPage}}>
                        <div className="compareCirclesM row">

                            {(() => {
                                if(this.self.state.statsSelectedCountries.length <= 0)
                                    return;
                                return this.compareItems()
                            })()}

                            <div onClick={this.addCountriesClick.bind(this)} className="addCountriesContainer col-xs-6 langFloat">
                                <div className="addCountriesM">+ <span>{this.self.state.lang.add_countries}</span></div>
                            </div>
                            <div className="clearfix" />
                        </div>

                        {(() => {
                            if(this.self.state.statsSelectedCountries.length <= 0)
                                return;
                            return (
                                <div className="bottomButtonsM">
                                    <div onClick={this.generateGraphics.bind(this)} className="generateGraphicsM">
                                        {this.self.state.lang.generate_graphics}
                                    </div>

                                    <div onClick={this.fullStatsClick.bind(this)} className="fullStatsM">{this.self.state.lang.full_stats_for} {this.self.getPillarName()}</div>
                                </div>
                            );
                        })()}


                    </div>
                </div>
            </div>
        );
    }
}


export default mCompare;
