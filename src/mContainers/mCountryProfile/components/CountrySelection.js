import React from 'react';

import countryCodes from '../../../mCommons/json/countryCodes.json';

const CountrySection = ({ name, countryId }) => {
    return (
        <div className="country-section">
            <div className={""}>
                <img className="flag" src={"/assets/flags/4x3/" + countryCodes[countryId].toLowerCase() + ".svg"} />
                <span className="name">{name}</span>
            </div>
            <div className="country-map" style={{height: "auto"}}>
                <i className={"mg map-" + (countryCodes[countryId].toLowerCase() === "gb" ? "uk": countryCodes[countryId].toLowerCase())}/>
            </div>
        </div>
    );
};

export default CountrySection;
