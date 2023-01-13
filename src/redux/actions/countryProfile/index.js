import {
  GET_KPI_BEST_AND_WORST_BY_COUNTRY,
  GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY,
  GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY_PROFILE,
  GET_SELECTED_COUNTRY_DATA,
  GET_SELECTED_REALM,
  GET_SELECTED_KPI,
  GET_COUNTRY_KPI_SCORES, SET_CP_ACTIVE_PATH,
} from '../../actionType';

import sdkV2 from '../../../mCommons/network/sdkV2';

export const getKpiBestAndWorstByCountryAction = (country) => async (dispatch) => {
  const request = await sdkV2.getKpiScoreAndRankDetailsByCountryOverallMarginals(country);

  return dispatch({
    type: GET_KPI_BEST_AND_WORST_BY_COUNTRY,
    bestAndWorst: request.data,
  });
};

export const getKpiScoreAndRankDetailsByCountryProfileAction = (country) => async (dispatch) => {
  const request = await sdkV2.getKpiScoreAndRankDetailsByCountryProfile(country);

  return dispatch({
    type: GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY_PROFILE,
    scoreAndRankByCountryProfile: request.data,
  });
};

export const getKpiScoreAndRankDetailsByCountryAction = (country) => async (dispatch) => {
  const request = await sdkV2.getKPIScoreAndRankDetailsByCountry(country);

  return dispatch({
    type: GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY,
    scoreAndRank: request.data,
  });
};

export const getSelectedCountryNameByCountryId = (countryId, countryList) => async (dispatch) => {
  const selectedCountry = countryList.filter(country => country.countryId === countryId);
  const selectedCountryName = selectedCountry[0].countryTextMap.name;
  const selectedCountryCode = selectedCountry[0].countryCode;

  return dispatch({
    type: GET_SELECTED_COUNTRY_DATA,
    selectedCountryId: countryId,
    selectedCountryName,
    selectedCountryCode,
  });
};

export const updateSelectedRealm = (realm) => async (dispatch) => dispatch({
  type: GET_SELECTED_REALM,
  selectedRealm: realm,
});

export const updateSelectedKpi = (kpi) => async (dispatch) => dispatch({
  type: GET_SELECTED_KPI,
  selectedKpi: kpi,
});

export const getCountryKpiScoreValues = (countryId) => async (dispatch) => {
  const request = await sdkV2.getKPIScoreAndRankDetailsByCountry(countryId);

  return dispatch({
    type: GET_COUNTRY_KPI_SCORES,
    kpiScores: request.data,
  });
};

export const setActivePathAction = (path) => (dispatch) => dispatch({
  type: SET_CP_ACTIVE_PATH,
  path
});
