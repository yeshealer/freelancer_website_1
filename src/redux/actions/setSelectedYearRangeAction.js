import { SET_SELECTED_YEAR_RANGE } from "../actionType";

const setSelectedYearRangeAction = (selectedYearStart, selectedYearEnd) => {
    return async (dispatch, getState) => {
        return dispatch({
            type: SET_SELECTED_YEAR_RANGE,
            selectedYearStart,
            selectedYearEnd
        });
    };
};


export default setSelectedYearRangeAction;
