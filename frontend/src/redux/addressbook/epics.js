import { map, mergeMap, tap, catchError, withLatestFrom, delay } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType  } from 'redux-observable';
import addressbookActions from './actions';
import addressbookServices from '../backend/addressbook-services';
import * as reduxUtils from '../redux-utils';

const epics = {
  readAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.read.command.type),
      mergeMap(action =>
          from(addressbookServices.address.read(backendSvc, action.payload.id, action.payload.infoForUser))
            .pipe(
              map(response => addressbookActions.address.read.ok(response, reduxUtils.successFromCommandAction(action)))
          )
      )
  ),

  readAddressList: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.readList.command.type),
      delay(2000),
      mergeMap(action =>
          from(addressbookServices.address.readList(backendSvc, {
                    pargeIndex: action.payload.pageIndex,
                    pageSize: action.payload.pageSize
                }))
            .pipe(
              map(response => addressbookActions.address.readList.ok(response, reduxUtils.successUserInfoFromCommandAction(action))),
              catchError(error => from([reduxUtils.createCommonFailureAction(action, error)]))
            )
      )
  ),

  createAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.create.command.type),
      mergeMap(action =>
          from(addressbookServices.address.create(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => of(reduxUtils.createCommonSuccessAction(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  updateAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.update.command.type),
      mergeMap(action =>
          from(addressbookServices.address.update(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => of(reduxUtils.createCommonSuccessAction(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  deleteAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.remove.command.type),
      mergeMap(action =>
          from(addressbookServices.address.remove(backendSvc, action.payload.id, action.payload.etag))
            .pipe(
              mergeMap(response => of(reduxUtils.createCommonSuccessAction(action))),
              catchError(error => from([reduxUtils.createCommonFailureAction(action, error)]))
            )
      )
  )
};

export default epics;
