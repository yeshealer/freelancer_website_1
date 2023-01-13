import sdkV2 from "../../mCommons/network/sdkV2";
import {SET_REALM_LIST} from "../actionType";

const getRealmListAction = () => {
    return async (dispatch) => {
        let request = await sdkV2.getRealmList();
        return dispatch({
            type: SET_REALM_LIST,
            realmList: request.data
        });
    };
};

export default getRealmListAction;
