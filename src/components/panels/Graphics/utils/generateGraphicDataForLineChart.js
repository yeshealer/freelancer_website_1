import normalizeSliderYear from './normalizeSliderYear';

const _ = require('lodash');

function generateGraphicDataForLineChart(
  countryKeyMap, scoreDataAllYears, statsSelectedCountries, statsSelectedGroups,
  selectedYearStart, selectedYearEnd) {
  if (scoreDataAllYears === undefined || scoreDataAllYears === null) { return [[], []]; }

  let isData = false;
  const data = [];

  for (let year = normalizeSliderYear(selectedYearStart); year <= normalizeSliderYear(selectedYearEnd); year++) {
    const dataLine = { year };
    const dataForSelectedYear = scoreDataAllYears[year];

    if (dataForSelectedYear !== undefined) {
      statsSelectedCountries.forEach((country3Code) => {
        const countryData = dataForSelectedYear.areas[country3Code];
        const country = _.get(countryKeyMap, `${country3Code}`, {});


        if (countryData !== undefined && countryData !== null && countryData.value != '-1') {
          dataLine[country3Code] = countryData.dataValue;
          dataLine[`${country3Code}_Detail`] = {
            denominatorName: '...',
            countryName: country.countryTextMap.name,
            countryCode: country.countryCode
          };

          // dataLine.data = countryData.dataValue;
          // dataLine.denominatorName = 'denominatorName';
          // dataLine.countryName = country.countryName;
          // dataLine.countryCode = country.countryCode;
          isData = true;
        }
      });

      if (statsSelectedGroups.length > 0) {
        dataForSelectedYear.groups.forEach((x) => {
          if (statsSelectedGroups.indexOf(x.groupId) > -1 && x.groupScore !== undefined && x.groupScore !== null && x.groupScore > 0) {
            dataLine[x.groupId] = x.groupScore;
          }
        });
      }
    }

    data.push(dataLine);
  }

  return [data, isData];
}

export default generateGraphicDataForLineChart;
