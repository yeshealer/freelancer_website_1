import sdkV2 from '../../mCommons/network/sdkV2';
import { SET_RANKING_KPI } from '../actionType';
import getKpiValueAction from './getKpiValueAction';

const getRankingKpiAction = (kpiId, year, countryGroupISO3) => async (dispatch, getState) => {
  const state = getState();

  let kpiId_ = kpiId;
  if (kpiId_ === null) {
    if (state.coreReducer.selectedKPI.kpi === undefined) {
      return dispatch({
        type: SET_RANKING_KPI,
        rankingKpiList: []
      });
    }
    kpiId_ = state.coreReducer.selectedKPI.kpi.id;
  }

  let year_ = year;
  if (year_ === null && !state.coreReducer.selectedYear) {
    const kpiScoreMap = state.kpiReducer.kpiScoreMap;
    year_ = (Object.keys(kpiScoreMap).length - 1);
  } else {
    year_ = state.coreReducer.selectedYear;
  }

  let countryGroupISO3_ = countryGroupISO3;
  if (countryGroupISO3_ === null) {
    countryGroupISO3_ = state.coreReducer.selectedGroup.groupId;
  }

  const request = await sdkV2.getRankingKpi(kpiId_, year_, countryGroupISO3_);
  return dispatch({
    type: SET_RANKING_KPI,
    rankingKpiList: request.data
  });
};

export default getRankingKpiAction;
