import React from 'react'

import {getCookie, createCookie} from "./mUtils/generalUtils";

import * as fileSaver from "file-saver";
import * as XLSX from "xlsx";
import * as R from 'ramda'
import MobileDetect from "mobile-detect"
import langUtils from "./mUtils/langUtils";
import { _lang } from '../utils';

export const colorSetM = [
    "#647e51",
    "#18785e",
    "#9c8c2a",
    "#17785e",
    "#5b5b5b",
    "#9b4038",
    "#7e8e30",
    "#5b5b5b",
    "#9d8c28",
    "#984138",
];

export const colorSetG = [
    "#39b54a",
    "#00a99d",
    "#8cc63f",
    "#d9e021",
    "#ff0000",
    "#c1272d",
    "#2e3192",
    "#662d91",
    "#9e005d",
    "#ed1e79",
    "#3fa9f5",
    "#22b573",
    "#d4145a",
    "#1b1464",
    "#f7931e",
    "#374464",
    "#bdccd4"
];


export const colorSetRefM = [
    "rgba(57,181,74, 0.8)",
    "rgba(0,169,157, 0.8)",
    "rgba(140,198,63, 0.8)",
    "rgba(217,224,33, 0.8)",
    "rgba(255,0,0, 0.8)",
    "rgba(193,39,45, 0.8)",
    "rgba(46,49,146, 0.8)",
    "rgba(102,45,145, 0.8)",
    "rgba(158,0,93, 0.8)",
    "rgba(237,30,121, 0.8)",
    "rgba(63,169,245, 0.8)",
    "rgba(34,181,115, 0.8)",
    "rgba(212,20,90, 0.8)",
    "rgba(27,20,100, 0.8)",
    "rgba(247,147,30, 0.8)"
    // "rgba(85, 173, 224, 0.8)",
    // "rgba(68, 125, 210, 0.8)",
    // "rgba(108, 100, 198, 0.8)",
    // "rgba(151, 93, 213, 0.8)",
    // "rgba(173, 113, 168, 0.8)"
];

export const p = (strEn, strAr) => {
    if (langUtils.currentEnglish)
        return strEn;
    else
        return strAr;
};

export const trimString = (str) => {
    if (str !== undefined && str !== null && str.length > 110)
        return str.substr(0, 110) + "...";
    else
        return str;
};

const transposeM = a => R.map(c => R.map(r => r[c], a), R.keys(a[0]));

export const downloadAsXLS = (fileNameM, sheetNameM, sheetDataM, applyTranspose) => {
    function sheet_from_array_of_arrays(data, opts) {
        let ws = {};
        let range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
        for (let R = 0; R !== data.length; ++R) {
            for (let C = 0; C !== data[R].length; ++C) {
                if (range.s.r > R) range.s.r = R;
                if (range.s.c > C) range.s.c = C;
                if (range.e.r < R) range.e.r = R;
                if (range.e.c < C) range.e.c = C;
                let cell = {v: data[R][C]};
                if (cell.v === null) continue;
                let cell_ref = XLSX.utils.encode_cell({c: C, r: R});
                cell.t = 's';
                ws[cell_ref] = cell;
            }
        }
        if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
        return ws;
    }

    /* original data */

    // let data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];

    function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
    }

    let wb = new Workbook();
    if (applyTranspose)
        sheetDataM = transposeM(sheetDataM);
    let ws = sheet_from_array_of_arrays(sheetDataM);

    /* add worksheet to workbook */
    wb.SheetNames.push(sheetNameM);
    wb.Sheets[sheetNameM] = ws;
    let wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: true, type: 'binary'});

    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    fileSaver.saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), fileNameM + ".xlsx");
};

export const GetRequest = (url, parameters, onSuccess, onError, onHideLoading) => {
    if (parameters !== null)
        url = url + "?" + Object.keys(parameters).map(function (key) {
            return key + "=" + parameters[key]
        }).join("&");

    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        let statusCode = request.status;
        if (statusCode >= 200 && statusCode < 400) {
            let response = JSON.parse(request.responseText);
            onSuccess(statusCode, response);
        } else {
            onSuccess(statusCode);
        }

        if (onHideLoading)
            onHideLoading();
    };
    request.onerror = function () {
        onError();
        if (onHideLoading)
            onHideLoading();
    };
    request.send();
};

export const setViewPort = () => {
    if (getCookie("isDesktopMode") === "mobile") {
        let metaTag = document.createElement('meta');
        metaTag.name = "viewport";
        metaTag.content = "width=device-width, initial-scale=1.0";
        document.getElementsByTagName('head')[0].appendChild(metaTag);
    }
};

export const setDesktopMode = (isDesktop) => {
    if (isDesktop === true) {
        createCookie("isDesktopMode", "desktop", 7);
    } else {
        createCookie("isDesktopMode", "mobile", 7);
    }
};

export const getHeight = () => {
    return window.innerHeight;
    // let body = document.body,
    //     html = document.documentElement;
    // return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

export const getWidth = () => {
    if (self.innerWidth) {
        return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
    }

    if (document.body) {
        return document.body.clientWidth;
    }
};


export const lightenColor = (color, percent) => {
    let num = parseInt(color, 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
};

export const colorData = [
    "#b82d31",
    "#c14c40",
    "#d07130",

    "#d1862e",
    "#d2a02b",
    "#c8b032",

    "#9eb138",
    "#789e61",
    "#1c9573",
    "#188178",

    "#188178",

    "#fff" //white for no data
];

export const colorChartData = [
    "#b82d31",
    "#d07130",
    "#c8b032",
    "#9eb138",
    "#1c9573",

    "#fff" //white for no data
];

// const colorData = [
//     "#e12d2d",
//     "#eb5541",
//     "#FE8523",
//     "#FFA019",
//     "#FFC000",
//     "#F2D616",
//     "#BDD72A",
//     "#8DBE68",
//     "#00B386",
//     "#009A8D",
//     "#009A8D"
// ];

// export const generateMapTooltip = (countryObj) => {
//     console.log(countryObj);
//     return (
//         <div>
//             <div className="country-flag sprite sprite-MA"/>
//             <span className="countryHover">{countryObj.countryName}</span>
//             <br />
//             <span className="scoreData" style={{color:"#ff0000"}}>{countryObj.data} / {countryObj.denominator}</span>
//         </div>
//     );
// };

export const getMapColorByScore = (value) => {
    if (value > -1) {
        let i = 0;
        if (value < 0.5)
            i = 0;
        else if (value < 1.0)
            i = 1;
        else if (value < 1.5)
            i = 2;
        else if (value < 2.0)
            i = 3;
        else if (value < 2.5)
            i = 4;
        else if (value < 3.0)
            i = 5;
        else if (value < 3.5)
            i = 6;
        else if (value < 4.0)
            i = 7;
        else if (value < 4.5)
            i = 8;
        else
            i = 9;
        return colorData[i];
    } else {
        return colorData[11]
    }
};

const colorRegex = /color:#([A-Za-z0-9]+)/g;
export const replaceColor = (htmlString, newColor) => {
    return htmlString.replace(colorRegex, newColor);
};

export const getPullClassForLang = () => {
    return (_lang('currentEnglish') ? 'pull-left' : 'pull-right');
};

export const getColorByDataV2 = (i, data) => {
    return colorChartData[i];
};

export const getColorByData = (data) => {
    return colorChartData[data];
};

export const setPageDirAndLang = (dir, lang) => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

export const togglePageDirAndLang = () => {
    if (document.documentElement.dir === "rtl") {
        setPageDirAndLang("ltr", "en");
    } else {
        setPageDirAndLang("rtl", "ar");
    }
};

export const headerMenuComponent = (itemTitle, itemSubtitle, itemIcon, modalId, setActiveModal, activeModal, onClickFunction, extraClass = "") => {
    let isActive = (modalId === activeModal);
    return (
        <div onClick={() => {
            setActiveModal(modalId);
            if (onClickFunction !== null)
                onClickFunction.bind(this);
        }} className={"menuItemM " + extraClass + " " + ((isActive) ? "active" : "")}>
            <div className={"menuIconM " + itemIcon + ((isActive) ? " activeIconM" : "")}/>
            <div className="itemTextM">
                <div className="itemH1M">{itemTitle}</div>
                <div className="itemH2M">{itemSubtitle}</div>
            </div>
        </div>
    );
};

export const headerMenuStaticComponentWithHref = (itemTitle, itemIcon, href, itemClass = "") => {
    return (
        <a href={href} className={"menuItemStaticM " + itemClass}>
            <div className={"menuIconM " + itemIcon}/>
            <div className="itemTextM">
                <div className="itemH1M">{itemTitle}</div>
            </div>
        </a>
    );
};


export const headerMenuStaticComponent = (itemTitle, itemIcon, onClickFunction, itemClass = "") => {
    return (
        <div onClick={onClickFunction.bind(this)} className={"menuItemStaticM " + itemClass}>
            <div className={"menuIconM " + itemIcon}/>
            <div className="itemTextM">
                <div className="itemH1M">{itemTitle}</div>
            </div>
        </div>
    );
};

export const introHeaderMenuStaticComponent = (itemTitle, itemIcon, onClickFunction, itemClass = "") => {
    return (
        <div onClick={onClickFunction.bind(this)} className={"introMenuItemStaticM " + itemClass}>
            <div className={"menuIconM " + itemIcon}/>
            <div className="itemTextM">
                <div className="itemH1M">{itemTitle}</div>
            </div>
        </div>
    );
};

export const introHeaderMenuStaticComponentWithHref = (itemTitle, itemIcon, href, itemClass = "") => {
    return (
        <a href={href} className={"introMenuItemStaticM " + itemClass}>
            <div className={"menuIconM " + itemIcon}/>
            <div className="itemTextM">
                <div className="itemH1M">{itemTitle}</div>
            </div>
        </a>
    );
};

export const isTablet = () => {
    let mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.tablet() !== null)
        return true;
    else
        return false;
};

export const isMobile = () => {
    let isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

    let mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.tablet() !== null)
        isMobile = false;

    return isMobile;
};



export const createCountriesAlphaMap = (countries) => {
    const countriesAlphaMap = {};

    countries.forEach((country) => {
        const {name} = country.countryTextMap;
        const firstLetterOfCountry = name.charAt(0);

        if (!countriesAlphaMap[firstLetterOfCountry]) {
            countriesAlphaMap[firstLetterOfCountry] = [];
        }

        countriesAlphaMap[firstLetterOfCountry].push(country);
    });

    return countriesAlphaMap;
}
