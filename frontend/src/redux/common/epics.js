import { ofType } from 'redux-observable';
import { map, filter, delay, tap } from 'rxjs/operators';
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 400;

const epics = {
  commandActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.isType(action.type)),
    map(action => commonActions.command.started(action.type, action.payload))),

  failActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.fail.isType(action.type)),
    map(action => {
      const commonFailCommand = reduxUtils.backendAction.fail.toCommand(action.type);
      return commonActions.command.failed(commonFailCommand, action.payload.response, action.payload.infoForUser);
    })
  ),

  okActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.ok.isType(action.type)),
    map(action => {
      const commonOkCommand = reduxUtils.backendAction.ok.toCommand(action.type);
      return commonActions.command.succeeded(commonOkCommand, action.payload.response, action.payload.infoForUser);
    })
  ),

  refreshCommandTypesBusyUponCommand: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.isType(action.type)),
    tap(action => console.log(`##### before common.epics.refreshCommandTypesBusyUponCommand${JSON.stringify(action)}`)),
    delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
    map(action => commonActions.command.refreshCommandTypesBusy(action.type)),
    tap(action => console.log(`##### after common.epics.refreshCommandTypesBusyUponCommand${JSON.stringify(action)}`)))
};

export default epics;
