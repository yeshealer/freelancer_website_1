import React, { Component } from "react";
import * as Scroll from "react-scroll";
import { Tooltip } from "react-tippy";
import _ from "lodash";
import Slider from "react-slick";
import { connect } from "react-redux";

import { isMobile } from "../../../mCommons/mUtils";
import {
  SampleNextArrow,
  SamplePrevArrow,
} from "../../../components/commons/Arrows";

// Redux
import { updateSelectedKpi } from "../../../redux";
import { _lang } from "../../../utils";

class CategoryPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCategoryPanelOpen: true,
      tabIndex: 0,
      targetVisable: true,
      kpiClass: false,
      indicatorClass: false,
      selectedIndicatorLabel: null,
      selectedTargetLabel: null,
      selectedRealmLabel: null,
      backButton: true,
      overallIcon: true,
      activeRealmId: null,
      selectedKPI: "",
      selectedGoal: [],
    };
  }

  componentDidMount() {
    Scroll.scrollSpy.update();
  }

  createBreadCrumbs = () => {
    const { selectedIndicatorLabel, selectedTargetlabel } = this.state;
    const realms = this.props.kpiObjs.scoreAndRank;
    const realm = realms[this.state.tabIndex];

    if (realms.length) {
      const selectedRealm =
        realm.nodeTextMap.title_short || "Missing title_short";

      if (selectedTargetlabel && !selectedIndicatorLabel) {
        return (
          <div className="itemH2M">
            {`${selectedRealm} / `}
            <span className="currentBreadCrumb">{selectedTargetlabel}</span>
          </div>
        );
      }

      if (selectedTargetlabel && selectedIndicatorLabel) {
        return (
          <div
            className="itemH2M"
            onClick={() => {
              this.setState({
                selectedKPI: null,
                selectedIndicatorLabel: null,
                kpiClass: false,
                indicatorClass: false,
                targetVisable: true,
                selectedTargetlabel: null,
                backButton: true,
                overallIcon: true,
              });
            }}
          >
            {`${selectedRealm} / ${selectedTargetlabel} / `}
            <span className="currentBreadCrumb">{selectedIndicatorLabel}</span>
          </div>
        );
      }

      return <div className="itemH2M" />;
    }
  };

  handleSelect = (index) => {
    this.setState({
      tabIndex: index,
      targetVisable: true,
      indicatorClass: false,
      kpiClass: false,
      selectedIndicatorLabel: null,
      selectedTargetlabel: null,
      backButton: true,
      overallIcon: true,
    });

    this.props.updateSelectedKpi([]);
  };

  createSubPillarList = () => {
    let { selectedGoal } = this.state;
    selectedGoal.forEach((goal) => {
      goal.children = goal.children.filter((child) => child !== null);
    });
    selectedGoal = selectedGoal.filter((goal) => goal.children.length > 0);

    return (
      <div className="indicatorWrapper">
        <ul
          className={
            this.state.indicatorClass ? "indicatorSlide" : "indicatorUl"
          }
        >
          {selectedGoal.map((child) => (
            <Scroll.Link
              duration={500}
              smooth
              to={`Content_${child.nodeTextMap.title}`}
              offset={isMobile() ? -120 : -75}
              activeClass="active"
            >
              <li
                onClick={() => {
                  this.setState({
                    selectedIndicator: child.id,
                    selectedIndicatorLabel: child.nodeTextMap.title,
                    mobilePanelCollapsed: true,
                  });

                  this.props.collapsePanel();
                }}
                className={
                  this.state.selectedIndicator === child.id
                    ? "indicator active"
                    : "indicator"
                }
              >
                <span className="indicatorLabel">
                  {child.nodeTextMap.title}
                </span>
              </li>
            </Scroll.Link>
          ))}
        </ul>
      </div>
    );
  };

  createTabs = (realms) => {
    const settings = {
      infinite: false,
      speed: 500,
      slidesToShow: 2.5,
      slidesToScroll: 1,
      className: "realmList",
      nextArrow: !isMobile() ? <SampleNextArrow /> : "",
      prevArrow: !isMobile() ? <SamplePrevArrow /> : "",
      focusOnSelect: true,
      centerPadding: "20px",
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
          },
        },
        {
          breakpoint: 920,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: false,
            initialSlide: 2,
            arrows: false,
          },
        },
        {
          breakpoint: 810,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
            initialSlide: 2,
            centerMode: true,
          },
        },
        {
          breakpoint: 765,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
            centerMode: true,
          },
        },
        {
          breakpoint: 550,
          settings: {
            arrows: false,
            slidesToShow: 2.5,
            slidesToScroll: 1,
            infinite: false,
            focusOnSelect: true,
          },
        },
      ],
    };
    return (
      <Slider {...settings}>
        {realms.map((realm, i) => (
          <button
            onClick={() => {
              this.setState({
                tabIndex: i,
                targetVisable: true,
                indicatorClass: false,
                kpiClass: false,
                selectedIndicatorLabel: null,
                selectedTargetlabel: null,
                backButton: true,
                overallIcon: true,
                activeRealmId: realm.id,
              });
            }}
            className={
              this.state.activeRealmId === realm.id
                ? "tabsNavigation active"
                : "tabsNavigation"
            }
            key={`label_${realm.id}`}
          >
            {realm.name}
          </button>
        ))}
      </Slider>
    );
  };

  createDotNavigation = (realms) =>
    realms.map((realm, i) => (
      <li
        key={"dot_nav_" + i.toString()}
        className={this.state.tabIndex === i ? "active" : ""}
      >
        <button
          onClick={() => {
            this.setState({
              tabIndex: i,
              activeRealmId: realm.id,
            });
          }}
          className="realmDot"
        />
      </li>
    ));

  collapsePanel() {
    this.setState({ isCategoryPanelOpen: !this.state.isCategoryPanelOpen });
  }

  renderIcons = (subPillar) => {
    if (subPillar.iconType) {
      let iconPath = [];
      if (subPillar.label.includes("[SDG")) {
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
        <div style={{ display: "inline" }}>
          <img
            src={`${iconPath[0]}`}
            className="icon-image icon-image-white"
            placeholder="placeholder"
            alt=""
          />
          <img
            src={`${iconPath[1]}`}
            className="icon-image icon-image-green"
            placeholder="placeholder"
            alt=""
          />
        </div>
      );
    }
  };

  renderPillarList = (realms) => {
    const { kpiObjs } = this.props;
    const { scoreAndRank } = kpiObjs;
    const pillarList = [];
    pillarList.push(this.renderOverallPillar());
    pillarList.push(
      <div key="pillar_list_div_2">
        <ul
          className={this.state.targetVisable ? "targetSlide" : "targetUl"}
          onClick={() =>
            this.setState({ indicatorClass: true, targetVisable: false })
          }
        >
          {realms.map((realm) => {
            const realmTreeListId = scoreAndRank[this.state.tabIndex].id;

            if (scoreAndRank.length && realmTreeListId === realm.id) {
              const subPillars = scoreAndRank[this.state.tabIndex].children;

              subPillars.sort((a, b) => {
                return a.nodeTextMap.title < b.nodeTextMap.title
                  ? -1
                  : a.nodeTextMap.title > b.nodeTextMap.title
                  ? 1
                  : 0;
              });

              return subPillars.map((subPillar) => {
                const isActivePillar =
                  this.state.selectedPillarId === subPillar.id ? "active" : "";
                const subPillarTitle = _.get(
                  subPillar.nodeTextMap,
                  "title",
                  "Missing Title"
                );

                return (
                  <li
                    onClick={() => {
                      this.setState({
                        selectedPillarId: subPillar.id,
                        selectedGoal: subPillar.children,
                        indicatorClass: true,
                        selectedTargetlabel: subPillar.nodeTextMap.title,
                        backButton: false,
                        overallIcon: false,
                      });

                      this.props.updateSelectedKpi(subPillar.children);
                    }}
                    className={`${isActivePillar} target`}
                    key={subPillar.id}
                  >
                    {this.renderIcons(subPillar)}
                    <span className="pillarLabel">{subPillarTitle}</span>
                    {/*  <Tooltip
                      disabled={this.state.isCategoryPanelOpen}
                      title={subPillarTitle}
                      position="right"
                      trigger="mouseenter"
                      animation="shift"
                      arrow
                      size="big"
                      className="black-tootip"
                      distance={20}
                      duration={0}
                    >
                      {this.renderIcons(subPillar)}
                      <span className="pillarLabel">{subPillarTitle}</span>
                    </Tooltip> */}
                  </li>
                );
              });
            }

            return null;
          })}
        </ul>
        {this.createSubPillarList()}
      </div>
    );
    return pillarList;
  };

  renderOverallPillar = () => (
    <li key="overall_pillar_li" className="target">
      <Scroll.Link
        duration={500}
        spy
        activeClass="active"
        smooth
        to={"Content_Overall"}
      >
        <img
          src={"/assets/svg/overall-white.svg"}
          className={
            this.state.overallIcon ? "icon-image icon-image-white" : "hidden"
          }
        />
        <img
          src={"/assets/svg/overall-green.svg"}
          className={
            this.state.overallIcon ? "icon-image icon-image-green" : "hidden"
          }
        />

        {/*   <Tooltip
          disabled={this.state.isCategoryPanelOpen}
          title={_lang("overall")}
          position="right"
          trigger="mouseenter"
          animation="shift"
          arrow
          size="big"
          className="black-tootip"
          distance={20}
          duration={0}
        >
          <img
            src={"/assets/svg/overall-white.svg"}
            className={
              this.state.overallIcon ? "icon-image icon-image-white" : "hidden"
            }
          />
          <img
            src={"/assets/svg/overall-green.svg"}
            className={
              this.state.overallIcon ? "icon-image icon-image-green" : "hidden"
            }
          />
        </Tooltip> */}

        <span>{_lang("overall")}</span>
      </Scroll.Link>
    </li>
  );

  renderMobieCloseButton = () => (
    <div
      onClick={() => {
        this.props.collapsePanel();
      }}
      className="clos/*  */e-button mobileClose"
    >
      <img src="/assets/svg/close-panel-white.svg" alt="" />
    </div>
  );

  render() {
    if (!this.props.kpiObjs.scoreAndRank) {
      return null;
    }
    const { scoreAndRank } = this.props.kpiObjs;
    const realms = scoreAndRank.map((realm) => ({
      name: realm.nodeTextMap.title_short || "Missing title_short",
      id: realm.id,
      kpis: realm.children,
    }));

    return (
      <div
        className={`categories ${
          this.state.isCategoryPanelOpen ? "opened" : "closed"
        }`}
      >
        {isMobile() ? (
          this.renderMobieCloseButton()
        ) : (
          <div
            className="action"
            onClick={() => {
              if (this.props.collapsePanel === undefined) {
                this.collapsePanel();
              } else {
                this.props.collapsePanel();
              }
            }}
          />
        )}
        <div className="scroll-area">
          <ul>
            <div>
              <div
                className={
                  this.state.isCategoryPanelOpen
                    ? "menu-open realm-tab"
                    : "menu-closed"
                }
              >
                {this.createTabs(realms)}
                <ul className="slick-dots">
                  {this.createDotNavigation(realms)}
                </ul>
                <div className="targetWrapper">
                  {this.createBreadCrumbs()}
                  {this.renderPillarList(realms)}
                </div>
              </div>
            </div>
          </ul>
        </div>
      </div>
    );
  }
}

const actions = {
  updateSelectedKpi,
};

const mapStateToProps = (state) => ({
  kpiObjs: state.countryProfileReducer,
  countryObj: state.countryReducer,
  realmObj: state.realmReducer,
  selectedCountry: state.coreReducer.selectedCountry,
});

export default connect(mapStateToProps, actions)(CategoryPanel);
