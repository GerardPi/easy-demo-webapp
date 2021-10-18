console.log(1);
import { ajax } from 'rxjs/ajax';
import * as reduxUtils from '../redux-utils';
import { createAction } from '@reduxjs/toolkit';
import APP_DEFAULTS from '../../application-defaults';
import * as userInfo from '../info-for-user';
console.log(2);
const actionTypePrefixes = {
    address: {
        read: 'ADDRESS_READ',
        readList: 'ADDRESS_READ_LIST',
        create: 'ADDRESS_CREATE',
        update: 'ADDRESS_UPDATE',
        delete: 'ADDRESS_DELETE'
    },
    person: {
        read: 'PERSON_READ',
        readList: 'PERSON_READ_LIST',
        create: 'PERSON_CREATE',
        update: 'PERSON_UPDATE',
        delete: 'PERSON_DELETE'
    }
};

const address = {
    read: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.read),
            (id, infoForUser) => ({payload: { id, infoForUser }})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.address.read),
            (response, infoForUser) => ({payload: { response, infoForUser }})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.address.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.readList),
            (pageIndex = APP_DEFAULTS.pageIndex, pageSize = APP_DEFAULTS.pageSize, infoForUser = userInfo.INFO_FOR_USER_DEFAULT) =>
                  ({payload: { pageIndex, pageSize, infoForUser }})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.address.readList),
            (response, infoForUser) => {
              console.log(`### actions.js address.readList.ok...`);
              return {payload: { response, infoForUser}};
            }),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.address.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.create),
            infoForUser => ({payload: {infoForUser}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.update),
            infoForUser => ({payload: {infoForUser}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.delete),
            (id, etag, infoForUser) => ({payload: {id, etag, infoForUser}}))
    }
};

export const person = {
    read: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.read),
            (id, infoForUser) => ({payload: { infoForUser}})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.person.read),
            (response, infoForUser) => ({payload: { response, infoForUser}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.person.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.readList),
            (infoForUser, pageIndex = 0, pageSize = APP_DEFAULTS.pageSize) => ({payload: { infoForUser}})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.person.readList),
            (response, infoForUser) => ({payload: { response, infoForUser}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.person.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.create),
            infoForUser => ({payload: {infoForUser}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.update),
            infoForUser => ({payload: {infoForUser}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.delete),
            infoForUser => ({palload: {infoForUser}}))
    }
};


const actions = {
  person,
  address
};

export default actions;
