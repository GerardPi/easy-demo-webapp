import {createUrl, toQueryArguments} from './backend-services';

export const urls = {
  addresses: 'api/addresses',
  persons: 'api/persons',
  personAddresses: 'api/person-addresses'
};

export const address = {
  read: backendSvc => backendSvc.performGet(createUrl(urls.addresses)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${urls.addresses}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(urls.addresses), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(urls.addresses), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(urls.addresses), tag)
};

export const person = {
  read: backendSvc => backendSvc.performGet(createUrl(urls.persons)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${urls.persons}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(urls.persons), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(urls.persons), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(urls.persons), tag)
};

export const personAddress = {
  read: backendSvc => backendSvc.performGet(createUrl(urls.personAddresses)),
  readList: (backendSvc, args) => backendSvc.performGet(createUrl(`${urls.personAddresses}?${toQueryArguments(args)}`)),
  create: (backendSvc, jsonBody) => backendSvc.performPostWithJsonBody(createUrl(urls.personAddresses), jsonBody),
  update: (backendSvc, jsonBody, tag) => backendSvc.performPutWithJsonBodyAndTag(createUrl(urls.personAddresses), jsonBody, tag),
  delete: (backendSvc, tag) => backendSvc.performDeleteWithTag(createUrl(urls.personAddresses), tag)
};
