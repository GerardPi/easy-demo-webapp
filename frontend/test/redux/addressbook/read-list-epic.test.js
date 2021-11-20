import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import { epics as addressbookEpics } from '../../../src/redux/addressbook/epics';
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
    stubbedBackendSvc = sandbox
      .stub(actualBackend, 'performGet')
      .returns(rxjs.of({}));
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('address.readList success', done => {
    console.log('### TEST address.readList success');
    // Given
    const givenAction = addressbookActions.address.readList.command();
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const mockResponse = {};
    stubbedBackendSvc.returns(rxjs.of(mockResponse));
    // When
    const epic$ = addressbookEpics.readAddressList(action$, state$);
    // Then
    epic$.subscribe(actualAction => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      sinon.assert.calledWith(
        stubbedBackendSvc,
        `${window.backendUrlPrefix}/addresses?page=0&size=100`
      );
      expect(actualAction.type).to.be.equal(
        addressbookActions.address.readList.ok.type
      );
      expect(actualAction.payload.meta.commandType).to.be.equal(
        givenAction.type
      );
      expect(actualAction.payload.response).to.be.equal(mockResponse);
      expect(
        actualAction.payload.meta.userFeedback.notificationType
      ).to.be.equal(userFeedback.NOTIFICATION_TYPES.none);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(
        'The list was loaded successfully'
      );
      done();
    });
  });
  // Use it.skip to disable this test.
  it('address.readList problem', done => {
    console.log('### TEST address.readList problem');
    // Given
    const givenAction = addressbookActions.address.readList.command();
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    stubbedBackendSvc.returns(rxjs.throwError('Something went wrong'));
    // When
    const epic$ = addressbookEpics.readAddressList(action$, state$);
    const expectedErrorResponseData = null;
    const expectedTicketId = '[no ticket ID available]';
    // Then
    epic$.subscribe(actualAction => {
      sinon.assert.calledWith(
        stubbedBackendSvc,
        `${window.backendUrlPrefix}/addresses?page=0&size=100`
      );
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.meta.commandType).to.be.equal(
        givenAction.type
      );
      expect(
        actualAction.payload.meta.userFeedback.notificationType
      ).to.be.equal(userFeedback.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(
        'The list could not be loaded. Please try again.'
      );
      expect(actualAction.payload.meta.userFeedback.ticketId).to.be.equal(
        expectedTicketId
      );
      expect(actualAction.payload.errorResponseData).to.be.equal(
        expectedErrorResponseData
      );
      done();
    });
  });
});
