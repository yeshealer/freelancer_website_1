import React from 'react';
import ReactDOM from 'react-dom';

import { shapeArray } from '../../../../mComponents/mWorldMap/mGraphicsUtil';
import getHoverComponent from './getHoverComponent';

class CustomizedDot extends React.Component {
  onMouseOver() {
    const { mousePosition, color, dataKey } = this.props;
    
    // const { countryName, countryCode, data, denominatorName } = this.props.payload;
    const { countryName, countryCode, denominatorName } = this.props.payload[`${dataKey}_Detail`];

    const data = this.props.payload[dataKey];

    const hoverComponent = getHoverComponent(mousePosition.x, mousePosition.y, countryName,
      countryCode, data, denominatorName, color);
    ReactDOM.render(hoverComponent, document.getElementById('tooltip-root'));
  }

  onMouseLeave() {
    ReactDOM.render(<div />, document.getElementById('tooltip-root'));
  }

  render() {
    const { cx, cy, i } = this.props;

    if (this.props.payload[this.props.countryCode] === undefined) { return null; }

    return (
      <svg
        onMouseOver={this.onMouseOver.bind(this)}
        onMouseLeave={this.onMouseLeave}
      >
        {shapeArray[i](cx, cy)}
      </svg>
    );
  }
}

export default CustomizedDot;
