import { SET_CLOSABLE_MODAL } from '../actionType';

const setCloseableModalAction = (closeableModal) => {
    return async (dispatch) => {
        return dispatch({
            type: SET_CLOSABLE_MODAL,
            closeableModal
        });
    };
};


export default setCloseableModalAction;
