import {backend, createUrl} from './backend-services';

export const urls = {
  addresses: 'api/addresses',
  persons: 'api/persons',
  personAddresses: 'api/person-addresses'
};

export const address = {
  read: backend => backend.performGet(createUrl(urls.addresses)),
  readList: backend => backend.performGet(createUrl(urls.addresses)),
  create: (backend, jsonBody) => backend.performPostWithJsonBody(createUrl(urls.addresses), jsonBody),
  update: (backend, jsonBody, tag) => backend.performPutWithJsonBodyAndTag(createUrl(urls.addresses), jsonBody, tag),
  delete: (backend, tag) => backend.performDeleteWithTag(createUrl(urls.addresses), tag)
};

export const person = {
  read: backend => backend.performGet(createUrl(urls.persons)),
  readList: backend => backend.performGet(createUrl(urls.persons)),
  create: (backend, jsonBody) => backend.performPostWithJsonBody(createUrl(urls.persons), jsonBody),
  update: (backend, jsonBody, tag) => backend.performPutWithJsonBodyAndTag(createUrl(urls.persons), jsonBody, tag),
  delete: (backend, tag) => backend.performDeleteWithTag(createUrl(urls.persons), tag)
};

export const personAddress = {
  read: backend => backend.performGet(createUrl(urls.personAddresses)),
  readList: backend => backend.performGet(createUrl(urls.personAddresses)),
  create: (backend, jsonBody) => backend.performPostWithJsonBody(createUrl(urls.personAddresses), jsonBody),
  update: (backend, jsonBody, tag) => backend.performPutWithJsonBodyAndTag(createUrl(urls.personAddresses), jsonBody, tag),
  delete: (backend, tag) => backend.performDeleteWithTag(createUrl(urls.personAddresses), tag)
};
