import MobileDetect from 'mobile-detect';

const isTablet = () => {
  const mobileDetect = new MobileDetect(window.navigator.userAgent);
  if (mobileDetect.tablet() !== null) {
    return true;
  }
  return false;
};

export default isTablet;
