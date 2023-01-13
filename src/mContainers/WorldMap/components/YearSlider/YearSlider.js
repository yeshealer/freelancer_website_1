import React from 'react';
import { isMobile } from '../../../../mCommons/mUtils';
import YearComponent from './YearComponent';

class YearSlider extends React.Component {
  render() {
    const isDesktopMode = !(isMobile());
    const legendBar = (!isDesktopMode) ? (
      <img src="/assets/images/legend-bar.png" className="legendImgM" alt="Legend bar" />) : '';

    const years = [];
    for (let i = 2000; i <= 2020; i++) {
      years.push(i);
    }


    return (
      <div className="bottomYearSliderM">
        {legendBar}
        <div className="timeLineM" id="timeLineM">
          <div className="innerDivM">
            {years.map((year) => <YearComponent key={'Year_' + year.toString()} year={year.toString()} />)}
          </div>
        </div>
      </div>
    );
  }
}

export default YearSlider;
