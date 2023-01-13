// React
import React from 'react';
import { withRouter } from 'react-router-dom';
import { _lang } from '../../../utils';

class About extends React.Component {
  render() {
    return (
      <div style={{ position: 'fixed' }} className={'fullScreenModal Stats-Table desktopAboutModal'}>
        <span
          onClick={() => {
            this.props.history.goBack();
          }} className="exit-img-icon-modal"
        />
        <div className="customScrollbar">
          <div className="innerSidePadding">
            <span dangerouslySetInnerHTML={{ __html: _lang('about_text') }} />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(About);
