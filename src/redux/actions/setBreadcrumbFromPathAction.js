import { SET_BREADCRUMB_FROM_PATH } from '../actionType';

const setBreadcrumbFromPathAction = (path) => async (dispatch, getState) => {

  const state = getState();
  const { realmTreeList } = state.realmReducer;

  const b1 = realmTreeList.find(x => x.id === path[0]);
  const b2 = b1.children.find(x => x.id === path[1]);
  const b3 = b2.children.find(x => x.id === path[2]);


  return dispatch({
    type: SET_BREADCRUMB_FROM_PATH,
  });
};

export default setBreadcrumbFromPathAction;
