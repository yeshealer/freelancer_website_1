import sdkV2 from "../../mCommons/network/sdkV2";
import { SET_WORLD_COUNTRIES } from "../actionType";

const getWorldCountriesAction = () => {
    return async (dispatch) => {
        let request = await sdkV2.getCountryList();
        
        return dispatch({
            type: SET_WORLD_COUNTRIES,
            worldCountries: request.data
        });
    }
}

export default getWorldCountriesAction;