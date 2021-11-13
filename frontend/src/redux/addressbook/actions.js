import { ajax } from 'rxjs/ajax';
import * as reduxUtils from '../redux-utils';
import { createAction } from '@reduxjs/toolkit';
import APP_DEFAULTS from '../../application-defaults';
import * as userFeedback from '../user-feedback';

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
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.address.read),
            (id, userFeedbackData) => ({payload: { id, userFeedbackData }})),
        ok: createAction(reduxUtils.backendAction.ok.createType(actionTypePrefixes.address.read),
            (response, meta) => ({payload: { response, meta }})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.createType(actionTypePrefixes.address.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.address.readList),
            (pageIndex = APP_DEFAULTS.pageIndex, pageSize = APP_DEFAULTS.pageSize, userFeedbackData = userFeedback.USER_FEEDBACK_DATA_DEFAULT) =>
                  ({payload: { pageIndex, pageSize, userFeedbackData }})),
        ok: createAction(reduxUtils.backendAction.ok.createType(actionTypePrefixes.address.readList),
            (response, meta) => ({payload: { response, meta}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.createType(actionTypePrefixes.address.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.address.create),
            (data, userFeedbackData) => ({payload: {data, userFeedbackData}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.address.update),
            (data, etag, userFeedbackData) => ({payload: {data, etag, userFeedbackData}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.address.delete),
            (id, etag, userFeedbackData = userFeedback.USER_FEEDBACK_DATA_DEFAULT) =>
                ({payload: {id, etag, userFeedbackData}}))
    }
};

const person = {
    read: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.person.read),
            (id, userFeedbackData) => ({payload: { userFeedbackData}})),
        ok: createAction(reduxUtils.backendAction.ok.createType(actionTypePrefixes.person.read),
            (response, meta) => ({payload: { response, meta}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.createType(actionTypePrefixes.person.read))
    },
    readList: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.person.readList),
            (userFeedbackData, pageIndex = 0, pageSize = APP_DEFAULTS.pageSize) => ({payload: { userFeedbackData}})),
        ok: createAction(reduxUtils.backendAction.ok.createType(actionTypePrefixes.person.readList),
            (response, meta) => ({payload: { response, meta}})),
        commandRepeat: createAction(reduxUtils.backendAction.commandRepeat.createType(actionTypePrefixes.person.readList))
    },
    create: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.person.create),
            (data, userFeedbackData) => ({payload: {data, userFeedbackData}}))
    },
    update: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.person.update),
            (id, etag, data, userFeedbackData) => ({payload: {id, etag, data, userFeedbackData}}))
    },
    delete: {
        command: createAction(reduxUtils.backendAction.command.createType(actionTypePrefixes.person.delete),
            (id, etag, userFeedbackData) => ({payload: {id, etag, userFeedbackData}}))
    }
};


const actions = {
  person,
  address
};

export default actions;
