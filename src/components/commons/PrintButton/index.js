import React, { Component } from "react";
import { Tooltip } from "react-tippy";

import "./PrintButton.css";

export default class PrintButton extends Component {
  componentWillMount() {}
  componentDidMount() {}
  render() {
    return (
      <span className="printButton" onClick={() => window.print()} />
      /*  <Tooltip
        title="Print"
        position="bottom"
        trigger="mouseenter"
        animation="shift"
        arrow
        size="big"
        className="print-black-tootip"
        distance={20}
        duration={0}
      >
        <span className="printButton" onClick={() => window.print()} />
      </Tooltip> */
    );
  }
}
