// React
import React from 'react'

import 'fixed-data-table/dist/fixed-data-table.css';
import {isMobile} from "../../mCommons/mUtils";
// import { Table, Column, Cell } from 'fixed-data-table';
// import { getWidth, getHeight } from '../../mCommons/mUtils';


class mAbout {
    constructor(self) {
        this.self = self;
    }

    didUpdated() {

    }

    closeModal() {
        this.self.setState({selectedClosableModal: ""})
    }

    render() {

        // + (!isMobile() ? "desktopAboutModal" : ""
        return (
            <div style={{position: "fixed"}} className={"fullScreenModal Stats-Table desktopAboutModal"}>
                <span onClick={this.closeModal.bind(this)} className="exit-img-icon-modal"/>
                <div className="customScrollbar">
                    {/*<div className="modalHeaderM">*/}
                        {/*<div className="titleM">{this.self.state.lang.about}</div>*/}
                    {/*</div>*/}
                    {/*<div className="gapM"/>*/}
                    <div className="innerSidePadding">
                        <span dangerouslySetInnerHTML={{__html: this.self.state.lang.about_text}} />
                    </div>
                </div>
            </div>
        );
    }
}

export default mAbout;
