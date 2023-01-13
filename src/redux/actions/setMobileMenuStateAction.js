import { SET_MOBILE_MENU_STATE } from "../actionType";

const setMobileMenuStateAction = (isMobileMenuOpen) => {
    return async (dispatch, getState) => {
        return dispatch({
            type: SET_MOBILE_MENU_STATE,
            isMobileMenuOpen
        });
    };
};


export default setMobileMenuStateAction;
