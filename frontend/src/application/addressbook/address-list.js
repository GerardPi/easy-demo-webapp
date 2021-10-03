import {LitElement, html} from 'lit';
import {tableStyle} from './style';
import store from '../../redux/store';
import { connect } from 'pwa-helpers';
import addressbookSelectors from '../../redux/addressbook/selectors';
import * as addressbookActions from '../../redux/addressbook/actions';
import * as userInfo from '../../redux/info-for-user';

export class AddressList extends connect(store)(LitElement) {

  static get properties() {
    return {
      title: {type: String},
      columns: { type: Array},
      data: {type: Object}
    }
  }
  static get styles() {
    return tableStyle;
  }

  constructor() {
   super();
   this.title = '';
   this.columns = [];
   this.data = { rows: []};
   this.pageIndex = 0;
   this.pageSize = 10;
  }

  stateChanged(state) {
    this.data = addressbookSelectors.address.list(state);
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
    console.log(`# row=${JSON.stringify(row)} # row[key] = ${row[key]}`);
    return html`<td>${key}: ${row[key]}</td>`;
  }
  renderColumns(row, columns) {
    return columns.map(column => this.renderColumn(row, column.path));
  }
  renderRows(rows, columns) {
    return html``;
//    return rows.map((row) => html`<tr>${this.renderColumns(row, columns)}</tr>`);
  }
  render() {
    return html`
      <h1>${this.title}</h1>
      <table border='1'>
        <thead>
          ${this.renderHeaderRows(this.columns)}
        </theader>
        <tbody>
          ${this.renderRows(this.data.rows, this.columns)}
        </tbody>
        <tfoot>
          ${this.renderHeaderRows(this.columns)}
        </tfoot>
      <table>
    `;
  }
}
customElements.define('address-list', AddressList);
