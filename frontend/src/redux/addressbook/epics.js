import { map, mergeMap, tap, catchError, withLatestFrom, delay } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { ofType  } from 'redux-observable';
import addressbookActions from './actions';
import addressbookServices from '../backend/addressbook-services';
import addressbookSelectors from './selectors';
import * as reduxUtils from '../redux-utils';
import { actualBackend } from '../backend/backend-services';

function createReadAddressListAction(state) {
  const selectionData = addressbookSelectors.address.list.selectionData(state);
  return addressbookActions.address.readList.command(selectionData.pageIndex, selectionData.pageSize);
}

export const createEpics = (backendSvc) => ({
  readAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.read.command.type),
      mergeMap(action =>
          from(addressbookServices.address.read(backendSvc, action.payload.id, action.payload.userFeedback))
            .pipe(
              map(response => addressbookActions.address.read
                  .ok(response, reduxUtils.createSuccessMetaData(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
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
              map(response => addressbookActions.address.readList
                  .ok(response, reduxUtils.createSuccessMetaData(action))),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
            )
      )
  ),

  createAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.create.command.type),
      mergeMap(action =>
          from(addressbookServices.address.create(backendSvc, action.payload.data))
            .pipe(
              mergeMap(response => from([reduxUtils.createCommonSuccessAction(action, response), createReadAddressListAction(state$.value)])),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  updateAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.update.command.type),
      mergeMap(action =>
          from(addressbookServices.address.update(backendSvc, action.payload.id, action.payload.etag, action.payload.data))
            .pipe(
              mergeMap(response => from([reduxUtils.createCommonSuccessAction(action, response), createReadAddressListAction(state$.value)])),
              catchError(error => of(reduxUtils.createCommonFailureAction(action, error)))
          )
      )
  ),

  deleteAddress: (action$, state$) => action$.pipe(
      ofType(addressbookActions.address.delete.command.type),
      mergeMap((action) => from(addressbookServices.address.delete(backendSvc, action.payload.id, action.payload.etag)).pipe(
            mergeMap((response) => from([reduxUtils.createCommonSuccessAction(action, response), createReadAddressListAction(state$.value)])),
            catchError((error) => of(reduxUtils.createCommonFailureAction(action, error))))
      )
  )
});

export const epics = createEpics(actualBackend);
