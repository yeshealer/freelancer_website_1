import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-rangeslider';
import { getWidth, getHeight } from '../../../../mCommons/mUtils';

import * as countryData from '../../../../../public/assets/data/countriesData';

import {
  setRangeValueForMapAction,
  setMapMarkersAction,
} from '../../../../redux';

import './MapZoom.css';

class MapZoom extends Component {
  onZoomIn() {
    if (this.props.rangeValue <= 2) {
      const value = this.props.rangeValue + this.props.rangeStepVal;
      this.props.setRangeValueForMapAction(value);
      this.zoomChange(value);
    }
  }

  onZoomOut() {
    if (this.props.rangeValue >= 1) {
      const value = this.props.rangeValue - this.props.rangeStepVal;
      this.props.setRangeValueForMapAction(value);
      this.zoomChange(value);
    }
  }

  onChangeScale(value) {
    this.props.setRangeValueForMapAction(value);
    this.zoomChange(value);
  }

  zoomChange(zoomValue) {
    const width = getWidth();
    const height = getHeight();
    const mapCenter = [width / 2, height / 2];

    const scale = window.mapZoom.scale();
    const extent = window.mapZoom.scaleExtent();
    const translate = window.mapZoom.translate();

    let x = translate[0];
    let y = translate[1];
    let targetScale = zoomValue;
    let factor = targetScale / scale;

    const clampedTargetScale = Math.max(extent[0], Math.min(extent[1], targetScale));
    if (clampedTargetScale !== targetScale) {
      targetScale = clampedTargetScale;
      factor = targetScale / scale;
    }
    x = (x - mapCenter[0]) * factor + mapCenter[0];
    y = (y - mapCenter[1]) * factor + mapCenter[1];

    window.mapZoom.scale(targetScale).translate([x, y]);
    window.dataMapM.transition()
      .attr('transform', `translate(${window.mapZoom.translate().join(',')}) scale(${window.mapZoom.scale()})`);

    const markerScaleIndex = (Math.round(((zoomValue - this.props.rangeMinVal) / this.props.rangeStepVal) * 100) / 100);
    // this.redrawMarkers(markerScaleIndex);
  }

  redrawMarkers(scaleRatio) {
    const scaleMap = [
      0.8,
      0.7,
      0.6,
      0.55,
      0.45,
      0.45
    ];
    this.setState({ currentMarkerScale: scaleMap[scaleRatio] });
    this.removeAllMarkers();

    if (this.props.selectedCountry !== null) {
      this.addMarkerToMap(this.props.selectedCountry.countryCode, false, scaleMap[scaleRatio]);
    }
    if (this.props.statsSelectedCountries.length > 0) {
      this.props.statsSelectedCountries.forEach((x) => {
        this.addMarkerToMap(x, true, scaleMap[scaleRatio]);
      });
    }
  }

  removeAllMarkers() {
    const nodeList = document.querySelectorAll('.node');
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i] !== undefined) {
        nodeList[i].remove();
      }
    }

    this.setState({ mapMarkers: null, mapMarkersForCompare: [] });
  }

  addMarkerToMap(countryCode, isCompare = false) {
    if (countryCode !== null) {
      const scaleB = this.props.rangeValue;

      const coordinate = [parseFloat(countryData[countryCode].latitude), parseFloat(countryData[countryCode].longitude)];
      const posX = window.projection([coordinate[1], coordinate[0]])[0] - (15.5 * (1 / scaleB));
      const posY = window.projection([coordinate[1], coordinate[0]])[1] - (32.5 * (1 / scaleB));

      const markerNode = window.dataMapM
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${posX},${posY}) scale(${1 / scaleB})`);
      markerNode.append('path')
        .attr('d', 'M14.7,0C8.7,0,3.9,4.9,3.9,10.9c0,6,10.7,18.7,10.9,18.7c0,0,10.9-12.7,10.9-18.7C25.6,4.9,20.8,0,14.7,0zM14.8,15.3c-2.5,0-4.6-2-4.6-4.6c0,0,0,0,0,0c0-2.5,2.1-4.6,4.6-4.6c0,0,0,0,0,0c2.5,0,4.6,2,4.6,4.6c0,0,0,0,0,0C19.4,13.2,17.4,15.3,14.8,15.3L14.8,15.3z')
        .attr('fill', '#ffffff');

      this.removeAllMarkers();
      this.props.setMapMarkersAction(markerNode);

      window.dataMapM.append((() => markerNode.node()));
    }
  }

  render() {
    return (
      <div key="mapZoomBgAndButtons" className="mapZoomBgAndButtons">
        <img src="/assets/svg/add-white.svg" onClick={this.onZoomIn.bind(this)} width="20" />
        <div className='slider-vertical'>
          <Slider
            tooltip={false}
            min={this.props.rangeMinVal}
            max={this.props.rangeMaxVal}
            value={this.props.rangeValue}
            step={this.props.rangeStepVal}
            onChange={this.onChangeScale.bind(this)}
            orientation='vertical'
          />
        </div>
        <img src="/assets/svg/minus-white.svg" onClick={this.onZoomOut.bind(this)} width="20" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rangeMinVal: state.uiReducer.rangeMinVal,
  rangeMaxVal: state.uiReducer.rangeMaxVal,
  rangeStepVal: state.uiReducer.rangeStepVal,
  rangeValue: state.uiReducer.rangeValue,
  mapMarkersForCompare: state.uiReducer.mapMarkersForCompare,
  selectedCountry: state.coreReducer.selectedCountry,
  statsSelectedCountries: state.coreReducer.statsSelectedCountries
});

const actions = {
  setRangeValueForMapAction,
  setMapMarkersAction,
};

export default connect(mapStateToProps, actions)(MapZoom);
