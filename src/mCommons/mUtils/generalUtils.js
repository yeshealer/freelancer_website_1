module.exports = {
  getCookie: (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  },
  createCookie: (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  },
  getDataFromApi: async (uri, parameters) => {
    let mainURL = process.env.REACT_APP_SDK_URL;
    if (parameters) {
      const parametersKeys = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');
      mainURL = `${mainURL}${uri}?${parametersKeys}`;
    }
    try {
      const response = await fetch(mainURL);
      const responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  },
  GetRequest: (url, parameters, onSuccess, onError) => {
    let tempURL = url;
    if (parameters) {
      const parametersKeys = Object.keys(parameters).map((key) => `${key}=${parameters[key]}`).join('&');
      tempURL = `${url}?${parametersKeys}`;
    }
    const request = new XMLHttpRequest();
    request.open('GET', tempURL, true);
    request.onload = () => {
      const statusCode = request.status;
      if (statusCode >= 200 && statusCode < 400) {
        const response = JSON.parse(request.responseText);
        onSuccess(statusCode, response);
      } else {
        onSuccess(statusCode);
      }
    };
    request.onerror = function () {
      onError();
    };
    request.send();
  },
  ellipsify: (str, n) => {
    if (str.length > n) {
      return (`${str.substring(0, n)}...`);
    }
    return str;
  },
  setViewPort: () => {
    if (module.exports.getCookie('isDesktopMode') === 'mobile') {
      const metaTag = document.createElement('meta');
      metaTag.name = 'viewport';
      metaTag.content = 'width=device-width, initial-scale=1.0';
      document.getElementsByTagName('head')[0].appendChild(metaTag);
    }
  },
  setDesktopMode: (isDesktop) => {
    if (isDesktop === true) {
      module.exports.createCookie('isDesktopMode', 'desktop', 7);
    } else {
      module.exports.createCookie('isDesktopMode', 'mobile', 7);
    }
  },
  getHeight: () => {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  },
  getWidth: () => {
    if (self.innerWidth) {
      return self.innerWidth;
    }
    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }
    if (document.body) {
      return document.body.clientWidth;
    }
  },
  getColorByData: (data) => this.colorData[parseInt(data, 10)],
  setPageDirAndLang: (dir, lang) => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  },
  togglePageDirAndLang: () => {
    if (document.documentElement.dir === 'rtl') {
      this.setPageDirAndLang('ltr', 'en');
    } else {
      this.setPageDirAndLang('rtl', 'ar');
    }
  },
  checkIfArabic: (data) => {
    const ar = ['ا', 'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    return ar.indexOf(data) > -1;
  }
};
