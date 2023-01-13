// @flow
const isObjectEmpty = (obj: Object) => {
    return (Object.keys(obj).length === 0 && obj.constructor === Object);
};

export default isObjectEmpty;