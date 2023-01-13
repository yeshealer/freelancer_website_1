// React
import React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import setSelectedYearRangeAction from '../../../../redux/actions/setSelectedYearRangeAction';
import { arSliderMap } from '../../../../params/arSliderMap';
import timeLineEN from '../../../../params/timeLineEN';
import timeLineAR from '../../../../params/timeLineAR';

class YearSliderRC extends React.Component {

  sliderYearsCallback(yearArray) {
    const { selectedLanguage, setSelectedYearRangeAction } = this.props;
    let selectedYearStart,
      selectedYearEnd;

    if (selectedLanguage === 'en_SA') {
      selectedYearStart = yearArray[0];
      selectedYearEnd = yearArray[1];
    } else {
      selectedYearEnd = arSliderMap[yearArray[0]];
      selectedYearStart = arSliderMap[yearArray[1]];
    }

    setSelectedYearRangeAction(selectedYearStart, selectedYearEnd);
  }

  render() {
    const { selectedLanguage, selectedYearStart, selectedYearEnd, selectedYear } = this.props;
    console.log(this.props)
    return (
      <div className="footer-graphs" style={{ zIndex: 99 }}>
        <div className="Slider Slider-graphs">
          <Range
            min={19995}
            max={20205}
            allowCross={false}
            pushable={10}
            step={5}
            marks={(selectedLanguage === 'en_SA') ? timeLineEN : timeLineAR}
            onChange={this.sliderYearsCallback.bind(this)}
            defaultValue={[selectedYearStart, selectedYear ? (parseInt(selectedYear) * 10) : selectedYearEnd]}
            className="Slider Slider-graphs"
          />
        </div>
      </div>
    );
  }
}

const actions = {
  setSelectedYearRangeAction
};

const mapStateToProps = (state) => ({
  selectedLanguage: state.coreReducer.selectedLanguage,
  selectedYearStart: state.coreReducer.selectedYearStart,
  selectedYearEnd: state.coreReducer.selectedYearEnd,
  selectedYear: state.coreReducer.selectedYear
});

export default connect(mapStateToProps, actions)(YearSliderRC);
