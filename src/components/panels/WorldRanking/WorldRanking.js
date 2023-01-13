import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Select from 'react-select';
import { getRankingKpiAction } from '../../../redux';
import setSelectedGroupAction from '../../../redux/actions/setSelectedGroupAction';

import { _lang, isMobile, updatePath } from '../../../utils'
import { trimString, getHeight } from '../../../mCommons/mUtils';
import PagePanel from '../../commons/PagePanel/PagePanel';

import getCountryListAction from '../../../redux/actions/getCountryListAction';
import FormatUtils from './FormatUtils';
import { ExportToExcelButton } from '../../commons/ExportToExcelButton';

import './styles/rankingTable.css';
import BreadCrumbComponent from '../../commons/BreadCrumbComponent'

class WorldRanking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate() {
    const tableDiv = document.getElementsByClassName('react-bs-container-body');
    if (tableDiv.length > 0) {
      tableDiv[0].style.height = '0px';
    }

    const heightOfScrollDiv = 260;
    const heightOfPage = getHeight() - heightOfScrollDiv;

    if (tableDiv.length > 0) {
      tableDiv[0].style.height = `${heightOfPage}px`;
    }
  }

  onSortChange(sortName, sortOrder) {
    const scrollContent = document.getElementsByClassName('react-bs-container-body');
    if (scrollContent.length > 0) { scrollContent[0].scrollTop = 0; }
  }

  render() {
    const {
      match, selectedKPI, groupList, selectedGroup, countryKeyMap,
      setSelectedGroupAction, getRankingKpiAction, rankingKpiList
    } = this.props;


    let isOpen;
    if (isMobile()) {
      isOpen = (match.params.pageId === undefined || match.params.pageId === 'ranking');
    } else {
      isOpen = (match.params.pageId === 'ranking');
    }

    // console.log("world-ranking", match.params);

    const options = {
      onSortChange: this.onSortChange.bind(this)
    };

    // let kpiName = '';
    // if (selectedKPI.id !== undefined) { kpiName = selectedKPI.kpi.kpiTextMap.title; }

    return (
      <PagePanel
        gradientClass="darkRedM"
        isOpen={isOpen}
        title={_lang('world_ranking_title')}
        subTitle={<BreadCrumbComponent />}
        exportToExcel="world-ranking"
      >
        <div className="flexBoxItem flexBoxSearchingBar searchBoxM">
          <Select
            clearable={false}
            simpleValue
            searchable={false}
            labelKey="title"
            valueKey="groupId"
            value={selectedGroup.groupId}
            options={groupList}
            onChange={(value) => {
              const group = groupList.find((val) => val.groupId === value);
              setSelectedGroupAction(group);
              getRankingKpiAction(null, null, value);

              updatePath();
            }}
          />
        </div>


        <div className="flexBoxItem flexBoxFillArea flexBoxItemGrow modalBodyM marginBottom20">
          <div className="flexBoxItemGrow" style={{ overflow: 'hidden' }}>
            {(() => {
              if (rankingKpiList.length <= 0) {
                return (
                  <div className="noDataMessageM">{_lang('no_data_message')}</div>);
              }

              return (
                <div className="global-ranking-tableM">
                  <BootstrapTable
                    options={options}
                    data={rankingKpiList}
                    striped={false}
                    hover
                    scrollTop={'5'}
                  >
                    <TableHeaderColumn
                      dataField="score"
                      dataAlign="left"
                      dataFormat={FormatUtils.rankFormat}
                      sortName="score"
                      dataSort
                    >{_lang('table_rank')}</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="countryId"
                      className="sec-column"
                      dataAlign="left"
                      dataFormat={(data) => FormatUtils.countryFormat(data, countryKeyMap)}
                      isKey
                      dataSort
                    >{_lang('table_countries')}</TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="data"
                      dataFormat={FormatUtils.columnDataFormat}
                      columnClassName={FormatUtils.columnClassNameFormat}
                      dataAlign="right"
                    >{_lang('table_score')}</TableHeaderColumn>
                  </BootstrapTable>
                </div>
              );
            })()}
          </div>
        </div>
      </PagePanel>
    );
  }
}

WorldRanking.propTypes = {};

const mapStateToProps = (state) => ({
  selectedKPI: state.coreReducer.selectedKPI,
  selectedYear: state.coreReducer.selectedYear,
  selectedKPIId: state.coreReducer.selectedKPIId,
  countryObj: state.countryReducer,
  selectedGroup: state.coreReducer.selectedGroup,
  groupList: state.groupsReducer.groups,
  rankingKpiList: state.kpiReducer.rankingKpiList,
  countryKeyMap: state.countryReducer.countryKeyMap
});

const actions = {
  getCountryListAction,
  setSelectedGroupAction,
  getRankingKpiAction
};

export default withRouter(connect(mapStateToProps, actions)(WorldRanking));
