import { mergeMap, catchError } from "rxjs/operators";
import { BehaviorSubject, EMPTY } from 'rxjs';

export class EpicRegistry {
    constructor() {
        this._epic$ = new BehaviorSubject(() => EMPTY);
    }
    register (epics) {
        epics.map(epic => this._epic$.next(epic));
    }
    rootEpic(...args$) {
        return this._epic$.pipe(
            mergeMap(epic => epic(...args$)),
            catchError((error, source) => {
                console.error(`There was a RootEpic error: ${JSON.stringify(error)}`);
                return source;
            })
        );
    }
}

export const epicRegistry = new EpicRegistry();
