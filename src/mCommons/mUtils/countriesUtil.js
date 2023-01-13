import generalUtils from './generalUtils';

module.exports = {
  loadCountries(callback, type) {
    if (!this[type] || this.countriesLang !== generalUtils.getCookie('lang')) {
      generalUtils.getDataFromApi('countryList', { locale: generalUtils.getCookie('lang') ? generalUtils.getCookie('lang') : 'en_SA' }).then((res) => {
        if (!res) {
          return window.alert('please make sure you have a valid internet connection');
        }
        this.countriesLang = generalUtils.getCookie('lang') ? generalUtils.getCookie('lang') : 'en_SA';
        this.countries = res;
        const countriesAlpha = {};
        res.forEach((value) => {
          if (!countriesAlpha[value.countryName.charAt(0)]) {
            countriesAlpha[value.countryName.charAt(0)] = [];
          }
          countriesAlpha[value.countryName.charAt(0)].push(value);
        });
        this.countriesAlpha = [];
        Object.keys(countriesAlpha).forEach((i) => {
          const group = {};
          group.alphabet = i;
          group.countriesList = countriesAlpha[i];
          this.countriesAlpha.push(group);
        });
        let leftCount = 0;
        let rightCount = 0;
        const alphabetSpace = 2;
        const left = [];
        const right = [];
        this.countriesAlpha.forEach((item, key) => {
          if (key === 0) {
            left.push(item);
            leftCount += item.countriesList.length + alphabetSpace;
          } else if (key === 1) {
            right.push(item);
            rightCount += item.countriesList.length + alphabetSpace;
          } else if (leftCount > rightCount) {
            right.push(item);
            rightCount += item.countriesList.length + alphabetSpace;
          } else {
            left.push(item);
            leftCount += item.countriesList.length + alphabetSpace;
          }
        });
        this.countriesAlphaForTwoColumns = left.concat(right);
        this.returnCountries(callback, type);
      });
      return false;
    }
    this.returnCountries(callback, type);
  },
  getCountries(callback) {
    this.loadCountries(callback, 'countries');
  },
  getCountriesAlpha(callback) {
    this.loadCountries(callback, 'countriesAlpha');
  },
  getCountriesAlphaForTwoColumns(callback) {
    this.loadCountries(callback, 'countriesAlphaForTwoColumns');
  },
  returnCountries(callback, type) {
    callback(this[type]);
  }
};
