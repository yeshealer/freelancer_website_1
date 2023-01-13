import {
  SET_COUNTRY_ALPHA_LIST,
  SET_COUNTRY_LIST,
  SET_WORLD_COUNTRIES,
  SET_FILTERED_COUNTRIES, SET_FILTERED_COUNTRIES_ALPHA
} from '../actionType'

const defaultState = {
  countryList: [],
  countryKeyMap: {},
  countryAlphaList: [],
  countryAlphaListObj: [],

  worldCountries: [],
  filteredCountries: [],
  filteredCountriesAlphaListObj: []
};

const countryReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_COUNTRY_LIST:
      return {
        ...state,
        countryList: action.countryList,
        countryKeyMap: action.countryKeyMap
      };
    case SET_FILTERED_COUNTRIES_ALPHA:
      return {
        ...state,
        filteredCountriesAlphaListObj: action.countryAlphaListObj
      };
    case SET_COUNTRY_ALPHA_LIST:
      return {
        ...state,
        countryAlphaList: action.countryAlphaList,
        countryAlphaListObj: action.countryAlphaListObj
      };
    case SET_WORLD_COUNTRIES:
      return {
        ...state,
        worldCountries: action.worldCountries
      };
    case SET_FILTERED_COUNTRIES:
      return {
        ...state,
        filteredCountries: action.filteredCountries
      };
    default:
      return {
        ...state
      };
  }
};

export default countryReducer;
