import { SET_SELECTED_LANG } from '../actionType';

const setSelectedLangAction = (lang) => {
  return async (dispatch) => dispatch({
      type: SET_SELECTED_LANG,
      lang
    });
};

export default setSelectedLangAction;
