import React from 'react';
import { _lang } from '../../utils';

class LoadingComponent extends React.Component {
  render() {
    return (
      <div className={'loadingOverlayM'}>
        <div className="loadingContentWrapper">
          <img src="/assets/images/loadingCells1.gif" alt="Loading" />
          <div className="loadingContentM">
            <div className="loadingMessageM">{_lang('loading_message')}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoadingComponent;
