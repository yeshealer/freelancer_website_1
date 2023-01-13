import { GET_KPI_BEST_AND_WORST_BY_COUNTRY } from '../actionType';
import sdkV2 from '../../mCommons/network/sdkV2';

const getKpiBestAndWorstByCountryAction = (country) => {
    return async (dispatch) => {        
        const request = await sdkV2.getKpiScoreAndRankDetailsByCountryOverallMarginals(country);
        
        return dispatch({
            type: GET_KPI_BEST_AND_WORST_BY_COUNTRY,
            bestAndWorst: request.data,
        });
    };
}

export default getKpiBestAndWorstByCountryAction;
