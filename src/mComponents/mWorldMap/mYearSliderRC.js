// React
import React from 'react'
import {Range} from "rc-slider";
import 'rc-slider/assets/index.css';
import langUtils from "../../mCommons/mUtils/langUtils";

export const arSliderMap = {
    20090: 20180,
    20095: 20175,

    20100: 20170,
    20105: 20165,

    20110: 20160,
    20115: 20155,

    20120: 20150,
    20125: 20145,

    20130: 20140,
    20135: 20135,

    20140: 20130,
    20145: 20125,

    20150: 20120,
    20155: 20115,

    20160: 20110,
    20165: 20105,

    20170: 20100,
    20175: 20095,

    20180: 20090,
    20185: 20085
};

const mYearSliderRC = (self) => {

    let timeLineEN = {
        20090: "2009",
        20100: "2010",
        20110: "2011",
        20120: "2012",
        20130: "2013",
        20140: "2014",
        20150: "2015",
        20160: "2016",
        20170: "2017",
        20180: "2018"
    };

    let timeLineAR = {
        20090: "2018",
        20100: "2017",
        20110: "2016",
        20120: "2015",
        20130: "2014",
        20140: "2013",
        20150: "2012",
        20160: "2011",
        20170: "2010",
        20180: "2009"
    };

    return (
        <div className="footer-graphs" style={{zIndex: 99}}>
            <div className="Slider Slider-graphs">
                <Range
                    min={20085}
                    max={20185}
                    allowCross={false}
                    pushable={10}
                    step={5}
                    marks={(langUtils.currentEnglish) ? timeLineEN: timeLineAR}
                    onChange={self.sliderYearsCallback.bind(self)}
                    defaultValue={[self.state.selectedYearStart, self.state.selectedYearEnd]}
                    className="Slider Slider-graphs"/>
            </div>
        </div>
    );
};

export default mYearSliderRC;