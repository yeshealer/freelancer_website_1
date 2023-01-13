import { SET_BREADCRUMB } from '../actionType';

const setBreadcrumbV2Action = (path) => async (dispatch, getState) => {
  const state = getState();
  const { realmTreeList } = state.realmReducer;
  const breadcrumb = [];

  if (path && path.length === 3) {
    const b1 = realmTreeList.filter(x => x).find(x => x.id === path[0]);
    const b2 = b1.children.filter(x => x).find(x => x.id === path[1]);
    const b3 = b2.children.filter(x => x).find(x => x.id === path[2]);

    breadcrumb.push(b1);
    breadcrumb.push(b2);
    breadcrumb.push(b3);
  }

  return dispatch({
    type: SET_BREADCRUMB,
    breadcrumb
  });
};

export default setBreadcrumbV2Action;
