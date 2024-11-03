var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let FieldRenderer = class FieldRenderer extends LitElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.rowIndex = 0;
    }
    render() {
        console.log("Rendering FieldRenderer with column:", this.column);
        console.log("Current value for rendering:", this.value);
        if (!this.column)
            return null; // Check if column is defined
        if (!this.value)
            return null;
        const { label, type, required, options } = this.column;
        switch (type) {
            case 'text':
            case 'textarea':
                return html `
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
                return html `
                    <label>
                        <select
                            .value="${String(this.value)}"
                            ?required="${required}"
                            @change="${this.handleInputChange}"
                        >
                            <option value="">Select...</option>
                            ${options === null || options === void 0 ? void 0 : options.map(option => html `<option value="${option}">${option}</option>`)}
                        </select>
                    </label>
                `;
            case 'boolean':
                return html `
                    <label>
                        <input
                            type="checkbox"
                            .checked="${Boolean(this.value)}"
                            @change="${this.handleBooleanChange}"
                        />
                    </label>
                `;
            case 'date':
                return html `
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
                return html `
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
                return html `
                    <button @click="${() => this.submitForm()}">Submit</button>
                `;
            default:
                return null;
        }
    }
    handleInputChange(event) {
        var _a;
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.dispatchEvent(new CustomEvent('field-change', {
            detail: { rowIndex: this.rowIndex, field: (_a = this.column) === null || _a === void 0 ? void 0 : _a.label, value }
        }));
    }
    handleBooleanChange(event) {
        var _a;
        const input = event.target;
        this.dispatchEvent(new CustomEvent('field-change', {
            detail: { rowIndex: this.rowIndex, field: (_a = this.column) === null || _a === void 0 ? void 0 : _a.label, value: input.checked }
        }));
    }
    submitForm() {
        // Implement form submission logic here
        console.log('Submit button clicked');
    }
};
__decorate([
    property({ type: Object })
], FieldRenderer.prototype, "column", void 0);
__decorate([
    property({ type: String })
], FieldRenderer.prototype, "value", void 0);
__decorate([
    property({ type: Number })
], FieldRenderer.prototype, "rowIndex", void 0);
FieldRenderer = __decorate([
    customElement('field-renderer')
], FieldRenderer);
