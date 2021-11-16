export const ADDRESS_COLUMNS = [
    { name: '', path: '_select' },
    { name: 'ID', path: 'id', hidden: true },
    { name: 'etag', path: 'etag', hidden: true},
    { name: 'Street', path: 'street', width: 3},
    { name: 'Housenumber', path: 'houseNumber', width: 1},
    { name: 'Postal code', path: 'postalCode', width: 2},
    { name: 'City', path: 'city', width: 3},
    { name: 'Country', tooltip: 'ISO country code', path: 'countryCode', width: 1}
];

export const PERSON_COLUMNS = [
    { name: 'ID', path: 'id' },
    { name: 'etag', path: 'etag'},
    { name: 'Country code', path: 'countryCode', width: 1},
    { name: 'City', path: 'city', width: 3},
    { name: 'Postal code', path: 'postalCode', width: 2},
    { name: 'Street', path: 'street', width: 3},
    { name: 'Housenumber', path: 'houseNumber', width: 1}
];
