import sdkV2 from "../../mCommons/network/sdkV2";
import {SET_KPI_SCORE} from "../actionType";

const getKpiScoreAction = (kpiId, countryISO3, year) => {
    return async (dispatch) => {
        let request = await sdkV2.getKpiScore(kpiId, countryISO3, year);
        return dispatch({
            type: SET_KPI_SCORE,
            kpiScore: request.data
        })

    }
};

export default getKpiScoreAction;