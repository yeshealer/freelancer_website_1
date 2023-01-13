import React from 'react';
import { Link } from 'react-router-dom';

import { _lang } from '../../../utils';

export default class CarouselComponent extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', padding: '0 7.5px 0 7.5px' }}>
        <Link to={`/realm/${this.props.carouselId}`}>
          <div className="hp-card">
            <div>
              <img src="/assets/svg/pillars-white.svg" />
              <div className="card-count">
                {this.props.carouselCount}
              </div>
              <div className="card-title">
                {this.props.carouselTitle}
              </div>
              <div className="card-content">
                {this.props.descriptionShort}
              </div>
            </div>
            <div className="hp-explore">
              <div>
                {_lang('see_details')}
              </div>
              <span><img src="/assets/svg/back-arrow-white.svg" /></span>
            </div>
          </div>
          <div style={{ clear: 'both' }} />
        </Link>
      </div>
    );
  }
}

