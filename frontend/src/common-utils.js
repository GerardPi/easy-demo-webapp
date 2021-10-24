import * as ldObject from 'lodash-es/object';
import * as ldLang from 'lodash-es/lang';
import * as ldString from 'lodash-es/string';
import * as ldArray from 'lodash-es/array';

export function isNullOrEmpty(value) {
    return ldLang.isNull(value) || ldLang.isEmpty(value);
}

export function isNotNullOrEmpty(value) {
    return !ldLang.isNull(value) && !ldLang.isEmpty(value);
}


export function isSubvalueNullOrEmpty(value, propertyKey) {
    return (!ldObject.has(value, propertyKey)) || isNullOrEmpty(value[propertyKey]);
}

export function isSubvalueNotNullOrEmpty(value, propertyKey) {
    return ldObject.has(value, propertyKey) && isNullOrEmpty(value[propertyKey]);
}

export function endsWith(value, suffix) {
    return ldString.endsWith(value, suffix);
}

export function startsWith(value, suffix) {
    return ldString.startsWith(value, suffix);
}

export function containsPropertyWithKey(targetObject, propertyKey) {
    return (targetObject !== null
        && targetObject !== undefined
        && Object.prototype.hasOwnProperty.call(targetObject, propertyKey));
}

export function arrayWithValue(originalArray, valueToAdd) {
    if (originalArray.includes(valueToAdd)) {
        return originalArray;
    }
    return originalArray.concat(valueToAdd);
}

export function arrayWithoutValue(originalArray, valueToRemove) {
    return ldArray.without(originalArray, valueToRemove);
}

export function objectWithout(object, propertyKey) {
    return ldObject.omit(object, [propertyKey]);
}

export function objectWith(object, path, value) {
    const result = ldLang.cloneDeep(object);
    return ldObject.set(result, path, value);
}

export function assertNoNullOrEmptyValues(keyValueMap) {
  const nullValues = Object.keys(keyValueMap).filter(key => keyValueMap[key] === null);
  if (Object.keys(nullValues).length > 0) {
    throw `Missing arguments: ${JSON.stringify(nullValues)}`;
  }
}
