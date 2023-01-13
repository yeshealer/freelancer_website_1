import store from '../redux/store';
import setSelectedLangAction from '../redux/actions/setSelectedLangAction';
import sdkV2 from '../mCommons/network/sdkV2';

const setPageDirAndLang = (dir, lang) => {
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

const toggleLanguage = () => {
  const { getState, dispatch } = store;
  const state = getState();
  const { selectedLanguage } = state.coreReducer;
  let newLang;


  if (document.documentElement.dir === 'rtl') {
    setPageDirAndLang('ltr', 'en');
  } else {
    setPageDirAndLang('rtl', 'ar');
  }

  if (selectedLanguage === 'en_SA') {
    // Set language Arabic
    document.title = 'منصة الأداء الدولي';
    document.body.style.fontFamily = 'ITCHandel';
    newLang = 'ar_SA';
  } else if (selectedLanguage === 'ar_SA') {
    // Set language English
    document.title = 'International Performance Hub';
    document.body.style.fontFamily = 'Etelka-Light';
    newLang = 'en_SA';
  }

  sdkV2.locale = newLang;
  setSelectedLangAction(newLang)(dispatch);

  // Reload requests...
};

export default toggleLanguage;
