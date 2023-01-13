// React
import React from 'react'
import {
    Link
} from 'react-router-dom'
import './SideMenu.css';
import {isMobile} from "../../../../mCommons/mUtils";

const menuItemM = (self, menuId, menuTitle, menuSubTitle, menuIcon) => {
    return (<div onClick={() => {
        self.setActiveModal(menuId)
    }} className={"menuItemM bottomBorderM" + ((self.state.selectedModal === menuId) ? " activeItemM" : "")}>
        <div className={"menuIcon " + menuIcon + ((self.state.selectedModal === menuId) ? " activeIconM" : "")}/>
        <div className="menuText">
            {menuTitle}
            <span>{menuSubTitle}</span>
        </div>
    </div>);
};

const SideMenu_UNMODIFIED = (self) => {
    // if(self.state.isDesktopMode)
    //     return;
    let menuClass = "mobileMenuWrapperM";
    menuClass += (isMobile()) ? " mobileMenuMode ": " desktopMenuMode ";
    menuClass += self.state.mobileMenuIsVisible;

    return (
        <div className={menuClass}>
            <div className="mobileMenuM">
                <div className="logoM bottomBorderM" style={{position: "relative"}}>
                    <Link to={`/`}>
                        <img
                            src={self.state.lang.id === 1 ? '/assets/images/new_logo_ar.png' : '/assets/images/new_logo_en.png'}
                            alt="Logo"/>
                    </Link>
                    {self.state.isDesktopMode &&
                    <div className="exit-img-icon" onClick={self.hideMobileMenuM.bind(self)}/>}
                </div>

                {menuItemM(self, "chooseKPI", self.state.lang.choose_kpi_title, self.getPillarKPIBreadcrumb(false), "kpi-icon marginTop")}
                {menuItemM(self, "worldRanking", self.state.lang.world_ranking_title, self.state.selectedGroupName, "ranking-img-icon")}
                {menuItemM(self, "compare", self.state.lang.compare_title, self.state.lang.menu_multiple_countries, "compare-img-icon")}
                {menuItemM(self, "countryDetails", self.state.lang.search_country_title, self._e(self.state.countryIdMap[self.state.selectedCountry], "countryName"), "search-img-icon")}

                <div className="bottomItemM">
                    <div className="bottomSubItem" onClick={() => {
                        self.setActiveClosableModal("about")
                    }}>
                        <div className="about-img-icon aboutIconM"/>
                        {self.state.lang.about}
                    </div>

                    <div className="bottomSubItem langTextFontM" onClick={() => {
                        self.toggleLanguage()
                    }}>
                        {self.state.lang.lang}
                    </div>

                    {/*<div className="bottomSubItem" onClick={() => {*/}
                        {/*self.setActiveClosableModal("deepDives")*/}
                    {/*}}>*/}
                        {/*{self.state.lang.deep_dives}*/}
                    {/*</div>*/}
                </div>
            </div>

            <div onClick={() => {
                self.toggleMobileMenuM();
            }} className="mobileMenuGapM"/>
        </div>
    );
};

export default SideMenu_UNMODIFIED;
