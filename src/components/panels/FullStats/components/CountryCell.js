import React from 'react';
import getColorDiv from '../utils/getColorDiv';
import numeral from 'numeral';

const { Cell } = require('fixed-data-table-2');
const _ = require('lodash');

class CountryCell extends React.PureComponent {
  render() {
    const { data, kpiIdList, rowIndex, columnKey, ...props } = this.props;

    const kpiId = kpiIdList[rowIndex];
    const selectedKPI = data.find(kpi => kpi.kpiId === parseInt(kpiId, 10));

    const dataVal = _.get(selectedKPI, 'dataValue', null);
    // console.log("--dataVal", dataVal);

    return (
      <Cell {...props}>
        <span className={getColorDiv(_.get(selectedKPI, 'weightedScore', 0))}>
          {dataVal && numeral(parseFloat(dataVal)).format('0.0a')}
          {/*{dataVal}*/}
        </span>
      </Cell>
    );
  }
}

export default CountryCell;
