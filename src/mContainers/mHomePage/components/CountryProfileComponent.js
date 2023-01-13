import React from 'react';
import { Link } from 'react-router-dom';

import { _lang } from '../../../utils';

export default class CountryProfileComponent extends React.Component {
  render() {
    return (
      <div style={{ width: '100%', padding: '0 7.5px 0 7.5px' }}>
        <Link to='/world-countries'>
          <div className="hp-card">
            <div>
              <img src="/assets/svg/world-ranking-white.svg" />
              <div className="card-count">
                {this.props.countryCount}
              </div>
              <div className="card-title">
                {_lang('country_profile_card_title')}
              </div>
              <div className="card-content">
                {_lang('country_profile_card_description')}
              </div>
            </div>
            <div className="hp-explore">
              <div>
                {_lang('see_details')}
              </div>
              <span><img src="/assets/svg/back-arrow-white.svg" /></span>
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
