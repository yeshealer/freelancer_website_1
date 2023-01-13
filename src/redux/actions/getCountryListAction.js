import sdkV2 from '../../mCommons/network/sdkV2';
import { SET_COUNTRY_LIST } from '../actionType';

const getCountryListAction = () => async (dispatch) => {
  const request = await sdkV2.getCountryList();
  const countryKeyMap = {};
  request.data.forEach(val => {
    countryKeyMap[val.countryId] = val;
  });

  return dispatch({
    type: SET_COUNTRY_LIST,
    countryList: request.data,
    countryKeyMap
  });
};

export default getCountryListAction;
