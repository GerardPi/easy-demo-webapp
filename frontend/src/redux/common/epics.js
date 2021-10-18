import { ofType } from 'redux-observable';
import { map, filter, delay, tap } from 'rxjs/operators';
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 1000;

const epics = {
  failActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.fail.is(action)),
       map(action => {
         const commonFailCommand = reduxUtils.backendAction.fail.toCommand(action.type);
         return commonActions.command.failed(commonFailCommand, action.payload.response, action.payload.userFeedback);
       })
     ),

  okActionToCommon: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.ok.is(action)),
    map(action => {
      const commonOkCommand = reduxUtils.backendAction.ok.toCommand(action.type);
      return commonActions.command.succeeded(commonOkCommand, action.payload.response, action.payload.userFeedback);
    })
  ),

  refreshCommandTypesBusyUponCommand: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.isType(action.type)),
    delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
    map(action => commonActions.command.refreshCommandTypesBusy(action.type)))
};

export default epics;
