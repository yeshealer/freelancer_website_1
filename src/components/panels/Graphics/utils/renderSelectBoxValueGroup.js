import React from 'react';
import { colorSetG } from '../../../../mCommons/mUtils';

function renderSelectBoxValueGroup(option, i) {
  return (
    <strong>
      <span
        className="colorDotM"
        style={{ background: colorSetG[i] }}
      /> {option.countryGroupTextMap.title}
    </strong>
  );
}

export default renderSelectBoxValueGroup;
