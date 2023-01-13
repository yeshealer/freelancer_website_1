import React from 'react';

import generalUtils from '../../mCommons/mUtils/generalUtils';

import Pillars from '../../mComponents/mExplore/mPillars';
import SubPillars from '../../mComponents/mExplore/mSubPillars';

import './style.css';
import { isMobile } from '../../mCommons/mUtils';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import { getRealmListAction } from '../../redux';
import { _lang, getLanguageKey } from '../../utils';

class Explore extends React.Component {
  state = {
    tabIndex: 0,
    step: localStorage.getItem('step') ? parseInt(localStorage.getItem('step'), 10) : 1,
  }

  componentWillMount() {
    this.opacity = 0.3;
    this.flexOpen = 8;
    this.flexClose = 1;
    this.selectedRealm = '';
    this.selectedIndex = 0;
  }

  componentDidMount() {
    document.title = _lang('pillars');

    generalUtils.setDesktopMode(false);
    generalUtils.setViewPort();

    document.getElementById('root').style.overflow = 'hidden';

    this.scrollToTop = () => {
      if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
        window.scrollBy(0, -10);
        this.timeOut = setTimeout(() => this.scrollToTop(), 10);
      } else {
        clearTimeout(this.timeOut);
      }
    };
    this.scrollToTop();
  }

  componentWillUnmount() {
    document.getElementById('root').style.overflow = '';
  }

  back() {
    this.setState({ step: this.state.step - 1 }, () => {
      if (this.state.step === 0) {
        this.props.history.push('/');
      }
      this.scrollToTop();
    });
  }

  next() {
    // document.removeEventListener('touchmove', this.touchmove);
    if (this.state.step === 1 && !this.state.selectedPillar) {
      // this.setState({alertMessage: 'select_pillar', alertIsShow: true});
    } else if (this.state.step === 2 && !this.state.selectedSubPillar) {
      // this.setState({alertMessage: 'select_subpillar', alertIsShow: true});
    } else {
      // this.setState({alertIsShow: false});
      // this.setState({step: this.state.step !== 3 ? this.state.step + 1 : this.state.step}, this.scrollToTop());
    }
  }

  update(key, value, step, subTopicId) {
    this.setState({
      [key]: value,
      step
    }, () => {

    });
  }

  updateSelectedRealm = (selectedRealm) => {
    this.setState({
      selectedRealm,
    });
  }

  createBreadCrumbs = () => (
    <Link to='/'>
      <img
        src={(getLanguageKey() === 'ar') ? '/assets/images/arrow-right.svg' : '/assets/images/arrow-left.svg'}
        alt='placeholder'
      />
      <span>{_lang('home')}</span>
    </Link>
  )

  handleClose = () => {
    window.location.href = '/';
  }

  render() {
    const { match: { params }, history } = this.props;
    const { step, lang, selectedPillar, pillarsData, selectedSubPillar, selectedCountry } = this.state;

    return (
      <div
        className={`pageContainerM ${isMobile() ? 'wizardMobile' : 'wizardDesktop'}`}
        dir={(getLanguageKey() === 'ar') ? 'rtl' : null}
      >
        {/*{this.printAlertModal()}*/}
        <div id='exploreM' className='exploreM'>
          <div className='navigatorM'>
            {/* {isMobile() ? this.createBreadCrumbs() : null} */}
            <div className='navigatorBlockerM'>
              <Link to='/'>
                <img src='/assets/images/home.svg' alt='placeholder' />
              </Link>
              <img
                src='/assets/images/dot.svg' alt='placeholder'
                className={this.state.step === 1 ? 'activeM' : ''}
                onClick={(() => { this.setState({ step: 1 }); })}
              />
              <img
                src='/assets/images/dot.svg' alt='placeholder'
                className={this.state.step === 2 ? 'activeM' : ''}
              />
              <i className="exit-img-icon-desktop" onClick={this.handleClose.bind(this)} />
            </div>
          </div>

          <Pillars
            step={1}
            currentStep={step}
            update={this.update.bind(this)}
            lang={lang}
            opacity={this.opacity}
            selected={selectedPillar}
            realmId={params.realmId}
            self={this}
          />

          <SubPillars
            step={2}
            currentStep={step}
            update={this.update.bind(this)}
            lang={lang}
            opacity={this.opacity}
            flexOpen={this.flexOpen}
            flexClose={this.flexClose}
            selected={selectedSubPillar}
            self={this}
            data={selectedPillar}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  realmObj: state.realmReducer,
});

const matchDispatchToProps = (dispatch) => bindActionCreators({
  getRealmListAction,
}, dispatch);

export default connect(mapStateToProps, matchDispatchToProps)(Explore);
