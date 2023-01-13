import { SET_ACTIVE_PANEL } from '../actionType';

// DON'T USE
const setActivePanelAction = (selectedPanel) => {
    return async (dispatch) => {
        return dispatch({
            type: SET_ACTIVE_PANEL,
            selectedPanel
        });
    };
};


export default setActivePanelAction;
