import * as reduxToolkit from '@reduxjs/toolkit';
import * as reduxObservable from 'redux-observable';
import { reducerRegistry } from './reducer-registry';
import { epicRegistry } from './epic-registry';
import { epicMiddlewareConfiguration } from './epic-mw-config';

import { epics as addressbookEpics } from './addressbook/epics';
import './addressbook/reducers';

import { epics as commonEpics } from './common/epics';
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

epicRegistry.register(Object.values(addressbookEpics, commonEpics));

export default store;