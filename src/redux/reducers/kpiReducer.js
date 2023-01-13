import { SET_KPI_SCORE, SET_RANKING_KPI, SET_FILTERED_KPI_LIST } from '../actionType';
import { SET_KPI_SCORE_MAP } from '../actionType';
import { SET_KPI_VALUE } from '../actionType';

const defaultState = {
    kpiScore: [],
    kpiScoreMap: [],
    kpiValue: {
        kpiMap: {}
    },
    rankingKpiList: [],
    filteredKpiList: [],
};

const kpiReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_KPI_SCORE:
            return {
                ...state,
                kpiScore: action.kpiScore
            };
        case SET_KPI_SCORE_MAP:
            return {
                ...state,
                kpiScoreMap: action.kpiScoreMap
            };
        case SET_KPI_VALUE:
            return {
                ...state,
                kpiValue: action.kpiValue
            };
        case SET_RANKING_KPI:
            return {
                ...state,
                rankingKpiList: action.rankingKpiList
            };
        case SET_FILTERED_KPI_LIST:
            return {
                ...state,
                filteredKpiList: action.filteredKpiList,
            };
        default:
            return {
                ...state
            };
    }
};

export default kpiReducer;
