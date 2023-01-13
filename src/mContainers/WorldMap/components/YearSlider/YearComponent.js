import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import getRankingKpiAction from '../../../../redux/actions/getRankingKpiAction';
import setSelectedYearAction from '../../../../redux/actions/setSelectedYearAction';
import getPath from '../../../../utils/getPath';
import setMapColors from '../Map/utils/setMapColors';
import { withRouter } from 'react-router-dom';
import { updatePath } from '../../../../utils';
import { getKpiValueAction, setLoadingState } from '../../../../redux'

const _get = require('lodash/get');

class YearComponent extends React.Component {

  onYearSelected() {
    const { setSelectedYearAction, getRankingKpiAction, year,
      selectedKPI, selectedGroup, setLoadingState, getKpiValueAction } = this.props;
    const selectedKPIId = _get(selectedKPI, 'kpi.id', null);
    const selectedKPIParentId = _get(selectedKPI, 'parentId', null);

    setLoadingState(true);
    setSelectedYearAction(year);

    getKpiValueAction(selectedKPIParentId, year)
      .then(() => getRankingKpiAction(selectedKPIId, year, selectedGroup.groupId))
      .then(value => {
        setMapColors(value.rankingKpiList);
      })
      .then(() => {
        updatePath();
        setLoadingState(false);
      });
  }

  render() {
    const { selectedYear, year, setSelectedYearAction } = this.props;

    const yearClassNameM = (selectedYear === year) ? 'active' : '';
    const activeId = (selectedYear === year) ? 'activeMenu' : '';

    return (
      <div id={activeId} className="itemM">
        <a onClick={this.onYearSelected.bind(this)} className={yearClassNameM}>{year}</a>
        <hr />
      </div>
    );
  }
}

YearComponent.propTypes = {
  selectedYear: PropTypes.any,
  year: PropTypes.any
};

const mapStateToProps = (state) => ({
    selectedKPI: state.coreReducer.selectedKPI,
    selectedYear: state.coreReducer.selectedYear,
    selectedGroup: state.coreReducer.selectedGroup,
  });

const actions = {
  getRankingKpiAction,
  setSelectedYearAction,
  setLoadingState,
  getKpiValueAction
};

export default withRouter(connect(mapStateToProps, actions)(YearComponent));
