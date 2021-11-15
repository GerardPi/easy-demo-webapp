import { LitElement, html } from 'lit';
import { connect } from 'pwa-helpers';
import store from '../redux/store';
import '@kor-ui/kor/components/button';
import '@kor-ui/kor/components/modal';

export class UserFeedbackDialog extends connect(store)(LitElement) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  stateChanged(state) {
    console.log(`## state has changed`);
    return this.requestUpdate();
  }

  close() {
    this._innerModal.visible = false;
  }


  okButtonClicked() {
    this.close();
  }

  cancelButtonClicked() {
    this.close();
  }

  get _innerModal() {
    return this.renderRoot.querySelector('#inner-modal');
  }

  render() {
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

UserFeedbackDialog.properties = {
};

customElements.define('user-feedback-dialog', UserFeedbackDialog);
