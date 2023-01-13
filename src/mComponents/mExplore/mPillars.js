import React from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { connect } from "react-redux";
//import { Tooltip } from "react-tippy";
import * as Tooltip from "react-tippy";

import setSelectedKPIAction from "../../redux/actions/setSelectedKPIAction";
import { getRealmListAction, getWholeRealmTreeAction } from "../../redux";
import Loader from "./mLoader";
import { getPillarIcon } from "../../mCommons/mUtils/pillarsUtil";

import { _lang, getLanguageKey, isMobile } from "../../utils";

import "./mPillars.css";
import "./Pillars.css";

class Pillars extends React.Component {
  componentWillMount() {}

  componentDidMount() {
    const {
      realmObj,
      getWholeRealmTreeAction,
      getRealmListAction,
    } = this.props;

    if (!realmObj || !realmObj.realmTreeList.length) {
      getWholeRealmTreeAction();
      getRealmListAction();
    }
  }

  selectPillar(realmId, data) {
    const { setSelectedKPIAction: getSelectedKPI } = this.props;
    this.props.update("selectedPillar", data, 2);
    getSelectedKPI([realmId, data.id], null);
  }

  createRealmList = (realmTreeList) => {
    const realmTreeListMap = {};

    realmTreeList.forEach((realm) => {
      realmTreeListMap[realm.id] = realm;
    });

    if (!realmTreeList.length) {
      return <Loader />;
    }

    const { realmId } = this.props.self.props.match.params;

    const selectedTab = realmTreeList.findIndex(
      (realm) => realmId === String(realm.id)
    );

    return realmTreeList.map((realm) => {
      if (realmTreeList[selectedTab].id === realm.id) {
        return realmTreeListMap[realm.id].children.map((selectedRealm) => {
          return (
            <button
              key={selectedRealm.id}
              value={selectedRealm.id}
              onClick={this.selectPillar.bind(this, realm.id, selectedRealm)}
            >
              <div className="imageHolderM">
                <div
                  style={{ display: "none" }}
                  className={`${
                    getPillarIcon(selectedRealm)
                      ? getPillarIcon(selectedRealm).replace(/ /g, "")
                      : selectedRealm.iconType
                  } activeM`}
                />
                <div
                  className={`${
                    getPillarIcon(selectedRealm)
                      ? getPillarIcon(selectedRealm).replace(/ /g, "")
                      : selectedRealm.iconType
                  } ${
                    this.props.selected &&
                    this.props.selected.id === selectedRealm.id
                      ? "activeM"
                      : ""
                  }`}
                />
              </div>
              <div className="textHolderM">
                <p
                  className={
                    this.props.selected &&
                    this.props.selected.id === selectedRealm.id
                      ? "activeM"
                      : ""
                  }
                >
                  {isMobile()
                    ? selectedRealm.nodeTextMap.title
                    : selectedRealm.nodeTextMap.title
                      /*  <Tooltip
                      title={selectedRealm.nodeTextMap.title || "Missing Title"}
                      position="top-left"
                      trigger="mouseenter"
                      animation="shift"
                      arrow={true}
                      size="big"
                      className="black-tootip"
                      distance={20}
                      duration={0}
                    >
                      {selectedRealm.nodeTextMap.title || "Missing Title"}
                    </Tooltip> */
                  }
                </p>
              </div>
            </button>
          );
        });
      }
    });
  };

  createTabs = (realmTreeList) => {
    if (!realmTreeList.length) {
      return <Loader />;
    }

    const { realmId } = this.props.self.props.match.params || 0;

    return (
      <div className="realm-tab">
        <Tabs
          selectedIndex={this.props.self.state.tabIndex}
          onSelect={(tabIndex) => this.props.self.setState({ tabIndex })}
        >
          <TabList>
            {realmTreeList.map((realm, i) => {
              if (realmId === String(realm.id)) {
                return (
                  <Tab key={`tab_key_${i}`}>
                    {realm.nodeTextMap.title_short || "Missing title_short"}
                  </Tab>
                );
              }
            })}
          </TabList>
          {realmTreeList.map((realm) => {
            if (realmId === String(realm.id)) {
              return (
                <TabPanel className="hidden" key={realm.id}>
                  {realm.id}
                </TabPanel>
              );
            }
          })}
        </Tabs>
      </div>
    );
  };

  createVerticalStep = () => {
    if (getLanguageKey() === "en") {
      return (
        <h1
          className="verticalLine"
          onClick={
            this.props.selected
              ? this.props.update.bind(this, "", null, 1)
              : () => {}
          }
          style={
            this.props.currentStep === this.props.step
              ? { opacity: 1 }
              : { opacity: this.props.opacity }
          }
        >
          01
          {this.props.selected ? (
            <div className="pillarNameM">
              {this.props.selected.nodeTextMap.title || "Missing Title"}
            </div>
          ) : (
            ""
          )}
        </h1>
      );
    }
  };

  createBreadCrumbs = () => {
    return (
      <Link to="/">
        <img
          src={
            getLanguageKey() === "ar"
              ? "/assets/images/arrow-right.svg"
              : "/assets/images/arrow-left.svg"
          }
          alt="placeholder"
        />
        <span>{_lang("home")}</span>
      </Link>
    );
  };

  render() {
    const selectedRealmId = this.props.self.props.match.params.realmId;

    const { realmTreeList } = this.props.realmObj;
    const initialIndex = realmTreeList.findIndex(
      (elem) => String(elem.id) === selectedRealmId
    );

    let pillarContainerClassName = "pillarsContainerM pillar-component";
    pillarContainerClassName +=
      this.props.currentStep === this.props.step
        ? " activeM flexBox8"
        : " minimizedM flexBox1";
    pillarContainerClassName +=
      getLanguageKey() === "en" ? " leftM" : " rightM";

    let stepContentMClassName = "stepContentM";
    stepContentMClassName +=
      this.props.currentStep !== this.props.step
        ? " displayNone"
        : " displayFlex";

    return (
      <div className={pillarContainerClassName}>
        {this.createVerticalStep()}

        <div className={stepContentMClassName}>
          <div className="topM">{this.createBreadCrumbs()}</div>
          <div className="middleM">
            {this.createTabs(realmTreeList, initialIndex)}
            <p>{_lang("pillars_tag")}</p>
          </div>
          <div className="bottomM">{this.createRealmList(realmTreeList)}</div>
          <div className="spaceHolderM" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    realmObj: state.realmReducer,
  };
};

const actions = {
  getWholeRealmTreeAction,
  setSelectedKPIAction,
  getRealmListAction,
};

export default connect(mapStateToProps, actions)(Pillars);
