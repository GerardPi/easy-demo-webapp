import {LitElement, html} from 'lit';
import {tableStyle} from './style';
import store from '../redux/store';
import { connect } from 'pwa-helpers';

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
    return rows.map((row) => html`<tr>${this.renderColumns(row, columns)}</tr>`);
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
