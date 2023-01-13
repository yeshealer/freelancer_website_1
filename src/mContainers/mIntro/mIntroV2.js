import React from 'react'
import {Link} from 'react-router-dom';
import langUtils from '../../mCommons/mUtils/langUtils';
import {
    introHeaderMenuStaticComponent, introHeaderMenuStaticComponentWithHref, isMobile, setPageDirAndLang,
    togglePageDirAndLang,
} from "../../mCommons/mUtils";
import './mIntroV2.css';
import SDK from "../../mCommons/mSDK";
import Highlighter from 'react-highlight-words'
import * as generalUtils from "../../mCommons/mUtils/generalUtils";
import mAbout from "../../mComponents/mWorldMap/mAbout";
import mTA from "../../mComponents/mWorldMap/mTC";
// import mCountryProfile from "../../mContainers/mCountryProfile/mCountryProfile";

export default class mIntroV2 extends React.Component {

    constructor(props) {
        super(props);
        this.lang = langUtils;
        if (this.lang.currentEnglish)
            setPageDirAndLang("ltr", "en");
        else
            setPageDirAndLang("rtl", "ar");

        this.state = {
            // Language Util
            lang: this.lang.getLang(),
            searchableKPIList: [],
            searchKeywordForKPI: "",
            selectedClosableModal: "",
            kpiSearchResultList: [],
            countries: [],
            countrySearchResultList: [],
            bottomCounts: {kpiCount: 0, pillarCount: 0, countryCount: 0}
        };

        this.mAbout = new mAbout(this);
        this.mTA = new mTA(this);
        // this.mCountryProfile = new mCountryProfile(this);
    }

    setActiveClosableModal(modalId) {
        this.setState({selectedClosableModal: modalId});
    }

    toggleLanguage() {
        togglePageDirAndLang();
        this.lang.changeLang();
        this.setState({lang: this.lang.getLang()});
    }

    kpiItemList(pillarId, kpiList) {
        let list = [];
        kpiList.forEach((x) => {
            list.push(
                <div onClick={() => {
                    generalUtils.createCookie('kpiId', x.id);
                    generalUtils.createCookie("countryId", "", 7);

                    this.props.history.push((isMobile()) ? '/world-map/ranking' : '/world-map');
                }} key={x.id}>
                    <Highlighter
                        highlightClassName='highLightKeyword'
                        searchWords={[this.state.searchKeywordForKPI]}
                        autoEscape={true}
                        textToHighlight={(this.lang.currentEnglish) ? x.name : x.nameOtherLang}
                    />
                </div>
            );
        });
        return list;
    }

    countryItem(countryItem) {
        return (
            <div
                onClick={() => {
                    this.props.history.push('/country-profile/' + countryItem.countryId);
                    // this.setActiveClosableModal("countryProfile");
                }}
                key={"countrySearchItem_" + countryItem.countryId}>
                <Highlighter
                    highlightClassName='highLightKeyword'
                    searchWords={[this.state.searchKeywordForKPI]}
                    autoEscape={true}
                    textToHighlight={(this.lang.currentEnglish) ? countryItem.countryName : countryItem.countryNameOtherLang}
                />
            </div>
        );
    }

    pillarItem(pillarObj) {
        if (pillarObj === undefined)
            return;
        if (pillarObj.kpiList.length <= 0)
            return;

        return (
            <div key={pillarObj.pillarId} className="searchItemsM">
                <div
                    className="pillarNameM">{(this.lang.currentEnglish) ? pillarObj.pillarName : pillarObj.pillarNameOtherLang}</div>
                <div className="kpiListM">
                    {this.kpiItemList(pillarObj.pillarId, pillarObj.kpiList)}
                </div>
            </div>
        );
    }

    setSearchableKPIList(pillarList) {
        let listM = [];
        pillarList.forEach((x) => {
            let kpiListM = [];

            x.subTopicList.forEach((y) => {
                y.kpiList.forEach((z) => {
                    z.subPillarId = y.subTopicId;
                });
                kpiListM = kpiListM.concat(y.kpiList);
            });

            listM.push(
                {
                    pillarId: x.pillarId,
                    pillarName: x.pillarName,
                    pillarNameOtherLang: x.pillarNameOtherLang,
                    kpiList: kpiListM
                }
            );
        });

        this.setState({searchableKPIList: listM});
    }

    searchOnKPIList(value) {
        let listS = JSON.parse(JSON.stringify(this.state.searchableKPIList));
        return listS.filter((x) => {
            x.kpiList = x.kpiList.slice(0).filter((y) => {
                // console.log(y.name.toLowerCase(), value.toLowerCase(), y);
                if (this.lang.currentEnglish)
                    return y.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
                else
                    return y.nameOtherLang.toLowerCase().indexOf(value.toLowerCase()) > -1;

                // return y.name.toLowerCase().includes(value.toLowerCase());
            });
            return (x.kpiList.length > 0);
        });
    }

    searchOnCountryList(value) {
        let listCountry = JSON.parse(JSON.stringify(this.state.countries));
        return listCountry.filter((x) => {
            if (this.lang.currentEnglish)
                return x.countryName.toLowerCase().indexOf(value.toLowerCase()) > -1;
            else
                return x.countryNameOtherLang.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
    }

    handleSearch(event) {
        if (event.target.value.length <= 2) {
            this.setState({
                kpiSearchResultList: [],
                countrySearchResultList: [],
                showNoResult: false,
                isSearchActive: false
            });
        } else {
            let filteredResult = this.searchOnKPIList(event.target.value);
            let filteredResultForCountry = this.searchOnCountryList(event.target.value);
            this.setState({
                kpiSearchResultList: filteredResult,
                countrySearchResultList: filteredResultForCountry,
                showNoResult: true,
                isSearchActive: true,
                searchKeywordForKPI: event.target.value
            });
        }
    }

    onFocusSearchBox() {
        // this.refs.searchInputM.style.background = "rgba(0, 0, 0, 1.0)";
        // this.refs.searchInputM.style.border = "1px solid rgb(0, 177, 134)";
    }

    onBlurSearchBox() {
        // this.refs.searchInputM.style.background = "rgba(0, 0, 0, 0.6)";
        // this.refs.searchInputM.style.border = "none";
    }

    componentDidMount() {
        SDK.getDataCountInfo((statusCode, response) => {
            this.setState({bottomCounts: response});
        }, () => {

        });

        SDK.getPillarList((statusCode, response) => {
            this.setState({pillarList: response});
            this.setSearchableKPIList(response);
        }, () => {

        });


        SDK.getCountryList((statusCode, response) => {

            // console.log(response);
            // let countryIdMap = {};
            //
            // response.forEach((x) => {
            //     countryIdMap[x.countryId] = x;
            // });
            // console.log(countryIdMap);

            this.setState({countries: response});
        }, () => {

        });

    }

    getBottomContentEN() {
        let items = [
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon infoIcon-sec-left">
                    <span className={"welcome1 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number countriesCount">{this.state.bottomCounts.countryCount}</span>
                    <p className="text">{this.state.lang.block_countries}</p>
                </div>
            </div>,
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon infoIcon-sec-mid">
                    <span className={"welcome2 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number pillarsCount">{this.state.bottomCounts.pillarCount}</span>
                    <p className="text">{this.state.lang.block_pillars}</p>
                </div>
            </div>,
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon infoIcon-sec-right">
                    <span className={"welcome3 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number kpisCount">{this.state.bottomCounts.kpiCount}</span>
                    <p className="text">{this.state.lang.block_indicator}</p>
                </div>
            </div>
        ];
        return items;
    }

    getBottomContentAR() {
        let items = [
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon-ar infoIcon-sec-left">
                    <span className={"welcome3 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number countriesCount">{this.state.bottomCounts.kpiCount}</span>
                    <p className="text">{this.state.lang.block_indicator}</p>
                </div>
            </div>,
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon-ar infoIcon-sec-mid">
                    <span className={"welcome2 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number pillarsCount">{this.state.bottomCounts.pillarCount}</span>
                    <p className="text">{this.state.lang.block_pillars}</p>
                </div>
            </div>,
            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                <div className="infoIcon-ar infoIcon-sec-right">
                    <span className={"welcome1 " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}/>
                    <span className="number kpisCount">{this.state.bottomCounts.countryCount}</span>
                    <p className="text">{this.state.lang.block_countries}</p>
                </div>
            </div>
        ];
        return items;
    }


    render() {
        return (
            <div style={{width: "100%", height: "100%"}} className="introBackgroundM">

                {(() => {
                    if (this.state.selectedClosableModal === "about")
                        return this.mAbout.render();
                })()}

                <div className="homeWrapper welcome-component">
                    <div className="introHeader">
                        <div className="innerWrapper">
                            <div className="topHeader">
                                <div className="logoM">
                                    <img src={this.state.lang.logo_home} alt="Logo"/>
                                </div>

                                <div className="introMenuBar">
                                    {introHeaderMenuStaticComponent(this.state.lang.lang, "", () => {
                                        this.toggleLanguage();
                                    }, "langTextFontM")}
                                    {introHeaderMenuStaticComponent(this.state.lang.about, "about-img-icon-24", () => {
                                        this.setActiveClosableModal("about");
                                    })}

                                    {introHeaderMenuStaticComponentWithHref(this.state.lang.contact, "mail-icon-24", "mailto:info@iph.sa")}

                                </div>
                                <div className="clearfix"/>
                            </div>
                            <div className="middleContent">
                                <h1>{this.state.lang.home_welcome}</h1>
                                <p dangerouslySetInnerHTML={{__html: this.state.lang.home_slogan}}/>
                                <div className="searchBoxIntroV2M">
                                    <div className="searchInputWrapper">
                                        <div ref="searchInputM" className="searchInputM">
                                            {/*<i className="placeholder-search-icon search-img-icon-mini"/>*/}
                                            <i className="fa fa-search"/>
                                            <input
                                                ref="searchInput"
                                                placeholder={this.state.lang.search_placeholder}
                                                onChange={this.handleSearch.bind(this)}
                                                onFocus={this.onFocusSearchBox.bind(this)}
                                                onBlur={this.onBlurSearchBox.bind(this)}
                                            />
                                        </div>

                                        <div className="searchDetail">
                                            {(() => {
                                                if (this.state.kpiSearchResultList.length === 0 &&
                                                    this.state.countrySearchResultList.length === 0)
                                                    return;

                                                let resultCount = this.state.kpiSearchResultList.length +
                                                    this.state.countrySearchResultList.length;

                                                if (this.state.showNoResult && resultCount <= 0)
                                                    return (<span key="noResultM"
                                                                  className="noResultM">{this.state.lang.no_results}</span>);

                                                let list = [];

                                                resultCount = 0;
                                                this.state.kpiSearchResultList.forEach((x) => {
                                                    list.push(this.pillarItem(x));
                                                    resultCount += x.kpiList.length;
                                                });

                                                resultCount += this.state.countrySearchResultList.length;
                                                if (this.state.countrySearchResultList.length > 0) {
                                                    let countryList = [];
                                                    this.state.countrySearchResultList.forEach((x) => {
                                                        countryList.push(this.countryItem(x));
                                                    });

                                                    list.unshift(
                                                        <div key="countrySearchContainer" className="searchItemsM">
                                                            <div
                                                                className="pillarNameM">{this.state.lang.search_country_title}</div>
                                                            <div className="kpiListM">
                                                                {countryList}
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (this.state.isSearchActive && resultCount > 0) {
                                                    list.unshift(<span key="resultsFound"
                                                                       className="resultsFound">
                                                        {resultCount} {(this.lang.currentEnglish) ? "result(s) found." : "نتائج"}
                                                    </span>);
                                                }


                                                return list;
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottomContent">
                                <div className="alignBottom">
                                    <p>{this.state.lang.explore_tag}</p>

                                    <Link className="buttonStart" to='/explore'>
                                        {this.state.lang.explore}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="navbar-fixed-bottom">
                        {(this.lang.currentEnglish) ? this.getBottomContentEN() : this.getBottomContentAR()}
                        <p className="copyright-text">{this.state.lang.powered_tag}</p>
                    </footer>

                    {/*<div className="introBottom">*/}
                    {/*<div className="flexContainerA">*/}
                    {/*<div className="flexGrowA">*/}

                    {/*<div*/}
                    {/*className={"introBullet " + ((this.lang.currentEnglish) ? "pull-right" : "pull-left")}>*/}
                    {/*<img src="/assets/images/world-countries-icon@x2.png"/>*/}
                    {/*<div className="bulletDescContent">*/}
                    {/*<div className="bulletNumber">217</div>*/}
                    {/*<div className="bulletDesc">{this.state.lang.block_countries}</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*</div>*/}

                    {/*<div className="flexGrowA">*/}

                    {/*<div className="introBullet" style={{maxWidth: "280px", margin: "auto auto"}}>*/}
                    {/*<img src="/assets/images/pillars-icon@x2.png"/>*/}
                    {/*<div className="bulletDescContent">*/}
                    {/*<div className="bulletNumber">12</div>*/}
                    {/*<div className="bulletDesc">{this.state.lang.block_pillars}</div>*/}
                    {/*</div>*/}
                    {/*<div className="clearfix"/>*/}
                    {/*</div>*/}

                    {/*</div>*/}

                    {/*<div className="flexGrowA">*/}

                    {/*<div*/}
                    {/*className={"introBullet " + ((this.lang.currentEnglish) ? "pull-left" : "pull-right")}>*/}
                    {/*<img src="/assets/images/KPI-icon@x2.png"/>*/}
                    {/*<div className="bulletDescContent">*/}
                    {/*<div className="bulletNumber">500</div>*/}
                    {/*<div className="bulletDesc">{this.state.lang.block_indicator}</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}

                    {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className="poweredLine">*/}
                    {/*{this.state.lang.powered_tag}*/}
                    {/*</div>*/}
                    {/*</div>*/}


                </div>
            </div>
        )
    }

}