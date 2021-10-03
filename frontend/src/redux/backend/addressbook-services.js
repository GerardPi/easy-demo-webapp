import {createUrl, toQueryArguments} from './backend-services';

const URLS = {
  addresses: '/addresses',
  persons: '/persons',
  personAddresses: '/person-addresses'
};

const address = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.addresses)),
  readList: (backendSvc, args) => {
    const url = createUrl(`${URLS.addresses}?${toQueryArguments(args)}`);
    console.log(`##### the url is ${url}`);
    return backendSvc.performGet(createUrl(`${URLS.addresses}?${toQueryArguments(args)}`));
  },
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.addresses), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.addresses), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(URLS.addresses), tag)
};

const person = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.persons)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${URLS.persons}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.persons), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.persons), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(URLS.persons), tag)
};

const personAddress = {
  read: backendSvc => backendSvc.performGet(createUrl(URLS.personAddresses)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${URLS.personAddresses}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(URLS.personAddresses), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(URLS.personAddresses), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(URLS.personAddresses), tag)
};

const services = {
  address,
  person,
  personAddress
};

export default services;
