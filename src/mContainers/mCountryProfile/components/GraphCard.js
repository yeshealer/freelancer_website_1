import React, { Component } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
  XAxis,
} from "recharts";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { setSelectedKPIAction, setBreadcrumbAction } from "../../../redux";
import { Tooltip } from "react-tippy";

import "react-tippy/dist/tippy.css";
import { _lang, getPath, subStr } from "../../../utils";

class GraphCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoOpened: false,
      shouldUpdate: true,
      lineChart: true,
      minHeight: false,
    };
  }

  // generateShareURL() {
  // 	return '/world-map/detail/' + this.props.pillarId
  // 		+ '/' + this.props.kpiId + '/'
  // 		+ this.props.countryId + '/'
  // 		+ this.props.year + '/'
  // 		+ (langUtils.currentEnglish ? "EN" : "AR");
  // }

  componentDidMount() {}

  handleChartChange = () => {
    this.setState({
      lineChart: !this.state.lineChart,
    });
  };

  generateBarChart = (graphData) => (
    <BarChart data={graphData} width={730} height={250}>
      <XAxis dataKey="year" />
      <YAxis type="number" domain={[0, 3]} />
      <Bar dataKey="score" fill="#01AE87" />
    </BarChart>
  );

  generateLineChart = (graphData) => (
    <LineChart data={graphData}>
      <YAxis hide type="number" domain={["dataMin", "dataMax"]} />
      <Line
        isAnimationActive={false}
        type="monotone"
        dot={false}
        dataKey="score"
        stroke="#999fa5"
        strokeWidth={2}
      />
    </LineChart>
  );

  getChartContent(graphData) {
    if (graphData.length > 1) {
      return (
        <ResponsiveContainer
          width="100%"
          height={this.state.lineChart ? 40 : 120}
        >
          {this.state.lineChart
            ? this.generateLineChart(graphData)
            : this.generateBarChart(graphData)}
        </ResponsiveContainer>
      );
    }
    return (
      <div className="noDataAvailable" style={{ height: 40, width: "100%" }}>
        {_lang("data_no_available")}
      </div>
    );
  }

  render() {
    const {
      title,
      description,
      currentValue = null,
      score,
      year,
      rank,
      rate,
      total,
      sourceTitle,
      sourceURL,
      showSource,
      graphData,
      typeClass,
      countryId,
      kpiObj,
      searchableKPIList,
      cardType,
    } = this.props;

    const { infoOpened } = this.state;

    let colorClass = "";
    if (rate === null) {
      colorClass += "card-type-gray";
    } else if (rate === 0) {
      colorClass += "card-type-gray";
    } else if (rate > 0) {
      colorClass += "card-type-green";
    } else {
      colorClass += "card-type-red";
    }

    let sourceDiv = "";
    if (showSource) {
      sourceDiv = (
        <div className="source-info">
          {_lang("source")}:{" "}
          <a target="_blank" href={sourceURL}>
            {sourceTitle}
          </a>
        </div>
      );
    }

    if (kpiObj) {
      const { id } = kpiObj;
      let kpiDetails;
      if (cardType === "Subcategory") {
        // Works on sub categories
        kpiDetails = searchableKPIList.find(
          (kpi) => kpi && kpi.id === kpiObj.id
        );
      } else {
        // Works on overall
        kpiDetails = searchableKPIList.find(
          (kpi) => kpi && kpi.kpi.id === kpiObj.id
        );
      }
      if (!kpiDetails) {
        return <div data-kpi-id={id} className="no-kpi-details" />;
      }

      const selectedPath = kpiDetails.path;
      const pathParam = {
        countryId: countryId,
        selectedKPIId: kpiDetails.kpi.id,
        selectedKPIPath: selectedPath,
        selectedYear: year.toString(),
      };

      return (
        <div className={`graph-card ${typeClass} ${colorClass}`}>
          <div className="graph-card-title">
            <Link to={getPath("/world-map/detail", pathParam)}>
              {subStr(title, 0, 65)}
            </Link>
            {/*  <Tooltip
              title={title}
              position="top"
              trigger="mouseenter"
              animation="shift"
              arrow
              size="big"
              className="black-tootip"
              distance={20}
              duration={0}
            >
              <Link to={getPath("/world-map/detail", pathParam)}>
                {subStr(title, 0, 65)}
              </Link>
            </Tooltip> */}

            <button
              className="info"
              onClick={() => this.setState({ infoOpened: !infoOpened })}
            >
              <img src="/assets/images/info.svg" />
            </button>

            {/*{graphData.length > 0 ?*/}
            {/*<button className="chart" onClick={this.handleChartChange}>*/}
            {/*<img src={this.state.lineChart ? '/assets/images/bar-graph.svg' : '/assets/images/close.svg'} />*/}
            {/*</button> : ''}*/}
          </div>
          <div className="graph-container">
            {this.getChartContent(graphData)}
            <div className="values" style={{ marginTop: 16 }}>
              <div className="current-value">
                <div>{currentValue}</div>
                <div>{score}</div>
                <div>{year}</div>
              </div>
              <div className="current-rank">
                <div>
                  <div>
                    {rate !== null && rate !== 0 && (
                      <div className={rate > 0 ? "up-rank" : "down-rank"}>
                        <img src="/assets/svg/rank-up.svg" />
                        <img src="/assets/svg/rank-down.svg" />
                        <span className="rate green">
                          {rate > 0 ? rate : rate.toString().substring(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>{rank}</div>
                </div>

                <div>
                  {_lang("out_of")} {total}
                </div>
              </div>
              <div className="clearfix" />
            </div>

            {sourceDiv}
          </div>

          {infoOpened && (
            <div className="graph-info customScrollbar">
              <div className="graph-title">
                <b>{_lang("overview_country_profile")} </b>
                <button
                  className="close"
                  onClick={() => this.setState({ infoOpened: !infoOpened })}
                >
                  <img src="/assets/images/close.svg" />
                </button>
                <span>({title})</span>
              </div>
              <div className="graph-content">
                {description}
                <br />
                <div className="info">
                  {_lang("source")}:{" "}
                  <a target="_blank" href={sourceURL}>
                    {sourceTitle}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

const actions = {
  setSelectedKPIAction,
  setBreadcrumbAction,
};

const mapStateToProps = (state) => ({
  searchableKPIList: state.coreReducer.searchableKPIList,
  selectedKPI: state.coreReducer,
  activePathOfBC: state.countryProfileReducer.activePathOfBC,
});

export default connect(mapStateToProps, actions)(GraphCard);
