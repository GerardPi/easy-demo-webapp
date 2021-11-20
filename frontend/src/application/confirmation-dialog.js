import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import store from '../redux/store';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/modal';

export class ConfirmationDialog extends connect(store)(LitElement) {
  constructor() {
    super();
    this.label = 'no label';
    this.text = 'no text';
    this.actions = [];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  close() {
    this._innerModal.visible = false;
  }

  open(label, text, actions) {
    console.log(`## 1 actions=${JSON.stringify(actions)}`);
    this.label = label;
    this.text = text;
    this.actions = actions;
    this._innerModal.visible = true;
  }

  okButtonClicked() {
    this.actions.forEach(action =>
      console.log(`## 4 action=${JSON.stringify(action)}`)
    );
    this.actions.forEach(action => store.dispatch(action));
    this.actions = [];
    this.close();
  }

  cancelButtonClicked() {
    this.actions = [];
    this.close();
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  render() {
    console.log(`## 3 actions=${JSON.stringify(this.actions)}`);
    return html`
      <kor-modal id="inner-modal" label="${this.label}" sticky height="500px">
        <slot></slot>
        ${this.text}
        <kor-button
          slot="footer"
          color="secondary"
          label="Cancel"
          @click="${this.cancelButtonClicked}"
        ></kor-button>
        <kor-button
          slot="footer"
          color="secondary"
          label="Ok"
          @click="${this.okButtonClicked}"
        ></kor-button>
      </kor-modal>
    `;
  }
}

ConfirmationDialog.properties = {
  label: { type: String },
  text: { type: String },
  actions: { type: Array },
};

customElements.define('confirmation-dialog', ConfirmationDialog);
