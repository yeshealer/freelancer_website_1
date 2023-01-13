// React
import React from 'react'
import 'fixed-data-table/dist/fixed-data-table.css';
import {isMobile} from "../../mCommons/mUtils";

class mDeepDives {
    constructor(self) {
        this.self = self;
    }

    didUpdated() {

    }

    closeModal() {
        this.self.setState({selectedClosableModal: ""})
    }

    render() {
        return (
            <div className={"fullScreenModal Stats-Table " + (!isMobile() ? "desktopAboutModal" : "")}>

                <div>
                    <div onClick={this.closeModal.bind(this)} className="exit-img-icon"/>
                    <div className="modalHeaderM">
                        <div className="titleM">{this.self.state.lang.deep_dives}</div>
                    </div>
                    <div className="gapM"/>
                    <div className="innerSidePadding deep-dives-table">
                        <table key={"deepDives_table"}>
                            <tr key={"deepDives_tableHeader"}>
                                <th>{this.self.state.lang.kpi_id}</th>
                                <th>{this.self.state.lang.kpi_name}</th>
                                <th>{this.self.state.lang.release_date}</th>
                                <th>{this.self.state.lang.file_for_arabic}</th>
                                <th>{this.self.state.lang.file_for_english}</th>
                            </tr>
                            {(() => {
                                let cells = [];

                                this.self.state.deepDivesData.forEach((x) => {
                                    let date = new Date(x.releaseDate);
                                    cells.push(
                                        <tr key={"deepDives_" + x.kpiId}>
                                            <td>{x.kpiId}</td>
                                            <td>{(this.self.lang.currentEnglish) ? x.nameEn : x.nameAr}</td>
                                            <td>{date.toGMTString()}</td>
                                            <td><a
                                                href={x.linkAr}>{(this.self.lang.currentEnglish) ? "Arabic File" : "ملف عربي"}</a>
                                            </td>
                                            <td><a
                                                href={x.linkEn}>{(this.self.lang.currentEnglish) ? "English File" : "ملف اللغة الانجليزية"}</a>
                                            </td>
                                        </tr>
                                    );
                                });
                                return cells;
                            })()}
                        </table>

                    </div>
                </div>
            </div>
        );
    }
}

export default mDeepDives;
