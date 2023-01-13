// React
import React from 'react'
import {getHeight} from '../../mCommons/mUtils';


class mSelectCountries {
    constructor(self) {
        this.self = self;
        this.state = {
            alertIsShow: false
        };
    }

    handleSearch(event){
        if(event.target.value.length <= 1){
            this.self.setState({countryListSearchResultList: [], countryListSearchIsActive: false});
        } else{
            let filteredResult = this.self.searchOnCountryList(event.target.value);
            this.self.setState({countryListSearchResultList: filteredResult, countryListSearchIsActive: true});
        }
    }


    toggleCountry(value){
        let indexOf = this.self.state.statsSelectedCountries.indexOf(value);
        if(indexOf > -1){
            let newStatesSelectedC = this.self.state.statsSelectedCountries;
            newStatesSelectedC.splice(indexOf, 1);
            this.self.setState({statsSelectedCountries: newStatesSelectedC});
        }else{
            if(this.self.state.statsSelectedCountries.length > 4){
                setTimeout(() => {
                    this.self.setState({alertIsShow: true});
                }, 100);
                return;
            }

            let newStatesSelectedC = this.self.state.statsSelectedCountries;
            newStatesSelectedC.push(value);
            this.self.setState({statsSelectedCountries: newStatesSelectedC});
        }
    }

    didUpdated(){

    }

    resetSearch(){
        this.self.setState({countryListSearchResultList: [], countryListSearchIsActive: false});
    }

    onDoneClick(){
        this.resetSearch();
        this.self.setState({selectedClosableModal: "benchmarkSelector"});
    }

    closeModal(){
        this.self.setState({alertIsShow: false});
    }

    printAlertModal(){
        if(!this.self.state.alertIsShow)
            return;

        return (<div>
            <div className="alertBackOverlayM" />
            <div className="alertModalM">
                <div className="warningHeaderM">
                    <img src="/assets/svg/warning.svg" />
                </div>

                <div className="warningContentM">
                    <div className="warningTitleM">{this.self.state.lang.oh_snap}</div>
                    <div className="warningDescM">{this.self.state.lang.max_5_country}</div>
                    <div className="okButtonM" onClick={this.closeModal.bind(this)}>{this.self.state.lang.ok_btn}</div>
                </div>
            </div>
        </div>);
    }

    render() {
        let height = getHeight() - 150;

        return (
            <div className="fullScreenModal Stats-Table">
                {this.printAlertModal()}

                <div className="modalHeaderM">
                    <div className="titleM">{this.self.state.lang.add_countries} ({this.self.state.statsSelectedCountries.length}/5)</div>
                    <div onClick={this.onDoneClick.bind(this)} className="doneM">{this.self.state.lang.done}</div>
                </div>

                <div className="gapM30" />

                <div className="searchBoxM">
                    <div className="searchInputWrapper">
                        <div className="searchInputM">
                            <i className="placeholder-search-icon search-img-icon" />
                            <input ref="searchInput" placeholder={this.self.state.lang.search_country} onChange={this.handleSearch.bind(this)}/>
                        </div>
                    </div>
                </div>

                <div className="countryListAlpha innerSidePadding overFlowYScroll" style={{height: height}}>
                    <div className="row">

                        {(() => {
                            let list = [];
                            let tempList = null;
                            if(this.self.state.countryListSearchIsActive)
                                tempList = this.self.state.countryListSearchResultList;
                            else
                                tempList = this.self.state.countryListAlphabetic;

                            let selectedCountryList = this.self.state.statsSelectedCountries;
                            tempList.forEach((x) => {
                                let countryItemList = [];

                                x.countriesList.forEach((y) => {
                                    countryItemList.push(
                                        <div
                                            onClick={this.toggleCountry.bind(this, y.countryId)}
                                            key={"key-" + y.countryName}
                                            className={((selectedCountryList.indexOf(y.countryId) > -1) ? "active countryNameM" : "countryNameM")}>
                                            {this.self._e(y, "countryName")}
                                            <div className="check-img-icon" />
                                        </div>
                                    );
                                });
                                let listItem = (<div key={"key-alp-" + x['alphabet']} className="col-xs-6 langFloat">
                                    <div className="letterTitleM">{x['alphabet']}</div>
                                    {countryItemList}
                                </div>);

                                list.push(listItem);
                            });

                            if(list.length > 0)
                                return list;
                            else
                                return (<div className="col-xs-12 marginTop30">{this.self.state.lang.no_results}</div>);
                        })()}

                    </div>
                </div>


            </div>
        );
    }
}

export default mSelectCountries;