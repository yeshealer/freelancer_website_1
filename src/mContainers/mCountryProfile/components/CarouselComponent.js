import React from 'react';
import { Link } from 'react-router-dom';

class CarouselComponent extends React.Component {
    render() {
        return (
            <div className="hp-card">
                <div>
                    <img alt="" src="/assets/svg/pillars-white.svg" />
                    <div className="card-count">
                        {this.props.carouselCount} {this.props.index}
                    </div>
                    <div className="card-title">
                        {this.props.carouselTitle}
                    </div>
                    <div className="card-content">
                        {this.props.descriptionShort}
                    </div>
                </div>
                <div className="hp-explore">

                    <Link to='/explore'>
                        { this.props.carouselTitle === "Sustainable Development Goals" ? "SEE SDGS" : "SEE "+this.props.carouselTitle }
                    </Link>
                    <span><img src="/assets/svg/back-arrow-white.svg"/></span>
                </div>
            </div>
        )
    }
}

export default CarouselComponent;

