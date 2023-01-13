import React from 'react';

const CountrySectionMobile = ({name, countryId}) => {
    return (
        <div className="country-section">
            <div className={""}>
                <img className="flag" src={"/assets/flags/4x3/" + countryId.toLowerCase() + ".svg"} />
                <span className="name">{name}</span>
            </div>
        </div>
    )
};

export default CountrySectionMobile;