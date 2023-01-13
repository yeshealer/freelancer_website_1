import React from 'react';
import numeral from 'numeral';
import GraphCard from './GraphCard';
import * as Scroll from 'react-scroll';

export default class PillarContentDataList extends React.Component {

  graphData(data) {
    if (data && data.kpi.countryData) {
      const countryDataLength = data.kpi.countryData ? data.kpi.countryData.length : 0;
      const latestCountryData = data.kpi.countryData[countryDataLength - 1];

      return (<GraphCard
        cardType="Subcategory"
        title={data.kpi.kpiTextMap.title}
        description={data.kpi.kpiTextMap.description_long}
        currentValue={numeral(latestCountryData.score).format('0.00a')}
        score={data.kpi.kpiTextMap.denominator}
        year={latestCountryData.year}
        rank={latestCountryData.rank}
        rate={latestCountryData.rankChange}
        total={latestCountryData.rankOutOf}
        sourceTitle={data.kpi.sourceTextMap.title}
        sourceURL={data.kpi.url}
        showSource
        graphData={data.kpi.countryData || []}
        typeClass={this.props.typeClass || 'card-type-2'}
        pillarId={data.id}
        kpiId={data.id}
        kpiName={data.kpi.kpiTextMap.title}
        countryId={this.props.countryId}
        kpiObj={data}
      />);
    }

    return <div />;
  }

  renderLoadMore = () => {
    if (this.props.kpiList.children.length > 9) {
      return (
        <a key={this.props.kpiList.pillarId} style={{ color: '#fff' }} onClick={this.props.onLoadMore}>
          <span>Load More</span>
        </a>
      );
    }
  }

  render() {
    const items = [];
    const maxLoad = this.props.maxLoad;

    if (this.props.kpiList !== undefined) {
      for (let i = 0; i < maxLoad; i++) {
        const kpi = this.props.kpiList.children[i];
        if (kpi) {
          items.push(
            <div
              key={`ContentDataList_${i}`}
              className="card-wrapper"
            >
              {this.graphData(kpi)}
            </div>
          );
        }
      }

      items.push(<div key={'ContentDataList_clearFix'} className='clearfix' />);
    }

    return (
      <div>
        {items}
        {
          this.props.kpiList.length < this.props.maxLoad || this.props.kpiList.length === 9 || this.props.kpiList.length === 18 ?
            <div /> :
            <div style={{ paddingLeft: '15px' }}>
              {
                this.props.expanded ?
                  <Scroll.Link
                    duration={500} smooth activeClass="active" spy
                    to={`Content_${this.props.pillar.pillarNameEn}`}
                  >
                    <a key={this.props.kpiList.pillarId} style={{ color: '#fff' }} onClick={this.props.onLoadMore}>
                      <span>Show Less</span>
                    </a>
                  </Scroll.Link> :
                  this.renderLoadMore()
              }
            </div>
        }

      </div>
    );
  }
}
