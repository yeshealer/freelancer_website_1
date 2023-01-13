import getQSParameterByName from './getQSParameterByName';

const getDataFromPath = () => {
  try {
    // eslint-disable-next-line no-undef
    const qsData = JSON.parse(atob(getQSParameterByName('d')));
    const { a, b, c, d, e, f } = qsData;

    return {
      countryId: a,
      selectedGroup: b,
      selectedKPIId: c,
      selectedKPIPath: d,
      selectedLanguage: e,
      selectedYear: f
    };
  } catch (e) {
    return {
      countryId: null,
      selectedGroup: 'GLO',
      selectedKPIId: null,
      selectedKPIPath: null,
      selectedLanguage: null,
      selectedYear: null,
    };
  }
};

export default getDataFromPath;
