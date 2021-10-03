import { axios } from '@bundled-es-modules/axios';

export const rest = axios.create({
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
  performGet: (url) => {
    console.log(`## url=${JSON.stringify(url)}`);
    return rest.get(url).then(response => response.data);
  },
  performPost: (url) => { return rest.post(url).then(response => response.data); },
  performPostWithJsonBody: (url, jsonBody) => {
      return rest.post(url, jsonBody, contentTypeOptions.json.headers).then(response => response.data);
  },
  performPostWithFormData: (url, body) => {
      return rest.post(url, jsonBody, contentTypeOptions.formData).then(response => response.data);
  },
  performPutWithJsonBody: (url, jsonBody, tag) => {
      return rest.put(url, jsonBody, contentTypeOptions.json).then(response => response.data);
  },
  performUpload: (url, uploadFile) => {
      const formData = new FormData();
      formData.append('multipartFile', uploadFile);
      return rest.post(url, formData, contentTypeOptions.upload).then(response => response.data);
  }
};

export function createUrl (path) {
  return window.backendUrlPrefix + path;
}

export function toQueryArguments (object) {
  return Object.keys(object).filter(key => object[key]).map(key => `${key}=${object[key]}`).join('&');
}
