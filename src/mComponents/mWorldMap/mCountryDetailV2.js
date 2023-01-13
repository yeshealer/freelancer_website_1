// React
import React from 'react'
import Select from 'react-select';
import {getHeight, p, trimString} from '../../mCommons/mUtils';
import {Link} from 'react-router-dom';

import mCircularProgress from './mCircularProgress';
import SDK from "../../mCommons/mSDK";
import ClipboardButton from 'react-clipboard.js';
import * as ReactDOM from "react-dom";
import numeral from "numeral";

const PlaceHolder = (props) => {
    return (
        <div><i className="placeholder-search-icon search-img-icon-mini"/> {props.text}</div>
    );
};

class mCountryDetailV2 {
    constructor(self) {
        this.self = self;
    }

    didUpdated() {

    }

    generateShareURL() {
        return window.location.origin + '/world-map/detail/' + this.self.state.selectedPillar + '/' + this.self.state.selectedKPI + '/' + this.self.state.selectedCountry + '/' + this.self.state.selectedYear + '/' + SDK.locale;
    }

    generateMessage(countryDetailM, rankCountryM, maxOfData) {
        if (countryDetailM === undefined || rankCountryM === undefined || maxOfData === undefined)
            return;

        let value = (rankCountryM.dataValue === undefined) ? "" : numeral(rankCountryM.dataValue).format('0.0a');
        return this.self.state.lang.share_text_country_detail.replaceArray(
            [':url', ':countryName', ':kpiName', ':denominatorName', ':year', ':value', ':rank', ':outOf'],
            [this.generateShareURL(), this.self._e(countryDetailM, "countryName"), this.self.state.selectedKPIObj.name,
                this.self.state.selectedKPIObj.denominator, this.self.state.selectedYear, value, rankCountryM.score, maxOfData]
        );
    }

    generateTwitterMessage(countryDetailM, rankCountryM, maxOfData) {
        if (countryDetailM === undefined || rankCountryM === undefined || maxOfData === undefined)
            return;

        let value = (rankCountryM.dataValue === undefined) ? "" : numeral(rankCountryM.dataValue).format('0.0a');
        return this.self.state.lang.twitter_text_country_detail.replaceArray(
            [':url', ':countryName', ':kpiName', ':denominatorName', ':year', ':value', ':rank', ':outOf'],
            [this.generateShareURL(), this.self._e(countryDetailM, "countryName"), this.self.state.selectedKPIObj.name,
                this.self.state.selectedKPIObj.denominator, this.self.state.selectedYear, value, rankCountryM.score, maxOfData]
        );
    }

    generateMailSubject(countryDetailM) {
        return this.self.state.lang.share_mail_subject.replaceArray(
            [":countryName"],
            [this.self._e(countryDetailM, "countryName")]
        );
    }

    generateShareURLForEmail(countryDetailM, rankCountryM, maxOfData) {
        if (this.self.lang.currentEnglish)
            return 'mailto:?subject=' + encodeURIComponent(this.generateMailSubject(countryDetailM)) + '&body=' + encodeURIComponent(this.generateMessage(countryDetailM, rankCountryM, maxOfData));
        else
            return 'mailto:?subject=' + encodeURIComponent(this.generateMailSubject(countryDetailM)) + '&body=' + encodeURIComponent(this.generateMessage(countryDetailM, rankCountryM, maxOfData));
    }

    getTwitterURL(countryDetailM, rankCountryM, maxOfData) {
        if (this.self.lang.currentEnglish) {
            return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.generateTwitterMessage(countryDetailM, rankCountryM, maxOfData));
        } else {
            return "https://twitter.com/intent/tweet?lang=ar&text=" + encodeURIComponent(this.generateTwitterMessage(countryDetailM, rankCountryM, maxOfData));
        }
    }

    getFacebookURL(){
        return "https://www.facebook.com/sharer/sharer.php?u=" + this.generateShareURL();
    }

    handleShareClick(type) {
        switch (type) {
            case 'TWITTER':
                window.open(this.getTwitterURL());
                break;
            case 'EMAIL':
                window.open('mailto:?subject=IPH URL!&body=' + this.generateShareURL());
                break;
            case 'FACEBOOK':
                window.open(this.getFacebookURL());
                break;
            case 'COPY':

                break;
        }
    }

    // shareHelperContent(){
    //     return (
    //         <div className="generate-graphics-section" style={{position: "unset", marginLeft: "5%", marginTop: "10px", marginBottom: "20px"}}>
    //
    //             <div className="tooltipB" style={{width: "45%", marginRight: (!this.ar ? "5%": "0px"), marginLeft: (this.ar ? "5%": "0px")}}>
    //                 <a className="generate-graphics-btn" href={this.generateShareURLForEmail()} style={{position: "unset", float: "left", width: "100%", lineHeight: "14px"}}>
    //                     <i className="fa fa-envelope-o" style={{fontSize: "20px"}} />
    //                 </a>
    //                 <span className="tooltiptext">{this.ar ? "شارك عبر البريد الإلكتروني" : "Share via Email"}</span>
    //             </div>
    //
    //             <div className="tooltipB" style={{width: "45%"}}>
    //                 <ClipboardButton className="generate-graphics-btn" onSuccess={() => {
    //                     // jQuery(".tooltiptext_copied")[0].style.visibility = "visible";
    //                     // setTimeout(function () {
    //                     //     jQuery(".tooltiptext_copied")[0].style.visibility = "hidden";
    //                     // }, 1000);
    //                 }} data-clipboard-text={this.generateShareURL()} style={{position: "unset", float: "left", width: "100%", lineHeight: "14px"}}>
    //                     <i className="fa fa-clipboard" style={{fontSize: "20px"}} />
    //                 </ClipboardButton>
    //
    //                 <span className="tooltiptext">Copy URL</span>
    //                 <span className="tooltiptext_copied">{this.ar ? "تم النسخ" : "Copied!"}</span>
    //             </div>
    //
    //             <div className="clearfix"/>
    //         </div>
    //     );
    // }

    render() {

        let maxOfData = "";
        let lengthOfSet = this.self.state.selectedGroupRankingData.length;
        if (lengthOfSet > 0) {
            let maxOfDataObj = this.self.state.selectedGroupRankingData[lengthOfSet - 1];
            if (maxOfDataObj !== undefined && maxOfDataObj !== null) {
                maxOfData = maxOfDataObj['score'];
            }
        }
        let countryDetailM;
        let rankCountryM;
        

        if (!(this.self.state.selectedCountry === null || this.self.state.selectedCountry === undefined || this.self.state.rankingData === undefined)){
            countryDetailM = this.self.state.countries.filter((x) => (x.countryId === this.self.state.selectedCountry))[0];
            rankCountryM = this.self.state.rankingData.filter((x) => (x.countryId === this.self.state.selectedCountry));


            if (rankCountryM.length > 0)
                rankCountryM = rankCountryM[0];
            else
                rankCountryM = {};
        }

        return (
            
            <div className={"modalContentM darkGreenGradientM " + this.self.state.desktopModeClass}>
                <div className="flexBoxParent wrapperOfModalM">

                    <div className="flexBoxItem flexBoxModalHeaderBar headerOfModalM">
                        <div className="mobileMenuIconM" onClick={this.self.toggleMobileMenuM.bind(this.self)}/>

                        {/*{this.self.closeDesktopModalButton()}*/}

                        <div className="rightTopOptions">
                            <a href={this.getTwitterURL(countryDetailM, rankCountryM, maxOfData)} target="_blank">
                                <img src="/assets/svg/twitter-outlined.svg" alt=""/>
                            </a>

                            <a href={this.getFacebookURL()} target="_blank">
                                <img src="/assets/svg/facebook-outlined.svg" alt=""/>
                            </a>

                            <span onClick={this.self.closeDesktopModal.bind(this.self, () => {
                            })}>
                                <img src="/assets/svg/close-panel-white.svg"/>
                            </span>
                        </div>

                        <div className="textContentM">
                            <div className="titleM">
                                {this.self.state.lang.country_details_title}
                            </div>
                            <div className="subTitleM">
                                {trimString(this.self.getPillarKPIBreadcrumb())}
                            </div>
                        </div>
                    </div>

                    <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
                        <Select
                            clearable={false}
                            simpleValue
                            searchable={true}
                            placeholder={<PlaceHolder text={this.self.state.lang.search_another_country}/>}
                            labelKey="countryName"
                            valueKey="countryId"
                            noResultsText={this.self.state.lang.no_results}
                            value={this.self.state.selectedCountry}
                            options={this.self.state.countries}
                            onChange={(value) => {
                                this.self.onCountryChanged(value);
                                this.self.panToCountry(value);
                            }}/>
                    </div>

                    <div
                        className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM customScrollbar marginBottom20">
                        <div className="flexBoxItemGrow">
                            {(() => {
                                if (this.self.state.selectedCountry === null || this.self.state.selectedCountry === undefined || this.self.state.rankingData === undefined)
                                    return;

                                // countryDetailM = this.self.state.countries.filter((x) => (x.countryId === this.self.state.selectedCountry))[0];
                                // rankCountryM = this.self.state.rankingData.filter((x) => (x.countryId === this.self.state.selectedCountry));


                                return (
                                    <div>
                                        <div className="modalCenterM">
                                            <div className="bodyTitleM">
                                                <div
                                                    className={"country-flag sprite sprite-" + this.self.state.selectedCountrySprite}/>
                                                <span>
                                                    <Link className="whiteURL"
                                                          to={'/country-profile/' + this.self.state.selectedCountry}>
                                                        {this.self._e(countryDetailM, "countryName")}
                                                    </Link>
                                                </span>
                                            </div>

                                            <div className="circularM">
                                                {mCircularProgress(this.self, rankCountryM.dataValue, rankCountryM.weightedScore)}
                                            </div>

                                            <div className="bodySubTitleM kpiNameFieldM">
                                                {/*{this.self.state.selectedKPIObj.name + " / " + this.self.state.selectedKPIObj.denominator}*/}
                                                {this.self.state.selectedKPIObj.denominator}
                                            </div>

                                            {/*<div className="">*/}

                                            {(() => {
                                                if (rankCountryM.score !== undefined) {
                                                    let colorCode = parseInt((parseInt(rankCountryM.weightedScore, 10) * 2), 10);
                                                    return (
                                                        <div className="worldRankDetailM">
                                                            {this.self.state.lang.world_rank} <span
                                                            className={"fontRange-" + colorCode}>{rankCountryM.score}</span> / {maxOfData}
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

                                    </div>
                                );
                            })()}
                            <div className="border1PXM marginBottom20 marginTop10"/>

                            <div className="detailBlockM">
                                <div className="detailTitleM">{this.self.state.lang.overview}</div>
                                <div className="detailTextM">{this.self.state.selectedKPIObj.descriptionLong}</div>
                            </div>

                            <div className="detailBlockM">
                                <div className="detailTitleM">{this.self.state.lang.source}</div>
                                <div className="detailTextM">
                                    <a target="_blank"
                                       href={this.self.state.selectedKPIObj.sourceUrl}>{this.self.state.selectedKPIObj.sourceName}</a>
                                </div>
                            </div>

                            {this.self.state.selectedKPIObj.additionalKpiNotes &&
                            <div className="detailBlockM">
                                <div className="detailTitleM">{this.self.state.lang.additional_notes}</div>
                                <div className="detailTextM">{this.self.state.selectedKPIObj.additionalKpiNotes}</div>
                            </div>
                            }


                            <div className="detailBlockM">
                                <div className="detailTitleM">{this.self.state.lang.updated}</div>
                                <div className="detailTextM">{this.self.state.selectedKPIObj.frequency}</div>
                            </div>

                            {(() => {
                                if (this.self.state.isDesktopMode)
                                    return (
                                        <div className="bottomButtonsM shareButtonsDesktop">
                                            <div className="tooltipB">
                                                <a className="shareButton shareWithEmail"
                                                   href={this.generateShareURLForEmail(countryDetailM, rankCountryM, maxOfData)}>
                                                    <i className="fa fa-envelope-o" style={{fontSize: "20px"}}/>
                                                </a>
                                                <span
                                                    className="tooltipText">{this.self.state.lang.share_via_email}</span>
                                            </div>

                                            <div className="tooltipB">
                                                <ClipboardButton
                                                    onSuccess={() => {
                                                        ReactDOM.findDOMNode(this.self.refs.tooltipTextCopied).style.visibility = "visible";
                                                        setTimeout(function () {
                                                            ReactDOM.findDOMNode(this.self.refs.tooltipTextCopied).style.visibility = "hidden";
                                                        }.bind(this), 1000);
                                                    }}
                                                    className="shareButton copyToClipboard"
                                                    data-clipboard-text={this.generateShareURL()}>
                                                    <i className="fa fa-clipboard" style={{fontSize: "20px"}}/>
                                                </ClipboardButton>
                                                <span className="tooltipText">{this.self.state.lang.copy_url}</span>
                                                <span ref={"tooltipTextCopied"}
                                                      className="tooltipTextCopied">{this.self.state.lang.copied}</span>
                                            </div>

                                        </div>
                                    );
                                else
                                    return (
                                        <div className="bottomButtonsM shareButtonsMobile" style={{paddingBottom: 70}}>
                                            <a className="shareButton"
                                               target="_blank"
                                               href={this.getFacebookURL()}>
                                                {this.self.state.lang.share_on_facebook}
                                            </a>
                                            <a className="shareButton"
                                               target="_blank"
                                               href={this.getTwitterURL(countryDetailM, rankCountryM, maxOfData)}>
                                                {this.self.state.lang.share_on_twitter}
                                            </a>

                                            <a className="shareButton"
                                               href={this.generateShareURLForEmail(countryDetailM, rankCountryM, maxOfData)}>
                                                {this.self.state.lang.share_via_email}
                                            </a>
                                            <ClipboardButton className="shareButton copyToClipboard"
                                                             data-clipboard-text={this.generateShareURL()}>
                                                {this.self.state.lang.copy_url}
                                            </ClipboardButton>
                                        </div>
                                    );
                            })()}


                        </div>
                    </div>

                    {(() => {
                        let lockedClassName = (this.self.state.statsSelectedCountries.length >= 1) ? "" : " lockedButton";
                        if (this.self.state.isDesktopMode)
                            return (
                                <div
                                    className={"flexBoxItem flexBoxButtonBar marginBottom40 "}>
                                    <div className={"bottomButtonsM" + lockedClassName}>
                                        <div className="lockedClassOverlay"/>
                                        <div
                                            style={{width: "70%", margin: "0 auto", display: "block"}}
                                            // className="tooltipB"
                                        >
                                            <div
                                                onClick={() => {
                                                    this.self.reloadStatsColorMap();
                                                    this.self.setActiveClosableModal("graphics")
                                                }}
                                                className="generateGraphicsM">
                                                {this.self.state.lang.generate_graphics}</div>
                                            {/*<span className="tooltipText wide">{this.self.state.lang.generate_graphics}</span>*/}
                                        </div>

                                        <div
                                            style={{width: "100%", margin: "0 auto", display: "block"}}
                                            // className="tooltipB"
                                        >
                                            <div
                                                onClick={() => {
                                                    this.self.setActiveClosableModal("fullStats")
                                                }}
                                                className="fullStatsM">{this.self.state.lang.full_stats_for} {this.self.getPillarName()}</div>
                                            {/*<span className="tooltipText wide">{this.self.state.lang.full_stats_for} {this.self.getPillarName()}</span>*/}
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

export default mCountryDetailV2;