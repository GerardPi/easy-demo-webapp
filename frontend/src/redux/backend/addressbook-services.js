import {createUrl, toQueryArguments} from './backend-services';

const URLS = {
  addresses: '/addresses',
  persons: '/persons',
  personAddresses: '/person-addresses'
};

const address = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.addresses)),
  readList: (backendSvc, args) => {
    const url = createUrl(`${URLS.addresses}?${toQueryArguments(args)}`)
    return backendSvc.performGet(url);
  },
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.addresses), jsonBody),
  update: (backendSvc, jsonBody, etag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.addresses), jsonBody, etag),
  delete: (backendSvc, id, etag) => backendSvc.performDeleteWithTag(createUrl(`${URLS.addresses}/${id}`, etag))
};

const person = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.persons)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${URLS.persons}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.persons), jsonBody),
  update: (backendSvc, jsonBody, etag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.persons), jsonBody, etag),
  delete: (backendSvc, id, etag) => backendSvc.performDeleteWithTag(createUrl(`${URLS.persons}/${id}`, etag))
};

const personAddress = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.personAddresses)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${URLS.personAddresses}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.personAddresses), jsonBody),
  update: (backendSvc, jsonBody, etag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.personAddresses), jsonBody, etag),
  delete: (backendSvc, id, etag) => backendSvc.performDeleteWithTag(createUrl(`${URLS.personAddresses}/${id}`, etag))
};

const services = {
  address,
  person,
  personAddress
};

export default services;
