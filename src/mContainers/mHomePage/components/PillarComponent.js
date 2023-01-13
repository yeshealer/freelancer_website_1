import React from 'react';
import {Link} from 'react-router-dom';

export default class PillarComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="hp-card">
                <div>
                    <img src="/assets/svg/pillars-white.svg"/>
                    <div className="card-count">
                        {this.props.pillarCount} {this.props.index}
                    </div>
                    <div className="card-title">
                        Main Pillars
                        {/*this.props.pillarTitle*/}
                    </div>
                    <div className="card-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </div>
                <div className="hp-explore">

                    <Link to='/explore'>
                        SEE PILLARS
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

