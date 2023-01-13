import {
  GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY,
  GET_KPI_BEST_AND_WORST_BY_COUNTRY,
  GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY_PROFILE,
  GET_SELECTED_COUNTRY_DATA,
  GET_SELECTED_REALM,
  GET_SELECTED_KPI,
  GET_COUNTRY_KPI_SCORES,
  SET_CP_ACTIVE_PATH
} from '../actionType';

const defaultState = {
  scoreAndRank: [],
  bestAndWorst: [],
  scoreAndRankByCountryProfile: [],
  kpiScores: [],
  selectedCountryName: '',
  selectedCountryId: '',
  selectedRealm: '',
  selectedCountryCode: '',
  selectedKpi: null,
  activePathOfBC: []
};

const countryProfileReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY:
      return {
        ...state,
        scoreAndRank: action.scoreAndRank,
      };
    case GET_KPI_BEST_AND_WORST_BY_COUNTRY:
      return {
        ...state,
        bestAndWorst: action.bestAndWorst,
      };
    case GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY_PROFILE:
      return {
        ...state,
        scoreAndRankByCountryProfile: action.scoreAndRankByCountryProfile,
      };
    case GET_SELECTED_COUNTRY_DATA:
      return {
        ...state,
        selectedCountryName: action.selectedCountryName,
        selectedCountryId: action.selectedCountryId,
        selectedCountryCode: action.selectedCountryCode,
      };
    case GET_SELECTED_REALM:
      return {
        ...state,
        selectedRealm: action.selectedRealm,
      };
    case GET_SELECTED_KPI:
      return {
        ...state,
        selectedKpi: action.selectedKpi,
      };
    case GET_COUNTRY_KPI_SCORES:
      return {
        ...state,
        kpiScores: action.kpiScores,
      };
    case SET_CP_ACTIVE_PATH:
      return {
        ...state,
        activePathOfBC: action.path
      };
    default:
      return {
        ...state
      };
  }
};

export default countryProfileReducer;
