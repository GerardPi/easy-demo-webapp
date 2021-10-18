import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import addressbookEpics from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import { actualBackend } from '../../../src/redux/backend/backend-services';
import * as userFeedbacks from '../../../src/redux/user-feedbacks';
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
    stubbedBackendSvc = sandbox.stub(actualBackend, 'performGet').returns(rxjs.of({}));
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('address.readList success', (done) => {
    const givenAction = addressbookActions.address.readList.command();
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockResponse = {};
    stubbedBackendSvc.returns(rxjs.of(mockResponse));
    const epic$ = addressbookEpics.readAddressList(action$, state$);
    epic$.subscribe((actualAction) => {
      sinon.assert.calledWith(stubbedBackendSvc, `${window.backendUrlPrefix}/addresses?page=0&size=100`)
      expect(actualAction.type).to.be.equal(addressbookActions.address.readList.ok.type);
      expect(actualAction.payload.response).to.be.equal(mockResponse);
      expect(actualAction.payload.userFeedback.notificationArrangement).to.be.equal(userFeedbacks.NOTIFICATION_TYPES.none);
      expect(actualAction.payload.userFeedback.text).to.be.equal(userFeedbacks.USER_FEEDBACK_OK_DEFAULT);
      expect(actualAction.payload.commandType).to.be.equal(givenAction.type);
      done();
    });
  });
  it('address.readList problem', (done) => {
    const givenAction = addressbookActions.address.readList.command();
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    stubbedBackendSvc.returns(rxjs.throwError('Something went wrong'));
    const epic$ = addressbookEpics.readAddressList(action$, state$);
    epic$.subscribe((actualAction) => {
      sinon.assert.calledWith(stubbedBackendSvc, `${window.backendUrlPrefix}/addresses?page=0&size=100`)
      console.log(`actualAction=${JSON.stringify(actualAction)}`);
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.userFeedback.notificationArrangement).to.be.equal(userFeedbacks.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.userFeedback.text).to.be.equal(userFeedbacks.USER_FEEDBACK_FAIL_DEFAULT);
      expect(actualAction.payload.commandType).to.be.equal(givenAction.type);
      done();
    });
  });
});
