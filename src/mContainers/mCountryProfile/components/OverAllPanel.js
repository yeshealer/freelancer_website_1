// React
import React from 'react';
import ContentHeaderOverAll from './ContentHeaderOverAll';
import ContentDataList from './ContentDataList';
import * as Scroll from 'react-scroll';

export default class OverAllPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Top9',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.overAllKPIData.length > 0) {
      Scroll.scrollSpy.update();
    }
  }

  render() {
    if (!this.props.overAllKPIData) {
      return null;
    }

    const items = [];
    const { topNineKpis, bottomNineKpis } = this.props.overAllKPIData;
    const kpiList = this.state.selectedTab === 'Top9' ? topNineKpis : bottomNineKpis;

    if (kpiList) {
      items.push(
        <div key={'MidContent_OverAllPanel'} style={{ marginBottom: 20 }}>
          <ContentHeaderOverAll self={this} />
          <div className={`graph-container ${this.props.graphContainerClass}`}>
            <ContentDataList
              countryId={this.props.countryId}
              overAllType={this.state.selectedTab}
              kpiList={this.props.overAllKPIData}
            />
            <div className="clearfix" />
          </div>
        </div>
      );
    }

    return (
      <Scroll.Element name={'Content_Overall'}>
        <div>
          {items}
        </div>
      </Scroll.Element>
    );
  }
}
