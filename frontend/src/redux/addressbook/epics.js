import { ofType } from "redux-observable";
import { from } from "redux-observable/node_modules/rxjs";
import { map } from "rxjs/operators";
import * as addressbookActions from './actions';
import * as addressbookServices from '../backend/addressbook-services';
import * as reduxUtils from '../redux-utils';

export const epics = {
    read: (action$, state$, { backend }) => action$.pipe(
        ofType(addressbookActions.address.read.command.type),
        mergeMap(action => 
            from(addressbookServices.address.read(backend, action.payload.id, action.payload.infoForUser)).pipe(
                map(response => addressbookActions.address.read.ok(response, reduxUtils.successFromCommandAction(action)))
            ))
    ),
    readList: (action$, state$, { backend }) => action$.pipe(
        ofType(addressbookActions.address.readList.command.type),
        mergeMap(action => 
            from(addressbookServices.address.readList(backend, action.payload.infoForUser, action.payload.pageIndex, action.payload.pageSize)).pipe(
                map(response => addressbookActions.address.readList.ok(response, reduxUtils.successFromCommandAction(action))),
                catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            ))
    ),
    create: (action$, state$, { backend }) => action$.pipe(
        ofType(addressbookActions.address.create.command.type),
        mergeMap(action => 
            from(addressbookServices.address.create(backend, action.payload.address)).pipe(
                mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
                catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            ))
    ),
    update: (action$, state$, { backend }) => action$.pipe(
        ofType(addressbookActions.address.update.command.type),
        mergeMap(action => 
            from(addressbookServices.address.update(backend, action.payload.address)).pipe(
                mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
                catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            ))

    ),
    delete: (action$, state$, { backend }) => action$.pipe(
        ofType(addressbookActions.address.delete.command.type),
        mergeMap(action => 
            from(addressbookServices.address.delete(backend, action.payload.id)).pipe(
                mergeMap(response => from(reduxUtils.successFromCommandAction(action))),
                catchError(error => from(reduxUtils.failureFromCommandAction(action, error)))
            ))
    )
};