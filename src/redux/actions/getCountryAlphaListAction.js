import sdkV2 from '../../mCommons/network/sdkV2';
import { SET_COUNTRY_ALPHA_LIST } from '../actionType';

const getCountryAlphaListAction = () => async (dispatch) => {
    const request = await sdkV2.getCountryAlphaList();

    let countryAlphaListObj = {};

    request.data.forEach(value => {
      const { countryTextMap: { name } } = value;
      const firstLetter = name[0];
      if (!countryAlphaListObj.hasOwnProperty(firstLetter)) {
        countryAlphaListObj[firstLetter] = {
          alphabet: firstLetter,
          countriesList: []
        };
      }
      countryAlphaListObj[firstLetter].countriesList.push(value);
    });

    countryAlphaListObj = Object.values(countryAlphaListObj);

    return dispatch({
      type: SET_COUNTRY_ALPHA_LIST,
      countryAlphaList: request.data,
      countryAlphaListObj
    });
  };

export default getCountryAlphaListAction;
