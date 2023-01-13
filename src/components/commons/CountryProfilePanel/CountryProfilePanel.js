import React from 'react';
import './style.css';
import * as Scroll from 'react-scroll';

import { isMobile, updatePath } from '../../../utils';
import {
  getKpiScoreMapAction,
  getRankingKpiAction,
  getWholeRealmTreeAction, setBreadcrumbAction, setLoadingState,
  setSearchableKpiListAction,
  setSelectedKPIAction,
  setSelectedRealmAction
} from '../../../redux';
import setBreadcrumbV2Action from '../../../redux/actions/setBreadcrumbV2Action';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setActivePathAction, updateSelectedKpi } from '../../../redux/actions/countryProfile';
import Slider from "react-slick";
import { SampleNextArrow, SamplePrevArrow } from '../Arrows';

const _ = require('lodash');
const scroller = Scroll.scroller;

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

class CountryProfilePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      path: [],
      tabIndex: 0,
    };
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

  componentDidMount() {
    // const { getWholeRealmTreeAction } = this.props;
    //
    // getWholeRealmTreeAction()
    //   .then(({ realmTreeList }) => {
    //     this.setState({ path: [realmTreeList[0]] });
    //   });

    const { scoreAndRank } = this.props;
    this.setState({ path: [scoreAndRank[0]], tabIndex: 0 });
  }

  render() {
    const {
      scoreAndRank, setSelectedKPIAction, setBreadcrumbV2Action,
      getKpiScoreMapAction, getRankingKpiAction, setLoadingState, setActivePathAction,
      onClose
    } = this.props;

    const { path, tabIndex } = this.state;
    const kpiList = _.last(path) || { children: [] };
    const idPath = path.map(item => item.id);

    const kpiBreadcrumb = path.slice(1);
    const finalIndex = kpiBreadcrumb.length - 1;

    return (
      <div className={'country-profile-panel'}>
        <div onClick={() => onClose()} className="exit-img-icon" />
        <div className="generic-tab">

          <div className="generic-tab-tabs">
            <Slider ref={slider => (this.slider = slider)} {...settings}>
            {scoreAndRank.map((node, index) => {
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
              const { nodeTextMap: { title } } = node;
              return (
                <div
                  key={`gen_tab_li_${i}`}
                  className='list-item'
                  onClick={() => {
                    if (path.length < 2) {
                      // Set active path, we use it on GraphCard.
                      this.props.setActivePathAction([...path, node]);

                      // Set active kpi list
                      this.props.updateSelectedKpi(node.children);

                      // Set path of the current leaf
                      this.setState({ path: [...path, node] });
                    } else {
                      if (isMobile()) {
                        onClose();
                      }

                      // Scroll to selected kpi category.
                      scroller.scrollTo(`Content_${node.nodeTextMap.title}`, {
                        duration: 1500,
                        delay: 100,
                        smooth: true,
                        offset: -60
                      });
                    }
                  }}
                >
                  {path.length === 1 && this.renderIcons(node)} <span>{title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
  searchableKPIList: state.coreReducer.searchableKPIList,
  realmObj: state.realmReducer,
  breadcrumb: state.coreReducer.breadcrumb,
  realmTreeList: state.realmReducer.realmTreeList,
  selectedLanguage: state.coreReducer.selectedLanguage,
  scoreAndRank: state.countryProfileReducer.scoreAndRank
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
  updateSelectedKpi,
  setActivePathAction
};
export default withRouter(connect(mapStateToProps, actions)(CountryProfilePanel));

