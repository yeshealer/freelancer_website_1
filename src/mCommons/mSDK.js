import {GetRequest} from './mUtils';

const mainURL = process.env.REACT_APP_SDK_URL;

const getFullURL = (endpoint) => (mainURL + endpoint);

/**
 * Deprecated!!!
 */
const SDK = {
    locale: "en",
    showLoading: function () {

    },
    hideLoading: function () {

    },
    getDeepDives: (onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiDeepDives`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIScoreForAllCountries: (kpi, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`mKpiScoreAll/${kpi.toString()}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIScoreForAllCountriesAndYears: (kpi, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiScoreAccordion/${kpi.toString()}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIScoreMapForAllCountriesAndYears: (kpi, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiScoreMap/${kpi.toString()}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getPillarList: (onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL("pillarList"), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getCountryAlphaList: (onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL("countryAlphaList"), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getRankingByKPIAndYearAndCountryGroup: (kpi, year, countryGroup, onSuccess, onError) => {
        if(kpi !== null){
            SDK.showLoading();
            GetRequest(
                getFullURL(`ranking/kpi/${kpi.toString()}/year/${year.toString()}/countryGroup/${countryGroup.toString()}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
            );
        }
    },
    getGroupList: (onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL("getGroups"), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getCountryList: (onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL("countryList"), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIValues: (pillar, year, onSuccess, onError) => {
        // onSuccess(200, jsonData);
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpisValue/pillar/${pillar}/year/${year}`), {"locale": SDK.locale, "pillarId": pillar, "year": year}, onSuccess, onError, SDK.hideLoading
        );
    },
    getDownloadURL_Graph: (kpiId, countrylist, grouplist, years, kpiname) => {
        return getFullURL(`kpiScoreMap/${kpiId}/excel/download?locale=${SDK.locale}&countrylist=${countrylist}&grouplist=${grouplist}&years=${years}&kpiname=${kpiname}`);
    },
    getDownloadURL_FullStats: (pillarId, year, countrylist, grouplist, pillarname) => {
        return getFullURL(`kpisValue/pillar/${pillarId}/year/${year}/excel/download?locale=${SDK.locale}&countrylist=${countrylist}&grouplist=${grouplist}&pillarname=${pillarname}`);
    },
    getDownloadURL_Ranking: (kpiId, year, groupId, groupName) => {
        return getFullURL(`ranking/kpi/${kpiId}/year/${year}/countryGroup/${groupId}/excel/download?locale=${SDK.locale}&groupname=${groupName}`);
    },
    getDownloadURL_Subpillar: (pillarId) => {
        return getFullURL(`subPillarList/excel/download?locale=${SDK.locale}&pillarid=${pillarId}`);
    },

    getKPIScoreAndRankDetailsByCountryProfile: (country, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiScoreAndRankDetailsByCountryProfile/${country}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIScoreAndRankDetailsByCountry: (country, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiScoreAndRankDetailsByCountry/${country}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getKPIScoreAndRankDetailsByCountryOverallMarginals: (country, onSuccess, onError) => {
        SDK.showLoading();
        GetRequest(
            getFullURL(`kpiScoreAndRankDetailsByCountryOverallMarginals/${country}`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    },
    getDataCountInfo: (onSuccess, onError) => {
        return GetRequest(
            getFullURL(`getDataCountInfo`), {"locale": SDK.locale}, onSuccess, onError, SDK.hideLoading
        );
    }
};

export default SDK;
