// React
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Explore from './mContainers/mExplore/mExplore';
import WorldMap from './mContainers/WorldMap/WorldMap';

// components
import NotFound from './mComponents/mNotFound';

// HotJar
import { hotjar } from 'react-hotjar';

//google analytics
import ReactGA from 'react-ga';
// import { isMobile } from './mCommons/mUtils';
// import mCountryProfileDesktop from './mContainers/mCountryProfile/mCountryProfileDesktop';
import mHomePage from './mContainers/mHomePage/mHomePage';
import mWorldCountriesPage from './mContainers/mWorldCountries/WorldCountries';

import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import store from './redux/store';
// import getCountryProfileMobile from './mContainers/mCountryProfile/countryProfileMobile';
import history from './history';
import { getLanguageKey } from './utils';
import About from './components/panels/StaticModals/About';
import Disclaimers from './components/panels/StaticModals/Disclaimers';
import CountryProfile from './components/panels/CountryProfile/CountryProfile';

// TODO: Check keys on the following lines.
hotjar.initialize(994162, 6);
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

//page view
function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
  return null;
}

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router>
        <div>
          {(() => {
            if (getLanguageKey() === 'ar') {
              document.title = 'منصة الأداء الدولي';
              document.body.style.fontFamily = 'ITCHandel';
            } else {
              document.title = 'International Performance Hub';
              document.body.style.fontFamily = 'Etelka-Light';
            }
          })()}
          <Route path="/" component={logPageView} />
          <Switch>
            <Route path="/" exact component={mHomePage} />

            <Route
            path="/country-profile/:countryId" exact
            component={CountryProfile}
            />

            <Route path="/realm/:realmId" component={Explore} />
            <Route path="/world-map" exact component={WorldMap} />
            <Route path="/world-map/:pageId" exact component={WorldMap} />
            <Route path="/world-map/:pageId/:subPageId" exact component={WorldMap} />
            <Route path="/world-countries" exact component={mWorldCountriesPage} />
            <Route path="/about" exact component={About} />
            <Route path="/disclaimers" exact component={Disclaimers} />

            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ConnectedRouter>
  </Provider>
);

export default App;
