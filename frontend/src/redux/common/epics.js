
import { ofType } from "redux-observable";
import { map, filter, delay } from "rxjs/operators";
import * as commonActions from './actions';
import * as addressbookServices from '../backend/addressbook-services';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 1000;

export const epics = {
    commandActionToGeneric: action$ => action$.pipe(
        filter(action => reduxUtils.backendAction.command.is(action.type)),
        map(action => commonActions.backend.command.started(action.type, action.payload))),
    failActionToGeneric: action$ => action$.pipe(
        filter(action => reduxUtils.backendAction.fail.is(action.type)),
        map(action => reduxUtils.backendAction.fail.toCommand(action.type, action.payload.response, action.payload.infoForUser))),
    okActionToGeneric: action$ => action$.pipe(
        filter(action => reduxUtils.backendAction.ok.is(action.type)),
        map(action => reduxUtils.backendAction.ok.toCommand(action.type, action.payload.response, action.payload.infoForUser))),
    refreshCommandTypesBusyUponCommand: action$ => action$.pipe(
        filter(action => reduxUtils.backendAction.command.is(action.type)),
        delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
        map(action => commonActions.backend.command.refreshCommandTypesBusy(action.type)))
};
