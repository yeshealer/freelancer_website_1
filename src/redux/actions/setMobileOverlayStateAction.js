import { SET_MOBILE_OVERLAY_STATE } from '../actionType';

const setMobileOverlayStateAction = (overlayKey, isOpen) => (dispatch) => dispatch({
      type: SET_MOBILE_OVERLAY_STATE,
      overlayKey,
      isOpen
    });

export default setMobileOverlayStateAction;
