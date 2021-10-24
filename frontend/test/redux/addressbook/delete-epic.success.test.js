import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import { createEpics as createAddressbookEpics } from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import { createBackend, actualBackend } from '../../../src/redux/backend/backend-services';
import { axios } from '@bundled-es-modules/axios';
import * as userFeedback from '../../../src/redux/user-feedback';
import * as rxjs from 'rxjs';
import sinon from 'sinon';

/*
  This test subs the axios API.
*/

describe('addressbook delete epic', () => {
  const sandbox = sinon.createSandbox();


  let stubbedBackendSvc;

  afterEach(() => {
    sandbox.restore();
  });
  function createMockResponse(response) {
    return new Promise((r) => r (response));
  }
  it('address.delete success', (done) => {
    console.log('### TEST address.delete success');
    // Given
    const addressId = '1';
    const addressEtag = '2';
    const givenAction = addressbookActions.address.delete.command(addressId, addressEtag);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    const stubbedAxios = sandbox.stub(axios, 'delete').returns(createMockResponse({}));
    const backend = createBackend(axios);
    const addressbookEpics = createAddressbookEpics(backend);
    // When
    const actualAction$ = addressbookEpics.deleteAddress(action$, state$);
    // Then
    actualAction$.subscribe((actualAction) => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      const expectedUrl = `${window.backendUrlPrefix}/addresses/${addressId}`;
      const expectedHeaders = { headers: { 'If-Match': `${addressEtag}`}};
      sinon.assert.calledWith(stubbedAxios, expectedUrl, expectedHeaders);
      expect(actualAction.type).to.be.equal(commonActions.command.succeeded.type);
      expect(actualAction.payload.response).to.be.equal('[no response available]');
      expect(actualAction.payload.meta.userFeedback.notificationArrangement).to.be.equal(userFeedback.NOTIFICATION_TYPES.none);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(userFeedback.USER_FEEDBACK_TEXT_OK_DEFAULT);
      expect(actualAction.payload.meta.commandType).to.be.equal(givenAction.type);
      done();
    });
  });
});
