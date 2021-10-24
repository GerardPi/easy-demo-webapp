import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import { epics as addressbookEpics } from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import { createBackend, actualBackend } from '../../../src/redux/backend/backend-services';
import { axios } from '@bundled-es-modules/axios';
import * as userFeedback from '../../../src/redux/user-feedback';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

/*
  This test subs the backend API (which, in turn uses axios).
  Stubbing axios when throwing exceptions for testing
  leads to 'TypeError: restApi.delete(...).then is not a function' as described here
  https://stackoverflow.com/questions/50801243/how-to-test-axios-requests-parameters-with-sinon-chai
*/


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
  it('address.delete problem', (done) => {
    console.log('### TEST address.delete problem');
    // Given
    const addressId = '1';
    const addressEtag = '2';
    const givenAction = addressbookActions.address.delete.command(addressId, addressEtag);
    console.log(`## givenAction=${JSON.stringify(givenAction)}`);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    stubbedBackendSvc.returns(rxjs.throwError('Something went wrong'));
    // When
    const epic$ = addressbookEpics.deleteAddress(action$, state$);
    // Then
    epic$.subscribe((actualAction) => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      const expectedUrl = `${window.backendUrlPrefix}/addresses`;
      const expectedHeaders = { headers: { 'If-Match': `${addressEtag}`}};
      sinon.assert.calledWith(stubbedBackendSvc, expectedUrl, addressId, addressEtag);
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.response).to.be.equal('[no response available]');
      expect(actualAction.payload.meta.userFeedback.notificationArrangement).to.be.equal(userFeedback.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(userFeedback.USER_FEEDBACK_TEXT_FAIL_DEFAULT);
      const expectedTicketId = '[no ticket ID available]';
      expect(actualAction.payload.meta.userFeedback.ticketId).to.be.equal(expectedTicketId);
      expect(actualAction.payload.meta.commandType).to.be.equal(givenAction.type);
      const expectedErrorResponseData = null;
      expect(actualAction.payload.errorResponseData).to.be.equal(expectedErrorResponseData);
      done();
    });
  });
});
