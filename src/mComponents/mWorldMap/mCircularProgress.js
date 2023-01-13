// React
import React from 'react';

import CircularProgressbar from 'react-circular-progressbar';
import { _lang } from '../../utils';

const numeral = require('numeral');

const mCircularProgress = (textVal, data) => {
  if (data === '-1' || data === undefined) {
 return (
      <div className="cpbM">
        <CircularProgressbar
          percentage={0}
          strokeWidth={2.5}
          textForPercentage={() => _lang('no_data')}
          classForPercentage={(x) => ('noDataM')}
        />
      </div>
    ); 
}

  const percentageM = data * 20;
  // textVal = numberToText(textVal);
  // let sizeClass = (textVal.length > 8) ? 'smallSize' : '';

  return (
    <div className={'cpbM'}>
      <CircularProgressbar
        percentage={percentageM}
        strokeWidth={2.5}
        textForPercentage={() => (numeral(textVal).format('0.0a'))}
        classForPercentage={(percentage) => {
          if (percentage <= 0) { return 'circularP0-M'; }
          return `circularP${parseInt((percentage / 10), 10)}-M`;
        }}
      />
    </div>
  );
};

export default mCircularProgress;
