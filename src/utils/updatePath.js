import history from '../history';
import getPath from './getPath';

const updatePath = () => {
  const { pathname } = window.location;
  history.push(getPath(pathname));
};

export default updatePath;
