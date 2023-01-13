import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import PrintButton from '../PrintButton';
import './style.css';
import ExportToExcelButton from '../ExportToExcelButton';
import ExportToPDFButton from '../ExportToPDFButton';
import { _lang } from '../../../utils';
import { Link, withRouter } from 'react-router-dom';

import setMobileOverlayStateAction from '../../../redux/actions/setMobileOverlayStateAction';

class FullPagePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  onBackClick() {
    const { setMobileOverlayStateAction } = this.props;
    setMobileOverlayStateAction('isMobileOverlayBenchmarkSelector', false);
  }

  onDoneClick() {
    const { setMobileOverlayStateAction } = this.props;
    setMobileOverlayStateAction('isMobileOverlayCountrySelector', false);
  }

  getExportButton(subPageId) {
    const { pillarObj, selectedYear, countryList, groupList } = this.props;

    if (subPageId === 'full-stats' && pillarObj && pillarObj.id) {
      return (
        <ExportToExcelButton
          type="full-stats"
          pillarId={pillarObj.id}
          selectedYear={selectedYear}
          countryList={countryList}
          groupList={groupList}
          entityPageName={pillarObj.nodeTextMap.title}
        />
      );
    }
    return null;
  }


  render() {
    const { isOpen, isMobile, title, subTitle, children, zIndex, isExportToPDFButton, isPrintButton,
      closeModal, headerType, isCloseable, setMobileMenuStateActionm, match } = this.props;

    const classNames = ['fullScreenModal', 'Stats-Table'];

    if (!isOpen) {
      classNames.push('hide');
    }

    if (!isMobile) {
      classNames.push('desktopModeModal');
    } else {
      classNames.push('mobileModeModal');
    }

    return (
      <div style={{ zIndex }} className={classNames.join(' ')}>

        <div className='full-panel-toolbar'>
          {/*{isExportToPDFButton && <ExportToPDFButton />}*/}
          {isPrintButton && <PrintButton />}
          {/*{this.getExportButton(match.params.subPageId)}*/}
        </div>

        {!isMobile ? <div onClick={() => closeModal()} className="exit-img-icon" /> : null}

        {
          (() => {
            switch (headerType) {
              case 1:
                return (
                  <div className="modalHeaderM">
                    <div className="titleM wrapTitleM">
                      {title}
                    </div>
                    <div className="subTitleM wrapTitleM">
                      {subTitle}
                    </div>
                  </div>
                );
              case 2:
                return (
                  <div className="modalHeaderM">
                    <div onClick={this.onBackClick.bind(this)} className="back-img-icon" />
                    <div className="titleM">{title}</div>
                    <div className="border1PXM" />
                  </div>
                );

              case 3:
                return (
                  <div className="modalHeaderM">
                    <div className="titleM">{title}</div>
                    <div onClick={this.onDoneClick.bind(this)} className="doneM">{_lang('done')}</div>
                  </div>
                );
            }
          })()
        }
        {children}
      </div>
    );
  }

}

FullPagePanel.defaultProps = {
  headerType: 1,
  isExportToPDFButton: false,
  isMobile: false,
  isOpen: false,
  isPrintButton: false,
  zIndex: 99
};

FullPagePanel.propTypes = {
  children: PropTypes.any,
  closeModal: PropTypes.func,
  countryList: PropTypes.any,
  groupList: PropTypes.any,
  headerType: PropTypes.number,
  isCloseable: PropTypes.bool,
  isExportToPDFButton: PropTypes.bool,
  isMobile: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  isPrintButton: PropTypes.bool,
  pillarObj: PropTypes.any,
  selectedYear: PropTypes.any,
  setMobileMenuStateAction: PropTypes.any,
  setMobileMenuStateActionm: PropTypes.any,
  setMobileOverlayStateAction: PropTypes.any,
  subPageId: PropTypes.any,
  subTitle: PropTypes.string,
  title: PropTypes.any,
  zIndex: PropTypes.number
};

const mapStateToProps = (state) => ({
  pillarObj: state.coreReducer.breadcrumb[1],
  selectedYear: state.coreReducer.selectedYear,
  countryList: state.coreReducer.statsSelectedCountries,
  groupList: state.coreReducer.statsSelectedGroups,
});

const actions = {
  setMobileOverlayStateAction
};

export default withRouter(connect(mapStateToProps, actions)(FullPagePanel));
