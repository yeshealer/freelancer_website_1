import {SET_SELECTED_GROUPS} from '../actionType';

const setStatsSelectedGroups = (groups) => {
    return async (dispatch) => {
      const groupList = (
        (groups === '' || groups === null || groups === undefined) ? [] : groups.split(',')
      );

        if (!groupList.length) {
          return dispatch({
            type: SET_SELECTED_GROUPS,
            statsSelectedGroups: [],
          });

        }

        if (groupList.length < 6) {
          return dispatch({
            type: SET_SELECTED_GROUPS,
            statsSelectedGroups: groupList,
          });
        }
    };
};


export default setStatsSelectedGroups;
