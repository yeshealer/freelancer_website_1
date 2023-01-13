import { SET_SELECTED_YEAR } from "../actionType";

const setSelectedYearAction = (year) => {
    return async (dispatch, getState) => {
        return dispatch({
            type: SET_SELECTED_YEAR,
            year
        });
    };
};


export default setSelectedYearAction;
