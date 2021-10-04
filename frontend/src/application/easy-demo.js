import { LitElement, html, css } from 'lit';
import {mainStyle} from './style';
import './components/easy-table';
const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;
import store from '../redux/store';
import { connect } from 'pwa-helpers';
import './addressbook/address-list';
import commonSelectors from '../redux/common/selectors';
import * as commonUtils from '../common-utils';

export class EasyDemo extends connect(store)(LitElement) {
  static get properties() {
    return {
      title: { type: String },
      columns: { type: Array},
      contents: { type: Object}
    };
  }

  static get styles() {
    return mainStyle;
  }

  constructor() {
    super();
    this.isSomethingInProgress = false;
    this.title = 'My app';
    this.tableColumns = [
      { name: 'First', path: 'first'},
      { name: 'Last', path: 'last'},
      { name: 'Date of birth', path: 'dateOfBirth'}
    ];
    this.tableData = {
      rows: [
        { first: 'A', last: 'B', dateOfBirth: '2001-01-22'},
        { first: 'C', last: 'D', dateOfBirth: '2001-02-22'},
        { first: 'E', last: 'F', dateOfBirth: '2001-03-22'}
      ],
    };
  }

  stateChanged(state) {
    console.log(`####### someting is in progress....${this.isSomethingInProgress}`);
    console.log(`####### in progress ${JSON.stringify(state.common.commandTypesInProgress)}`);
    console.log(`####### is something in progress ${commonUtils.isNotNullOrEmpty(state.common.commandTypesInProgress)}`);
    console.log(`####### busy ${JSON.stringify(state.common.commandTypesBusy)}`);
    this.inSomethingInProgress = commonSelectors.isSomethingInProgress(state);
    return this.requestUpdate();
  }

  renderSomethingIsInProgress() {
    if (this.isSomethingInProgress) {
      return html`<h1>hi<img src="assets/loader-arrow-circle.gif" title="Something is being loaded..."></h1>`;
    }
    return html`<h1>nothing</h1>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>

        ${this.renderSomethingIsInProgress()}
        <easy-table .title='the title' .columns=${this.tableColumns} .data=${this.tableData}></easy-table>
        <address-list></address-list>

        <p>Edit <code>src/EasyDemo.js</code> and save to reload.</p>
        <a
          class="app-link"
          href="https://open-wc.org/guides/developing-components/code-examples/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Code examples
        </a>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/open-wc"
          >open-wc</a
        >.
      </p>
    `;
  }
}
customElements.define('easy-demo', EasyDemo);
