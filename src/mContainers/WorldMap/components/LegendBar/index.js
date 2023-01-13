import React, { Component } from 'react';
import { connect } from 'react-redux';

import { _lang } from '../../../../utils';

import './LegendBar.css';

const _ = require('lodash');

class LegendBar extends Component {
  render() {
    const { selectedKPI } = this.props;
    const title = _.get(selectedKPI, 'kpi.kpiTextMap.title', null);
    return (
      <div className="kpiLegend">
        <div className="legendTextBox">
          {_lang('selected_kpi')}: <span className="kpiLegendText">{title}</span>
        </div>
        <div className="legendBarDesktop">
          <div className="clearfix" />
          <img src="/assets/images/legend-bar.png" className="legendImgM" alt="Legend bar" />
          <div className="lowBar">{_lang('low')}</div>
          <div className="highBar">{_lang('high')}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
});

const actions = {};

export default connect(mapStateToProps, actions)(LegendBar);
