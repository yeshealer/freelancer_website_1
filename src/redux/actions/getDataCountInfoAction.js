import sdkV2 from "../../mCommons/network/sdkV2";
import {SET_DATA_COUNT_INFO} from "../actionType";

const getDataCountInfoAction = () => {
    return async (dispatch) => {
        let request = await sdkV2.getDataCountInfo();
        return dispatch({
            type: SET_DATA_COUNT_INFO,
            dataCountInfo: request.data
        });
    };
};

export default getDataCountInfoAction;