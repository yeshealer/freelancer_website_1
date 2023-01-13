import { SET_SELECTED_REALM } from '../actionType';

const setSelectedRealmAction = (selectedRealm) => {  
    return async (dispatch) => {
        return dispatch({
            type: SET_SELECTED_REALM,
            selectedRealm,
        });
    };
};


export default setSelectedRealmAction;
