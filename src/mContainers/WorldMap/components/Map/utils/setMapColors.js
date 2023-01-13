import * as topojson from 'topojson';
import { getMapColorByScore } from '../../../../../mCommons/mUtils';
import worldMapJson from '../../../../../mCommons/json/world-simple';

const setMapColors = (rankingKPIData) => {
    const world = worldMapJson;
    const countryData = topojson.feature(world, world.objects.world).features;

    window.dataMapM
        .selectAll('path')
        .data(countryData)
        .attr('d', window.dataPath)
        .attr('class', 'mapFeatureM')
        .style('fill', (d) => {
            if (d.type === 'Feature') {
                const countryData = rankingKPIData.find(val => val.countryId === d.id);
                if (countryData) {
                    return getMapColorByScore(countryData.weightedScore);
                }
            }
            return '#8d8d8d';
        });
};

export default setMapColors;
