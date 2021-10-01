import * as reduxToolkit from '@reduxjs/toolkit';
import * as reduxObservable from 'redux-observable';
import { reducerRegistry } from './reducer-registry';
import { epicRegistry } from './epic-registry';
import { epicMiddlewareConfiguration } from './epic-mw-config';

import addressbookEpics from './addressbook/epics';
import './addressbook/reducers';

import commonEpics from './common/epics';
import './common/reducers';

const epicMiddleware = reduxObservable.createEpicMiddleware(epicMiddlewareConfiguration.getConfiguration());

const store = reduxToolkit.configureStore(
    {
        reducer: reducerRegistry.getRootReducer(),
        middleware: [epicMiddleware],
        devTools: true

    }
);

reducerRegistry.setChangeListener(rootReducer => store.replaceReducer(rootReducer));

epicMiddleware.run(epicRegistry.rootEpic.bind(epicRegistry));

console.log(`### addressbookEpics = ${JSON.stringify(addressbookEpics)}`);
epicRegistry.register(Object.values(addressbookEpics));
epicRegistry.register(Object.values(commonEpics));

export default store;
