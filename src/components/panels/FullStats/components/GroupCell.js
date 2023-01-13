import React from 'react';
import getColorDiv from '../utils/getColorDiv';

const { Cell } = require('fixed-data-table-2');
const _ = require('lodash');

class GroupCell extends React.PureComponent {
  render() {
    const { data, ...props } = this.props;
    return (
      <Cell {...props}>
        <span className={getColorDiv(_.get(data, 'groupWeightedScore', 0))}>
          {_.get(data, 'groupScore', '')}
        </span>
      </Cell>
    );
  }
}

export default GroupCell;
