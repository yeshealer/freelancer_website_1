// React
import React from 'react'
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import langUtils from '../../mCommons/mUtils/langUtils';
import countryCodes from '../../mCommons/json/countryCodes.json';
import numeral from "numeral";

import {
    togglePageDirAndLang,
    setPageDirAndLang,
    getWidth,
    getHeight,
    getColorByData,
    headerMenuComponent,
    headerMenuStaticComponent,
    colorData, isMobile, getColorByDataV2, headerMenuStaticComponentWithHref, generateMapTooltip, replaceColor,
    getMapColorByScore, lightenColor, isTablet
} from "../../mCommons/mUtils";
import {getCookie, createCookie} from "../../mCommons/mUtils/generalUtils";
import SDK from "../../mCommons/mSDK";

import * as d3 from "d3";
import {event as currentEvent} from 'd3';
import * as topojson from "topojson";
// import * as countryData from '../../../public/assets/data/countries.json';
import * as countryData from '../../../public/assets/data/countriesData.json';

import './style.css';
import './flexStyle.css';

import '../../mCommons/css/mIcons.css';
import '../../mCommons/css/mSelect.css';
import '../../mCommons/css/mCountry.css';
import '../../mCommons/css/mCircularProgressbar.css';

import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'


import mCountryDetailV2 from '../../mComponents/mWorldMap/mCountryDetailV2';
import mWorldRankingV2 from '../../mComponents/mWorldMap/mWorldRankingV2';
import mChooseKPIV2 from '../../mComponents/mWorldMap/mChooseKPIV2';
import mCompareV2 from '../../mComponents/mWorldMap/mCompareV2';

import mFullStats from '../../mComponents/mWorldMap/mFullStats';
import mCountryBenchmarkSelector from '../../mComponents/mWorldMap/mCountryBenchmarkSelector';
import mSelectCountries from '../../mComponents/mWorldMap/mSelectCountries';
import mGraphics from '../../mComponents/mWorldMap/mGraphics';
import mAbout from '../../mComponents/mWorldMap/mAbout';

import SideMenu_UNMODIFIED from './components/SideMenu/SideMenu';
import mYearSlider from '../../mComponents/mWorldMap/mYearSlider';
import mYearSliderRC, {arSliderMap} from '../../mComponents/mWorldMap/mYearSliderRC';
import mDeepDives from "../../mComponents/mWorldMap/mDeepDives";

import {
    getKpiScoreMapAction,
    getRankingKpiAction,
    getGroupsAction,
    getRealmListAction,
    getWholeRealmTreeAction,
 } from "../../redux";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

class WorldMap extends React.Component {
    centered;

    constructor(props) {
        super(props);

        this.lang = langUtils;
        if (this.lang.currentEnglish)
            setPageDirAndLang("ltr", "en");
        else
            setPageDirAndLang("rtl", "ar");

        let initCountryId = getCookie("countryId");
        // initCountryId = (initCountryId === null) ? [] : initCountryId;
        let initYear = getCookie("selectedYear");
        initYear = (initYear === null) ? "2009" : initYear;

        let isDesktopMode = !(isMobile());

        this.state = {
            tabIndex: 0,
            selectedGoal: [],
            Label: [],
            targetVisable: true,
            kpiClass: false,
            indicatorClass: false,
            selectedIndicatorLabel: null,
            selectedTargetLabel: null,
            selectedRealmLabel: null,

            desktopModeClass: ((isDesktopMode) ? " showModal desktopMode" : ""),
            indicatorSlider: ((isDesktopMode) ? " showModal desktopMode indicatorModal" : ""),
            showIndicators: false,
            isDesktopMode: isDesktopMode,

            countryIdMap: {},
            countries: [],

            deepDivesData: [],

            //
            selectedYearStart: null,
            selectedYearEnd: null,

            //
            selectedYear: initYear,
            selectedPillar: null,
            selectedSubPillar: null,
            selectedKPI: null,
            selectedKPIForModal: null,
            selectedCountry: ((initCountryId !== null && initCountryId !== "null") ? initCountryId : null),
            selectedCountries: ((initCountryId !== null && initCountryId !== "null") ? [initCountryId] : []),
            selectedGroup: null,
            selectedGroupName: "",

            //
            selectedPillarObj: {},
            selectedSubPillarObj: {},
            selectedKPIObj: {},
            selectedKPIForModalObj: {},
            selectedWorldRankingGroup: "1",
            selectedKpis: [],
            selectedIndicator: '',

            selectedGroupRankingData: [],

            //
            chooseKPISelectedPillar: null,

            //
            rankingData: [],
            scoreDataAllYears: null,
            groupListData: [],
            groupListDataMap: {},
            groupListUIdDataMap: {},

            //
            kpiValuesForStats: null,

            // Language Util
            lang: this.lang.getLang(),

            mobileMenuIsVisible: '',
            selectedModal: '',

              // (isDesktopMode) ? ((initCountryId !== null && initCountryId !== "null") ? 'countryDetails' : '') : 'countryDetails',
            selectedClosableModal: '',

            //
            statsSelectedCountriesColorMap: {},
            statsSelectedCountries: ((initCountryId !== null && initCountryId !== "null" && initCountryId !== "undefined" && initCountryId !== undefined) ? [initCountryId] : []),
            statsSelectedGroups: [],

            //
            countryListAlphabetic: [],
            countryListSearchIsActive: false,
            countryListSearchResultList: [],

            //
            pillarList: [],
            searchableKPIList: [],

            //
            loadingCounter: 1,

            //
            showNoResult: false,
            isSearchActive: false,
            searchKeywordForKPI: '',

            //IPH-388
            link: window.location.origin + '/?kpiId=',

            tooltipContainer: "",
            tooltipContainerLine: "",
            countryData: [],

            // CoordinateMap
            countryCoordinateMap: {},

            // Map Markers
            mapMarkers: null,
            mapMarkersForCompare: [],

            // Marker Scale
            currentMarkerScale: 0.8,
            rangeValue: 1,
            rangeMinVal: 1,
            rangeMaxVal: 2,
            rangeStepVal: 0.2,

            //
            mousePosition: {x: 0, y: 0},

            //
            isScrollEnabled: false,

            //
            showChooseKPIResult: false
        };

        this.mCountryDetailV2 = new mCountryDetailV2(this);
        this.mWorldRankingV2 = new mWorldRankingV2(this);
        this.mChooseKPIV2 = new mChooseKPIV2(this);
        this.mCompareV2 = new mCompareV2(this);

        //
        this.mFullStats = new mFullStats(this);
        this.mCountryBenchmarkSelector = new mCountryBenchmarkSelector(this);
        this.mSelectCountries = new mSelectCountries(this);
        this.mGraphics = new mGraphics(this);
        this.mAbout = new mAbout(this);
        this.mDeepDives = new mDeepDives(this);
    }

    setMouseListener() {
        let handler = (e) => {
            if (this.state.selectedClosableModal === "graphics") {
                e = e || window.event;
                let pageX = e.pageX;
                let pageY = e.pageY;
                // IE 8
                if (pageX === undefined) {
                    pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                this.setState({mousePosition: {x: pageX, y: pageY}});
            }
        };

        if (document.attachEvent)
            document.attachEvent('mousemove', handler.bind(this));
        else
            document.addEventListener('mousemove', handler.bind(this));
    }

    closeGraphAndStatsModalReturnFirstState() {
        this.setState({statsSelectedGroups: []});

        if (this.state.selectedCountry === null)
            return;

        this.addMarkerToMap(this.state.selectedCountry);
        this.setState({statsSelectedCountries: [this.state.selectedCountry]});
        this.reloadStatsColorMap([this.state.selectedCountry]);
    }

    onGroupsChanged(countriesM) {
        if (countriesM.length === 0) {
            this.setState({statsSelectedGroups: []});
            return;
        }
        let groupList = countriesM.split(",");
        if (groupList.length < 6) {
            this.setState({statsSelectedGroups: groupList});
        }
    }

    onCountriesChanged(countriesM) {
        this.removeAllMarkers();
        if (countriesM.length === 0) {
            this.setState({statsSelectedCountries: []});
            return;
        }

        let countryList = countriesM.split(",");
        if (countryList.length < 6) {
            this.setState({statsSelectedCountries: countryList});
            countryList.forEach((country) => {
                this.addMarkerToMap(country, true);
            });
        }

        this.reloadStatsColorMap(countryList);
    }

    reloadStatsColorMap(countryList = this.state.statsSelectedCountries) {
        let colorMap = {};

        countryList.forEach((x, i) => {
            if (x !== null) {
                let selectedCountryInfo = this.state.scoreDataAllYears[this.state.selectedYear]['areas'][x];
                colorMap[x] = getColorByDataV2(i, selectedCountryInfo.value);
            }
        });

        this.setState({ statsSelectedCountriesColorMap: colorMap });
    }

    clearAllCountries() {
        this.setState({statsSelectedCountries: []});
        this.removeAllMarkers();
    }

    clearAllGroups() {
        this.setState({statsSelectedGroups: []});
    }

    sliderYearsCallback(yearArray) {
        let selectedYearStart, selectedYearEnd;

        if(this.lang.currentEnglish){
            selectedYearStart = yearArray[0];
            selectedYearEnd = yearArray[1];
        }else{
            selectedYearEnd = arSliderMap[yearArray[0]];
            selectedYearStart = arSliderMap[yearArray[1]];
        }

        this.setState({
            selectedYearStart: selectedYearStart,
            selectedYearEnd: selectedYearEnd
        })
    }

    addSingleCountry(value) {
        let indexOf = this.state.statsSelectedCountries.indexOf(value);
        if (indexOf === -1) {
            if (this.state.statsSelectedCountries.length > 4) {
                setTimeout(() => {
                    this.setState({alertIsShow: true});
                }, 100);
                return;
            }

            let newStatesSelectedC = this.state.statsSelectedCountries;
            newStatesSelectedC.push(value);
            this.setState({statsSelectedCountries: newStatesSelectedC});
        }
    }

    reloadMap() {
        if (!this.state.isDesktopMode)
            return;

        let t = this;

        let rankingData = [];
        if (this.state.selectedModal === "worldRanking")
            rankingData = this.state.selectedGroupRankingData;
        else
            rankingData = this.state.rankingData;
        let mapForSelectedGroup = rankingData.map((x) => {
            return x.countryId;
        });

        window.dataMapM
            .selectAll("path")
            .data(this.state.countryData)
            .attr("d", window.dataPath)
            .attr("class", "mapFeatureM")
            .style("fill", function (d) {
                if (d['type'] === "Feature") {
                    let countryCode = t.iso3Toiso2(d.id);
                    let indexOfCountryCode = mapForSelectedGroup.indexOf(countryCode);
                    if (typeof countryCode !== "undefined" && indexOfCountryCode > -1) {

                        // let countryProp = this.state.selectedGroupRankingData.filter((x) => {
                        //     return x.countryId === countryCode;
                        // });

                        let countryProp = rankingData[indexOfCountryCode];
                        if (typeof countryProp !== "undefined") {
                            let value = countryProp.weightedScore;
                            return getMapColorByScore(value);
                        }
                    }
                }
                return "#8d8d8d";
            }.bind(this));
        // .style("fill-opacity", 0.8);
    }

    iso3Toiso2(code) {
        return countryCodes[code];
    }

    mapClickedV2(x, y) {
        let width = getWidth();
        let height = getHeight();

        let k = 1;

        window.dataMapM
            .transition()
            .duration(750)
            .attr("transform", "translate(" + (width - 450) / 2 + "," + height / 2.5 + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 0.5 / k + "px");
    }

    getFeature(countryCode) {
        let countryList = this.state.countryData;
        let countryObj = null;
        countryList.forEach((x) => {
            if (this.iso3Toiso2(x.id) === countryCode)
                countryObj = x;
        });

        return countryObj;
    }

    panToCountry(countryCode) {
        if (!this.state.isDesktopMode)
            return;
        let d = this.getFeature(countryCode);
        this.clicked(d);
    }

    clicked(d) {
        if (d === null)
            return;

        let width = getWidth();
        let height = getHeight();
        let extraGap = 0;

        if (!this.lang.currentEnglish)
            extraGap = 100;

        this.setState({rangeValue: 1});

        let bounds = window.dataPath.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = 1,
            translate = [(width / 2) - x + extraGap, height / 2 - scale * y];

        if (d.id === "USA") {
            if (!this.lang.currentEnglish)
                translate = [(width / 2) - (x / 2) + extraGap, height / 2 - scale * y]
        }

        window.svgMap.transition()
            .duration(600)
            .call(window.mapZoom.translate(translate).scale(scale).event);
    }

    loadCountryCoordinates() {
        let countryCoordinateMap = {};
        Object.keys(countryData).forEach((x) => {
            let countryInfo = countryData[x];
            if (countryInfo['latlng'] !== undefined)
                countryCoordinateMap[countryInfo['cca3']] = countryInfo['latlng'];
        });
        this.setState({countryCoordinateMap: countryCoordinateMap});
    }

    removeAllMarkers() {
        let nodeList = document.querySelectorAll(".node");
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i] !== undefined)
                nodeList[i].remove();
        }
        this.setState({mapMarkers: null, mapMarkersForCompare: []});
    }

    redrawMarkers(scaleRatio) {
        let scaleMap = [
            0.8,
            0.7,
            0.6,
            0.55,
            0.45,
            0.45
        ];
        this.setState({currentMarkerScale: scaleMap[scaleRatio]});
        this.removeAllMarkers();

        if (this.state.selectedCountry !== null)
            this.addMarkerToMap(this.state.selectedCountry, false, scaleMap[scaleRatio]);
        if (this.state.statsSelectedCountries.length > 0)
            this.state.statsSelectedCountries.forEach((x) => {
                this.addMarkerToMap(x, true, scaleMap[scaleRatio]);
            });
    }

    addMarkerToMap(countryCode, isCompare = false, scale = this.state.currentMarkerScale) {
        if (this.state.isDesktopMode && countryCode !== null) {

            let scaleB = this.state.rangeValue;

            let coordinate = [parseFloat(countryData[this.iso3Toiso2(countryCode)].latitude), parseFloat(countryData[this.iso3Toiso2(countryCode)].longitude)];
            let posX = window.projection([coordinate[1], coordinate[0]])[0] - (15.5 * (1 / scaleB));
            let posY = window.projection([coordinate[1], coordinate[0]])[1] - (32.5 * (1 / scaleB));

            let markerNode = window.dataMapM
                .append('g')
                .attr('class', 'node')
                .attr('transform', function (d) {
                    return 'translate(' + posX + ',' + posY + ') scale(' + (1 / scaleB) + ')';
                });
            markerNode.append('path')
                .attr('d', 'M14.7,0C8.7,0,3.9,4.9,3.9,10.9c0,6,10.7,18.7,10.9,18.7c0,0,10.9-12.7,10.9-18.7C25.6,4.9,20.8,0,14.7,0zM14.8,15.3c-2.5,0-4.6-2-4.6-4.6c0,0,0,0,0,0c0-2.5,2.1-4.6,4.6-4.6c0,0,0,0,0,0c2.5,0,4.6,2,4.6,4.6c0,0,0,0,0,0C19.4,13.2,17.4,15.3,14.8,15.3L14.8,15.3z')
                .attr('fill', '#ffffff');

            // this.mapClickedV2(posX, posY);

            if (isCompare) {
                this.setState({mapMarkersForCompare: [...this.state.mapMarkersForCompare, markerNode]});
            } else {
                this.removeAllMarkers();
                this.setState({mapMarkers: markerNode, mapMarkersForCompare: [markerNode]});
            }
            window.dataMapM.append((function () {
                return markerNode.node();
            }));
        }
    }

    onResizeChange() {
        this.reinitializeMap();
    }

    reinitializeMap() {
        if (window.svgMap !== undefined || window.svgMap !== null) {
            window.svgMap
                .attr("width", getWidth())
                .attr("height", getHeight());
        }
    }

    initializeMap(callbackFunction = () => {
    }) {
        if (!this.state.isDesktopMode)
            return;

        let mapDivM = this.refs.backgroundMapM;

        let width = getWidth(),
            height = getHeight();

        let mapCenter = [width / 2, height / 2];


        let projection = d3.geo
            .mercator()
            .translate([(width / 1.9), (height / 1.75)])
            .scale(width / 2.4 / Math.PI)
            .rotate([-11, 0]);

        window.projection = projection;

        let path = d3.geo.path()
            .projection(projection);

        window.dataPath = path;

        let svg = d3.select(mapDivM).append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("rect")
            .attr("class", "mapBackgroundM")
            .attr("width", width)
            .attr("height", height);

        window.svgMap = svg;

        let g = svg.append("g");
        g.style("stroke-width", "0.5px").style("stroke-opacity", "0.3");
        window.dataMapM = g;

        let tooltipContainerM = this.refs.tooltipContainerM;
        let tooltip = d3.select(tooltipContainerM);

        let t = this;

        let nodes;

        d3.json("/assets/data/world-simple.json", function (error, world) {
            if (error) throw error;

            let countries = topojson.feature(world, world.objects.world).features;
            this.setState({countryData: countries});

            let self = this;

            g.selectAll("path")
                .data(countries)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "mapFeatureM")
                .on("touchstart", (d) => {
                    console.log('touchstart');

                    const iso2 = d.id;

                    // let iso2 = t.iso3ToIso2(d.id);
                    if (iso2.toLowerCase() === 'il') {
                        return;
                    }
                    if (t.state.selectedModal === 'compare') {
                        t.addCountryToCompare(iso2);
                    } else {
                        t.setActiveModal('countryDetails');
                        t.onCountryChanged(iso2);
                    }
                    t.clicked(d);
                })
                .on("click", (d) => {
                    const iso2 = d.id

                    if (iso2.toLowerCase() === 'il') {
                        return;
                    }
                    if (t.state.selectedModal === 'compare') {
                        t.addCountryToCompare(iso2);
                    } else {
                        t.setActiveModal('countryDetails');

                        t.onCountryChanged(iso2);
                    }
                    t.clicked(d);
                })
                .on("mousemove", function (d) {
                    if (isTablet())
                        return;

                    let rankingData = [];
                    if (self.state.selectedModal === "worldRanking")
                        rankingData = self.state.selectedGroupRankingData;
                    else
                        rankingData = self.state.rankingData;
                    let countryProp = rankingData.filter((x) => {
                        return x.countryId === t.iso3Toiso2(d.id);
                    });
                    countryProp = countryProp[0];

                    if (self.state.scoreDataAllYears === null)
                        return;

                    let countryPropTooltip = self.state.scoreDataAllYears[self.state.selectedYear]['areas'][t.iso3Toiso2(d.id)];

                    if (!countryProp) {
                        countryProp = {weightedScore: -1};
                    }
                    if (countryProp !== undefined && countryPropTooltip !== undefined) {
                        if (countryProp.weightedScore == -1) {
                            this.setAttribute("style", "fill: #" + lightenColor("8d8d8d", 5));
                            self.setState({tooltipContainer: countryPropTooltip.tooltip.content});
                            let mouse = d3.mouse(svg.node()).map((d) => (parseInt(d, 10)));
                            tooltip.classed("hiddenM", false).attr("style", "left:" + (12 + mouse[0]) + "px; top:" + (12 + mouse[1]) + "px");
                        } else {
                            let selectedColor = getMapColorByScore(countryProp.weightedScore);
                            let tooltipContainer = "<div class=\"country-flag sprite sprite-"+countryProp['countryId']+"\"></div>" +
                                "<span class='countryHover'>"+countryProp['countryName']+"</span><br />" +
                                "<span class='scoreData' style='color:"+selectedColor+"'>"+numeral(countryPropTooltip.dataValue).format("0.0a")+" / "+ countryProp.denominator +"</span>";
                            self.setState({tooltipContainer: tooltipContainer});

                            let mouse = d3.mouse(svg.node()).map((d) => (parseInt(d, 10)));
                            tooltip.classed("hiddenM", false).attr("style", "left:" + (12 + mouse[0]) + "px; top:" + (12 + mouse[1]) + "px");
                            this.setAttribute("style", "fill: #" + lightenColor(selectedColor.toString().substring(1), 5));
                        }
                    }
                })
                .on("mouseout", function (d) {
                    if (isTablet())
                        return;

                    let rankingData = [];
                    if (self.state.selectedModal === "worldRanking")
                        rankingData = self.state.selectedGroupRankingData;
                    else
                        rankingData = self.state.rankingData;
                    let countryProp = rankingData.filter((x) => {
                        return x.countryId === t.iso3Toiso2(d.id);
                    });
                    countryProp = countryProp[0];

                    if (self.state.scoreDataAllYears === null)
                        return;

                    let countryPropTooltip = self.state.scoreDataAllYears[self.state.selectedYear]['areas'][t.iso3Toiso2(d.id)];

                    if (!countryProp) {
                        countryProp = {weightedScore: -1};
                    }

                    if (countryProp !== undefined && countryPropTooltip !== undefined) {
                        if (countryProp.weightedScore == -1) {
                            this.setAttribute("style", "fill: #8d8d8d");
                        } else {
                            let selectedColor = getMapColorByScore(countryProp.weightedScore);
                            this.setAttribute("style", "fill: " + selectedColor);
                        }
                    }
                    tooltip.classed("hiddenM", true);
                });

            g.append("path")
                .datum(topojson.mesh(world, world.objects.world, function (a, b) {
                    return a !== b;
                }))
                .attr("class", "mapMeshM")
                .attr("d", path);

            let zoom = d3.behavior.zoom()
                .scaleExtent([t.state.rangeMinVal, t.state.rangeMaxVal])
                .on("zoom", function () {
                    g.style("stroke-width", 0.5 / currentEvent.scale + "px");
                    g.attr("transform", "translate(" + currentEvent.translate + ")scale(" + currentEvent.scale + ")");

                    // if (currentEvent.scale !== t.state.rangeValue) {
                    //     let calculatedScale = currentEvent.scale - (currentEvent.scale % t.state.rangeStepVal);
                    //     let markerScaleIndex = parseInt(((calculatedScale - t.state.rangeMinVal) / t.state.rangeStepVal), 10);
                    //     t.redrawMarkers(markerScaleIndex);
                    //
                    //     let roundedRange = Math.round((currentEvent.scale) * 100) / 100;
                    //     t.setState({rangeValue: roundedRange});
                    // }
                    // g.attr('transform', 'translate(' + currentEvent.translate.join(',') + ') scale(' + currentEvent.scale + ')');
                });

            window.mapZoom = zoom;

            svg
                .call(zoom)
                .call(zoom.event)
                .on("wheel.zoom", null);

            // d3.select('#mapZoomRange').on("change", function () {
            //     t.zoomChange(this.value);
            // });

            if (this.state.selectedCountry !== null) {
                this.addMarkerToMap(this.state.selectedCountry);
                // t.panToCountry(this.state.selectedCountry);
            }

            callbackFunction();
        }.bind(this));
    }

    zoomChange(zoomValue) {
        let width = getWidth(),
            height = getHeight();
        let mapCenter = [width / 2, height / 2];

        let scale = window.mapZoom.scale(),
            extent = window.mapZoom.scaleExtent(),
            translate = window.mapZoom.translate();

        let x = translate[0], y = translate[1];
        let target_scale = zoomValue;
        let factor = target_scale / scale;

        let clamped_target_scale = Math.max(extent[0], Math.min(extent[1], target_scale));
        if (clamped_target_scale != target_scale) {
            target_scale = clamped_target_scale;
            factor = target_scale / scale;
        }
        x = (x - mapCenter[0]) * factor + mapCenter[0];
        y = (y - mapCenter[1]) * factor + mapCenter[1];


        window.mapZoom.scale(target_scale).translate([x, y]);
        window.dataMapM.transition()
            .attr("transform", "translate(" + window.mapZoom.translate().join(",") + ") scale(" + window.mapZoom.scale() + ")");
        //g.selectAll("path")
        //    .attr("d", path.projection(projection));

        let markerScaleIndex = (Math.round(((zoomValue - this.state.rangeMinVal) / this.state.rangeStepVal) * 100) / 100);
        this.redrawMarkers(markerScaleIndex);


        //g.selectAll(".node")
        // .transition()
        //.attr("transform", "translate(" + zoom.translate().join(",") + ") scale(" + 0.5 + ")");
        //.attr("transform", "scale(" + 0.5 + ")");
    }

    _e(objData, val) {
        if (objData === undefined || objData === null)
            return "";
        return (objData[val] !== undefined) ? objData[val] : "";
        // if(this.lang.currentEnglish)
        //     return (objData[val] !== undefined) ? objData[val]: "";
        // else
        //     return (objData[val + "OtherLang"] !== undefined) ? objData[val + "OtherLang"]: "";
    }

    groupUIDToID(groupList) {
        let ids = [];
        groupList.forEach((x) => {
            let id = this.state.groupListUIdDataMap[x]['groupId'];
            ids.push(id);
        });

        return ids;
    }

    resetSelectedGroupAndCountry() {
        this.setState({statsSelectedGroups: [], statsSelectedCountries: []});
    }

    setActiveClosableModal(modalId) {
        // this.toggleMobileMenuM();
        this.hideMobileMenuM();
        this.setState({selectedClosableModal: modalId});

        if (isMobile()) {
            if (modalId === "graphics") {
                this.setState({isScrollEnabled: true});
            } else {
                this.setState({isScrollEnabled: true});
            }
        }

    }

    setActiveModal(modalId) {
        // this.toggleMobileMenuM();
        this.hideMobileMenuM();
        console.log(this.state.groupListDataMap);
        console.log(this.state.selectedGroup);



        let p1 = new Promise(resolve => {
            if (this.state.selectedModal === "worldRanking") {
                this.setState({selectedGroup: 1, selectedGroupName: this.state.groupListDataMap[this.state.selectedGroup] });
                this.mWorldRankingV2.load_WorldRankingData('1', this.state.selectedYear, this.state.selectedKPI, resolve);
            } else {
                resolve();
            }
        }).then(() => {
            if (this.state.isDesktopMode)
                this.setState({selectedModal: modalId, desktopModeClass: " showModal desktopMode"});
            else
                this.setState({selectedModal: modalId, desktopModeClass: " showModal"});
        }).then(() => {
            // this.addMarkerToMap(this.state.selectedCountry);
            if (this.state.isDesktopMode) {
                if (modalId === "compare") {
                    if (this.state.selectedCountry === null)
                        this.removeAllMarkers();
                    else
                        this.addCountryToCompare(this.state.selectedCountry);
                } else {
                    this.resetSelectedGroupAndCountry();
                    if (this.state.selectedCountry === null)
                        this.removeAllMarkers();
                    else
                        this.addMarkerToMap(this.state.selectedCountry);
                }

                if (modalId === "countryDetails") {
                    if (this.state.selectedCountry !== null) {
                        this.setState({statsSelectedCountries: [this.state.selectedCountry]});
                        this.reloadStatsColorMap([this.state.selectedCountry]);
                    }
                }

                if (modalId === "") {
                    createCookie("countryId", "", 7);
                    this.setState({statsSelectedCountries: [], selectedCountry: null, selectedCountries: []});
                    this.removeAllMarkers();
                }
            }
        });

    }

    setSelectedPillarSubPillarKPIObjects(pillarId, subPillarId, kpiId, pillarList = this.state.pillarList, callbackFunction = () => {
    }) {
        this.setState({
            selectedPillar: pillarId,
            selectedSubPillar: subPillarId,
            selectedKPI: kpiId,
            selectedKPIForModal: kpiId,
            chooseKPISelectedPillar: pillarId
        });

        let listS = JSON.parse(JSON.stringify(pillarList));
        let selectedPillar = listS.filter((x) => (x.pillarId === pillarId))[0];
        let selectedSubPillar = selectedPillar.subTopicList.filter((x) => (x.subTopicId === subPillarId))[0];
        let selectedKPI = selectedSubPillar.kpiList.filter((x) => (x.id === kpiId))[0];

        this.setState({selectedKPIObj: selectedKPI, selectedKPIForModalObj: selectedKPI});
        delete selectedSubPillar.kpiList;

        this.setState({selectedSubPillarObj: selectedSubPillar});
        delete selectedPillar.subTopicList;

        this.setState({selectedPillarObj: selectedPillar}, callbackFunction);
    }

    setPillarSubPillar(kpi, pillarList) {
        let initPillarSubPillar = [];
        pillarList.forEach((x) => {
            x.subTopicList.forEach((y) => {
                y.kpiList.forEach((z) => {
                    if (z.id === kpi) {
                        initPillarSubPillar = [y.subTopicId, y.pillarId];
                    }
                });
            });
        });

        return initPillarSubPillar;
    }

    setSearchableKPIList(pillarList) {
        let listM = [];
        pillarList.forEach((x) => {
            let kpiListM = [];

            x.subTopicList.forEach((y) => {

                y.kpiList.forEach((z) => {
                    z.subPillarId = y.subTopicId;
                });

                kpiListM = kpiListM.concat(y.kpiList);
            });

            listM.push(
                {
                    pillarId: x.pillarId,
                    pillarName: x.pillarName,
                    pillarNameOtherLang: x.pillarNameOtherLang,
                    kpiList: kpiListM
                }
            );
        });

        this.setState({searchableKPIList: listM});
    }

    searchOnKPIList(value) {
        let listS = JSON.parse(JSON.stringify(this.state.searchableKPIList));
        return listS.filter((x) => {
            x.kpiList = x.kpiList.slice(0).filter((y) => {
                return y.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
                // return y.name.toLowerCase().includes(value.toLowerCase());
            });
            return (x.kpiList.length > 0);
        });
    }

    searchOnCountryList(value) {
        let listS = JSON.parse(JSON.stringify(this.state.countryListAlphabetic));
        return listS.filter((x) => {
            x.countriesList = x.countriesList.slice(0).filter((y) => {
                // if(this.lang.currentEnglish)
                return y.countryName.toLowerCase().indexOf(value.toLowerCase()) > -1;
                // else
                //     return y.countryNameOtherLang.indexOf(value);
            });
            return (x.countriesList.length > 0);
        });
    }

    // Country Event
    onCountryChanged(country) {
        if (country !== null) {
            this.addMarkerToMap(country);
            const iso2 = this.iso3Toiso2(country);
            this.setState({
                selectedCountry: country,
                selectedCountrySprite: iso2,
                statsSelectedCountries: [country],
            });

            // Set Cookie
            createCookie("countryId", country, 7);
        }
    }

    addCountryToCompare(countryCode) {
        if (countryCode === null)
            return;

        if (this.state.statsSelectedCountries.indexOf(countryCode) <= -1 && this.state.statsSelectedCountries.length < 5) {
            let countryList = this.state.statsSelectedCountries;
            countryList.push(countryCode);
            this.setState({statsSelectedCountries: countryList});
            this.addMarkerToMap(countryCode, true);
        }
        this.reloadStatsColorMap();
    }

    // Year Event
    onYearChanged(year) {
        this.setState({
            selectedYear: year,
            selectedYearStart: (parseInt(year) * 10) - 5,
            selectedYearEnd: (parseInt(year) * 10) + 5
        });

        // Set Cookie
        createCookie("selectedYear", year, 7);

        // Notify modal components when year is changed
        this.mWorldRankingV2.onYearChanged(year);

        console.log("onYearChanged", this.state.selectedKPI, year);
        const { getRankingKpiAction } = this.props;

        getRankingKpiAction(this.state.selectedKPI, this.state.selectedYear, this.state.selectedGroup).then((response) => {
            this.setState({rankingData: response.rankingKpiList, selectedGroupRankingData: response.rankingKpiList});
        }, () => {

        });

        // SDK.getRankingByKPIAndYearAndCountryGroup(
        //     this.state.selectedKPI,
        //     year,
        //     1,
        //     (statusCode, response) => {

        //         this.setState({rankingData: response});
        //         this.reloadMap();
        //     },
        //     () => {
        //         if (this.state.selectedKPI !== null) {
        //             SDK.getRankingByKPIAndYearAndCountryGroup(
        //                 this.state.selectedKPI,
        //                 year,
        //                 1,
        //                 (statusCode, response) => {
        //                     this.setState({rankingData: response});
        //                 },
        //                 () => {

        //                 }
        //             );
        //         }
        //     });

        // SDK.locale = (this.lang.currentEnglish) ? "en" : "ar";
        SDK.getKPIValues(this.state.selectedPillar, year, (statusCode, response) => {
                this.setState({kpiValuesForStats: response});
            },
            () => {

            }
        );
        // SDK.locale = "en";
    }

    // KPI Event
    onKPIChanged(pillarId, subPillarId, kpiId) {
        this.resetSelectedGroupAndCountry();
        // this.setState({selectedKPI: kpiId});

        this.setSelectedPillarSubPillarKPIObjects(pillarId, subPillarId, kpiId);

        // Set Cookie
        createCookie("kpiId", kpiId, 7);
        createCookie("subPillarId", subPillarId, 7);
        createCookie("pillarId", pillarId, 7);

        // Notify modal components when KPI is changed
        console.log("Error Line - onKPIChanged: ", this.state.selectedGroup, this.state.selectedYear, kpiId);
        this.mWorldRankingV2.load_WorldRankingData(this.state.selectedGroup, this.state.selectedYear, kpiId);

        SDK.getKPIScoreMapForAllCountriesAndYears(
            kpiId,
            (statusCode, response) => {
                this.setState({scoreDataAllYears: response});
                this.selectLastFilledYear(response);
            },
            () => {

            }
        );
        const { getRankingKpiAction } = this.props;
        getRankingKpiAction(this.state.selectedKPI, this.state.selectedYear, this.state.selectedGroup).then((response) => {
            this.setState({rankingData: response.rankingKpiList, selectedGroupRankingData: response.rankingKpiList});
        }, () => {

        });

        // SDK.getRankingByKPIAndYearAndCountryGroup(
        //     kpiId,
        //     this.state.selectedYear,
        //     1,
        //     (statusCode, response) => {
        //         this.setState({rankingData: response});
        //         this.reloadMap();
        //     },
        //     () => {

        //     }
        // );

        // SDK.locale = (this.lang.currentEnglish) ? "en" : "ar";
        SDK.getKPIValues(pillarId, this.state.selectedYear, (statusCode, response) => {
                this.setState({kpiValuesForStats: response});
            },
            () => {

            }
        );
        // SDK.locale = "en";
    }

    getDenominatorName() {
        return this.state.selectedKPIObj.denominator;
    }

    getPillarKPIBreadcrumb() {
        if (this.state.selectedTargetLabel === null || this.state.selectedIndicatorLabel === null)
            return;
        if (this.state.selectedTargetLabel && !this.state.selectedIndicatorLabel)
            return this.state.selectedTargetLabel;
        else
            return this.state.selectedTargetLabel + " > " + this.state.selectedIndicatorLabel;
    }

    getKPIName() {
        if (this.state.selectedKPI === null)
            return "";
        return this.state.selectedKPIObj.name;
    }

    getPillarName() {
        if (this.state.selectedPillar === null)
            return "";
        return this.state.selectedPillarObj.pillarName;
    }

    toggleLanguage(targetLang) {
        if (targetLang === undefined) {
            togglePageDirAndLang();
            this.lang.changeLang();
            this.setState({lang: this.lang.getLang()});
            this.initLoad();
            if (this.state.mobileMenuIsVisible === 'hideM') {
                this.setState({mobileMenuIsVisible: ''});
            }
        } else {
            if (this.lang.currentEnglish && targetLang === "ar") {
                this.toggleLanguage();
            } else if (!this.lang.currentEnglish && targetLang === "en") {
                this.toggleLanguage();
            }
        }

    }

    hideMobileMenuM() {
        if (this.state.mobileMenuIsVisible === 'showM')
            this.setState({mobileMenuIsVisible: 'hideM'});
    }

    toggleMobileMenuM() {
        // if (!this.state.isDesktopMode) {
        if (this.state.mobileMenuIsVisible === 'showM') {
            this.hideMobileMenuM();
        } else {
            this.setState({mobileMenuIsVisible: 'showM'});
        }
        // }
    }

    componentDidUpdate() {
        setTimeout(() => {
            let timeLineElement = document.getElementById("timeLineM");
            let activeMenu = document.getElementById("activeMenu");
            if (timeLineElement !== null) {
                if (this.lang.currentEnglish) {
                    timeLineElement.scrollLeft = activeMenu.offsetLeft - (getWidth() / 2);
                } else {
                    if (/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent)) {
                        let elementScrollEqForMobile = (x) => (75.667 * x - 803.22);
                        timeLineElement.scrollLeft = elementScrollEqForMobile((2018 - parseInt(this.state.selectedYear, 10)));
                    } else {
                        let initScrollEq = (-0.5416 * getWidth()) + 337.88;
                        let elementScrollEq = (x) => ((-0.0312 * x) + 68.567);
                        timeLineElement.scrollLeft = (initScrollEq + (elementScrollEq(getWidth()) * (2018 - parseInt(this.state.selectedYear, 10))));
                    }
                }
            }
        }, 100);

        if (this.state.selectedClosableModal === "fullStats")
            return this.mFullStats.didUpdated();

        if (this.state.selectedModal === "countryDetails")
            return this.mCountryDetailV2.didUpdated();

        if (this.state.selectedModal === "worldRanking")
            return this.mWorldRankingV2.didUpdated();

        if (this.state.selectedModal === "chooseKPI")
            return this.mChooseKPIV2.didUpdated();

        if (this.state.selectedModal === "compare")
            return this.mCompareV2.didUpdated();
    }

    setPillarStuffByLang(lang, initKPIId, callbackFunction = () => {
    }) {
        // SDK.locale = lang;
        SDK.getPillarList((statusCode, response) => {
            this.setState({pillarList: response});

            this.setSearchableKPIList(response);
            let pillarSubpillar = this.setPillarSubPillar(initKPIId, response);

            if (pillarSubpillar.length > 0) {
                SDK.getKPIValues(pillarSubpillar[1], this.state.selectedYear, (statusCode, response) => {
                        this.setState({kpiValuesForStats: response});
                    },
                    () => {

                    }
                );

                if (pillarSubpillar[0] !== null && pillarSubpillar[1] !== null && initKPIId !== null)
                    this.setSelectedPillarSubPillarKPIObjects(pillarSubpillar[1], pillarSubpillar[0], initKPIId, response, callbackFunction);
                else
                    callbackFunction();
            } else {
                callbackFunction();
            }
        }, () => {
            callbackFunction();
        });
        // SDK.locale = "en";
    }

    setGroupStuffByLang() {
        // SDK.locale = (this.lang.currentEnglish) ? "en" : "ar";

        SDK.getGroupList((statusCode, response) => {
            let groupListIdMap = {};
            let groupListUIdMap = {};

            this.setState({
                selectedGroup: 'GLO',
            })

            response.forEach((x) => {
                groupListIdMap[x.groupId] = x;
                groupListUIdMap[x.groupUid] = x;
            });

            this.setState({
                groupListData: response,
                groupListDataMap: groupListIdMap,
                groupListUIdDataMap: groupListUIdMap,
                selectedGroupName: groupListIdMap[this.state.selectedGroup],
            });

            console.log(groupListIdMap);
        }, () => {

        });
        // SDK.locale = "en";
    }

    selectLastFilledYear(response) {
        let objKeys = Object.keys(response).reverse();
        let lastData = 0;
        let lastYear = 0;
        for (let key of objKeys) {
            let responseData = response[key];
            if (responseData.hasOwnProperty('areas')) {
                let countryData = responseData['areas'];
                let dataBiggerThanZero = Object.values(countryData).filter(function (x) {
                    return x.dataValue > 0;
                });
                if (dataBiggerThanZero.length > lastData) {
                    // console.log(dataBiggerThanZero.length, key);
                    if (lastData === 0 && dataBiggerThanZero.length > 0) {
                        lastData = dataBiggerThanZero.length;
                        lastYear = key;
                    }
                }
            }
        }
        this.onYearChanged(lastYear);
    }

    initLoad(initLang, initKpi, initCountry, initYear) {
        const {getKpiScoreMapAction, getRankingKpiAction, getGroupsAction, kpiObj} = this.props;

        console.log("initLang.................", initLang);
        if (initLang === undefined)
            SDK.locale = (this.lang.currentEnglish) ? "en" : "ar";
        else
            SDK.locale = initLang;

        // let initPillarId = getCookie("pillarId");
        // let initSubPillarId = getCookie("subPillarId");
        let initKPIId;
        if (initKpi === undefined) {
            initKPIId = 5;//getCookie("kpiId");
        } else
            initKPIId = initKpi;

        // DANGER!!! UGLY CODE
        // - - - -
        // - - - -

        let p1 = new Promise((resolve, reject) => {
            console.log("Promise 1 ... " + initKPIId);
            this.setState({selectedKPI: initKPIId}, resolve);
        }).then(value => {
            console.log("Error line - initLoad:", initKpi, initKPIId);
            console.log("initLoad - initCountry: ", initCountry);

            if (initCountry !== undefined) {
                this.onCountryChanged(initCountry);
            }

            // initPillarId = (initPillarId === null) ? null : parseInt(initPillarId, 10);
            // initSubPillarId = (initSubPillarId === null) ? null : parseInt(initSubPillarId, 10);
            initKPIId = (initKPIId === null) ? null : parseInt(initKPIId, 10);

            //IPH-388
            // this.setState({link:window.location.origin + '/?kpiId=' + initKPIId + ',countryId=' + this.state.selectedCountry});

            SDK.showLoading = () => {
                this.showLoading();
            };

            SDK.hideLoading = () => {
                this.hideLoading();
            };

            SDK.getCountryAlphaList((statusCode, response) => {
                this.setState({countryListAlphabetic: response});
            }, () => {

            });

        }).then(value => {
            // DANGER!!! UGLY CODE
            // - - - -
            // - - - -
            let p2 = new Promise((resolve, reject) => {
                console.log("Promise 2 ... " + initKPIId);
                this.setPillarStuffByLang((this.lang.currentEnglish) ? "en" : "ar", initKPIId, resolve);
            }).then(async (value) => {

                if (initKPIId !== null) {

                    getKpiScoreMapAction(initKPIId).then((response) => {
                            this.setState({scoreDataAllYears: response.kpiScoreMap});
                            //IPH-385
                            //process the years data for the latest here
                            if (initYear === undefined) {
                                this.selectLastFilledYear(response.kpiScoreMap);
                                // let objKeys = Object.keys(response).reverse();
                                // let lastData = 0;
                                // let lastYear = 0;
                                // for (let key of objKeys) {
                                //     let responseData = response[key];
                                //     if (responseData.hasOwnProperty('areas')) {
                                //         let countryData = responseData['areas'];
                                //         let dataBiggerThanZero = Object.values(countryData).filter(function (x) {
                                //             return x.dataValue > 0;
                                //         });
                                //         if (dataBiggerThanZero.length > lastData) {
                                //             // console.log(dataBiggerThanZero.length, key);
                                //             if (lastData === 0 && dataBiggerThanZero.length > 0) {
                                //                 lastData = dataBiggerThanZero.length;
                                //                 lastYear = key;
                                //             }
                                //         }
                                //     }
                                // }
                                // this.onYearChanged(lastYear);


                            } else {
                                this.onYearChanged(initYear);
                            }

                        },
                        () => {

                        }
                    ).catch((err) => {
                        console.log(err);

                        console.log("Error on getKpiScoreMapAction");
                    });

                    const countryGroups = await getGroupsAction();

                    if (!this.state.selectedGroup) {
                        this.setState({ selectedGroup: 'GLO'});
                    }


                    getRankingKpiAction(this.state.selectedKPI, this.state.selectedYear, this.state.selectedGroup).then((response) => {
                        this.setState({rankingData: response.rankingKpiList, selectedGroupRankingData: response.rankingKpiList});
                    }, () => {

                    });

                    // SDK.getRankingByKPIAndYearAndCountryGroup(
                    //     initKPIId,
                    //     this.state.selectedYear,
                    //     this.state.selectedGroup,
                    //     (statusCode, response) => {
                    //         this.setState({rankingData: response, selectedGroupRankingData: response});

                    //         // this.reloadMap();
                    //     },
                    //     () => {

                    //     }
                    // );

                }

                SDK.getCountryList((statusCode, response) => {
                    let countryIdMap = {};

                    response.forEach((x) => {
                        countryIdMap[x.countryId] = x;
                    });

                    this.setState({countries: response, countryIdMap: countryIdMap});
                }, () => {

                });

                this.setGroupStuffByLang();

                // SDK.getDeepDives((statusCode, response) => {
                //     this.setState({deepDivesData: response});
                // }, () => {
                // });
            });


        });


    }

    componentDidMount() {

        // this.loadCountryCoordinates();
        this.setMouseListener();
        let initLang = undefined;
        let initKpi = undefined;
        let initCountry = undefined;
        let initYear = undefined;

        const { getRealmListAction, getWholeRealmTreeAction } = this.props;

        getRealmListAction().then(() => {}).catch((err) => {
            console.log(err);
        })

        getWholeRealmTreeAction().then(() => {}).catch((err) => {
            console.log(err);
        })

        if (this.props.match.params.pageId !== undefined) {
            let params = this.props.location.state;

            // props.location.state.language

            if (this.props.match.params.pageId === "detail") {
                this.setState({
                    selectedModal: "countryDetails",
                    selectedClosableModal: params.modal,
                    scoreDataAllYears: params.scoreDataAllYears,
                    selectedYearStart: params.selectedYearStart,
                    selectedYearEnd: params.selectedYearEnd
                });
                initLang = params.lang;
                initKpi = params.kpiId;
                initCountry = params.countryId;
                initYear = params.year;
            } else if (this.props.match.params.pageId === "ranking") {
                this.setState({selectedModal: "worldRanking"});
            }
        }

        console.log("componentDidMount....", initLang, this.props.location.state);

        let stateSet = {};
        if (initKpi !== undefined || initKpi !== null)
            stateSet = {initKpi: initKpi};

        this.initializeMap(() => {
            if (initCountry === undefined) {
                if (this.state.selectedCountry !== null && this.state.selectedCountry !== undefined)
                    this.panToCountry(this.state.selectedCountry);
            } else
                this.panToCountry(initCountry);

            this.initLoad(initLang, initKpi, initCountry, initYear);
            if (initLang !== undefined)
                this.toggleLanguage(initLang);

            if (getWidth() < 992) {
                this.onChangeScale(2);
            }

            setTimeout(() => {
                this.setState({loadingCounter: this.state.loadingCounter - 1});
            }, 100);
        });

        if (!this.state.isDesktopMode) {
            this.initLoad(initLang, initKpi, initCountry, initYear);
            if (initLang !== undefined)
                this.toggleLanguage(initLang);

            setTimeout(() => {
                this.setState({loadingCounter: this.state.loadingCounter - 1});
            }, 100);
        }
        // this.reloadMapData(1, this.state.selectedYear);
        window.addEventListener("resize", this.onResizeChange.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeChange.bind(this));
    }


    showLoading() {
        setTimeout(() => {
            this.setState({loadingCounter: this.state.loadingCounter + 1});
        }, 50);
    }

    hideLoading() {
        setTimeout(() => {
            this.setState({loadingCounter: this.state.loadingCounter - 1});
        }, 50);
    }

    closeDesktopModal(callbackFunction = () => {
    }) {
        let p1 = new Promise((resolve, reject) => {
            this.setState({desktopModeClass: " hideModal desktopMode"}, resolve);
        }).then(() => {
            this.setActiveModal("");
        }).then(() => {
            callbackFunction();
        });
    }

    closeDesktopModalButton(callbackFunction = () => {
    }) {
        if (!this.state.isDesktopMode)
            return;

        return (
            <i className="exit-img-icon-desktop" onClick={this.closeDesktopModal.bind(this, callbackFunction)}/>
        )
    }

    printLoadingOverlay() {
        if (this.state.loadingCounter === 0)
            return;

        return (
            <div className={"loadingOverlayM " + ((this.state.isDesktopMode) ? "" : "mobileModeOverlay")}>

                <div className="loadingContentWrapper">
                    <img src="/assets/images/loadingCells1.gif" alt="Loading"/>
                    <div className="loadingContentM">
                        {/* <div className="loadingTitleM">{this.state.lang.loading_title}</div> */}
                        <div className="loadingMessageM">{this.state.lang.loading_message}</div>
                    </div>
                </div>

            </div>
        );
    }

    printDesktopHeader() {
        if (this.state.isDesktopMode) {
            let countryName = this.state.lang.select_countries;
            if (this.state.selectedCountry !== null && this.state.countryIdMap[this.state.selectedCountry] !== undefined)
                countryName = this.state.countryIdMap[this.state.selectedCountry]['countryName'];
            let hamburgerMenu;
            if (this.state.selectedModal === "")
                hamburgerMenu = (
                    <div className="hamburgerMenuM">
                        <div className="menu-icon"
                             onClick={this.toggleMobileMenuM.bind(this)}
                        />
                    </div>
                );


            let mailto = "mailto:info@iph.sa?subject=" + this.state.lang.share_mail_subject.replaceArray(
                [":countryName"],
                [countryName]
            );

            return (
                <div className="mapHeaderM">

                    <div className="logoM">
                        <Link to="/">
                            <img src={this.state.lang.logo_home} alt="Logo"/>
                        </Link>
                    </div>

                    <div className="menuM">
                        {headerMenuComponent(this.state.lang.choose_kpi_title, this.getPillarKPIBreadcrumb(), "kpi-icon", 'chooseKPI', this.setActiveModal.bind(this), this.state.selectedModal, () => {
                        }, "maxWidth240")}
                        {headerMenuComponent(this.state.lang.world_ranking_title, this.state.lang.countries, "ranking-img-icon", 'worldRanking', this.setActiveModal.bind(this), this.state.selectedModal, () => {
                        })}
                        {headerMenuComponent(this.state.lang.compare_title, this.state.lang.menu_multiple_countries, "compare-img-icon", 'compare', this.setActiveModal.bind(this), this.state.selectedModal, () => {
                        })}
                        {headerMenuComponent(this.state.lang.search_country_title, countryName, "search-img-icon", 'countryDetails', this.setActiveModal.bind(this), this.state.selectedModal, () => {
                        })}
                    </div>

                    <div className="menuM staticMenu">
                        <div className="secondMenu">
                            {/*{headerMenuStaticComponent(this.state.lang.deep_dives, "deep-dive-icon", () => {*/}
                            {/*this.setState({selectedClosableModal: "deepDives"});*/}
                            {/*}, "iconMenuItem")}*/}

                            {headerMenuStaticComponentWithHref(this.state.lang.contact, "mail-icon-24", mailto, "iconMenuItem")}

                            {headerMenuStaticComponent(this.state.lang.about, "about-img-icon", () => {
                                this.setState({selectedClosableModal: "about"});
                            }, "iconMenuItem")}

                            {headerMenuStaticComponent(this.state.lang.lang, "", () => {
                                this.toggleLanguage();
                            }, "langTextFontM")}
                        </div>
                    </div>
                    {hamburgerMenu}
                </div>
            );
        } else
            return;
    }

    onChangeScale(value) {
        this.setState({rangeValue: value});
        this.zoomChange(value);
    }

    onZoomIn() {
        if (this.state.rangeValue <= 2) {
            let value = this.state.rangeValue + this.state.rangeStepVal;
            this.setState({rangeValue: value});
            this.zoomChange(value);
        }
    }

    onZoomOut() {
        if (this.state.rangeValue >= 1) {
            let value = this.state.rangeValue - this.state.rangeStepVal;
            this.setState({rangeValue: value});
            this.zoomChange(value);
        }
    }

    render() {
        // console.log(this.state.selectedGroupRankingData);


        // if(this.state.loadingCounter > 0)
        //     return (
        //         <div>
        //             {this.printLoadingOverlay()}
        //         </div>
        //     );
        // else
        return (
            <div className="worldMapWrapperM">

                {this.printLoadingOverlay()}

                {(() => {
                    if (!this.state.isDesktopMode) {

                        if (this.state.selectedClosableModal !== "graphics") {
                            return (
                                <style
                                    dangerouslySetInnerHTML={{__html: `body {position: fixed; overflow: hidden; width: 100%; height: 100%;}`}}/>
                            );
                        }
                    } else {
                        return [
                            <style
                                dangerouslySetInnerHTML={{__html: `body {overflow: hidden;}`}}/>,
                            // <div className="betaBadge"/>
                        ];
                    }
                })()}

                {(() => {

                    if (this.state.isDesktopMode && this.state.selectedClosableModal == "" && this.state.selectedModal == "")

                        return [
                            <div key="mapZoomBgAndButtons" className="mapZoomBgAndButtons">
                                <img src="/assets/svg/add-white.svg" onClick={this.onZoomIn.bind(this)} width="20"/>
                                <div className='slider-vertical'>
                                    <Slider
                                        tooltip={false}
                                        min={this.state.rangeMinVal}
                                        max={this.state.rangeMaxVal}
                                        value={this.state.rangeValue}
                                        step={this.state.rangeStepVal}
                                        onChange={this.onChangeScale.bind(this)}
                                        orientation='vertical'
                                    />
                                </div>
                                <img src="/assets/svg/minus-white.svg" onClick={this.onZoomOut.bind(this)} width="20"/>
                            </div>
                        ];
                })()}

                <div ref="backgroundMapM" className="backgroundMapM"/>
                <div ref="tooltipContainerM"
                     className="tooltipM hiddenM" dangerouslySetInnerHTML={{__html: this.state.tooltipContainer}}/>
                <div className="lineTooltip" dangerouslySetInnerHTML={{__html: this.state.tooltipContainerLine}}/>

                {this.printDesktopHeader()}
                {/* {SideMenu(this)} */}
                {(() => {
                    if (this.state.selectedModal === "chooseKPI") {
                        mainModalDiv = this.mChooseKPIV2.render();
                    }
                })}

                {/*{(() => {*/}
                    {/**/}
                    {/*if (this.state.selectedClosableModal === "fullStats")*/}
                        {/*return this.mFullStats.render();*/}

                    {/*if (this.state.selectedClosableModal === "benchmarkSelector")*/}
                        {/*return this.mCountryBenchmarkSelector.render();*/}

                    {/*if (this.state.selectedClosableModal === "selectCountries")*/}
                        {/*return this.mSelectCountries.render();*/}

                    {/*if (this.state.selectedClosableModal === "graphics")*/}
                        {/*return this.mGraphics.render();*/}

                    {/*if (this.state.selectedClosableModal === "about")*/}
                        {/*return this.mAbout.render();*/}

                    {/*if (this.state.selectedClosableModal === "deepDives")*/}
                        {/*return this.mDeepDives.render();*/}
                {/*})()}*/}

                {/*{(() => {*/}
                    {/*let mainModalDiv = null;*/}
                    {/*if (this.state.selectedModal === "countryDetails")*/}
                        {/*mainModalDiv = this.mCountryDetailV2.render();*/}

                    {/*if (this.state.selectedModal === "worldRanking")*/}
                        {/*mainModalDiv = this.mWorldRankingV2.render();*/}

                    {/*if (this.state.selectedModal === "chooseKPI")*/}
                        {/*mainModalDiv = this.mChooseKPIV2.render();*/}

                    {/*if (this.state.x === "compare")*/}
                        {/*mainModalDiv = this.mCompareV2.render();*/}

                    {/*return mainModalDiv;*/}
                {/*})()}*/}
                {/*{(() => {*/}
                    {/*if (this.state.isDesktopMode)*/}
                        {/*return (*/}
                            {/*<div className="legendBarDesktop">*/}
                                {/*<div className="lowBar">{this.state.lang.low}</div>*/}
                                {/*<div className="mediumBar">{this.state.lang.medium}</div>*/}
                                {/*<div className="highBar">{this.state.lang.high}</div>*/}
                                {/*<div className="clearfix"/>*/}
                                {/*<img src="/assets/images/legend-bar.png" className="legendImgM" alt="Legend bar"/>*/}
                            {/*</div>*/}
                        {/*)*/}
                {/*})()}*/}


                {/*{(() => {*/}
                    {/*if (*/}
                        {/*this.state.selectedClosableModal !== "benchmarkSelector" &&*/}
                        {/*this.state.selectedClosableModal !== "selectCountries" &&*/}
                        {/*this.state.selectedClosableModal !== "about" &&*/}
                        {/*this.state.selectedClosableModal !== "deepDives") {*/}
                        {/*if (this.state.selectedClosableModal === "graphics" && this.state.isDesktopMode) {*/}
                            {/*return mYearSliderRC(this);*/}
                        {/*} else {*/}
                            {/*return mYearSlider(this);*/}
                        {/*}*/}
                    {/*}*/}
                {/*})()}*/}
            </div>
        );
    }

}

WorldMap.propTypes = {
    pageTitle: PropTypes.string
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getKpiScoreMapAction,
        getRankingKpiAction,
        getGroupsAction,
        getRealmListAction,
        getWholeRealmTreeAction,
    }, dispatch);
};

const mapStateToProps = (state) => {
    return {
        kpiObj: state.kpiReducer,
        realmObj: state.realmReducer,
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(WorldMap);
