import React from 'react'
import {isMobile} from "../../mCommons/mUtils";

const yearComponentM = (year, selectedYear) => {
    let yearClassNameM = (selectedYear === year) ? "active" : "";
    let activeId = (selectedYear === year) ? "activeMenu" : "";
    return (<div id={activeId} className="itemM"><a onClick={() => { self.onYearChanged(year) }} className={ yearClassNameM }>{year}</a><hr /></div>);
};

const mYearSlider = (selectedYear) => {
    let isDesktopMode = !(isMobile());
    let legendBar = (!isDesktopMode) ? (<img src="/assets/images/legend-bar.png" className="legendImgM" alt="Legend bar" />): "";
    let yearList = [
        yearComponentM("2009", selectedYear),
        yearComponentM("2010", selectedYear),
        yearComponentM("2011", selectedYear),
        yearComponentM("2012", selectedYear),
        yearComponentM("2013", selectedYear),
        yearComponentM("2014", selectedYear),
        yearComponentM("2015", selectedYear),
        yearComponentM("2016", selectedYear),
        yearComponentM("2017", selectedYear),
        yearComponentM("2018", selectedYear),
        yearComponentM("2019", selectedYear),
        yearComponentM("2020", selectedYear),
    ];

    return (
        <div className="bottomYearSliderM">
            {legendBar}
            <div className="timeLineM" id="timeLineM">
                <div className="innerDivM">
                    {yearList}
                </div>
            </div>
        </div>
    );
};

export default mYearSlider;
