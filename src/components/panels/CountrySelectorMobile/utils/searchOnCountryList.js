const searchOnCountryList = (countryListAlphabetic, value) => {
  let listS = JSON.parse(JSON.stringify(countryListAlphabetic))
  return listS.filter((x) => {
    x.countriesList = x.countriesList.slice(0).filter((y) => {
      // if(this.lang.currentEnglish)
      return y.countryTextMap.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      // else
      //     return y.countryNameOtherLang.indexOf(value);
    })
    return (x.countriesList.length > 0)
  })
}

export default searchOnCountryList