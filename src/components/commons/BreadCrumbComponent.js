import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { trimString } from '../../utils';

const _ = require('lodash');

class BreadCrumbComponent extends React.Component {
  render() {
    const { breadcrumb, selectedKPI } = this.props;
    const kpiName = _.get(selectedKPI, 'kpi.kpiTextMap.title', null);

    if (breadcrumb.length === 3 && kpiName) {
      const realmName = breadcrumb[0].nodeTextMap.title_short || 'Missing Short Title';
      const pillarName = breadcrumb[1].nodeTextMap.title;
      const subPillarName = breadcrumb[2].nodeTextMap.title;

      return (
        <span>{trimString(`${realmName} > ${pillarName} > ${subPillarName} > ${kpiName}`)}</span>
      );
    }
    
    return <span />;
  }
}

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
  breadcrumb: state.coreReducer.breadcrumb
});

const actions = {};

export default withRouter(connect(mapStateToProps, actions)(BreadCrumbComponent));
