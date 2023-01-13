// React
import React from 'react';
import {Link} from 'react-router-dom';
import {
    setPageDirAndLang, togglePageDirAndLang
} from "../mCommons/mUtils";
import langUtils from "../mCommons/mUtils/langUtils";
import mAbout from "./mWorldMap/mAbout";
import mTC from "./mWorldMap/mTC";
import SDK from "../mCommons/mSDK";

export default class NotFound extends React.Component {
    constructor(props) {
        super(props);

        this.lang = langUtils;
        if (this.lang.currentEnglish)
            setPageDirAndLang("ltr", "en");
        else
            setPageDirAndLang("rtl", "ar");

        this.state = {
            lang: this.lang.getLang(),
            selectedClosableModal: ""
        };
        this.mAbout = new mAbout(this);
    }

    setActiveClosableModal(modalId) {
        this.setState({selectedClosableModal: modalId});
    }

    toggleLanguage() {
        togglePageDirAndLang();
        this.lang.changeLang();
        this.setState({lang: this.lang.getLang()});
    }

    componentDidMount() {

    }

    render() {

        return (
            <div className="home-page">
                {(() => {
                    if (this.state.selectedClosableModal === "about")
                        return this.mAbout.render();
                })()}
                {/* <div className="betaBadge"/> */}

                <div className="hp-main-content">
                    <div className="hp-top">
                        <div className="logo">
                            <img src={this.state.lang.logo_home_v2}/>
                        </div>

                        <div className="menu">
                            <span className="menu-item">
                                <a href="mailto:info@iph.sa">
                                    <img style={{height: 28}} src="/assets/svg/mail.svg"/>
                                    <span className="text-span">{this.state.lang.contact}</span>
                                </a>
                            </span>

                            <span onClick={() => this.setActiveClosableModal("about")} className="menu-item">
                                <img style={{height: 20}} src="/assets/svg/about-white.svg"/>
                                <span className="text-span">{this.state.lang.about}</span>
                            </span>

                            <span className="menu-item">
                                <a href="https://www.facebook.com/IPH_saudiarabia-109728776500600/" target="_blank">
                                    <img style={{height: 18}} src="/assets/svg/facebook-outlined.svg"/>
                                </a>
                            </span>

                            <span className="menu-item">
                                <a href="https://twitter.com/IPH_SaudiArabia/" target="_blank">
                                    <img style={{height: 18}} src="/assets/svg/twitter-outlined.svg"/>
                                </a>
                            </span>

                            <span onClick={() => this.toggleLanguage()} className="menu-item language">
                                {this.state.lang.lang}
                            </span>

                        </div>
                        <div className="clearfix"/>
                    </div>

                    <div className="hp-top-text">
                        <h1 className="h1-404">Not Found</h1>
                        <p>Hi there ! It's looking like you may have taken a wrong turn.</p>
                        <p>Don't worry... it happens to the best of us.</p>

                        <div className="hp-explore not-found">
                            <Link className="home-link" to='/'>
                                GO HOME
                            </Link>
                        </div>
                    </div>


                </div>

            </div>
        )
    }
};
