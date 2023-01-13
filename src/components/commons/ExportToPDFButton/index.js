import React, { Component } from "react";
import { Tooltip } from "react-tippy";

import "./ExportToPDFButton.css";

export default class ExportToPDFButton extends Component {
  componentWillMount() {}
  componentDidMount() {}
  render() {
    return (
      <span
        className="pdfButton"
        onClick={() => {
          window.print();
        }}
      />
      /*  <Tooltip
        title="Print to PDF"
        position="bottom"
        trigger="mouseenter"
        animation="shift"
        arrow
        size="big"
        className="pdf-black-tootip"
        distance={20}
        duration={0}
      >
        <span
          className="pdfButton"
          onClick={() => {
            window.print();
          }}
        />
      </Tooltip> */
    );
  }
}
