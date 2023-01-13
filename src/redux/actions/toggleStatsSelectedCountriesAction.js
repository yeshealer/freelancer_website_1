import { setStatsSelectedCountriesAction } from '../index';

const _ = require('lodash');

const toggleStatsSelectedCountriesAction = (countryId) => async (dispatch, getState) => {
  const state = getState();
  const { statsSelectedCountries } = state.coreReducer;
  const newList = [...statsSelectedCountries];

  if (statsSelectedCountries.indexOf(countryId) > -1) {
    _.pull(newList, countryId);
  } else {
    newList.push(countryId);
  }

  return setStatsSelectedCountriesAction(newList.join(','))(dispatch);
};

export default toggleStatsSelectedCountriesAction;
