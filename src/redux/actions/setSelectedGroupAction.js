import { SET_SELECTED_GROUP } from "../actionType";

const setSelectedGroupAction = (group) => {
    return async (dispatch, getState) => {
        return dispatch({
            type: SET_SELECTED_GROUP,
            group
        });
    };
};


export default setSelectedGroupAction;
