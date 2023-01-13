import React from 'react';
import { _lang } from '../../../utils';

export default class ContentHeaderOverAll extends React.Component {
  render() {
    return (
      <header className="filter">
        <div className="title">
          <img src={'/assets/svg/overall-white.svg'} className="icon-image icon-overall" />
          {_lang('overall')}
        </div>
        <div className="actions">
          <label
            onClick={() => {
              this.props.self.setState({ selectedTab: 'Top9' });
            }} className={(this.props.self.state.selectedTab === 'Top9') ? 'selected' : ''}
          >
            {_lang('top_9_kpis')}
            <img className="inactive-mark" src="/assets/svg/check-white.svg" />
            <img className="active-mark" src="/assets/svg/checkmark-green.svg" />
          </label>
          <label
            onClick={() => {
              this.props.self.setState({ selectedTab: 'Bottom9' });
            }} className={(this.props.self.state.selectedTab === 'Bottom9') ? 'selected' : ''}
          >
            {_lang('bottom_9_kpis')}
            <img className="inactive-mark" src="/assets/svg/check-white.svg" />
            <img className="active-mark" src="/assets/svg/checkmark-green.svg" />
          </label>
          {/*<div className="iph-select">*/}
          {/*</div>*/}
        </div>
        <div className="clearfix" />
      </header>
    );
  }
}

