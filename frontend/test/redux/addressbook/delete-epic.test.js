import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import addressbookEpics from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import { actualBackend } from '../../../src/redux/backend/backend-services';
import * as userFeedback from '../../../src/redux/user-feedback';
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
    stubbedBackendSvc = sandbox.stub(actualBackend, 'performDeleteWithTag').returns(rxjs.of({}));
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('address.delete success', (done) => {
    console.log('### TEST address.delete success');
    // Given
    const addressId = 1;
    const givenAction = addressbookActions.address.delete.command(addressId);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockResponse = {};
    stubbedBackendSvc.returns(rxjs.of(mockResponse));
    // When
    const epic$ = addressbookEpics.deleteAddress(action$, state$);
    // Then
    epic$.subscribe((actualAction) => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      sinon.assert.calledWith(stubbedBackendSvc, `${window.backendUrlPrefix}/addresses/${addressId}`)
      expect(actualAction.type).to.be.equal(commonActions.command.succeeded.type);
      expect(actualAction.payload.response).to.be.equal('[no response available]');
      expect(actualAction.payload.meta.userFeedback.notificationArrangement).to.be.equal(userFeedback.NOTIFICATION_TYPES.none);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(userFeedback.USER_FEEDBACK_TEXT_OK_DEFAULT);
      expect(actualAction.payload.meta.commandType).to.be.equal(givenAction.type);
      done();
    });
  });
  it('address.delete problem', (done) => {
    console.log('### TEST address.delete problem');
    // Given
    const addressId = 1;
    const givenAction = addressbookActions.address.delete.command(addressId);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockResponse = {};
    stubbedBackendSvc.returns(rxjs.throwError('Something went wrong'));
    // When
    const epic$ = addressbookEpics.deleteAddress(action$, state$);
    const expectedErrorResponseData = null;
    const expectedTicketId = '[no ticket ID available]';
    // Then
    epic$.subscribe((actualAction) => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      sinon.assert.calledWith(stubbedBackendSvc, `${window.backendUrlPrefix}/addresses/${addressId}`)
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.response).to.be.equal('[no response available]');
      expect(actualAction.payload.meta.userFeedback.notificationArrangement).to.be.equal(userFeedback.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(userFeedback.USER_FEEDBACK_TEXT_FAIL_DEFAULT);
      expect(actualAction.payload.meta.userFeedback.ticketId).to.be.equal(expectedTicketId);
      expect(actualAction.payload.meta.commandType).to.be.equal(givenAction.type);
      expect(actualAction.payload.errorResponseData).to.be.equal(expectedErrorResponseData);
      done();
    });
  });
  it('address.delete problem with proper userFeedback', (done) => {
    console.log('### TEST address.delete problem');
    // Given
    const addressId = 1;
    const givenAction = addressbookActions.address.delete.command(addressId);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockResponse = {};
    stubbedBackendSvc.returns(rxjs.throwError('Something went wrong'));
    // When
    const epic$ = addressbookEpics.deleteAddress(action$, state$);
    const expectedErrorResponseData = null;
    const expectedTicketId = '[no ticket ID available]';
    // Then
    epic$.subscribe((actualAction) => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      sinon.assert.calledWith(stubbedBackendSvc, `${window.backendUrlPrefix}/addresses/${addressId}`)
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.response).to.be.equal('[no response available]');
      expect(actualAction.payload.meta.userFeedback.notificationArrangement).to.be.equal(userFeedback.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(userFeedback.USER_FEEDBACK_TEXT_FAIL_DEFAULT);
      expect(actualAction.payload.meta.userFeedback.ticketId).to.be.equal(expectedTicketId);
      expect(actualAction.payload.meta.commandType).to.be.equal(givenAction.type);
      expect(actualAction.payload.errorResponseData).to.be.equal(expectedErrorResponseData);
      done();
    });
  });
});
