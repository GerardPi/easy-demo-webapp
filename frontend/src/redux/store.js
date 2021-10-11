import * as reduxToolkit from '@reduxjs/toolkit';
import * as reduxObservable from 'redux-observable';
import { reducerRegistry } from './reducer-registry';
import { epicRegistry } from './epic-registry';
import { epicMiddlewareConfiguration } from './epic-mw-config';

import addressbookReducer from './addressbook/reducer';
reducerRegistry.register("addressbook", addressbookReducer);

import commonReducer from './common/reducer';
reducerRegistry.register("common", commonReducer);

import commonEpics from './common/epics';
import addressbookEpics from './addressbook/epics';
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

//console.log(`### addressbookEpics = ${Object.keys(addressbookEpics)}`);
//console.log(`### commonEpics = ${Object.keys(commonEpics)}`);
epicRegistry.register(Object.values(addressbookEpics));
epicRegistry.register(Object.values(commonEpics));

export default store;
