import {
  map,
  mergeMap,
  tap,
  catchError,
  withLatestFrom,
  delay,
} from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType } from 'redux-observable';
import testActions from './actions';
import testServices from '../backend/test-services';
import testSelectors from './selectors';
import * as reduxUtils from '../redux-utils';
import { actualBackend } from '../backend/backend-services';


export const createEpics = backendSvc => ({
  testOne: (action$, state$) =>
    action$.pipe(
      ofType(testActions.test.one.command.type),
      mergeMap(action =>
        from(
          testServices.testOne(
            backendSvc,
            action.payload.testAData
          )
        ).pipe(
          map(response =>
            testActions.test.one.ok(
              response,
              reduxUtils.createSuccessMetaData(action)
            )
          ),
          catchError(error =>
            of(reduxUtils.createCommonFailureAction(action, error))
          )
        )
      )
    )
});

export const epics = createEpics(actualBackend);
