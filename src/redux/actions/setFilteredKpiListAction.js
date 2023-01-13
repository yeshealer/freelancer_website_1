import { SET_FILTERED_KPI_LIST } from "../actionType";

const setFilteredKpiListAction = (searchTerm) => {
  return async (dispatch, getState) => {
    if (!searchTerm) {
      return dispatch({
        type: SET_FILTERED_KPI_LIST,
        filteredKpiList: [],
      });
    }
    const state = getState();

    const { searchableKPIList } = state.coreReducer;
    const myRegex = new RegExp(searchTerm, 'i');

    const filteredKpiList = searchableKPIList.filter((kpi) => {
      const { title } = kpi.kpi.kpiTextMap;
      return title.match(myRegex);
    });

    return dispatch({
      type: SET_FILTERED_KPI_LIST,
      filteredKpiList,
    });
  };
};

export default setFilteredKpiListAction;
