import React from 'react';
import {Link} from 'react-router-dom';
import R from 'ramda';
import setSelectedCountryAction from "../../redux/actions/setSelectedCountryAction";
import Loader from './mLoader';
import generalUtils from '../../mCommons/mUtils/generalUtils';
import countriesUtil from '../../mCommons/mUtils/countriesUtil';
import {createCountriesAlphaMap, getWidth, isMobile} from "../../mCommons/mUtils";
import {setFilteredCountriesAction, getWorldCountriesAction} from "../../redux";
import {connect} from "react-redux";

class Countries extends React.Component {
    state = {
        showSearch: false
    }

    componentDidMount() {
        const {getWorldCountriesAction, countryObj} = this.props;

        if (countryObj.worldCountries.length <= 0) {
            getWorldCountriesAction().catch((err) => {
                console.log('Error on getWorldCountriesAction: ', err);
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.tempLooper);
        this.tempLooper = false;
    }


    filter(event) {
        if (event.target.value.charAt(0) === ' ') {
            document.getElementById('countrySearchM').value = document.getElementById('countrySearchM').value.replace(' ', '');
        }
        const val = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
        this.setState({countryList: JSON.parse(this.countryListRow)}, () => {
            if (val.length > 0) {
                const res = R.filter((item) => item.alphabet === val.charAt(0).toUpperCase(), this.state.countryList);
                if (res[0]) {
                    const list = R.filter((item) => item.countryName.toLowerCase().indexOf(val.toLowerCase()) > -1, res[0].countriesList);
                    res[0].countriesList = list;
                    this.setState({countryList: res});
                }
            }
        });
    }

    countCountries() {
        this.tempLooper = setInterval(() => {
            if (this.state.countryList) {
                clearInterval(this.tempLooper);
                let countriesLength = 0;
                this.state.countryList.forEach((value) => {
                    countriesLength += value.countriesList.length;
                });
                this.setState({countryNo: countriesLength});
            }
        });
    }

    selectCountry(data) {
        const {setSelectedCountryAction} = this.props;
        setSelectedCountryAction(data);

        this.props.history.push('/world-map');
        // this.props.update('selectedCountry', data, 3);
    }

    onInputChange(event) {
        const {value: searchTerm} = event.target;
        this.props.setFilteredCountriesAction(searchTerm);
    }

    toggleSearch() {
        setTimeout(() => document.getElementById('countrySearchM').focus());
        this.setState({showSearch: !this.state.showSearch});
    }

    renderSubCountries(worldCountriesAlpha, param, nth) {
        if (worldCountriesAlpha) {
            return Object.keys(worldCountriesAlpha).sort().map((key => {
                // worldCountriesAlpha[key].map((country, key) => {
                //     console.log(country);
                // });
                return (
                    <div key={key} className='countryGroupM'>
                        <p style={{color: '#000 !important'}}>{key}</p>
                        <div className='countryGroupListM'>
                            {
                                worldCountriesAlpha[key].map((country, key) =>
                                    <button key={key} onClick={this.selectCountry.bind(this, country)}>
                                        <p className={this.props.selected && this.props.selected.countryId === country.countryId ? 'activeM' : ''}>{country.countryTextMap.name}</p>
                                    </button>
                                )
                            }
                        </div>
                    </div>
                );
            }));
        }
    }

    renderLoader(data) {
        if (!data) {
            return <Loader/>;
        }
    }

    onBlurInput() {
        this.setState({showSearch: false});
    }

    renderContent() {
        if (this.props.selectedPillar && this.props.selectedSubPillar) {
            let mColClass = "";

            if (isMobile()) {
                mColClass = "mCol2";
            } else {
                if (getWidth() >= 1200) {
                    mColClass = "mCol4";
                } else if (getWidth() >= 1024) {
                    mColClass = "mCol3";
                } else {
                    mColClass = "mCol2";
                }
            }

            const {worldCountries, filteredCountries} = this.props.countryObj;
            const countriesList = filteredCountries.length ? filteredCountries : worldCountries;

            const worldCountriesAlpha = createCountriesAlphaMap(countriesList);

            return (
                <div className={'stepContentM ' + (!isMobile() ? "desktopStepContentM" : "")}
                     style={this.props.currentStep !== this.props.step ? {display: 'none'} : {display: 'flex'}}>
                    <div className='topM'>
                        <Link to='/'>
                            <img
                                src={this.props.lang.id === 1 ? '/assets/images/arrow-right.svg' : '/assets/images/arrow-left.svg'}
                                alt='placeholder'/>
                            <span>{this.props.lang.home}</span>
                        </Link>
                        <span className='dashLineM'>―</span>
                        <button onClick={this.props.update.bind(this, '', null, 1)}>
                            <span>{this.props.selectedPillar.nodeTextMap.title}</span>
                            {/*<span>{generalUtils.ellipsify(this.props.selectedPillar.pillarName, 10)}</span>*/}
                        </button>
                        <span className='dashLineM'>―</span>
                        <button onClick={this.props.update.bind(this, '', null, 2)}>
                            <span>{this.props.selectedSubPillar.kpi.kpiTextMap.title}</span>
                            {/*<span>{generalUtils.ellipsify(this.props.selectedSubPillar.name, 10)}</span>*/}
                        </button>
                    </div>

                    <div className='middleM'>
                        <h1>{this.props.lang.countries}</h1>
                        <p style={{color: "#fff", opacity: "0.3"}}>{this.props.lang.not_all_world_countries}</p>
                        <button onClick={this.toggleSearch.bind(this)}
                                style={{display: (this.state.showSearch) ? 'none' : 'block'}}
                                className="searchButtonCountryM">
                            <img src='/assets/images/search-light.svg' alt='placeholder'/>
                        </button>

                        <span className="searchCountryContentM"
                              style={{display: (this.state.showSearch || isMobile()) ? "block" : "none"}}>
                            <img src='/assets/images/search-light.svg' alt='placeholder'/>
                            <input
                                placeholder={this.props.lang.search_country}
                                id="countrySearchM"
                                onBlur={this.onBlurInput.bind(this)}
                                onChange={this.onInputChange}
                            />
                            <span className="clearfix"/>
                        </span>
                    </div>

                    <div className='bottomM customScrollbar'>
                        {this.renderLoader(worldCountries)}
                        <div className={'countryGroupWrapperM ' + mColClass}>
                            {this.renderSubCountries(worldCountriesAlpha)}
                        </div>
                    </div>
                    <Link to={(isMobile()) ? 'world-map/ranking' : 'world-map/'}
                          onClick={() => (generalUtils.createCookie("countryId", ""))}
                          style={this.props.currentStep === this.props.step ? {display: 'block'} : {display: 'none'}}>
                        <p>{this.props.lang.skip_step}</p>
                    </Link>
                </div>
            );
        }
    }

    render() {
        let h1Content = (
            <h1 className="verticalLine"
                style={this.props.currentStep === this.props.step ? {opadity: 1} : {opacity: this.props.opacity}}>03</h1>
        );

        return (
            <div
                className={`countriesContainerM ${this.props.currentStep === this.props.step ? 'activeM' : 'minimizedM'} ${this.props.lang.id === 0 ? 'rightM' : 'leftM'}`}
                style={this.props.currentStep === this.props.step ? {flex: this.props.flexOpen} : {flex: this.props.flexClose}}>

                {this.props.lang.id === 0 && h1Content}

                {this.renderContent()}

                {this.props.lang.id === 1 && h1Content}
            </div>
        );
    }
}

const actions = {
    setFilteredCountriesAction,
    getWorldCountriesAction,
    setSelectedCountryAction
};

const mapStateToProps = (state) => {
    return {
        countryObj: state.countryReducer,
    };
};

export default connect(mapStateToProps, actions)(Countries);
