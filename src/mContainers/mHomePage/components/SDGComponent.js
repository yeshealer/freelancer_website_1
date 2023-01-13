import React from 'react';
import {Link} from 'react-router-dom';

export default class SDGComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="hp-card">
                <div>
                    <img src="/assets/svg/KPI-white.svg"/>
                    <div className="card-count">
                        {this.props.sdgCount}
                    </div>
                    <div className="card-title">
                        Sustainable Development Goals
                        {/*this.props.pillarTitle*/}
                    </div>
                    <div className="card-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </div>
                <div className="hp-explore">
                    <Link to='/explore'>
                        SEE SDGS
                        {
                            //this.props.explorePillar
                        }
                    </Link>
                    <span><img src="/assets/svg/back-arrow-white.svg"/></span>
                </div>
            </div>
        )
    }
}