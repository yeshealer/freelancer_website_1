import React from 'react';
import R from 'ramda';
import {Link} from 'react-router-dom';
import langUtils from '../../mCommons/mUtils/langUtils';
import generalUtils from '../../mCommons/mUtils/generalUtils';
import countriesUtil from '../../mCommons/mUtils/countriesUtil';
import pillarsUtil from '../../mCommons/mUtils/pillarsUtil';
import Highlighter from 'react-highlight-words'

import './style.css';
import {togglePageDirAndLang} from "../../mCommons/mUtils";
import SDK from "../../mCommons/mSDK";

export default class Intro extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            countries: [],
            countrySearchResultList: [],
            bottomCounts: {kpiCount: 0, pillarCount: 0}
        };
    }

    componentWillMount() {
        localStorage.clear();
        countriesUtil.getCountries(this.handleCountriesData);
        pillarsUtil.getPillarsCustom(this.handlePillarsData);
        const tempValues = ['pillarId', 'subPillarId', 'kpiId', 'countryId'];
        tempValues.forEach((value) => generalUtils.createCookie(value, '', -555));
        this.setState({
            lang: langUtils.getLang()
        });
        this.blocksData = [
            {image: 'world-countries-icon@x2.png', count: 'countries_count', text: 'block_countries'},
            {image: 'pillars-icon@x2.png', count: 'pillars_count', text: 'block_pillars'},
            {image: 'KPI-icon@x2.png', count: 'indicators_count', text: 'block_indicator'}
        ];

        //IPH-388
        var params = this.getSearchParameters();
        //set as the sessionStorage data
        //trigger next
        if (params.kpiId !== undefined) {
            //cookie for country is countryId
            generalUtils.createCookie("countryId", params.countryId, 7);
            //cookie for kpi is kpiId
            generalUtils.createCookie("kpiId", params.kpiId, 7);
            //now go
            this.props.history.push('/world-map');
        }//end if
    }

    componentDidMount() {
        // SDK.getDataCountInfo((statusCode, response) => {
        //     this.setState({bottomCounts: response});
        // }, () => {
        //
        // });

        document.title = this.state.lang.logo_alt;
        document.getElementById('root').style.minHeight = `${667}px`;
        generalUtils.setDesktopMode(false);
        generalUtils.setViewPort();

        SDK.getCountryList((statusCode, response) => {
            this.setState({countries: response});
        }, () => {

        });
    }

    componentWillUnmount() {
        document.getElementById('root').style.minHeight = '';
        document.getElementsByTagName('html')[0].style.overflow = '';
    }

    getElementsToStyle(data) {
        const elements = [
            document.querySelector('div.inputContainerM input[name=\'kpi\']'),
            document.querySelector('.pageContainerM #introM.introM .middleTopM .searchResultM'),
            document.querySelector('.pageContainerM #introM.introM .middleTopM .searchResultM h1')
        ];
        for (let i = 0; i < elements.length; i++) {
            if (elements[i]) {
                elements[i].style.direction = data;
            }
        }
    }

    handleCountriesData = (data) => {
        this.setState({countries_count: data.length});
    }
    handlePillarsData = (data) => {
        this.setState({pillarsData: data[0], pillars_count: data[0].length, indicators_count: data[1].length});
    }

    aboutToggle() {
        this.setState({about: !this.state.about, showDropData: false}, () => {
            document.getElementsByTagName('html')[0].style.overflow = this.state.about ? 'hidden' : '';
        });
    }

    searchOnCountryList(value) {
        let listCountry = JSON.parse(JSON.stringify(this.state.countries));
        return listCountry.filter((x) => {
            if (langUtils.currentEnglish)
                return x.countryName.toLowerCase().indexOf(value.toLowerCase()) > -1;
            else
                return x.countryNameOtherLang.toLowerCase().indexOf(value.toLowerCase()) > -1;
        });
    }

    filter(event) {
        const val = event.target.value;
        // const valLang = generalUtils.checkIfArabic(val.charAt(0)) ? 1 : 0;
        // this.keyMatch = this.state.lang.id === valLang ? ['name', 'pillarName'] : ['nameOtherLang', 'pillarNameOtherLang'];
        this.keyMatch = ['name', 'pillarName'];
        if (val.length > 2 && this.state.pillarsData) {
            const res = [];
            const results = {};

            let filteredResultForCountry = this.searchOnCountryList(val);
            this.setState({
                searchKeywordForKPI: val,
                countrySearchResultList: filteredResultForCountry
            });

            this.state.pillarsData.map((data, pillarKey) =>
                data.subTopicList.map((value, subPillarKey) => {
                    const temp = R.filter(item => {
                            const cloneOfTemp = JSON.parse(JSON.stringify(item));
                            return cloneOfTemp[this.keyMatch[0]].toLowerCase().indexOf(val.toLowerCase()) > -1;
                        }
                        , value.kpiList);
                    if (temp.length > 0) {
                        temp.children = subPillarKey;
                        if (!results[pillarKey]) {
                            results[pillarKey] = [];
                        }
                        results[pillarKey].push(temp);
                    }
                    return results;
                })
            );
            Object.keys(results).forEach((i) => {
                res.push({parent: i, result: results[i]});
            });
            const tempy = JSON.stringify(res);
            const tempyRes = JSON.parse(tempy);
            let tempCount = 0;
            tempyRes.map((newVal, newKey) => newVal.result.map((value, key) => value.forEach((data, i) => {
                const resultText = data[this.keyMatch[0]];
                const pos = resultText.toLowerCase().indexOf(val.toLowerCase());
                const resultMatchedText = resultText.slice(pos, pos + val.length);
                const resArray = data[this.keyMatch[0]].split(data[this.keyMatch[0]].slice(pos, pos + val.length));
                const styledResult = `${resArray[0]}<strong style="display: inline-block; color: #00b186;">${resultMatchedText}</strong>${resArray[1]}`;
                tempyRes[newKey].result[key][i][this.keyMatch[0]] = styledResult;
                tempCount++;
            })));
            tempyRes.count = tempCount;
            this.setState({dropData: tempyRes, showDropData: true}, () => {
                // if (this.state.lang.id === 0 && generalUtils.checkIfArabic(val.charAt(0))) {
                //   this.getElementsToStyle('rtl');
                // } else if (this.state.lang.id === 1 && !generalUtils.checkIfArabic(val.charAt(0))) {
                //   this.getElementsToStyle('ltr');
                // }
            });
        } else {
            this.setState({
                searchKeywordForKPI: "",
                countrySearchResultList: []
            });

            this.setState({dropData: false, showDropData: false}, () => {
                this.getElementsToStyle('');
            });
        }
    }

    selectKPI(data) {
        generalUtils.createCookie('kpiId', data.id);
        this.props.history.push('/world-map/ranking');
    }

    updateLang = () => {
        togglePageDirAndLang();
        this.setState({lang: langUtils.changeLang()}, () => {
            pillarsUtil.getPillarsCustom(this.handlePillarsData);
            document.getElementsByName('kpi')[0].value = '';
            this.setState({dropData: false});
        });
    }

    renderFooter(flex) {
        return (
            <div className={flex ? 'footerFlexM' : 'footerBlockM'}>
                <div className='blocksContainerM'>
                    {this.renderBlocks()}
                </div>
                <p className='poweredM'>{this.state.lang.powered_tag}</p>
            </div>
        );
    }

    renderBlocks() {
        return this.blocksData.map((data, i) =>
            <div key={i} className='singleBlockM'>
                <div>
                    <img src={`assets/images/${data.image}`} alt='placeholder'/>
                </div>
                <div>
                    <h3>{this.state[data.count]}</h3>
                    <p>{this.state.lang[data.text]}</p>
                </div>
            </div>
        );
    }

    renderResultCount() {
        if (this.state.dropData && this.state.dropData.count > 0 && this.state.showDropData) {
            return <strong
                className='resultCountM'>{`${this.state.dropData.count} ${this.state.dropData.count > 1 ? this.state.lang.multi_results : this.state.lang.single_result}`}</strong>;
        }
    }

    renderCountryList(){
        let list = [];
        this.state.countrySearchResultList.forEach((value, key) => {
            list.push(
                <button
                    onClick={() => {
                        this.props.history.push('/country-profile/' + value.countryId);
                        // this.setActiveClosableModal("countryProfile");
                    }}
                    key={"CountryItem__" + value.countryId}>
                    {/*<span dangerouslySetInnerHTML={{__html: }}/>*/}

                        <Highlighter
                            highlightClassName='highLightKeyword'
                            searchWords={[this.state.searchKeywordForKPI]}
                            autoEscape={true}
                            textToHighlight={(langUtils.currentEnglish) ? value.countryName : value.countryNameOtherLang}
                        />

                        {/*{(langUtils.currentEnglish) ? value.countryName : value.countryNameOtherLang}*/}
                </button>
            );
        });
        return list;
    }

    renderResult() {
        let list = [];


        if(this.state.countrySearchResultList.length > 0){
            list.push(
                <div className='listCategoryM' key='listCategoryM_country'>
                    <h1>{this.state.lang.search_country_title}</h1>
                    <div className='listM'>
                        <div className='listItemsM' key="countryList_">
                            {this.renderCountryList()}
                        </div>
                    </div>
                </div>
            );
        }

        if(this.state.dropData && this.state.dropData.length > 0){
            this.state.dropData.forEach((value, key) =>
                list.push(
                    <div className='listCategoryM' key={'listCategoryM_' + key}>
                        <h1>{this.state.pillarsData[value.parent][this.keyMatch[1]]}</h1>
                        <div className='listM'>
                            {this.renderResultList(value.result, value.parent)}
                        </div>
                    </div>
                )
            );
        }

        if ((this.state.dropData && this.state.dropData.length > 0) || this.state.countrySearchResultList.length > 0) {
            return list;
        }
        return <div className='listCategoryM'><p>{this.state.lang.no_results}</p></div>;
    }

    // renderResultCountryList(data, parent) {
    //     return data.map((value, key) =>
    //         <div className='listItemsM' key={key}>
    //             <p>{this.state.pillarsData[parent].subTopicList[value.children] ? this.state.pillarsData[parent].subTopicList[value.children].topicName : ''}</p>
    //             {this.renderListItem(value)}
    //         </div>
    //     );
    // }

    renderResultList(data, parent) {
        return data.map((value, key) =>
            <div className='listItemsM' key={key}>
                <p>{this.state.pillarsData[parent].subTopicList[value.children] ? this.state.pillarsData[parent].subTopicList[value.children].topicName : ''}</p>
                {this.renderListItem(value)}
            </div>
        );
    }

    renderListItem(data) {
        return data.map((value, key) =>
            <button key={key} onClick={this.selectKPI.bind(this, value)}><span
                dangerouslySetInnerHTML={{__html: value[this.keyMatch[0]]}}/></button>
        );
    }


    getSearchParameters() {
        var prmstr = window.location.search.substr(1);
        return prmstr != null && prmstr != "" ? this.transformToAssocArray(prmstr) : {};
    }

    transformToAssocArray(prmstr) {
        var params = {};
        var prmarr = prmstr.split(",");
        for (var i = 0; i < prmarr.length; i++) {
            var tmparr = prmarr[i].split("=");
            params[tmparr[0]] = tmparr[1];
        }
        return params;
    }

    render() {
        return (
            <div className='pageContainerM' dir={this.state.lang.id === 1 ? 'rtl' : 'ltr'}>
                <style
                    dangerouslySetInnerHTML={{__html: `body {overflow: auto;}`}}/>

                <div className='aboutContainerM' style={this.state.about ? {display: 'block'} : {display: 'none'}}>
                    <button onClick={this.aboutToggle.bind(this)}>
                        <img src='/assets/images/close.svg' alt='placeholder'/>
                    </button>
                    <h1>{this.state.lang.about}</h1>
                    <div>
                        <p>{this.state.lang.about_text}</p>
                    </div>
                </div>
                <div id='introM' className='introM'>
                    <div className='headerM'>
                        <div className='leftM'>
                            <img
                                src={this.state.lang.id === 1 ? 'assets/images/new_logo_ar.png' : 'assets/images/new_logo_en.png'}
                                alt={this.state.lang.logo_alt}/>
                        </div>
                        <div className='rightM'>
                            <button onClick={this.updateLang}>
                                <span>{this.state.lang.lang}</span>
                            </button>
                            <button onClick={this.aboutToggle.bind(this)}>
                                <img src='assets/svg/about-white.svg' alt={this.state.lang.info_alt}/>
                                <span>{this.state.lang.about}</span>
                            </button>
                        </div>
                    </div>
                    <div className='middleTopM'>
                        <h1>{this.state.lang.home_welcome}</h1>
                        <p dangerouslySetInnerHTML={{__html: this.state.lang.home_slogan}}/>
                        <div className='inputContainerM'>
                            <button className='searchM'>
                                <img src='/assets/images/search-dark.svg' alt='placeholder'/>
                            </button>
                            <input type='text' name='kpi' placeholder={this.state.lang.search_placeholder}
                                   onChange={this.filter.bind(this)}/>
                            <button className='dropM'
                                    onClick={() => this.setState({showDropData: !this.state.showDropData})}>
                                <img src='/assets/images/arrow-down.svg' alt='placeholder'/>
                            </button>
                        </div>
                        {this.renderResultCount()}
                        <div className='searchResultM'
                             style={((this.state.dropData && this.state.showDropData) || this.state.countrySearchResultList.length > 0) ? {display: 'block'} : {display: 'none'}}>
                            {this.renderResult()}
                        </div>
                    </div>
                    <div className='middleBottomM'>
                        <div>
                            <div>
                                <p>{this.state.lang.explore_tag}</p>
                            </div>
                        </div>
                        <div>
                            <div>
                                <Link to='/explore'>
                                    <div>
                                        <span>{this.state.lang.explore}</span>
                                        <img
                                            src={this.state.lang.id === 1 ? '/assets/svg/back-arrow-white.svg' : '/assets/images/arrow-right.svg'}
                                            alt='placeholder'/>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {this.renderFooter(true)}
                </div>
                {this.renderFooter(false)}
            </div>
        );
    }
}
