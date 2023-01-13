import sdkV2 from '../../mCommons/network/sdkV2';
import { SET_KPI_VALUE } from '../actionType';

const getKpiValueAction = (kpiId, year) => async (dispatch) => {
    const request = await sdkV2.getKpiValue(kpiId, year);
    return dispatch({
      type: SET_KPI_VALUE,
      kpiValue: request.data
    });
  };

export default getKpiValueAction;
