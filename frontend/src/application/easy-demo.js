import { LitElement, html, css } from 'lit';
import {mainStyle} from './style';
import './easy-table';
const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;
import store from '../redux/store';
import { connect } from 'pwa-helpers';

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


  render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.title}</h1>

        <easy-table .title='the title' .columns=${this.tableColumns} .data=${this.tableData}></easy-table>

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
