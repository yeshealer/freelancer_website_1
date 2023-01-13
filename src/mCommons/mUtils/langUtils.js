import generalUtils from './generalUtils';
import langEn from '../json/lang_en.json';
import langAr from '../json/lang_ar.json';

module.exports = {
    langEn,
    langAr,
    currentEnglish: generalUtils.getCookie('lang') !== 'ar',
    changeLang() {
        this.currentEnglish = !this.currentEnglish;
        const langForCookie = this.currentEnglish ? 'en' : 'ar';
        generalUtils.createCookie('lang', langForCookie, 30);

        if (this.currentEnglish) {
            document.title = "International Performance Hub";
            document.body.style.fontFamily = "Etelka-Light";
        } else {
            document.title = "منصة الأداء الدولي";
            document.body.style.fontFamily = "ITCHandel";
        }

        return this.getLang();
    },
    getLangCode() {
        return this.currentEnglish ? "en": "ar";
    },
    setEnglish() {
        this.currentEnglish = true;
        generalUtils.createCookie('lang', "en", 30);
        document.title = "International Performance Hub";
        document.body.style.fontFamily = "Etelka-Light";
        return this.getLang();
    },
    setArabic() {
        this.currentEnglish = false;
        generalUtils.createCookie('lang', "ar", 30);
        document.title = "منصة الأداء الدولي";
        document.body.style.fontFamily = "ITCHandel";
        return this.getLang();
    },
    getLang() {
        return this.currentEnglish ? this.langEn : this.langAr;
    }
};
