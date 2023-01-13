import {
  SET_MOBILE_MENU_STATE,
  SET_MAP_SCALING_STATE,
  SET_ACTIVE_PANEL,
  SET_MAP_MARKERS,
  SET_RANGE_VALUE, SET_LOADING_STATE
} from '../actionType';

const defaultState = {
  isMobileMenuOpen: false,
  currentMarkerScale: 0.8,
  rangeValue: 1,
  rangeMinVal: 1,
  rangeMaxVal: 2,
  rangeStepVal: 0.2,
  mapMarkersForCompare: [],
  // selectedPanel: 'kpi',
  mapMarkers: [],

  showLoading: true
};

const uiReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_MOBILE_MENU_STATE:
      return {
        ...state,
        isMobileMenuOpen: action.isMobileMenuOpen
      };
    case SET_MAP_SCALING_STATE:
      return {
        ...state,
        currentMarkerScale: action.currentMarkerScale,
        rangeValue: action.rangeValue,
        rangeMinVal: action.rangeMinVal,
        rangeMaxVal: action.rangeMaxVal,
        rangeStepVal: action.rangeStepVal,
        mapMarkersForCompare: action.mapMarkersForCompare,
      };
    case SET_MAP_MARKERS:
      return {
        ...state,
        mapMarkers: action.mapMarkers,
      };
    case SET_RANGE_VALUE:
      return {
        ...state,
        rangeValue: action.rangeValue,
      };

    case SET_LOADING_STATE:
      return {
        ...state,
        showLoading: action.isVisible
      };
    // case SET_ACTIVE_PANEL:
    // 	return {
    // 		...state,
    // 		selectedPanel: action.selectedPanel
    // 	};
    default:
      return state;
  }
};

export default uiReducer;
