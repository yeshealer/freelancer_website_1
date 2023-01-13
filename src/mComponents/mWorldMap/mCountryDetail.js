// React
import React from 'react'
import Select from 'react-select';
import {getHeight} from '../../mCommons/mUtils';

import mCircularProgress from './mCircularProgress';
import SDK from "../../mCommons/mSDK";
import ClipboardButton from 'react-clipboard.js';

const PlaceHolder = (props) => {
    return (
        <div><i className="placeholder-search-icon search-img-icon-mini" /> {props.text}</div>
    );
};

class mCountryDetail {
    constructor(self) {
        this.self = self;
    }

    didUpdated(){

    }

    generateShareURL(){
        return window.location.origin + '/world-map/detail/' + this.self.state.selectedPillar + '/' + this.self.state.selectedKPI + '/' + this.self.state.selectedCountry + '/' + this.self.state.selectedYear + '/' + SDK.locale;
    }

    handleShareClick(type){
        switch (type){
            case 'TWITTER':
                window.open('http://twitter.com/share?url=' + this.generateShareURL());
                break;
            case 'EMAIL':
                window.open('mailto:?subject=IPH URL!&body=' + this.generateShareURL());
                break;
            case 'COPY':

                break;
        }
    }

    render() {

        let heightOfScrollDiv = 101 + 10 + 45 + 30;
        let heightOfPage = getHeight() - heightOfScrollDiv;

        let maxOfData = "";
        let lengthOfSet = this.self.state.selectedGroupRankingData.length;
        if(lengthOfSet > 0){
            let maxOfDataObj = this.self.state.selectedGroupRankingData[lengthOfSet - 1];
            if(maxOfDataObj !== undefined && maxOfDataObj !== null){
                maxOfData = maxOfDataObj['score'];
            }
        }

        return (
            <div className={"modalContentM darkGreenGradientM " + this.self.state.desktopModeClass}>
                <div className="wrapperOfModalM">
                    <div className="headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)} />
                        {this.self.closeDesktopModalButton()}

                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.country_details_title}
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
                            searchable={true}
                            placeholder={<PlaceHolder text={this.self.state.lang.search_another_country} />}
                            labelKey="countryName"
                            valueKey="countryId"
                            noResultsText={this.self.state.lang.no_results}
                            value={this.self.state.selectedCountry}
                            options={this.self.state.countries}
                            onChange={(value) => {
                                this.self.onCountryChanged(value);
                            }} />
                    </div>

                    <div className="modalBodyM" id="countryDetailContentM" style={{height: heightOfPage}}>
                        {(() => {
                            let rankCountryM;
                            let countryDetailM;
                            // let countryProp;

                            // if(this.self.state.scoreDataAllYears === null)
                            //     return;

                            if(this.self.state.selectedCountry === null || this.self.state.selectedCountry === undefined || this.self.state.rankingData === undefined)
                                return;

                            countryDetailM = this.self.state.countries.filter((x) => (x.countryId === this.self.state.selectedCountry))[0];

                            rankCountryM = this.self.state.rankingData.filter((x) => (x.countryId === this.self.state.selectedCountry));
                            // if(rankCountryM.length === 0)
                            //     return;

                            // countryProp = this.self.state.scoreDataAllYears[this.self.state.selectedYear]['areas'][this.self.state.selectedCountry];

                            if(rankCountryM.length > 0)
                                rankCountryM = rankCountryM[0];
                            else
                                rankCountryM = {};

                            return (
                                <div>
                                    <div className="modalCenterM">
                                        <div className="bodyTitleM">
                                            <div className={"country-flag sprite sprite-" + this.self.state.selectedCountry} />
                                            <span>{this.self._e(countryDetailM, "countryName")}</span>
                                        </div>

                                        <div className="circularM">
                                            {mCircularProgress(this.self, rankCountryM.dataValue, rankCountryM.weightedScore)}
                                        </div>

                                        <div className="bodySubTitleM kpiNameFieldM">
                                            {this.self.state.selectedKPIObj.name + " / " + this.self.state.selectedKPIObj.denominator}
                                        </div>

                                        {/*<div className="">*/}

                                            {(() => {
                                                if(rankCountryM.score !== undefined){
                                                    let colorCode = parseInt((parseInt(rankCountryM.weightedScore, 10) * 2), 10);
                                                    return (
                                                        <div className="worldRankDetailM">
                                                            {this.self.state.lang.world_rank} <span className={"fontRange-" + colorCode}>{rankCountryM.score}</span> / {maxOfData}
                                                        </div>
                                                    );
                                                }
                                            })()}

                                            {/*<div className="rankDivM">*/}
                                                {/*{(rankCountryM.score === undefined) ? "NA":rankCountryM.score}*/}
                                            {/*</div>*/}

                                            {/*<div className="worldRankTextM"></div>*/}
                                        {/*</div>*/}
                                    </div>

                                    <div className="border1PXM marginBottom20"/>
                                </div>
                            );
                        })()}

                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.overview}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIObj.descriptionLong}</div>
                        </div>

                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.source}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIObj.sourceName}</div>
                        </div>

                        <div className="detailBlockM">
                            <div className="detailTitleM">{this.self.state.lang.updated}</div>
                            <div className="detailTextM">{this.self.state.selectedKPIObj.frequency}</div>
                        </div>

                        {/*<div className="detailBlockM">*/}
                          {/*<div className="detailLinkM">*/}
                            {/*<a href="javascript:void(0)" onClick={this.handleLinkClick.bind(this,'email')}>Email Link</a>*/}
                            {/*&nbsp;*/}
                            {/*<a href="javascript:void(0)" onClick={this.handleLinkClick.bind(this,'tweet')}>Tweet Link</a>*/}
                          {/*</div>*/}
                        {/*</div>*/}


                        <div className="bottomButtonsM">
                            {/*<div onClick={this.handleShareClick.bind(this,'TWITTER')} className="generateGraphicsM">*/}
                                {/*Share on Twitter*/}
                            {/*</div>*/}

                            <a href={'mailto:?subject=IPH URL!&body=' + this.generateShareURL()} className="generateGraphicsM marginTop10">
                                Share via E-mail
                            </a>

                            <ClipboardButton className="generateGraphicsM marginTop10" data-clipboard-text={this.generateShareURL()}>
                                Copy URL
                            </ClipboardButton>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default mCountryDetail;
