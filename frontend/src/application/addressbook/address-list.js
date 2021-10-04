import {LitElement, html} from 'lit';
import {tableStyle} from './style';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import addressbookSelectors from '../../redux/addressbook/selectors';
import addressbookActions from '../../redux/addressbook/actions';
import * as userInfo from '../../redux/info-for-user';
import * as commonUtils from '../../common-utils';
import { ADDRESS_COLUMNS} from './columns';

export class AddressList extends connect(store)(LitElement) {

  static get properties() {
    return {
      title: {type: String},
      columns: { type: Array},
      items: {type: Array},
      inProgress: {type: Boolean}
    }
  }
  static get styles() {
    return tableStyle;
  }

  constructor() {
   super();
   this.title = '';
   this.columns = ADDRESS_COLUMNS;
   this.items = [];
   this.inProgress = false;
  }

  stateChanged(state) {
    this.items = addressbookSelectors.address.list.items(state);
    this.inProgress = addressbookSelectors.address.list.inProgress(state);
    return this.requestUpdate();
  }

  connectedCallback() {
    this.refreshTable();
    super.connectedCallback();
  }

  refreshTable() {
    store.dispatch(addressbookActions.address.readList.command());
  }

  renderHeaderRows(columns) {
    return html`<tr>${columns.map((column) => html`<th>${column.name}</th>`)}</tr>`;
  }
  renderColumn(row, key) {
    return html`<td>${key}: ${row[key]}</td>`;
  }
  renderColumns(row, columns) {
    return columns.map(column => this.renderColumn(row, column.path));
  }
  renderRows(rows, columns) {
    if (commonUtils.isNotNullOrEmpty(rows)) {
      return rows.map((row) => html`<tr>${this.renderColumns(row, columns)}</tr>`);
    } else if (this.inProgress) {
      return html`<tr><td colspan="${columns.length}" ><img src="assets/loader-bar.gif" title="loading..."></td></tr>`;
    } else {
      return html`<tr><td>no data</td></tr>`;
    }
  }
  refreshButtonClicked() {
    this.refreshTable();
  }
  render() {
    return html`
      <input type="button" @click=${this.refreshButtonClicked}>refresh</input>
      <h1>TABLE ${this.title}</h1>
      <table border='1'>
        <thead>
          ${this.renderHeaderRows(this.columns)}
        </theader>
        <tbody>
          ${this.renderRows(this.items, this.columns)}
        </tbody>
        <tfoot>
          ${this.renderHeaderRows(this.columns)}
        </tfoot>
      <table>
    `;
  }
}
customElements.define('address-list', AddressList);
