import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { setActivePanelAction } from '../../../../redux';

class HeaderMenuComponent extends React.Component {
  render() {
    const {
      id, itemTitle, itemSubtitle, itemIcon, url, extraClass = [], match
    } = this.props;

    const isActive = (match.params.pageId === id);
    const styleAClasses = [...extraClass];

    styleAClasses.push('menuItemM');
    if (isActive) {
      styleAClasses.push('active');
    }

    const styleBClasses = [];
    styleBClasses.push('menuIconM');
    if (itemIcon) {
      styleBClasses.push(itemIcon);
    }
    if (isActive) {
      styleBClasses.push('activeIconM');
    }

    return (
      <div className={styleAClasses.join(' ')}>
        <Link
          // onClick={(() => this.props.setActivePanelAction(id))}
          to={url}
        >
          <div className={styleBClasses.join(' ')} />
          <div className="itemTextM">
            <div className="itemH1M">{itemTitle}</div>
            <div className="itemH2M">{itemSubtitle}</div>
          </div>
        </Link>
      </div>
    );
  }
}

HeaderMenuComponent.propTypes = {
  id: PropTypes.string,
  activeModal: PropTypes.any,
  extraClass: PropTypes.array,
  itemIcon: PropTypes.any,
  itemSubtitle: PropTypes.any,
  itemTitle: PropTypes.any,
  modalId: PropTypes.any,
  onClickFunction: PropTypes.any,
  setActiveModal: PropTypes.any,
  url: PropTypes.string
};

const mapStateToProps = (state) => ({});

const actions = {
  setActivePanelAction
};

export default withRouter(connect(mapStateToProps, actions)(HeaderMenuComponent));

