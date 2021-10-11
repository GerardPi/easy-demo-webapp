import { ofType } from 'redux-observable';
import { map, filter, delay, tap } from 'rxjs/operators';
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 1000;

const epics = {
  refreshCommandTypesBusyUponCommand: action$ => action$.pipe(
    filter(action => reduxUtils.backendAction.command.isType(action.type)),
    delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
    map(action => commonActions.command.refreshCommandTypesBusy(action.type)))
};

export default epics;
