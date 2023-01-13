const trimString = (str) => {
  if (str !== undefined && str !== null && str.length > 110) {
    return `${str.substr(0, 110)}...`;
  }

  return str;
};

export default trimString;
