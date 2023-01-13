import {SET_DATA_COUNT_INFO} from "../actionType";

const defaultState = {
    dataCountInfo: []
};

const dataCountReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_DATA_COUNT_INFO:
            return {
                ...state,
                dataCountInfo: action.dataCountInfo
            };
        default:
            return {
                ...state
            };
    }
};

export default dataCountReducer;