import store from '../redux/store';
import setSelectedLangAction from '../redux/actions/setSelectedLangAction';
import sdkV2 from '../mCommons/network/sdkV2';

const setPageDirAndLang = (dir, lang) => {
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
};

const setLanguage = (lang) => {
  const { dispatch } = store;
  let newLang;

  if (lang === 'ar') {
    setPageDirAndLang('rtl', 'ar');
  } else {
    setPageDirAndLang('ltr', 'en');
  }

  if (lang === 'ar') {
    // Set language Arabic
    document.title = 'منصة الأداء الدولي';
    document.body.style.fontFamily = 'ITCHandel';
    newLang = 'ar_SA';
  } else if (lang === 'en') {
    // Set language English
    document.title = 'International Performance Hub';
    document.body.style.fontFamily = 'Etelka-Light';
    newLang = 'en_SA';
  }

  sdkV2.locale = newLang;
  setSelectedLangAction(newLang)(dispatch);

  // Reload requests...
};

export default setLanguage;
