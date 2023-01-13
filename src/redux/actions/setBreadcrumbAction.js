import { SET_BREADCRUMB } from '../actionType';

const setBreadcrumbAction = (breadcrumb) => {    
    return async (dispatch, getState) => {
        const existingState = getState().coreReducer.breadcrumb;

        // console.log(breadcrumb);        
        
        const realm = breadcrumb[0] ? breadcrumb[0] : existingState[0];
        const pillar = breadcrumb[1] ? breadcrumb[1] : existingState[1];
        const subPillar = breadcrumb[2] ? breadcrumb[2] : existingState[2];
        const kpi = breadcrumb[3] ? breadcrumb[3] : existingState[3];
        

        return dispatch({
            type: SET_BREADCRUMB,
            breadcrumb: [
                realm,
                pillar,
                subPillar,
                kpi,
            ]
        });
    };
};


export default setBreadcrumbAction;
