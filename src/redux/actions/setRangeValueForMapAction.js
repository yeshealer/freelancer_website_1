import { SET_RANGE_VALUE } from "../actionType";

const setRangeValueForMapAction = (rangeValue) => {    
    return async (dispatch) => {
        return dispatch({
            type: SET_RANGE_VALUE,
            rangeValue
        });
    };
};


export default setRangeValueForMapAction;
