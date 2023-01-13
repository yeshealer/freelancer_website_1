import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { getWidth, isMobile } from '../../mCommons/mUtils';
import setSelectedKPIAction from '../../redux/actions/setSelectedKPIAction';
import getLanguageKey from '../../utils/getLanguageKey';
import { withRouter } from 'react-router-dom';

import { _lang, getPath } from '../../utils';
import { setSelectedCountryAction, setStatsSelectedCountriesAction } from '../../redux'

class SubPillars extends React.Component {
  state = {}

  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillReceiveProps() {
    if (getLanguageKey() === 'en') {
      this.timeout = setTimeout(() => {
        if (window.location.pathname.includes('explore')) {
          return this.setState({ locationClass: this.props.currentStep < this.props.step ? 'rightM' : 'leftM' });
        }
      });
    } else {
      this.timeout = setTimeout(() => {
        if (window.location.pathname.includes('explore')) {
          this.setState({ locationClass: this.props.currentStep > this.props.step ? 'rightM' : 'leftM' });
        }
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  selectSubPillar(data, idPath) {
    const { selectedKPIPath, setSelectedKPIAction, setStatsSelectedCountriesAction, setSelectedCountryAction } = this.props;
    const kpiPath = [...selectedKPIPath, ...idPath];

    setStatsSelectedCountriesAction('');
    setSelectedCountryAction({});

    setSelectedKPIAction(kpiPath, data)
      .then(() => {
        this.props.history.push(getPath('/world-map'));
      });
  }

  renderSubPillars(param, nth) {
    return this.createTree(this.props.data.children.filter(child => child !== null), true, 0, param, nth, []);
  }

  createTree(data, isSub, lev, param, nth, idPath) {
    const level = lev || 0;
    const children = [];

    for (let i = 0; i < data.length; i++) {
      if ((i + 1) % param !== nth) {
        children.push(<span key={`subPillar${i}_${nth}`} />);
        if (typeof (data[i].children) !== 'object') {
          children.push(
            <span key={`subPillarListM${i}_${nth}`} className='subPillarListM'>
              <span onClick={this.selectSubPillar.bind(this, data[i], idPath)}>
                <button key={`kpi${i}`}>
                    <p
                      className={this.props.selected && this.props.selected.id === data[i].id ? 'activeM' : ''}
                    >{data[i].kpi.kpiTextMap.title || 'Missing Title'}</p>
                    <img
                      src='/assets/images/check.svg' alt='placeholder'
                      style={this.props.selected && this.props.selected.id === data[i].id ? { display: 'inline-block' } : { display: 'none' }}
                    />
                </button>
              </span>
            </span>
          );
        }
      } else if (typeof (data[i].children) === 'object') { // Sub array found, build structure
        children.push(
          <span key={`subPillarM_${i}_${nth}`} className='subPillarM'>
                            <p>{data[i].nodeTextMap.title || 'Missing Title'} ({data[i].children.filter(child => child !== null).length})</p>
            {this.createTree(data[i].children.filter(child => child !== null), true, level, param, nth, [...idPath, data[i].id])}
                        </span>
        );
      } else { // No submenu, bottom of tree
        if (data[i]) {
          children.push(
            <span key={`subPillarListM${i}_${nth}`} className='subPillarListM'>
              <span onClick={this.selectSubPillar.bind(this, data[i], idPath)}>
                <button key={`kpi${i}`}>
                  <p
                    className={this.props.selected && this.props.selected.id === data[i].id ? 'activeM' : ''}
                  >{data[i].kpi.kpiTextMap.title || 'Missing Title'}</p>
                  <img
                    src='/assets/images/check.svg' alt='placeholder'
                    style={this.props.selected && this.props.selected.id === data[i].id ? { display: 'inline-block' } : { display: 'none' }}
                  />
                </button>
              </span>
            </span>
          );
        }
      }
    }
    return children;
  }

  renderContent() {
    if (this.props.data) {
      let mainContent = [];

      if (isMobile()) {
        mainContent = [
          <span className="section100">{this.renderSubPillars(1, 0)}</span>
        ];
      } else if (getWidth() > 1024) {
        mainContent = [
          <span key="2" className="section33">{this.renderSubPillars(3, 2)}</span>,
          <span key="1" className="section33">{this.renderSubPillars(3, 1)}</span>,
          <span key="0" className="section33">{this.renderSubPillars(3, 0)}</span>
        ];
      } else {
        mainContent = [
          <span className="section50">{this.renderSubPillars(2, 1)}</span>,
          <span className="section50">{this.renderSubPillars(2, 0)}</span>
        ];
      }

      const { realmList } = this.props.self.props.realmObj;
      const selectedRealm = realmList[this.props.self.state.tabIndex].nodeTextMap.title_short || 'Missing title_short';

      return (
        <div
          className='stepContentM'
          style={this.props.currentStep !== this.props.step ? { display: 'none' } : { display: 'flex' }}
        >
          <div className='topM'>
            <Link to='/'>
              <img
                src={(getLanguageKey() === 'ar') ? '/assets/images/arrow-right.svg' : '/assets/images/arrow-left.svg'}
                alt='placeholder'
              />
              <span>{_lang('home')}</span>
            </Link>
            <span className='dashLineM'>―</span>
            <button onClick={this.props.update.bind(this, '', null, 1)}>
              <span>{selectedRealm}</span>
            </button>
            <span className='dashLineM'>―</span>
            <button onClick={this.props.update.bind(this, '', null, 1)}>
              <span>{this.props.data.nodeTextMap.title || 'Missing Title'}</span>
            </button>
          </div>
          <div className='middleM'>
            <h1>{_lang('sub_pillars')}</h1>
          </div>
          <span className='bottomM customScrollbar'>
            {/*<div className="flexBoxFillAreaCol flexBoxItemGrow customScrollbar">*/}
            {/*<div className="flexBoxItemGrow">*/}
            {mainContent}
            {/*</div>*/}
            {/*</div>*/}
          </span>
          <div className='spaceHolderM' />
        </div>
      );
    }
  }

  render() {
    const h1Content = (
      <h1
        className="verticalLine"
        onClick={this.props.selected ? this.props.update.bind(this, '', null, 2) : () => {
        }} style={this.props.currentStep === this.props.step ? { opacity: 1 } : { opacity: this.props.opacity }}
      >
        02
        {this.props.selected ?
          <div className="pillarNameM">{this.props.selected.kpi.kpiTextMap.title}</div> : ''}
      </h1>
    );

    return (
      <div
        className={`subPillarsContainerM ${this.props.currentStep === this.props.step ? 'activeM' : 'minimizedM'} ${this.state.locationClass}`}
        style={this.props.currentStep === this.props.step ? { flex: this.props.flexOpen } : { flex: this.props.flexClose }}
      >
        {getLanguageKey() === 'en' && h1Content}

        {this.renderContent()}

        {(getLanguageKey() === 'ar') && h1Content}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKPIPath: state.coreReducer.selectedKPIPath
});

const matchDispatchToProps = (dispatch) => bindActionCreators({
  setSelectedKPIAction,
  setStatsSelectedCountriesAction,
  setSelectedCountryAction
}, dispatch);

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(SubPillars));
