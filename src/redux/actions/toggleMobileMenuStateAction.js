import { SET_MOBILE_MENU_STATE } from '../actionType';

const toggleMobileMenuStateAction = () => async (dispatch, getState) => dispatch({
  type: SET_MOBILE_MENU_STATE,
  isMobileMenuOpen: !getState().uiReducer.isMobileMenuOpen
});

export default toggleMobileMenuStateAction;
