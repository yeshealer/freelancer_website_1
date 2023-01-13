import PropTypes from 'prop-types';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class MenuItem extends React.Component {
  render() {
    const { id, url, menuIcon, title, subTitle, onClick, match } = this.props;

    const isActive = (match.params.pageId === id);

    const wrapperClassList = [];
    wrapperClassList.push('menuItemM');
    wrapperClassList.push('bottomBorderM');

    const innerClassList = [];
    innerClassList.push('menuIcon');
    innerClassList.push(menuIcon);

    if (isActive) {
      wrapperClassList.push('activeItemM');
      innerClassList.push('activeIconM');
    }

    return (
      <div className={wrapperClassList.join(' ')}>
        <Link onClick={onClick} to={url}>
          <div className={innerClassList.join(' ')} />
          <div className="menuText">
            {title}
            <span>{subTitle}</span>
          </div>
        </Link>
      </div>
    );
  }
}

MenuItem.propTypes = {
  id: PropTypes.string,
  menuIcon: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func
};

export default withRouter(MenuItem);
