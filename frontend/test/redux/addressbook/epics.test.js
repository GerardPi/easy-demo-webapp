import { fixture, expect } from '@open-wc/testing';
import '../../../test/global-variables';

import addressbookEpics from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import { actualBackend } from '../../../src/redux/backend/backend-services';
import * as userInfo from '../../../src/redux/info-for-user';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

describe('addressbook epics', () => {
  const sandbox = sinon.createSandbox();
  let stubbedBackendSvc;
  beforeEach(() => {
     // This is required by redux
     // but it does not work loading the window.process like this:
     // window.process = { env: { NODE_ENV: 'development'}};
     // Instead, use loading global-variables.js like is done above.
//     console.log(`#### ${actualBackend.performGet}`);
    stubbedBackendSvc = sandbox.stub(actualBackend, 'performGet').returns(rxjs.of({}));
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('address.readList success', (done) => {
    const givenAction = addressbookActions.address.readList.command();
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockSuccessResponse = {};
    stubbedBackendSvc.returns(rxjs.of(mockSuccessResponse));
    const epic$ = addressbookEpics.readAddressList(action$, state$);
    epic$.subscribe((actualAction) => {
      sinon.assert.calledWith(stubbedBackendSvc, window.backendUrlPrefix + '/addresses?page=0&size=100')
      expect(actualAction.type).to.be.equal(addressbookActions.address.readList.ok.type);
      expect(actualAction.payload.response).to.be.equal(mockSuccessResponse);
      expect(actualAction.payload.infoForUser.notificationArrangement).to.be.equal(userInfo.NOTIFICATION_TYPES.none);
      expect(actualAction.payload.infoForUser.text).to.be.equal(userInfo.INFO_FOR_USER_OK_DEFAULT);
      expect(actualAction.payload.infoForUser.commandType).to.be.equal(givenAction.type);
      done();
    });
  });
});
