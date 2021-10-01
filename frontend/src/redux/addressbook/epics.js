import { ofType } from "redux-observable";
import { map, mergeMap } from "rxjs/operators";
import { from } from "rxjs";
import * as addressbookActions from './actions';
import * as addressbookServices from '../backend/addressbook-services';
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
      mergeMap(action =>
          from(addressbookServices.address.readList(backendSvc, action.payload.pageIndex, action.payload.pageSize))
            .pipe(
              map(response => addressbookActions.address.readList.ok(response, reduxUtils.successFromCommandAction(action))),
              catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            )
      )
  ),

  createAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.create.command.type),
      mergeMap(action =>
          from(addressbookServices.address.create(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
              catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
          )
      )
  ),

  updateAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.update.command.type),
      mergeMap(action =>
          from(addressbookServices.address.update(backendSvc, action.payload.address))
            .pipe(
              mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
              catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
          )
      )
  ),

  deleteAddress: (action$, state$, { backendSvc }) => action$.pipe(
      ofType(addressbookActions.address.delete.command.type),
      mergeMap(action =>
          from(addressbookServices.address.delete(backendSvc, action.payload.id))
            .pipe(
              mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
              catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            )
      )
  )
};

export default epics;
