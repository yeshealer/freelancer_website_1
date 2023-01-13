import { SET_REALM_LIST, SET_REALM_TREE } from '../actionType';

const defaultState = {
  realmList: [],
  realmTreeList: []
};

const realmReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_REALM_LIST:
      return {
        ...state,
        realmList: action.realmList
      };
    case SET_REALM_TREE:
      return {
        ...state,
        realmTreeList: action.realmTreeList
      };
    default:
      return {
        ...state
      };
  }
};

export default realmReducer;
