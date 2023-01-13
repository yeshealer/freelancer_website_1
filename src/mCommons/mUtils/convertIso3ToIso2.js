import countryCodes from "../json/countryCodes";

const convertIso3ToIso2 = (code) => {
    return countryCodes[code];
};

export default convertIso3ToIso2;
