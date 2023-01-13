import { GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY } from '../actionType';
import sdkV2 from '../../mCommons/network/sdkV2';

const getKpiScoreAndRankDetailsByCountryAction = (country) => {
    return async (dispatch) => {        
        const request = await sdkV2.getKPIScoreAndRankDetailsByCountry(country);
        
        return dispatch({
            type: GET_KPI_SCORE_AND_RANK_DETAIL_BY_COUNTRY,
            scoreAndRank: request.data,
        });
    };
};

export default getKpiScoreAndRankDetailsByCountryAction;
