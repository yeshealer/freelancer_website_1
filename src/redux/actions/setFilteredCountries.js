import { SET_FILTERED_COUNTRIES, SET_FILTERED_COUNTRIES_ALPHA } from '../actionType';

const setFilteredCountriesAction = (searchTerm) => {
    return async (dispatch, getState) => {
        const state = getState();
        const { countryList } = state.countryReducer;
        const myRegex = new RegExp('^' + searchTerm, 'i');

        const filteredCountries = countryList.filter((country) => {
            const { name } = country.countryTextMap;
            return name.match(myRegex);
        });
        let countryAlphaListObj = {};

        filteredCountries.forEach(value => {
            const { countryTextMap: { name } } = value;
            const firstLetter = name[0];
            if (!countryAlphaListObj.hasOwnProperty(firstLetter)) {
                countryAlphaListObj[firstLetter] = {
                    alphabet: firstLetter,
                    countriesList: []
                };
            }
            countryAlphaListObj[firstLetter].countriesList.push(value);
        });

        countryAlphaListObj = Object.values(countryAlphaListObj);

        dispatch({
            type: SET_FILTERED_COUNTRIES_ALPHA,
            countryAlphaListObj
        });

        return dispatch({
            type: SET_FILTERED_COUNTRIES,
            filteredCountries,
        });
    };
};

export default setFilteredCountriesAction;
