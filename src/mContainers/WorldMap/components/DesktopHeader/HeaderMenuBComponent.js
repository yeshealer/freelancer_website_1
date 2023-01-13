import PropTypes from 'prop-types';
import React from 'react';

class HeaderMenuBComponent extends React.Component {

  render() {
    const { href, styleClass, itemIcon, itemTitle, onClick } = this.props;

    if (href !== undefined) {
      return (
        <a href={href} className={`menuItemStaticM ${styleClass}`}>
          <div className={`menuIconM ${itemIcon}`} />
          <div className="itemTextM">
            <div className="itemH1M">{itemTitle}</div>
          </div>
        </a>
      );
    } 
      return (
        <div onClick={onClick} className={`menuItemStaticM ${styleClass}`}>
          <div className={`menuIconM ${itemIcon}`} />
          <div className="itemTextM">
            <div className="itemH1M">{itemTitle}</div>
          </div>
        </div>
      );
  }
}

HeaderMenuBComponent.propTypes = {
  href: PropTypes.any,
  itemIcon: PropTypes.any,
  itemTitle: PropTypes.any,
  onClick: PropTypes.any,
  styleClass: PropTypes.any
}

export default HeaderMenuBComponent;
