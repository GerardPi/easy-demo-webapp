import { ajax } from 'rxjs/ajax';
import * as reduxUtils from '../redux-utils';
import { createAction } from '@reduxjs/toolkit';
import APP_DEFAULTS from '../../application-defaults';
import * as userFeedbacks from '../user-feedbacks';

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
            (id, userFeedback) => ({payload: { id, userFeedback }})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.address.read),
            (response, userFeedback) => ({payload: { response, userFeedback }})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.address.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.readList),
            (pageIndex = APP_DEFAULTS.pageIndex, pageSize = APP_DEFAULTS.pageSize, userFeedback = userFeedbacks.INFO_FOR_USER_DEFAULT) =>
                  ({payload: { pageIndex, pageSize, userFeedback }})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.address.readList),
            (response, userFeedback) => {
              console.log(`### actions.js address.readList.ok...`);
              return {payload: { response, userFeedback}};
            }),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.address.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.create),
            userFeedback => ({payload: {userFeedback}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.update),
            userFeedback => ({payload: {userFeedback}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.address.delete),
            (id, etag, userFeedback) => ({payload: {id, etag, userFeedback}}))
    }
};

const person = {
    read: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.read),
            (id, userFeedback) => ({payload: { userFeedback}})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.person.read),
            (response, userFeedback) => ({payload: { response, userFeedback}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.person.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.readList),
            (userFeedback, pageIndex = 0, pageSize = APP_DEFAULTS.pageSize) => ({payload: { userFeedback}})),
        ok: createAction(reduxUtils.backendAction.ok.create(actionTypePrefixes.person.readList),
            (response, userFeedback) => ({payload: { response, userFeedback}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.create(actionTypePrefixes.person.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.create),
            userFeedback => ({payload: {userFeedback}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.update),
            userFeedback => ({payload: {userFeedback}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.create(actionTypePrefixes.person.delete),
            userFeedback => ({payload: {userFeedback}}))
    }
};


const actions = {
  person,
  address
};

export default actions;
