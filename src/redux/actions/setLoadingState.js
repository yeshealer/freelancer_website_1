import { SET_LOADING_STATE } from '../actionType';

const setLoadingState = (isVisible) => (dispatch) => dispatch({
  type: SET_LOADING_STATE,
  isVisible
});

export default setLoadingState;
