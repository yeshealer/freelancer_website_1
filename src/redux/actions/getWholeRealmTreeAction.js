import sdkV2 from "../../mCommons/network/sdkV2";
import {SET_REALM_TREE} from "../actionType";

const getWholeRealmTreeAction = () => {
    return async (dispatch) => {
        let request = await sdkV2.getWholeRealmTree();

        return dispatch({
            type: SET_REALM_TREE,
            realmTreeList : request.data.map((r) => {
                const mainEntityPage = r.children.sort((a, b) =>{
                    return (parseInt(a.position) > parseInt(b.position)?1:-1);
                });
                return {
                    ...r,
                    children: mainEntityPage
                };
            })
        });
    };
};

export default getWholeRealmTreeAction;
