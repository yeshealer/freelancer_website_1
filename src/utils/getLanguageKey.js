import store from '../redux/store';

const getLanguageKey = () => {
  const { getState } = store;
  const state = getState();
  const { selectedLanguage } = state.coreReducer;

  const keyMap = {
    en_SA: 'en',
    ar_SA: 'ar'
  };

  return keyMap[selectedLanguage];
};

export default getLanguageKey;
