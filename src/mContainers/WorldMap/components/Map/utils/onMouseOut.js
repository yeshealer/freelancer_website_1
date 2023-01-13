import React from "react";
import ReactDOM from "react-dom";
import {getMapColorByScore} from "../../../../../mCommons/mUtils";

const onMouseOut = (getData) => {
    return function (d) {
        const countryId = d.id;
        const data = getData();
        const countryData = data.find(value => value.countryId === countryId);

        if (countryData) {
            const {weightedScore} = countryData;
            const selectedColor = getMapColorByScore(weightedScore);

            this.setAttribute("style", "fill: " + selectedColor);
        } else {
            this.setAttribute("style", "fill: #8d8d8d");
        }

        ReactDOM.render(
            <span/>,
            document.getElementById('tooltip-root')
        );
    };
};

export default onMouseOut;
