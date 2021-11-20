import { fixture, expect } from '@open-wc/testing';
import '../../global-variables';

import { createEpics as createAddressbookEpics } from '../../../src/redux/addressbook/epics';
import addressbookActions from '../../../src/redux/addressbook/actions';
import commonActions from '../../../src/redux/common/actions';
import {
  createBackend,
  actualBackend,
} from '../../../src/redux/backend/backend-services';
import * as userFeedback from '../../../src/redux/user-feedback';
import * as rxjs from 'rxjs';
import * as rxjsOperators from 'rxjs/operators';
import sinon from 'sinon';

/*
  https://stackoverflow.com/questions/55569169/redux-observable-modify-state-and-trigger-follow-up-action
*/
describe('addressbook delete epic', () => {
  const sandbox = sinon.createSandbox();
  const fakeAxios = {
    delete: a => `## a=${a}`,
  };

  let stubbedBackendSvc;

  afterEach(() => {
    sandbox.restore();
  });
  it('address.delete success', done => {
    // Given
    const addressId = '1';
    const addressEtag = '2';
    const givenAction = addressbookActions.address.delete.command(
      addressId,
      addressEtag
    );
    const action$ = rxjs.of(givenAction);
    const state$ = {
      value: {
        addressbook: {
          address: {
            list: {
              selectionData: {
                pageIndex: 2,
                pageSize: 10,
              },
            },
          },
        },
      },
    };
    const responseForDelete = {};
    const resolved = new Promise(r => r(responseForDelete));
    const stubbedAxios = sandbox.stub(fakeAxios, 'delete').returns(resolved);
    const backend = createBackend(fakeAxios);
    const addressbookEpics = createAddressbookEpics(backend);
    // When
    const actualAction$ = addressbookEpics.deleteAddress(action$, state$);
    // Then
    // Two actions are expected from the delete:
    // the backend delete is triggered
    // depending on the response, the list is reloaded using data from the store.
    // Convert stream of actions into one element with all actions.
    const actualActionArray$ = actualAction$.pipe(rxjsOperators.toArray());
    actualActionArray$.subscribe(actualActionArray => {
      expect(actualActionArray.length).to.be.equal(2);
      const actualAction = actualActionArray[0]; // The delete action
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      const expectedUrl = `${window.backendUrlPrefix}/addresses/${addressId}`;
      const expectedHeaders = { headers: { 'If-Match': `${addressEtag}` } };
      sinon.assert.calledWith(stubbedAxios, expectedUrl, expectedHeaders);
      expect(actualAction.type).to.be.equal(
        commonActions.command.succeeded.type
      );
      expect(actualAction.payload.response).to.be.equal(
        '[no response available]'
      );
      expect(
        actualAction.payload.meta.userFeedback.notificationType
      ).to.be.equal(userFeedback.NOTIFICATION_TYPES.transient);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(
        'The item was deleted successfully'
      );
      expect(actualAction.payload.meta.commandType).to.be.equal(
        givenAction.type
      );

      const actualAction2 = actualActionArray[1]; // The reload action
      console.log(`## actualAction2=${JSON.stringify(actualAction2)}`);
      expect(actualAction2.type).to.be.equal(
        addressbookActions.address.readList.command.type
      );
      expect(actualAction2.payload.pageIndex).to.be.equal(2);
      expect(actualAction2.payload.pageSize).to.be.equal(10);
      done();
    });
  });
  it('address.delete problem', done => {
    console.log('### TEST address.delete problem');
    // Given
    const addressId = '1';
    const addressEtag = '2';
    const givenAction = addressbookActions.address.delete.command(
      addressId,
      addressEtag
    );
    console.log(`## givenAction=${JSON.stringify(givenAction)}`);
    const action$ = rxjs.of(givenAction);
    const state$ = rxjs.of({});
    // When
    const rejected = new Promise((resolve, reject) =>
      reject(new Error('Something went wrong'))
    );
    const stubbedAxios = sandbox.stub(fakeAxios, 'delete').returns(rejected);
    const backend = createBackend(fakeAxios);
    const addressbookEpics = createAddressbookEpics(backend);
    const epic$ = addressbookEpics.deleteAddress(action$, state$);
    // Then
    epic$.subscribe(actualAction => {
      console.log(`## actualAction=${JSON.stringify(actualAction)}`);
      const expectedUrl = `${window.backendUrlPrefix}/addresses/${addressId}`;
      const expectedHeaders = { headers: { 'If-Match': `${addressEtag}` } };
      sinon.assert.calledWith(stubbedAxios, expectedUrl, expectedHeaders);
      expect(actualAction.type).to.be.equal(commonActions.command.failed.type);
      expect(actualAction.payload.response).to.be.equal(
        '[no response available]'
      );
      expect(
        actualAction.payload.meta.userFeedback.notificationType
      ).to.be.equal(userFeedback.NOTIFICATION_TYPES.confirmed);
      expect(actualAction.payload.meta.userFeedback.text).to.be.equal(
        'The item was not deleted. Please try again.'
      );
      const expectedTicketId = '[no ticket ID available]';
      expect(actualAction.payload.meta.userFeedback.ticketId).to.be.equal(
        expectedTicketId
      );
      expect(actualAction.payload.meta.commandType).to.be.equal(
        givenAction.type
      );
      const expectedErrorResponseData = null;
      expect(actualAction.payload.errorResponseData).to.be.equal(
        expectedErrorResponseData
      );
      done();
    });
  });
});
