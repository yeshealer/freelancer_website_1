import React from 'react';
import { connect } from 'react-redux';
import setSelectedCountryAction from '../../../../redux/actions/setSelectedCountryAction';
import setStatsSelectedCountriesAction from '../../../../redux/actions/setStatsSelectedCountriesAction';
import initMap from './utils/initMap';
import onClick from './utils/onClick';
import onMouseMove from './utils/onMouseMove';
import onMouseOut from './utils/onMouseOut';
import setMapColors from './utils/setMapColors';
import { getPath, isMobile } from '../../../../utils';
import * as countryData from '../../../../../public/assets/data/countriesData';
import countryCodes from '../../../../mCommons/json/countryCodes.json';
import { setRangeValueForMapAction, toggleStatsSelectedCountriesAction } from '../../../../redux';
import { withRouter } from 'react-router-dom';

const _ = require('lodash');

window.nodeList = [];

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Marker Scale
      currentMarkerScale: 0.8,
      rangeValue: 1,
      rangeMinVal: 1,
      rangeMaxVal: 2,
      rangeStepVal: 0.2,

      markedCountryList: []

    };

    // Reference for background map
    this.mapDivRef = null;
    this.setMapDivRef = element => {
      this.mapDivRef = element;
    };

    // Reference for tooltip of the background map
    this.tooltipDivRef = null;
    this.setTooltipDivRef = element => {
      this.tooltipDivRef = element;
    };
  }

  componentWillReceiveProps(nextProps) {
    setMapColors(nextProps.rankingKpiList);

    const { match } = nextProps;

    this.removeAllMarkers();
    if (match.params.pageId === 'compare') {
      nextProps.statsSelectedCountries.forEach((countryId) => {
        this.printMarker(countryId);
      });
    } else {
      const { selectedCountry } = nextProps;
      if (selectedCountry.countryId) {
        this.printMarker(selectedCountry.countryId);
      }
    }
  }

  componentDidMount() {
    const { rangeMinVal, rangeMaxVal } = this.state;
    const {
      setSelectedCountryAction,
      statsSelectedCountries,
      selectedPanel,
      match,
      setRangeValueForMapAction
    } = this.props;

    initMap(
      this.mapDivRef,
      this.tooltipDivRef,
      rangeMinVal,
      rangeMaxVal,
      onClick(
        () => this.props.selectedLanguage,
        () => this.props.countryList,
        setSelectedCountryAction,
        statsSelectedCountries,
        this.addMarkerToMap.bind(this),
        () => this.props.setRangeValueForMapAction,
        () => match
      ),
      () => {
      },
      onMouseMove(() => this.props.rankingKpiList),
      onMouseOut(() => this.props.rankingKpiList),
      this.props.setRangeValueForMapAction
    );
  }

  iso3ToIso2(code) {
    return countryCodes[code];
  }

  printMarker(countryCode) {
    const scaleB = this.props.rangeValue;

    const coordinate = [parseFloat(countryData[this.iso3ToIso2(countryCode)].latitude), parseFloat(countryData[this.iso3ToIso2(countryCode)].longitude)];
    const posX = window.projection([coordinate[1], coordinate[0]])[0] - (15.5 * (1 / scaleB));
    const posY = window.projection([coordinate[1], coordinate[0]])[1] - (32.5 * (1 / scaleB));

    const markerNode = window.dataMapM
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${posX},${posY}) scale(${1 / scaleB})`);

    markerNode.append('path')
      .attr('d', 'M14.7,0C8.7,0,3.9,4.9,3.9,10.9c0,6,10.7,18.7,10.9,18.7c0,0,10.9-12.7,10.9-18.7C25.6,4.9,20.8,0,14.7,0zM14.8,15.3c-2.5,0-4.6-2-4.6-4.6c0,0,0,0,0,0c0-2.5,2.1-4.6,4.6-4.6c0,0,0,0,0,0c2.5,0,4.6,2,4.6,4.6c0,0,0,0,0,0C19.4,13.2,17.4,15.3,14.8,15.3L14.8,15.3z')
      .attr('fill', '#ffffff');
    window.nodeList.push(markerNode.node());
    window.dataMapM.append((() => markerNode.node()));
  }

  removeAllMarkers() {
    const nodeList = document.querySelectorAll('.node');
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i] !== undefined) {
        nodeList[i].remove();
      }
    }
  }

  addMarkerToMap(countryCode, isCompare = false) {
    if (countryCode !== null) {
      const { history, match, setSelectedCountryAction, setStatsSelectedCountriesAction,
        toggleStatsSelectedCountriesAction, statsSelectedCountries, countryKeyMap } = this.props;

      if (match.params.pageId === 'compare') {
        if (statsSelectedCountries.length < 5 && statsSelectedCountries.indexOf(countryCode) === -1) {
          toggleStatsSelectedCountriesAction(countryCode);
        }
      } else {
        setStatsSelectedCountriesAction(countryCode);
        setSelectedCountryAction(countryKeyMap[countryCode])
          .then(() => {
            history.push(getPath('/world-map/detail'));
          });
      }
    }
  }

  render() {
    if (isMobile()) {
      return <div />;
    }
    return (
      <div>
        <div ref={this.setMapDivRef} className="backgroundMapM" key="backgroundMapM" />
        <div
          ref={this.setTooltipDivRef}
          className="tooltipM hiddenM"
          dangerouslySetInnerHTML={{ __html: this.state.tooltipContainer }}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rankingKpiList: state.kpiReducer.rankingKpiList,
  selectedLanguage: state.coreReducer.selectedLanguage,
  countryList: state.countryReducer.countryList,
  statsSelectedCountries: state.coreReducer.statsSelectedCountries,
  currentMarkerScale: 0.8,
  rangeValue: state.uiReducer.rangeValue,
  rangeMinVal: state.uiReducer.rangeMinVal,
  rangeMaxVal: state.uiReducer.rangeMaxVal,
  rangeStepVal: state.uiReducer.rangeStepVal,
  mapMarkersForCompare: state.uiReducer.mapMarkersForCompare,
  selectedPanel: state.uiReducer.selectedPanel,
  countryKeyMap: state.countryReducer.countryKeyMap,
  selectedCountry: state.coreReducer.selectedCountry
});

const actions = {
  setSelectedCountryAction,
  setStatsSelectedCountriesAction,
  setRangeValueForMapAction,
  toggleStatsSelectedCountriesAction,
};

export default withRouter(connect(mapStateToProps, actions)(Map));
