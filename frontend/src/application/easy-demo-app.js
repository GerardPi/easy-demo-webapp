import { LitElement, html, css } from 'lit';
import { mainStyle } from './style';
import store from '../redux/store';
import { connect } from 'pwa-helpers';
import './addressbook/address-list';
import commonSelectors from '../redux/common/selectors';
import * as commonUtils from '../common-utils';
import '@kor-ui/kor/components/page';
import '@kor-ui/kor/components/app-bar';
import '@kor-ui/kor/components/nav-bar';
import '@kor-ui/kor/components/tabs';
import '@kor-ui/kor/components/icon';
import './user-feedback-dialog';
import './user-feedback-notification';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

export class EasyDemoApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      title: { type: String },
      columns: { type: Array },
      contents: { type: Object },
      isSomethingInProgress: { type: Boolean },
      isSomethingBusy: { type: Boolean },
    };
  }

  static get styles() {
    return mainStyle;
  }

  constructor() {
    super();
    this.isSomethingInProgress = false;
    this.isSomethingBusy = false;
    this.title = 'My app';
    this.tableColumns = [
      { name: 'First', path: 'first' },
      { name: 'Last', path: 'last' },
      { name: 'Date of birth', path: 'dateOfBirth' },
    ];
    this.tableData = {
      rows: [
        { first: 'A', last: 'B', dateOfBirth: '2001-01-22' },
        { first: 'C', last: 'D', dateOfBirth: '2001-02-22' },
        { first: 'E', last: 'F', dateOfBirth: '2001-03-22' },
      ],
    };
  }

  stateChanged(state) {
    this.isSomethingInProgress = commonSelectors.isSomethingInProgress(state);
    this.isSomethingBusy = commonSelectors.isSomethingBusy(state);
    return this.requestUpdate();
  }

  renderSomethingIsInProgress() {
    if (this.isSomethingBusy) {
      return html`<div slot="functions">
        <img
          src="assets/loader-arrow-circle.gif"
          title="Something is being loaded..."
        />
      </div>`;
    }
    return html`<div slot="functions"></div>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _addressTabClicked(event) {
    console.log('_addressTabClicked');
  }

  _personTabClicked(event) {
    console.log('_personTabClicked');
  }

  render() {
    return html`
      <kor-page flex-direction="column">
        <kor-app-bar slot="top" label="Easy Demo">
          ${this.renderSomethingIsInProgress()}
        </kor-app-bar>
        <kor-nav-bar slot="top">
          <kor-tabs>
            <kor-tab-item
              label="Addresses"
              @click=${this._addressTabClicked}
              active
            ></kor-tab-item>
            <kor-tab-item
              label="Persons"
              @click=${this._personTabClicked}
            ></kor-tab-item>
          </kor-tabs>
          <!--
        <kor-icon icon="launch" button slot="functions"></kor-icon>
        <kor-icon icon="more_vert" button slot="functions"></kor-icon>
        -->
        </kor-nav-bar>
        <address-list></address-list>
      </kor-page>
      <user-feedback-dialog></user-feedback-dialog>
      <user-feedback-notification></user-feedback-notification>
    `;
  }
}
customElements.define('easy-demo-app', EasyDemoApp);
