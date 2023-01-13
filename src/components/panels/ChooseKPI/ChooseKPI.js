/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { _lang, updatePath } from '../../../utils';
import PagePanel from '../../commons/PagePanel/PagePanel';
import SearchFilter from '../../commons/SearchFilter';

import './style.css';

import {
  setSelectedKPIAction,
  getWholeRealmTreeAction,
  setSearchableKpiListAction,
  setSelectedRealmAction,
  setBreadcrumbAction, getRankingKpiAction, setLoadingState, getKpiScoreMapAction, getKpiValueAction
} from '../../../redux'
import setBreadcrumbV2Action from '../../../redux/actions/setBreadcrumbV2Action';
import BreadCrumbComponent from '../../commons/BreadCrumbComponent';
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from '../../commons/Arrows';

const _ = require('lodash');

const settings = {
  // className: "slider variable-width",
  dots: false,
  infinite: false,
  centerMode: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  variableWidth: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,

  // nextArrow: !isMobile() ? <SampleNextArrow /> : '',
  // prevArrow: !isMobile() ? <SamplePrevArrow /> : '',
};

class ChooseKPI extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: [],
      tabIndex: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedLanguage !== this.props.selectedLanguage) {
      const { getWholeRealmTreeAction } = this.props;

      getWholeRealmTreeAction()
        .then(({ realmTreeList }) => {
          this.setState({ path: [realmTreeList[0]] });
        });
    }
  }

  componentDidMount() {
    const { getWholeRealmTreeAction } = this.props;

    getWholeRealmTreeAction()
      .then(({ realmTreeList }) => {
        this.setState({ path: [realmTreeList[0]] });
      });
  }

  renderKpiMenu() {
    const {
      realmTreeList, setSelectedKPIAction, setBreadcrumbV2Action, selectedYear,
      getKpiScoreMapAction, getRankingKpiAction, setLoadingState, getKpiValueAction
    } = this.props;

    const { path, tabIndex } = this.state;
    const kpiList = _.last(path) || { children: [] };
    const idPath = path.map(item => item.id);

    const kpiBreadcrumb = path.slice(1);
    const finalIndex = kpiBreadcrumb.length - 1;

    return (
      <div>
        <SearchFilter kpiList={this.props.searchableKPIList} />
        <div className='choose-kpi-tab-wrapper'>
          <div className="generic-tab">
            <div className="generic-tab-tabs">
              <Slider ref={slider => (this.slider = slider)} {...settings}>

                {realmTreeList.map((node, index) => {
                  // Set first node of the active path.
                  const { nodeTextMap: { title_short } } = node;
                  return (
                    <div
                      key={`gen_tab_${index}`}
                      onClick={() => {
                        this.setState({ path: [node], tabIndex: index });
                        this.slider.slickGoTo(index);
                      }}
                      className={(index === tabIndex) ? 'tab-item selected-tab' : 'tab-item'}
                    >
                      {title_short}
                    </div>
                  );
                })}
              </Slider>
            </div>

            <div className="generic-tab-breadcrumb">
              {kpiBreadcrumb.map((node, i) => {
                const { nodeTextMap: { title_short, title } } = node;
                return (
                  <div
                    key={`gen_tab_bc_${i}`}
                    onClick={() => {
                      this.setState({ path: path.slice(0, i + 2) });
                    }}
                    className={(i < finalIndex) ? 'active-branch' : ''}
                  >
                    {title_short || title} {i < finalIndex && <span className='separator'>/ </span>}
                  </div>
                );
              })}
            </div>

            <div className="generic-tab-list">
              {kpiList.children.filter(node => node).map((node, i) => {
                const { tag } = node;

                if (tag === 'kpi_page') {
                  const { kpi } = node;
                  const { kpiTextMap: { title } } = kpi;

                  return (
                    <div
                      key={`gen_tab_li_${i}`}
                      className='list-item'
                      onClick={() => {
                        setLoadingState(true);
                        setBreadcrumbV2Action(idPath);
                        setSelectedKPIAction(idPath, node);
                        getKpiValueAction(node.parentId, selectedYear);
                        getKpiScoreMapAction(kpi.id)
                          .then(() => getRankingKpiAction(kpi.id, null, null))
                          .then(() => {
                            setLoadingState(false);
                            updatePath();
                          });
                      }}
                    >
                      {title}
                    </div>
                  );
                }
                const { nodeTextMap: { title } } = node;

                return (
                  <div
                    key={`gen_tab_li_${i}`}
                    className='list-item'
                    onClick={() => {
                      this.setState({ path: [...path, node] });
                    }}
                  >
                    {path.length === 1 && this.renderIcons(node)} {title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderIcons = (subPillar) => {
    if (subPillar.iconType) {
      let iconPath = [];
      if (subPillar.label.includes('[SDG')) {
        iconPath = [
          `/assets/icons/sdgs/${subPillar.iconType}-white.png`,
          `/assets/icons/sdgs/${subPillar.iconType}-green.png`,
        ];
      } else {
        iconPath = [
          `/assets/svg/${subPillar.iconType.toLowerCase()}-white.svg`,
          `/assets/svg/${subPillar.iconType.toLowerCase()}-green.svg`,
        ];
      }

      return (
        <div className='icon-block'>
          <img
            src={`${iconPath[0]}`}
            className="icon-image icon-image-white"
            placeholder='placeholder'
          />
          <img
            src={`${iconPath[1]}`}
            className='icon-image icon-image-green'
            placeholder='placeholder'
          />
        </div>
      );
    }
  }

  render() {
    const { match } = this.props;
    const isOpen = (match.params.pageId === 'kpi');

    return (
      <PagePanel
        gradientClass="darkGreenGradientM"
        isOpen={isOpen}
        title={_lang('choose_kpi_title')}
        subTitle={<BreadCrumbComponent />}
      >
        {this.renderKpiMenu()}
      </PagePanel>
    );
  }
}

ChooseKPI.propTypes = {};

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
  searchableKPIList: state.coreReducer.searchableKPIList,
  realmObj: state.realmReducer,
  breadcrumb: state.coreReducer.breadcrumb,
  realmTreeList: state.realmReducer.realmTreeList,
  selectedLanguage: state.coreReducer.selectedLanguage,
  selectedYear: state.coreReducer.selectedYear
});

const actions = {
  setSelectedKPIAction,
  getWholeRealmTreeAction,
  setSearchableKpiListAction,
  setSelectedRealmAction,
  setBreadcrumbAction,
  getRankingKpiAction,
  setLoadingState,
  getKpiScoreMapAction,
  setBreadcrumbV2Action,
  getKpiValueAction
};

export default withRouter(connect(mapStateToProps, actions)(ChooseKPI));
