import * as reduxToolkit from '@reduxjs/toolkit';
import * as reduxObservable from 'redux-observable';
import { reducerRegistry } from './reducer-registry';
import { epicRegistry } from './epic-registry';
import { actualBackend } from './backend/backend-services';
import addressbookReducer from './addressbook/reducer';
import testReducer from './test/reducer';
import commonReducer from './common/reducer';
import commonEpics from './common/epics';
import testEpics from './test/epics';
import addressbookEpics from './addressbook/epics';

reducerRegistry.register('addressbook', addressbookReducer);
reducerRegistry.register('test', testReducer);
reducerRegistry.register('common', commonReducer);

const epicMiddleware = reduxObservable.createEpicMiddleware();

const store = reduxToolkit.configureStore({
  reducer: reducerRegistry.getRootReducer(),
  middleware: [epicMiddleware],
  devTools: true,
});

reducerRegistry.setChangeListener(rootReducer =>
  store.replaceReducer(rootReducer)
);

epicMiddleware.run(epicRegistry.rootEpic.bind(epicRegistry));

epicRegistry.register(Object.values(addressbookEpics));
epicRegistry.register(Object.values(testEpics));
epicRegistry.register(Object.values(commonEpics));

export default store;
