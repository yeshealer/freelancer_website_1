import React from 'react';
import * as Scroll from 'react-scroll';

import ContentHeader from './ContentHeader';
import PillarContentDataList from './PillarContentDataList';

export default class PillarPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      subPillarId: 0,
      maxLoad: 9,
      expanded: false,
    };
  }

  onLoadMore() {
    this.state.maxLoad === 9 ? (
      this.setState({ maxLoad: this.props.kpiData.children.length, expanded: true })
    ) : (
      this.setState({ maxLoad: 9, expanded: false })
    );
  }

  handleChange(event) {
    this.setState({ subPillarId: event.target.value, maxLoad: 9, expanded: false });
  }

  render() {
    return (
      <div style={{ marginBottom: 20 }}>
        <Scroll.Element name={`Content_${this.props.kpiData.nodeTextMap.title}`}>
          <ContentHeader
            handleChange={this.handleChange.bind(this)}
            selectedValue={this.state.subPillarId}
            kpi={this.props.kpiData}
          />

          <div className={'graph-container'}>
            <PillarContentDataList
              tagId={this.state.tagId}
              countryId={this.props.countryId}
              overAllType="Bottom9"
              expanded={this.state.expanded}
              maxLoad={this.state.maxLoad}
              pillar={this.props.kpiData}
              onLoadMore={this.onLoadMore.bind(this)}
              kpiList={this.props.kpiData}
            />
            <div className="clearfix" />
          </div>
        </Scroll.Element>
      </div>
    );
  }
}
