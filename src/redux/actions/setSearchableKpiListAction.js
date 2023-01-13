import { SET_SEARCHABLE_KPI_LIST } from "../actionType";

const setSearchableKpiListAction = (searchableKPIList) => {
    return async (dispatch) => {
        return dispatch({
            type: SET_SEARCHABLE_KPI_LIST,
            searchableKPIList
        });
    };
};


export default setSearchableKpiListAction;
