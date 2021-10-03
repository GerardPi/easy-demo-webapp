
import { ofType } from "redux-observable";
import { map, filter, delay } from "rxjs/operators";
import * as commonActions from './actions';
import * as addressbookServices from '../backend/addressbook-services';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 1000;

const epics = {
  commandActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.is(action.type)),
    map(action => commonActions.backend.command.started(action.type, action.payload))),

  failActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.fail.is(action.type)),
    map(action => {
      const commonFailCommand = reduxUtils.backendAction.fail.toCommand(action.type);
      return commonActions.backend.command.failed(commonFailCommand, action.payload.response, action.payload.infoForUser);
    })
  ),

  okActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.ok.is(action.type)),
    map(action => {
      const commonOkCommand = reduxUtils.backendAction.ok.toCommand(action.type);
      return commonActions.backend.command.succeeded(commonOkCommand, action.payload.response, action.payload.infoForUser);
    })
  ),

  refreshCommandTypesBusyUponCommand: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.is(action.type)),
    delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
    map(action => commonActions.backend.command.refreshCommandTypesBusy(action.type)))
};

export default epics;
