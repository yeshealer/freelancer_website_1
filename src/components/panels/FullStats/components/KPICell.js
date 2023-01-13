import React from 'react';

const { Cell } = require('fixed-data-table-2');
const _ = require('lodash');

class KPICell extends React.PureComponent {
  render() {
    const { data, rowIndex, columnKey, ...props } = this.props;
    return (
      <Cell {...props}>
        <span>
            {_.get(data, `[${rowIndex}].kpiTextMap.title`, '.')}
        </span>
      </Cell>
    );
  }
}

export default KPICell;
