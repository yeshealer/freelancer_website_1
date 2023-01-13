import {SET_GROUPS} from "../actionType";

const defaultState = {
    groups: [],
    groupKeyMap: {}
};

const groupsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_GROUPS:
            return {
                ...state,
                groups: action.groups,
                groupKeyMap: action.groupKeyMap
            };
        default:
            return {
                ...state
            };
    }
};

export default groupsReducer;