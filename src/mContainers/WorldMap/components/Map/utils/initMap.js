import { event as currentEvent } from 'd3';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { getHeight, getWidth } from '../../../../../mCommons/mUtils';
import worldMapJson from '../../../../../mCommons/json/world-simple';

const initMap = (backgroundDivRef, tooltipDivRef, rangeMinVal, rangeMaxVal,
                 onClick, onTouchStart, onMouseMove, onMouseOut, setRangeValueForMapAction) => {
  const mapDivM = backgroundDivRef;

  let width = getWidth(),
    height = getHeight();

  const projection = d3.geo
    .mercator()
    .translate([(width / 1.9), (height / 1.75)])
    .scale(width / 2.4 / Math.PI)
    .rotate([-11, 0]);

  window.projection = projection;

  const path = d3.geo
    .path()
    .projection(projection);

  window.dataPath = path;

  const svg = d3.select(mapDivM).append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('rect')
    .attr('class', 'mapBackgroundM')
    .attr('width', width)
    .attr('height', height);

  window.svgMap = svg;

  const g = svg.append('g');
  g.style('stroke-width', '0.5px').style('stroke-opacity', '0.3');

  window.dataMapM = g;

  const world = worldMapJson;
  const countries = topojson.feature(world, world.objects.world).features;

  g.selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'mapFeatureM')
    .on('touchstart', (d) => {
      onTouchStart(d);
    })
    .on('click', onClick)
    .on('mousemove', onMouseMove)
    .on('mouseout', onMouseOut);

  g.append('path')
    .datum(topojson.mesh(world, world.objects.world, (a, b) => a !== b))
    .attr('class', 'mapMeshM')
    .attr('d', path);

  const zoom = d3.behavior.zoom()
    .scaleExtent([rangeMinVal, rangeMaxVal])
    .on('zoom', () => {
      setRangeValueForMapAction(currentEvent.scale);

      g.style('stroke-width', `${0.5 / currentEvent.scale}px`);
      g.attr('transform', `translate(${currentEvent.translate})scale(${currentEvent.scale})`);
    });

  window.mapZoom = zoom;

  svg
    .call(zoom)
    .call(zoom.event)
    .on('wheel.zoom', null);
};

export default initMap;
