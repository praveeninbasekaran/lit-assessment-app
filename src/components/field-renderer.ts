import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Column } from '../types/types';

@customElement('field-renderer')
class FieldRenderer extends LitElement {
  @property({ type: Object }) column?: Column; // Changed to optional
  @property({ type: String }) value: string | boolean | undefined = '';
  @property({ type: Number }) rowIndex: number = 0;

  render() {
    console.log("Rendering FieldRenderer with column:", this.column);
    console.log("Current value for rendering:", this.value);
    if (!this.column) return null; // Check if column is defined
    if (!this.value) return null;
    const { label, type, required, options } = this.column;

    switch (type) {
      case 'text':
      case 'textarea':
        return html`
            <label>
                        <input
                            type="text"
                            .value="${String(this.value)}"
                            ?required="${required}"
                            @input="${this.handleInputChange}"
                        />
                    </label>
                `;
      case 'dropdown':
        return html`
                    <label>
                        <select
                            .value="${String(this.value)}"
                            ?required="${required}"
                            @change="${this.handleInputChange}"
                        >
                            <option value="">Select...</option>
                            ${options?.map(option => html`<option value="${option}">${option}</option>`)}
                        </select>
                    </label>
                `;
      case 'boolean':
        return html`
                    <label>
                        <input
                            type="checkbox"
                            .checked="${Boolean(this.value)}"
                            @change="${this.handleBooleanChange}"
                        />
                    </label>
                `;
      case 'date':
        return html`
                    <label>
                        <input
                            type="date"
                            .value="${String(this.value)}"
                            ?required="${required}"
                            @input="${this.handleInputChange}"
                        />
                    </label>
                `;
      case 'number':
        return html`
                    <label>
                        <input
                            type="number"
                            .value="${this.value !== undefined ? String(this.value) : ''}" // Safeguard against undefined
                            ?required="${required}"
                            @input="${this.handleInputChange}"
                        />
                    </label>
                `;
      case 'button':
        return html`
                    <button @click="${() => this.submitForm()}">Submit</button>
                `;
      default:
        return null;
    }
  }

  handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.type === 'checkbox' ? input.checked : input.value;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { rowIndex: this.rowIndex, field: this.column?.label, value }
    }));
  }

  handleBooleanChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('field-change', {
      detail: { rowIndex: this.rowIndex, field: this.column?.label, value: input.checked }
    }));
  }

  submitForm() {
    // Implement form submission logic here
    console.log('Submit button clicked');
  }
}
