import {
  SET_SELECTED_COUNTRY_OBJ,
  SET_SELECTED_GROUP,
  SET_SELECTED_KPI_PATH,
  SET_SELECTED_LANG,
  SET_SELECTED_YEAR,
  SET_SEARCHABLE_KPI_LIST,
  SET_SELECTED_COUNTRY_STATS,
  SET_CLOSABLE_MODAL,
  SET_SELECTED_GROUPS,
  SET_SELECTED_YEAR_RANGE,
  SET_BREADCRUMB,
  SET_MOBILE_OVERLAY_STATE,
} from '../actionType';

const defaultState = {
  searchableKPIList: [],
  selectedKPIPath: [
    // 3,
    // 6,
    // 25
  ],
  selectedKPI: {
    // id: 101,
    // nodeType: 'App\\Bonsai\\Nodes\\Pages\\KpiPage\\KpiPage',
    // nodeId: 37,
    // label: '',
    // template: 'kpi-page',
    // tag: 'kpi_page',
    // position: 1,
    // nodeTextMap: {},
    // kpi: {
    //   displayType: null,
    //   id: 50,
    //   countryData: null,
    //   kpiPages: [
    //     {
    //       id: 1356
    //     },
    //     {
    //       id: 37
    //     }
    //   ],
    //   kpiTextMap: {
    //     description_long: 'Carbon dioxide emissions are those stemming from the burning of fossil fuels and the manufacture of cement. They include carbon dioxide produced during consumption of solid, liquid, and gas fuels and gas flaring.',
    //     title: 'CO2 Emissions',
    //     denominator: 'Metric Tons per Capita'
    //   },
    //   sourceTextMap: {
    //     citation: 'The World Bank',
    //     title: 'World Bank'
    //   },
    //   url: 'http://data.worldbank.org/indicator/EN.ATM.CO2E.PC'
    // },
    // parentId: 25
  },
  selectedKPIId: null,
  selectedCountry: {
    // countryId: 'USA',
    // countryCode: 'US',
    // countryTextMap: {
    //   name: 'United States'
    // }
  },

  selectedYearStart: 20135,
  selectedYearEnd: 20145,

  altSelectedYear: 2014,
  selectedYear: null,
  selectedGroup: {
    // groupId: null,
    // countryGroupTextMap: { title: null }

    // groupId: 'GLO',
    // countryGroupTextMap: { title: 'World' },
    // groupScore: 0.0,
    // groupWeightedScore: 0.0,
    // formattedGroupScore: '0.0'
  },

  selectedLanguage: 'en_SA',

  statsSelectedCountries: [],
  // statsSelectedCountriesColorMap: [],

  // Mobile Modals
  isMobileOverlayCountrySelector: false,
  isMobileOverlayBenchmarkSelector: false,

  statsSelectedGroups: [],
  closeableModal: '',
  selectedRealm: 0,
  selectedPillar: '',
  breadcrumb: [
    // {
    //   id: 3,
    //   nodeType: 'App\\Bonsai\\Nodes\\Pages\\RealmPage\\RealmPage',
    //   nodeId: 1,
    //   label: 'Classic',
    //   template: 'realm-page',
    //   tag: 'realm_page',
    //   position: 1,
    //   iconType: 'Classic',
    //   nodeTextMap: {
    //     title: 'Classic',
    //     bonsai_slug: null,
    //     title_short: 'Pillars'
    //   },
    // },
    // {
    //   id: 6,
    //   nodeType: 'App\\Bonsai\\Nodes\\Pages\\EntityPage\\EntityPage',
    //   nodeId: 2,
    //   label: 'Energy',
    //   template: 'entity-page',
    //   tag: 'entity_page',
    //   position: 1,
    //   iconType: 'Energy',
    //   nodeTextMap: {
    //     description_short: null,
    //     description_long: 'The Energy Pillar consists of two topics, Supply and Demand. The focus of the Pillar is not only to assess the absolute energy output of a country, but also the sustainability of its production as well as its capability in meeting current and future energy needs. The criteria selected highlights issues most relevant to the Kingdom.',
    //     title: 'Energy',
    //     title_short: null
    //   },
    // },
    // {
    //   id: 25,
    //   nodeType: 'App\\Bonsai\\Nodes\\Pages\\EntityPage\\EntityPage',
    //   nodeId: 21,
    //   label: 'Demand',
    //   template: 'entity-page',
    //   tag: 'entity_page',
    //   position: 1,
    //   iconType: 'Demand',
    //   nodeTextMap: {
    //     description_short: 'Measures how quickly resources are being consumed against reserves, as well as the level of dependency on external resources',
    //     description_long: 'The Demand topic measures how quickly energy resources are being consumed against reserves, as well as the level of energy dependency on external resources. Furthermore the topic has a strong focus on sustainability and the impact on future generations.',
    //     title: 'Demand',
    //     title_short: null
    //   }
    // },
    // {
    //   id: 101,
    //   nodeType: 'App\\Bonsai\\Nodes\\Pages\\KpiPage\\KpiPage',
    //   nodeId: 37,
    //   label: 'CO2 Emissions',
    //   template: 'kpi-page',
    //   tag: 'kpi_page',
    //   position: 1,
    //   iconType: 'CO2 Emissions',
    //   nodeTextMap: {},
    //   kpi: {
    //     displayType: null,
    //     id: 50,
    //     countryData: null,
    //     kpiPages: [
    //       {
    //         id: 1356
    //       },
    //       {
    //         id: 37
    //       }
    //     ],
    //     kpiTextMap: {
    //       additional_notes: null,
    //       description_short: null,
    //       description_long: 'Carbon dioxide emissions are those stemming from the burning of fossil fuels and the manufacture of cement. They include carbon dioxide produced during consumption of solid, liquid, and gas fuels and gas flaring.',
    //       title: 'CO2 Emissions',
    //       footnotes: null,
    //       data_update_fequency: 'Annual',
    //       denominator: 'Metric Tons per Capita'
    //     },
    //     sourceTextMap: {
    //       citation: 'The World Bank',
    //       title: 'World Bank'
    //     },
    //     url: 'http://data.worldbank.org/indicator/EN.ATM.CO2E.PC'
    //   },
    //   parentId: 25
    // },
  ]
};

const coreReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_SELECTED_KPI_PATH:
      return {
        ...state,
        selectedKPIPath: action.path,
        selectedKPI: (action.kpiObj === null) ? {} : action.kpiObj,
        selectedKPIId: (action.kpiObj === null) ? null : action.kpiObj.kpi.id
      };
    case SET_SELECTED_COUNTRY_OBJ:
      return {
        ...state,
        selectedCountry: action.countryObj
      };

    case SET_SELECTED_YEAR_RANGE:
      return {
        ...state,
        selectedYearStart: action.selectedYearStart,
        selectedYearEnd: action.selectedYearEnd
      };
    case SET_SELECTED_YEAR:
      return {
        ...state,
        selectedYear: action.year
      };
    case SET_SELECTED_GROUP:
      return {
        ...state,
        selectedGroup: action.group
      };
    case SET_SEARCHABLE_KPI_LIST:
      return {
        ...state,
        searchableKPIList: action.searchableKPIList
      };

    case SET_SELECTED_LANG:
      return {
        ...state,
        selectedLanguage: action.lang
      };
    case SET_MOBILE_OVERLAY_STATE:
      return {
        ...state,
        [action.overlayKey]: action.isOpen
      };

    case SET_SELECTED_COUNTRY_STATS:
      return {
        ...state,
        statsSelectedCountries: action.statsSelectedCountries
      };
    case SET_SELECTED_GROUPS:
      return {
        ...state,
        statsSelectedGroups: action.statsSelectedGroups
      };
    case SET_CLOSABLE_MODAL:
      return {
        ...state,
        closeableModal: action.closeableModal
      };
    case SET_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.breadcrumb
      };
    default:
      return {
        ...state
      };
  }
};

export default coreReducer;
