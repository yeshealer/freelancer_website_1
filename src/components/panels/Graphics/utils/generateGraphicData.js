const _ = require('lodash');

function generateGraphicData(countryKeyMap, scoreDataAllYears, statsSelectedCountries, statsSelectedGroups, selectedYear) {
  if (scoreDataAllYears === null || selectedYear === null) { return [[], []]; }

  const itemsCountry = [];
  const itemsGroup = [];
  let isDownloadable = false;

  const dataForSelectedYear = scoreDataAllYears[selectedYear];
  if (dataForSelectedYear === undefined || dataForSelectedYear === null) { return [[], []]; }

  const groupDataMap = {};
  dataForSelectedYear.groups.forEach((x) => {
    groupDataMap[x.groupId] = x;
  });

  statsSelectedCountries.forEach((x) => {
    const selectedCountryInfo = dataForSelectedYear.areas[x];
    const country = _.get(countryKeyMap, `${x}`, {});

    // if(selectedCountryInfo.value !== undefined && selectedCountryInfo.value === "-1"){
    //     itemsCountry.push({name: x, data: 0, value: 0});
    // }
    if (selectedCountryInfo !== null && selectedCountryInfo !== undefined) {
      itemsCountry.push({
        // fullName: this.self._e(countryIdMap[x], 'countryName'),
        // fullName: '-',
        denominatorName: 'denominatorName',
        countryName: country.countryName,
        countryCode: country.countryCode,
        name: x,
        data: selectedCountryInfo.dataValue,
        value: selectedCountryInfo.value
      });
      if (selectedCountryInfo.value !== '-1') { isDownloadable = true; }
    }
  });

  statsSelectedGroups.forEach((x) => {
    const selectedGroupInfo = groupDataMap[x];
    if (selectedGroupInfo !== null && selectedGroupInfo !== undefined && selectedGroupInfo.groupScore !== undefined && selectedGroupInfo.groupScore !== 0) {
      itemsGroup.push({
        name: selectedGroupInfo.countryGroupTextMap.title,
        data: selectedGroupInfo.groupScore
      });
    }
  });
  return [itemsCountry, itemsGroup, isDownloadable];
}

export default generateGraphicData;
