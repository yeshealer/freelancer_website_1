import * as d3 from "d3";
import numeral from "numeral";
import React from "react";
import ReactDOM from "react-dom";
import {getMapColorByScore, lightenColor} from "../../../../../mCommons/mUtils";
import convertIso3ToIso2 from "../../../../../mCommons/mUtils/convertIso3ToIso2";

const onMouseMove = (getData) => {
    return function (d) {
        const countryId = d.id;
        const countryId2 = convertIso3ToIso2(countryId);
        const data = getData();
        const countryData = data.find(value => value.countryId === countryId);

        if (countryData) {
            const {weightedScore, dataValue} = countryData;
            const {denominator} = countryData.kpiTextMap;
            const selectedColor = getMapColorByScore(weightedScore);
            const countryName = countryData.countryTextMap.name;

            let mouse = d3
                .mouse(window.svgMap.node())
                .map((d) => parseInt(d, 10));

            let tooltipContainer = <div className="tooltipM" style={{left: (12 + mouse[0]) + "px", top: (12 + mouse[1]) + "px"}}>
                <span>
                    <div className={"country-flag sprite sprite-" + countryId2}/>
                    <span className="countryHover">{countryName}</span><br/>
                    <span className="scoreData"
                          style={{"color": selectedColor}}>{numeral(dataValue).format("0.0a") + " / " + denominator}</span>
                </span>
            </div>;

            ReactDOM.render(
                tooltipContainer,
                document.getElementById('tooltip-root')
            );

            this.setAttribute("style", "fill: #" + lightenColor(selectedColor.toString().substring(1), 5));
        } else {
            this.setAttribute("style", "fill: #" + lightenColor("8d8d8d", 5));
        }
    };
};
export default onMouseMove;
