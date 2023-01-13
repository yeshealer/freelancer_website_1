import generalUtils from './generalUtils';

module.exports = {
  loadPillars(callback, type, callnow) {
    if (!this.pillars || this.pillarsLang !== generalUtils.getCookie('lang')) {
      generalUtils.getDataFromApi('pillarList', { locale: generalUtils.getCookie('lang') ? generalUtils.getCookie('lang') : 'en' }).then((res) => {
        if (!res) {
          return window.alert('please make sure you have a valid internet connection');
        }

        this.pillarsLang = generalUtils.getCookie('lang') ? generalUtils.getCookie('lang') : 'en';
        this.pillars = res;
        const temp = [];
        res.forEach(singleData => singleData.subTopicList.forEach(item => item.kpiList.forEach(i => temp.push(i))));
        this.pillarsKpis = temp;
        return callnow ? this[callnow](callback, type) : this.returnPillars(callback, type);
      });
      return false;
    }
    return callnow ? this[callnow](callback, type) : this.returnPillars(callback, type);
  },
  getPillarIcon(selectedRealm) {
    let realmIcon = null;
    if(!selectedRealm.iconType){
      return '';
    }
    const match = selectedRealm.iconType.match(/(\[(?:\[??[^\[]*?\]))/g);
    if (match) {
        realmIcon = match[0].replace(/((\[\s*)|(\s*\]))/g, '');
    }

    return realmIcon;
  },
  getPillars(callback) {
    this.loadPillars(callback, 'pillars');
  },
  getPillarsKpis(callback) {
    this.loadPillars(callback, 'pillarsKpis');
  },
  getPillarsCustom(callback) {
    this.loadPillars(callback, ['pillars', 'pillarsKpis'], 'returnPillarsCusom');
  },
  returnPillars(callback, type) {
    callback(this[type]);
  },
  returnPillarsCusom(callback, type) {
    callback([this[type[0]], this[type[1]]]);
  }
};
