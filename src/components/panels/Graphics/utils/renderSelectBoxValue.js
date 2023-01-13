import React from 'react';
import { colorChartData } from '../../../../params';

function renderSelectBoxValue(option, i) {
  // TODO: Need modification for colors.
  return (<strong>
            <span
              className="colorDotM"
              style={{ background: colorChartData[i] }}
            />
    {option.countryTextMap.name}
  </strong>);
}

export default renderSelectBoxValue;
