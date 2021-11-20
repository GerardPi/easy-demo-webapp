import { map, filter, delay, tap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import commonActions from './actions';
import * as reduxUtils from '../redux-utils';

const TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS = 1000;
const TIME_IN_MS_DISPLAY_TRANSIENT_USER_FEEDBACK = 5000;

const epics = {
  refreshCommandTypesBusyUponCommand: action$ =>
    action$.pipe(
      filter(action => reduxUtils.backendAction.command.isType(action.type)),
      delay(TIME_IN_MS_BEFORE_BUSY_INDICATOR_APPEARS),
      map(action => commonActions.command.refreshCommandTypesBusy(action.type))
    ),
  delayedTransientUserFeedbackDeletion: action$ =>
    action$.pipe(
      ofType(commonActions.transientUserFeedback.deleteLater.type),
      filter(action => action.payload.transientUserFeedbackIds.length > 0),
      delay(TIME_IN_MS_DISPLAY_TRANSIENT_USER_FEEDBACK),
      map(action =>
        commonActions.transientUserFeedback.deleteNow(
          action.payload.transientUserFeedbackIds
        )
      )
    ),
};

export default epics;

/*
    filter(action => (action.payload.transientUserFeedbackIds.length > 0)
                      && (action.type === commonActions.transientUserFeedback.deleteLater.type)),
                      */
