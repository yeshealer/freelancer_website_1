// React
import React from 'react';
import PillarPanel from './PillarPanel';
import * as Scroll from 'react-scroll';

export default class PillarPanelList extends React.PureComponent {
  getContentData() {
    const { selectedKpi } = this.props;

    const items = [];

    if (selectedKpi) {
      selectedKpi.forEach((kpi) => {
        kpi.children = kpi.children.filter(c => c !== null);
        if (kpi.children.length) {
          items.push(
            <Scroll.Element key={`ScrollContent_${kpi.nodeTextMap.title}`} name={`Content_${kpi.nodeTextMap.title}`}>
              <PillarPanel
                countryId={this.props.countryId}
                kpiData={kpi}
              />
            </Scroll.Element>
          );
        }
      });
    }

    return items;
  }

  render() {
    return (
      <div>
        {this.getContentData()}
      </div>
    );
  }
}
