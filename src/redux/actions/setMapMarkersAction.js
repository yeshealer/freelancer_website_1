import { SET_MAP_MARKERS } from "../actionType";

const setRangeValueForMapAction = (mapMarkers) => {
    return async (dispatch) => {
        return dispatch({
            type: SET_MAP_MARKERS,
            mapMarkers,
        });
    };
};


export default setRangeValueForMapAction;
