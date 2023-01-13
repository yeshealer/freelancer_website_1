import { getHeight, getWidth } from '../../../../../mCommons/mUtils';
// import getPath from '../../../../../utils/getPath';
// import history from '../../../../../history';

// import store from '../../../../../redux/store.js';

const onClick = (getLang, getCountryList, setSelectedCountryAction, statsSelectedCountries,
                 addMarkerToMap, setRangeValueForMapAction, getMatch) => function (d) {
  const countryId = d.id;
  if (countryId === 'ISR') {
    return false;
  }

  // const match = getMatch();
  const currentLang = getLang();
  const countryList = getCountryList();

  const selectedCountry = countryList.find(item => item.countryId === countryId);
  if (selectedCountry === null) {
    return false;
  }

  addMarkerToMap(countryId, true);

  // if (match.params.pageId === 'compare') {
  // } else {
  //
  // }

  // setSelectedCountryAction(selectedCountry)
  //   .then(val => {
  //     const { pathname } = history.location;
  //     setTimeout(() => history.push(getPath(`${pathname}`)), 1000);
  //   });

  // const state = store.getState();
  // const { selectedPanel } = state.uiReducer;
  //
  // if (selectedPanel === 'compare') {
  //   statsSelectedCountries.push(selectedCountry.countryId);
  //
  //   if (statsSelectedCountries.length && statsSelectedCountries.length <= 4) {
  //     statsSelectedCountries.forEach(country => addMarkerToMap(country, true));
  //   }
  // }

  setRangeValueForMapAction(1);

  let extraGap = 0;
  const width = getWidth();
  const height = getHeight();
  const bounds = window.dataPath.bounds(d),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = 1;
  let translate = [(width / 2) - x + extraGap, height / 2 - scale * y];

  if (currentLang === 'sa_SA') {
    extraGap = 100;
  }

  if (d.id === 'USA' && currentLang === 'sa_SA') {
    translate = [(width / 2) - (x / 2) + extraGap, height / 2 - scale * y];
  }

  window
    .svgMap
    .transition()
    .duration(600)
    .call(window.mapZoom.translate(translate).scale(scale).event);
};

export default onClick;
