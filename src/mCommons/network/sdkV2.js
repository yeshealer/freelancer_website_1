import network from "./network";
import replaceParams from "./utils/replaceParams";
import { GetRequest } from "../mUtils";
import SDK from "../mSDK";

//const mainURL = "http://10.110.119.43/iph/"; //process.env.REACT_APP_SDK_URL; --  statging
//const mainURL = "http://10.110.119.43/iph/"; //process.env.REACT_APP_SDK_URL; --  production
const mainURL = "http://10.110.119.43/iph/"; //process.env.REACT_APP_SDK_URL; -- dev
const getFullURL = (endpoint) => mainURL + endpoint;

const sdkV2 = {
  locale: "en_SA",
  getRealmList: (onSuccess, onError) => {
    return network.get(
      getFullURL("realmList"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getWholeRealmTree: (onSuccess, onError) => {
    return network.get(
      getFullURL("getWholeRealmTree"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getCountryList: (onSuccess, onError) => {
    return network.get(
      getFullURL("countryList"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getCountryAlphaList: (onSuccess, onError) => {
    return network.get(
      getFullURL("countryAlphaList"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getGroups: (onSuccess, onError) => {
    return network.get(
      getFullURL("getGroups"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKpiScore: (parentId, countryISO3, year, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL(
          "kpisScore/groupRoot/{parentId}/country/{countryISO3}/year/{year}"
        ),
        ["{parentId}", "{countryISO3}", "{year}"],
        [parentId, countryISO3, year]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKpiScoreMap: (kpiId, onSuccess, onError) => {
    return network.get(
      replaceParams(getFullURL("kpiScoreMap/{kpiId}"), ["{kpiId}"], [kpiId]),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKpiValue: (kpiId, year, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL("kpisValue/groupRoot/{kpiId}/year/{year}"),
        ["{kpiId}", "{year}"],
        [kpiId, year]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getRankingKpi: (kpiId, year, countryGroupISO3, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL(
          "ranking/kpi/{kpiId}/year/{year}/countryGroup/{countryGroupISO3}"
        ),
        ["{kpiId}", "{year}", "{countryGroupISO3}"],
        [kpiId, year, countryGroupISO3]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getDataCountInfo: (onSuccess, onError) => {
    return network.get(
      getFullURL("getDataCountInfo"),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKPIScoreAndRankDetailsByCountry: (country, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL("kpiScoreAndRankDetailsByCountry/{country}"),
        ["{country}"],
        [country]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKpiScoreAndRankDetailsByCountryOverallMarginals: (
    country,
    onSuccess,
    onError
  ) => {
    return network.get(
      replaceParams(
        getFullURL("kpiScoreAndRankDetailsByCountryOverallMarginals/{country}"),
        ["{country}"],
        [country]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKpiScoreAndRankDetailsByCountryProfile: (country, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL("kpiScoreAndRankDetailsByCountryProfile/{country}"),
        ["{country}"],
        [country]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getRankingExcelDownload: (
    kpiId,
    selectedYear,
    selectedGroup,
    groupName,
    locale,
    onSuccess,
    onError
  ) => {
    return network.get(
      replaceParams(
        getFullURL(
          "ranking/kpiId/{kpiId}/year/{selectedYear}/countryGroupId/{selectedGroup}/excel/download"
        ),
        ["{kpiId}", "{selectedYear}", "{selectedGroup}"],
        [kpiId, selectedYear, selectedGroup]
      ),
      { locale, groupname: groupName },
      onSuccess,
      onError
    );
  },
  getFullStatsExcelDownload: (
    entityPageId,
    selectedYear,
    countryList,
    groupList,
    entityPageName,
    locale,
    onSuccess,
    onError
  ) => {
    //https://api-test.iph.sa/iph/kpisValue/entityPageId/{entityPageId}/year/{selectedYear}/excel/download?locale=ar_SA&countrylist=SAU,TUR,USA&grouplist=GLO,G20&entityPageName=hedehodo
    return network.get(
      replaceParams(
        getFullURL(
          "kpisValue/entityPageId/{entityPageId}/year/{selectedYear}/excel/download"
        ),
        ["{entityPageId}", "{selectedYear}"],
        [entityPageId, selectedYear]
      ),
      {
        locale,
        countrylist: countryList,
        grouplist: groupList,
        entityPageName: entityPageName,
      },
      onSuccess,
      onError
    );
  },
  getBranchDetail: (id, onSuccess, onError) => {
    return network.get(
      replaceParams(
        getFullURL("getNodeDetail/branch/{branchId}"),
        ["{branchId}"],
        [id]
      ),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
  getKPIDetail: (id, onSuccess, onError) => {
    return network.get(
      replaceParams(getFullURL("getNodeDetail/kpi/{id}"), ["{id}"], [id]),
      { locale: sdkV2.locale },
      onSuccess,
      onError
    );
  },
};

window.sdkV2 = sdkV2;

export default sdkV2;
