import { SET_SELECTED_COUNTRY_OBJ } from '../actionType';

const setSelectedCountryAction = (countryObj) => async (dispatch, getState) => dispatch({
  type: SET_SELECTED_COUNTRY_OBJ,
  countryObj
});

export default setSelectedCountryAction;
