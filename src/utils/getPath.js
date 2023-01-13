/* eslint-disable no-undef */
import store from '../redux/store';

const getPath = (path, defaultConf = null) => {
  const state = store.getState().coreReducer;

  const { selectedCountry, selectedGroup, selectedKPIId, selectedKPIPath, selectedLanguage, selectedYear, altSelectedYear } = state;
  const { countryId } = selectedCountry;

  let data = {};

  if (defaultConf === null) {
    data = {
      a: countryId,
      b: selectedGroup.groupId || 'GLO',
      c: selectedKPIId,
      d: selectedKPIPath,
      e: selectedLanguage,
      f: selectedYear
    };
  } else {
    data = {
      a: defaultConf.countryId,
      b: 'GLO',
      c: defaultConf.selectedKPIId,
      d: defaultConf.selectedKPIPath,
      e: selectedLanguage,
      f: defaultConf.selectedYear || '2018'
    };
  }

  return `${path}?d=${btoa(JSON.stringify(data))}`;
};

export default getPath;
