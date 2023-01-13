import React from 'react';
import {Link} from 'react-router-dom';

export default class DeepDivesComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="hp-card">
                <div>
                    <img src="/assets/svg/pillars-white.svg"/>
                    <div className="card-count">
                        25
                    </div>
                    <div className="card-title">
                        Deep Dives
                        {/*this.props.pillarTitle*/}
                    </div>
                    <div className="card-content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </div>
                </div>
                <div className="hp-explore">
                    <Link to='/explore'>
                        SEE DEEP DIVES
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

