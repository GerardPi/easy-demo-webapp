import { axios } from '@bundled-es-modules/axios';
import * as commonUtils from '../../common-utils';

export const restApi = axios.create({
  xsrfCookieName: 'XSRF-TOKEN',
  withCredentials: true
});

const contentTypes = {
  json: 'application/json',
  formData: 'application/x-www-form-urlencoded',
  upload: undefined
};

export const contentTypeOptions = {
  json: { headers: { headerNameContentType: 'application/json' }},
  formData: { headers: { headerNameContentType: 'application/x-www-form-urlencoded' }},
  upload: { headers: { headerNameContentType: undefined }}
};

export const actualBackend = {
  performGet: (url) => restApi.get(url).then(response => response.data),
  performPost: (url) => restApi.post(url).then(response => response.data),
  performPostWithJsonBody: (url, jsonBody) =>
    restApi.post(url, jsonBody, contentTypeOptions.json.headers).then(response => response.data),
  performPostWithFormData: (url, body) =>
    restApi.post(url, body, contentTypeOptions.formData).then(response => response.data),
  performPutWithJsonBody: (url, jsonBody, etag) =>
    restApi.put(url, jsonBody, contentTypeOptions.json).then(response => response.data),
  performUpload: (url, uploadFile) => {
    const formData = new FormData();
    formData.append('multipartFile', uploadFile);
    return restApi.post(url, formData, contentTypeOptions.upload).then(response => response.data);
  },
  performDeleteWithTag: (url, etag) => {
    commonUtils.assertNoNullOrEmptyValues({url, etag});
    const headers = {'If-Match': etag};
    console.log(`#### delete url=${JSON.stringify(url)} headers=${JSON.stringify(headers)}`);
    return restApi.head(url, { headers }).then((response) => response.data);
  }
};

export function createUrl (path) {
  return window.backendUrlPrefix + path;
}

// Converts an object into a query string for usage in a URL.
// Note that it will only include non-null values from the object.
export function toQueryArguments (object) {
  return Object.keys(object)
  .filter(key => object[key] !== null)
  .map(key => `${key}=${object[key]}`).join('&');
}
