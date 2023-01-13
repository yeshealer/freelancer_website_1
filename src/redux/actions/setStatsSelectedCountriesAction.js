import { SET_SELECTED_COUNTRY_STATS } from '../actionType';

const setStatsSelectedCountriesAction = (countries) => async (dispatch) => {
    const countryList = ((countries === '' || countries === null) ? [] : countries.split(','));

    if (!countryList.length) {
      return dispatch({
        type: SET_SELECTED_COUNTRY_STATS,
        statsSelectedCountries: [],
      });
    }

    if (countryList.length < 6) {
      return dispatch({
        type: SET_SELECTED_COUNTRY_STATS,
        statsSelectedCountries: countryList,
      });
    }
  };

export default setStatsSelectedCountriesAction;
