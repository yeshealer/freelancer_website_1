// React
import React from 'react'
import Select from 'react-select';
import mCircularProgress from './mCircularProgress';
import {trimString} from "../../mCommons/mUtils";

class mCompareV2 {

    constructor(self) {
        this.self = self;
    }

    addCountriesClick() {
        this.self.mSelectCountries.onDoneClick = () => {
            this.self.mSelectCountries.resetSearch();
            this.self.setState({selectedClosableModal: ""});
        };
        this.self.setState({selectedClosableModal: "selectCountries"});
    }

    fullStatsClick() {
        this.self.setState({selectedClosableModal: "fullStats"});
    }

    generateGraphics() {
        this.self.setState({selectedClosableModal: "graphics"});
    }

    compareItems() {

        if (this.self.state.scoreDataAllYears === null)
            return;

        let items = [];

        this.self.state.statsSelectedCountries.forEach((x) => {
            let selectedCountryInfo = this.self.state.scoreDataAllYears[this.self.state.selectedYear]['areas'][x];
            items.push(
                <div key={x} className="compareCircleM col-xs-6 langFloat">
                    {mCircularProgress(this.self, selectedCountryInfo.dataValue, selectedCountryInfo.value)}
                    <div className="countryNameM">
                        {this.self._e(this.self.state.countryIdMap[x], "countryName")}
                        <span className="cross-img-icon"
                              onClick={this.self.mSelectCountries.toggleCountry.bind(this, x)}/>
                    </div>
                </div>
            );
        });

        return items;
    }

    noCountryDesktop() {
        return (
            <div className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar">
                <div className="flexBoxItemGrow">
                    <div className="noCountryDesktop">
                        <img src="/assets/images/nocountry.png"/>
                        <div className="headerOfMessage">{this.self.state.lang.no_country_text_line_1}</div>
                        <div className="bodyOfMessage">{this.self.state.lang.no_country_text_line_2}</div>
                    </div>
                </div>
            </div>
        )
    }

    itsLonelyInHere() {
        return (
            <div key="noCountryDesktop" className="noCountryDesktop">
                <img src="/assets/images/green-arrow.png"/>
                <div className="headerOfMessage">{this.self.state.lang.lonely_country}</div>
                <div className="bodyOfMessage">{this.self.state.lang.single_country_text_line2}</div>
            </div>
        )
    }

    didUpdated() {

    }

    render() {
        // console.log(this.self.state.countries);
        
        return (
            <div className={"modalContentM darkGreenGradientM" + this.self.state.desktopModeClass}>
                <div className="flexBoxParent wrapperOfModalM">

                    <div className="flexBoxItem flexBoxModalHeaderBar headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)}/>
                        {this.self.closeDesktopModalButton()}
                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.compare_title}
                                <span>({this.self.state.statsSelectedCountries.length}/5)</span>
                            </div>
                            <div className="subTitleM">
                                {trimString(this.self.getPillarKPIBreadcrumb())}
                            </div>
                        </div>
                    </div>
                    {(() => {
                        if (this.self.state.isDesktopMode) {
                            return (
                                <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
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
                            );
                        }
                    })()}

                    {(() => {
                        if (this.self.state.isDesktopMode) {
                            if (this.self.state.statsSelectedCountries.length <= 0)
                                return this.noCountryDesktop();

                            return [
                                <div key={"compareItems"}
                                     className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar marginBottom20">
                                    <div className="flexBoxItemGrow">
                                        <div className="compareCirclesM row">

                                            {(() => {
                                                return this.compareItems()
                                            })()}

                                            {(() => {
                                                if (this.self.state.statsSelectedCountries.length === 1) {
                                                    return [
                                                        <div key="dummyCountry"
                                                             className="dummyCountry compareCircleM col-xs-6 langFloat">
                                                            {mCircularProgress(this.self, 0, 0)}
                                                            <div className="countryNameM">
                                                                {this.self.state.lang.country_name}
                                                            </div>
                                                        </div>,
                                                        this.itsLonelyInHere()
                                                    ];
                                                }
                                            })()}

                                            <div className="clearfix"/>
                                        </div>
                                    </div>
                                </div>
                            ]
                        } else {
                            return (
                                <div
                                    className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar marginBottom60">
                                    <div className="flexBoxItemGrow">
                                        <div className="compareCirclesM row">

                                            {(() => {
                                                if (this.self.state.statsSelectedCountries.length <= 0)
                                                    return;
                                                return this.compareItems()
                                            })()}

                                            <div onClick={this.addCountriesClick.bind(this)}
                                                 className="addCountriesContainer col-xs-6 langFloat">
                                                <div className="addCountriesM">+
                                                    <span>{this.self.state.lang.add_countries}</span></div>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        {(() => {
                                            if (this.self.state.statsSelectedCountries.length <= 0)
                                                return;
                                            return (
                                                <div className="bottomButtonsM">
                                                    <div onClick={this.generateGraphics.bind(this)}
                                                         className="generateGraphicsM">
                                                        {this.self.state.lang.generate_graphics}
                                                    </div>
                                                    <div onClick={this.fullStatsClick.bind(this)}
                                                         className="fullStatsM">{this.self.state.lang.full_stats_for} {this.self.getPillarName()}</div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    {(() => {
                        if (this.self.state.isDesktopMode && this.self.state.statsSelectedCountries.length >= 1)
                            return (
                                <div
                                    className={"flexBoxItem flexBoxButtonBar marginBottom40 " + ((this.self.state.statsSelectedCountries.length <= 1) ? 'opacity4' : '')}>
                                    <div className="bottomButtonsM">
                                        <div style={{width: "70%", margin: "auto"}}>
                                            <div onClick={this.generateGraphics.bind(this)}
                                                 className="generateGraphicsM">
                                                {this.self.state.lang.generate_graphics}
                                            </div>
                                            <div onClick={this.fullStatsClick.bind(this)}
                                                 className="fullStatsM">{this.self.state.lang.full_stats_for} {this.self.getPillarName()}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                    })()}

                </div>
            </div>
        );
    }
}


export default mCompareV2;