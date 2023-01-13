import { SET_SELECTED_KPI_PATH } from '../actionType';

const setSelectedKPIAction = (path, kpiObj) => async (dispatch, getState) => dispatch({
  type: SET_SELECTED_KPI_PATH,
  path,
  kpiObj
});

export default setSelectedKPIAction;
