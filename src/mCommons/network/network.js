import Axios from 'axios';
import "babel-polyfill";

const defaultCallback = () => {

};

//
// {
//     // `data` is the response that was provided by the server
//     data: {},
//
//     // `status` is the HTTP status code from the server response
//     status: 200,
//
//     // `statusText` is the HTTP status message from the server response
//     statusText: 'OK',
//
//     // `headers` the headers that the server responded with
//     // All header names are lower cased
//     headers: {},
//
//     // `config` is the config that was provided to `axios` for the request
//     config: {},
//
//     // `request` is the request that generated this response
//     // It is the last ClientRequest instance in node.js (in redirects)
//     // and an XMLHttpRequest instance the browser
//     request: {}
// }

const get = (endpoint, params, successCallback, errorCallback, setLoadingStateFn = (state) => {}) => {
    setLoadingStateFn(true);

    const axiosGet = Axios.get(`${endpoint}`, {params: params});
    if (successCallback !== undefined) {
        axiosGet.then(function (response) {
            successCallback(response);
            setLoadingStateFn(false);
        })
    }

    if (errorCallback !== undefined) {
        axiosGet.catch(function (error) {
            errorCallback(error);
            setLoadingStateFn(false);
        });
    }

    return axiosGet;
};

const post = (endpoint, body, successCallback, errorCallback, setLoadingStateFn = (state) => {}) => {
    setLoadingStateFn(true);

    let axiosPost = Axios.post(`${endpoint}`, body);
    if (successCallback !== undefined) {
        axiosPost.then(function (response) {
            successCallback(response);
            setLoadingStateFn(false);
        })
    }

    if (errorCallback !== undefined) {
        axiosPost.catch(function (error) {
            errorCallback(error);
            setLoadingStateFn(false);
        });
    }

    return axiosPost;
};

const put = (endpoint, body, successCallback, errorCallback, setLoadingStateFn = (state) => {}) => {
    setLoadingStateFn(true);

    let axiosPost = Axios.put(`${endpoint}`, body);
    if (successCallback !== undefined) {
        axiosPost.then(function (response) {
            successCallback(response);
            setLoadingStateFn(false);
        })
    }

    if (errorCallback !== undefined) {
        axiosPost.catch(function (error) {
            errorCallback(error);
            setLoadingStateFn(false);
        });
    }

    return axiosPost;
};

const network = {get, post, put};

export default network;