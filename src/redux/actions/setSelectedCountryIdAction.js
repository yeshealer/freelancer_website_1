import { SET_SELECTED_COUNTRY_ID } from "../actionType";

export const setSelectedCountryIdAction = () => {    
    return async (dispatch, getState) => {
        const state = getState();
        const { pathname: url } = state.router.location;
        const selectedCountryId = url.match(/\/([^\/]+)\/?$/)[1];
        
        return dispatch({
            type: SET_SELECTED_COUNTRY_ID,
            selectedCountryId
        });
    };
};
