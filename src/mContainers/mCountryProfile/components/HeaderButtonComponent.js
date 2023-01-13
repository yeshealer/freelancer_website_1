import PropTypes from 'prop-types';
import React from 'react';

class HeaderButtonComponent extends React.Component {
  render() {
    const { onClick, wrapperClassName, iconClassName, itemText } = this.props;
    
    return (
      <div onClick={onClick} className={`introMenuItemStaticM ${wrapperClassName}`}>
        <div className={`menuIconM ${iconClassName}`} />
        <div className="itemTextM">
          <div className="itemH1M">{itemText}</div>
        </div>
      </div>
    );
  }
}

HeaderButtonComponent.propTypes = {
  iconClassName: PropTypes.any,
  itemText: PropTypes.any,
  onClick: PropTypes.any,
  wrapperClassName: PropTypes.any
}

export default HeaderButtonComponent;
