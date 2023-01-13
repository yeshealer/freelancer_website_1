import React from 'react';
import numeral from "numeral";

const getHoverComponent = (x, y, countryName, countryCode, value, denominatorName, color) => {
    return (
        <div style={{left: (12 + x) + 'px', top: y + 'px', padding: '8px 32px'}} className="tooltipM">
            <div style={{margin: "0 auto"}} className={`country-flag-small sprite sprite-${countryCode}`}/>
            <span className="countryHover">{countryName}</span>
            {value !== undefined && <span style={{color: color}} className="valueAndDenominator">
                {numeral(value).format('0.0a') + '/' + denominatorName}
            </span>}
        </div>
    );
};

export default getHoverComponent;
