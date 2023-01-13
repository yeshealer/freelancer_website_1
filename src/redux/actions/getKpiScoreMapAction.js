import sdkV2 from '../../mCommons/network/sdkV2';
import { SET_KPI_SCORE_MAP } from '../actionType';

const getKpiScoreMapAction = (kpiId) => async (dispatch) => {
  const request = await sdkV2.getKpiScoreMap(kpiId);
  return dispatch({
    type: SET_KPI_SCORE_MAP,
    kpiScoreMap: request.data
  });
};

export default getKpiScoreMapAction;
