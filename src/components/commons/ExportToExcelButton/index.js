import React, { Component } from "react";
import { Tooltip } from "react-tippy";

import sdkV2 from "../../../mCommons/network/sdkV2";

import "./ExportToExcelButton.css";

export default class ExportToExcelButton extends Component {
  componentWillMount() {}

  componentDidMount() {}

  getExcelExport() {
    const {
      type,
      kpiId,
      selectedYear,
      selectedGroup,
      groupName,
      pillarId,
      countryList,
      groupList,
      entityPageName,
    } = this.props;

    switch (type) {
      case "world-ranking":
        return sdkV2
          .getRankingExcelDownload(
            kpiId,
            selectedYear,
            selectedGroup,
            groupName,
            "ar_EN"
          )
          .then((resp) => {
            window.open(resp.request.responseURL, "target: _blank");
          })
          .catch((err) => {
            console.log(err);
          });
      case "full-stats":
        return sdkV2
          .getFullStatsExcelDownload(
            pillarId,
            selectedYear,
            countryList.join(),
            groupList.join(),
            entityPageName,
            "ar_EN"
          )
          .then((resp) => {
            window.open(resp.request.responseURL, "target: _blank");
          })
          .catch((err) => {
            console.log(err);
          });
      default:
        return null;
    }
  }

  render() {
    return (
      <span
        className="exportButton"
        onClick={() => {
          this.getExcelExport();
        }}
      ></span>
      /*  <Tooltip
        title="Export to Excel"
        position="bottom"
        trigger="mouseenter"
        animation="shift"
        arrow
        size="big"
        className="export-black-tootip"
        distance={20}
        duration={0}
      >
        <span
          className="exportButton"
          onClick={() => {
            this.getExcelExport();
          }}
        ></span>
      </Tooltip> */
    );
  }
}
