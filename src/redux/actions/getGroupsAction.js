import sdkV2 from "../../mCommons/network/sdkV2";
import {SET_GROUPS} from "../actionType";

const getGroupsAction = () => {
    return async (dispatch) => {
        let request = await sdkV2.getGroups();

        let groupKeyMap = {};
        request.data.forEach(val => {
            groupKeyMap[val.groupId] = val;
        });


        return dispatch({
            type: SET_GROUPS,
            groups: request.data.map((val) => ({...val, title: val.countryGroupTextMap.title})),
            groupKeyMap
        });
    };
};

export default getGroupsAction;
