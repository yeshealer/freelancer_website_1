const subStr = (str, start, end) => {
  if (str.length > end) {
    return `${str.substr(start, end)}...`;
  }
  return str;
};

export default subStr;
