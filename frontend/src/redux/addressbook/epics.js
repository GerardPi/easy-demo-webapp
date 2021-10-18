import { map, mergeMap, tap, catchError, withLatestFrom, delay } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType  } from 'redux-observable';
import addressbookActions from './actions';
import addressbookServices from '../backend/addressbook-services';
import * as reduxUtils from '../redux-utils';
import { actualBackend as backendSvc } from '../backend/backend-services';

const epics = {
  readAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.read.command.type),
      mergeMap(action =>
          from(addressbookServices.address.read(backendSvc, action.payload.id, action.payload.infoForUser))
            .pipe(
              map(response => addressbookActions.address.read.ok(response, reduxUtils.successFromCommandAction(action)))
          )
      )
  ),

  readAddressList: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.readList.command.type),
      mergeMap(action =>
          from(addressbookServices.address.readList(backendSvc, {
                    page: action.payload.pageIndex,
                    size: action.payload.pageSize
                }))
            .pipe(
              map(response => addressbookActions.address.readList.ok(response, reduxUtils.successUserInfoFromCommandAction(action))),
              catchError(error => from([reduxUtils.createCommonFailureAction(action, error)]))
            )
      )
  ),

  createAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.create.command.type),
      mergeMap(action =>
          from(addressbookServices.address.create(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => of(reduxUtils.createCommonSuccessAction(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  updateAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.update.command.type),
      mergeMap(action =>
          from(addressbookServices.address.update(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => of(reduxUtils.createCommonSuccessAction(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  deleteAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.delete.command.type),
      mergeMap((action) => from(addressbookServices.address.delete(backendSvc, action.payload.id, action.payload.etag)).pipe(
            map((response) => reduxUtils.createCommonSuccessAction(action, response)),
            catchError((error) => from([reduxUtils.createCommonFailureAction(action, error)])))
      )
  )
};

export default epics;
