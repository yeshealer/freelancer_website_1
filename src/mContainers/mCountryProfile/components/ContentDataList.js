import React from 'react';
import numeral from 'numeral';
import GraphCard from './GraphCard';
import * as Scroll from 'react-scroll';

export default class ContentDataList extends React.Component {

  graphData(data) {
    const countryDataLength = data.countryData.length;
    const latestCountryData = data.countryData[countryDataLength - 1];

    return (<GraphCard
      cardType="Overall"
      title={data.kpiTextMap.title}
      description={data.kpiTextMap.description_long}
      currentValue={numeral(latestCountryData.score).format('0.00a')}
      score={data.kpiTextMap.denominator}
      year={latestCountryData.year}
      rank={latestCountryData.rank}
      rate={latestCountryData.rankChange}
      total={latestCountryData.rankOutOf}
      sourceTitle={data.sourceTextMap.title}
      sourceURL={data.url}
      showSource
      graphData={data.countryData}
      typeClass="card-type-2"
      pillarId={data.id}
      kpiId={data.id}
      kpiName={data.kpiTextMap.title}
      countryId={this.props.countryId}
      kpiObj={data}
    />);
  }

  render() {
    const items = [];
    const kpisToRender = this.props.overAllType === 'Top9' ? this.props.kpiList.topNineKpis : this.props.kpiList.bottomNineKpis;

    kpisToRender.sort((a, b) => a.kpiTextMap.title < b.kpiTextMap.title ? -1 : a.kpiTextMap.title > b.kpiTextMap.title ? 1 : 0);

    if (kpisToRender !== undefined) {
      kpisToRender.forEach((kpi, index) => {
        kpi.kpi = kpi;
        items.push(
          <div key={`ContentDataList_${index}`} className="card-wrapper">
            {this.graphData(kpi)}
          </div>
        );
      });

      items.push(<div key={'ContentDataList_clearFix'} className='clearfix' />);
    }

    return (
      <div>
        {items}
      </div>
    );
  }
}
