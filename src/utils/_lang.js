import langEn from '../mCommons/json/lang_en';
import langAr from '../mCommons/json/lang_ar';

import store from '../redux/store';

const _lang = (key) => {
  const { getState } = store;
  const state = getState();
  const { selectedLanguage } = state.coreReducer;

  if (selectedLanguage === 'en_SA') {
    return langEn[key];
  } else if (selectedLanguage === 'ar_SA') {
    return langAr[key];
  }
};

export default _lang;
