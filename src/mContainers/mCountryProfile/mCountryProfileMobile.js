// React
import React from 'react'
import numeral from 'numeral';

import SDK from "../../mCommons/mSDK";
// import categoriesData from './data/categories';

import GraphCard from './components/GraphCard';
import CategoryPanel from './components/CategoryPanel';
import CountrySection from './components/CountrySelection';

// import 'fixed-data-table/dist/fixed-data-table.css';
import './CountryProfile.css';
import OverAllPanel from "./components/OverAllPanel";
import PillarPanelList from "./components/PillarPanelList";
import langUtils from "../../mCommons/mUtils/langUtils";
import {setPageDirAndLang, p, introHeaderMenuStaticComponent, togglePageDirAndLang} from "../../mCommons/mUtils";
import generalUtils from "../../mCommons/mUtils/generalUtils";
import * as Scroll from 'react-scroll';
import mCountryProfileDesktop from "./mCountryProfileDesktop";
import CountrySectionMobile from "./components/CountrySelectionMobile";


class mCountryProfileMobile extends mCountryProfileDesktop {
    constructor(props) {
        super(props);
    }

    openPillarMenu() {
        this.setState({mobilePanelCollapsed: false});
    }

    collapsePanel() {
        this.setState({mobilePanelCollapsed: true});
    }

    render() {
        return (
            <div style={{width: "100%"}}>
                {this.printLoadingOverlay()}

                <div className="country-profile-page country-profile-mobile">

                    <div
                        className={"sticky-pillar-menu " + ((this.state.mobilePanelCollapsed) ? "closed-panel" : "open-panel")}>
                        <CategoryPanel
                            collapsePanel={this.collapsePanel.bind(this)}
                            self={this}
                            pillarList={this.state.pillarDataList}
                            selected={0}/>
                    </div>

                    <header id="countryProfileHeader" className="country-profile-header-sticky">
                        <div className="navigation">
                            {/*<a className="back-button" onClick={() => {*/}
                            {/*this.props.history.push('/');*/}
                            {/*}} href="#">*/}
                            {/*/!*<i className="icon icon-back-arrow"/>*!/*/}
                            {/*<img src="/assets/svg/back-arrow-white.svg"/>*/}
                            {/*{this.lang.getLang().back}*/}
                            {/*</a>*/}

                            <span className="pillar-menu" onClick={this.openPillarMenu.bind(this)}>
                                <img src="/assets/svg/pillars-white.svg"/>
                            </span>
                            <div className="actions">
                                <a href={this.getTwitterURL()}
                                   target="_blank">
                                    <img src="/assets/svg/social-twitter.svg" alt=""/>
                                </a>

                                <a href={this.getFacebookURL()}
                                   target="_blank">
                                    <img src="/assets/svg/social-facebook.svg" alt=""/>
                                </a>

                                {/*<a href="#">*/}
                                {/*<i className="icon icon-close-panel"/>*/}
                                {/*</a>*/}

                                {introHeaderMenuStaticComponent(this.lang.getLang().lang, "", () => {
                                    this.toggleLanguage();
                                }, "langTextFontM")}

                                <div
                                    onClick={() => {
                                        this.props.history.goBack();
                                    }}
                                    className="close-button">
                                    <img src="/assets/svg/close-panel-white.svg" alt=""/>
                                </div>
                            </div>
                        </div>
                        <div className="country-section-wrapper">
                            <CountrySectionMobile
                                name={p(this.state.selectedCountry.countryName, this.state.selectedCountry.countryNameOtherLang)}
                                countryId={this.state.countryId}/>
                        </div>
                    </header>

                    <div className="summary-mobile">
                        <div className="graph-container">
                            {this.getHeaderData()}
                        </div>
                    </div>


                    <div className="kpi-list-mobile">
                        <OverAllPanel
                            countryId={this.state.countryId}
                            overAllKPIData={this.state.overAllKPIData}
                            graphContainerClass={this.state.graphContainerClass}/>

                        <PillarPanelList
                            countryId={this.state.countryId}
                            lang={this.state.lang}
                            pillarDataList={this.state.pillarDataList}/>
                    </div>

                    {/*<div className="country-profile-content">*/}
                    {/*<div className={"category-panel-wrapper " + ((this.state.headerIsFixed) ? " sticky-panel" + openClosedClassName : "")}>*/}
                    {/*<CategoryPanel*/}
                    {/*self={this}*/}
                    {/*pillarList={this.state.pillarDataList}*/}
                    {/*selected={0}/>*/}
                    {/*</div>*/}

                    {/*<div className={"right-section" + ((this.state.headerIsFixed) ? " sticky-panel" + openClosedClassName : "")}>*/}
                    {/*<div id="scrollContent">*/}

                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default mCountryProfileMobile;
