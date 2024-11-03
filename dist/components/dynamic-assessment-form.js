var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fetchAssessmentData } from '../services/api';
import './field-renderer';
let DynamicAssessmentForm = class DynamicAssessmentForm extends LitElement {
    constructor() {
        super(...arguments);
        this.assessments = ['Risk', 'Fraud', 'Forex', 'MoneyLaundering'];
        this.metadata = null;
        this.formData = [];
        this.errors = {};
    }
    /**
     * Fetches new metadata and form data when a different assessment type is selected from the drop down
     * @param event
     */
    onAssessmentChange(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("onAssessmentChange");
            const select = event.target;
            const assessmentType = select.value;
            if (assessmentType) {
                try {
                    const assessmentData = yield fetchAssessmentData(assessmentType);
                    /*
                    * 1. Update the metadata and form data with the new assessment data
                    */
                    console.log("metadata -> " + assessmentData.metadata);
                    console.log("value -> " + assessmentData.values);
                    this.metadata = assessmentData.metadata;
                    this.formData = assessmentData.values;
                    this.errors = {};
                }
                catch (error) {
                    /*
                    * 2. If there's an error, display the error message
                    */
                    console.error(error);
                    this.metadata = null;
                    this.formData = [];
                }
            }
            else {
                /*
                * 3. If no assessment type is selected, reset the metadata and form data
                */
                this.metadata = null;
                this.formData = [];
            }
        });
    }
    /**
     * Updates formData based on user input for a specific field and row, using data passed in a CustomEvent.
     * @param event
     */
    updateFieldValue(event) {
        /*
        * 1. Get the field name and row index from the event
        */
        const { rowIndex, field, value } = event.detail;
        /*
        * 2. Update the formData with the new value
        */
        this.formData = this.formData.map((row, index) => 
        /*
        * 3. If the current row index matches the row index from the event, update the
        *    field value in the row
        */
        index === rowIndex ? Object.assign(Object.assign({}, row), { [field]: value }) : row);
        /*
        * 4. Validate the updated formData and update the errors object if necessary
        */
        this.requestUpdate();
    }
    /**
     * Checks each required field and populates the errors object with messages for empty required fields
     * @returns boolean if form is valid or not
     */
    validateForm() {
        if (!this.metadata)
            return false;
        let isValid = true;
        const newErrors = {};
        this.metadata.columns.forEach(column => {
            if (column.required) {
                this.formData.forEach((row, rowIndex) => {
                    if (!row[column.label]) {
                        isValid = false;
                        newErrors[`${column.label}-${rowIndex}`] = `${column.label} is required`;
                    }
                });
            }
        });
        this.errors = newErrors;
        this.requestUpdate();
        return isValid;
    }
    /**
     * I created a separate submit button which is not needed in our case
     * @param event
     */
    handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (this.validateForm()) {
                try {
                    const response = yield fetch('http://localhost:3000/api/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.formData)
                    });
                    if (response.ok) {
                        console.log('Form submitted successfully');
                        // Optionally, reset the form or provide user feedback
                    }
                    else {
                        console.error('Failed to submit form');
                    }
                }
                catch (error) {
                    console.error('Error submitting form:', error);
                }
            }
        });
    }
    /**
     * Generates the HTML structure of the form,
     * displaying metadata columns as headers and mapping formData values to inputs in each row.
     * @returns
     */
    renderForm() {
        // Check if metadata exists
        if (!this.metadata) {
            console.log("Metadata is not available.");
            return null;
        }
        console.log("Rendering form with metadata:", this.metadata);
        console.log("Current form data:", this.formData);
        return html `
      <form @submit="${this.handleSubmit}">
        <table>
          <thead>
            <tr>
              ${this.metadata ? this.metadata.columns.map(column => html `<th>${column.label}</th>`) : null}
            </tr>
          </thead>
          <tbody>
            ${this.formData.map((row, rowIndex) => {
            console.log(`Rendering row ${rowIndex} with data:`, row);
            return html `
                <tr>
                  ${this.metadata ? this.metadata.columns.map(column => {
                const cellValue = row[column.label];
                console.log(`Rendering the column ${column.label} with value:`, cellValue);
                return html `
                      <td>
                        <field-renderer
                          .column="${column}"
                          .value="${cellValue}"
                          .rowIndex="${rowIndex}"
                          @field-change="${this.updateFieldValue}"
                        ></field-renderer>
                        ${this.errors[`${column.label}-${rowIndex}`] ? html `
                          <div class="error">${this.errors[`${column.label}-${rowIndex}`]}</div>
                        ` : ''}
                      </td>
                    `;
            }) : null}
                </tr>
              `;
        })}
          </tbody>
        </table>
        <button type="submit">Submit</button>
      </form>
    `;
    }
    /**
     * Displays the dropdown for selecting assessment types, along with the dynamically generated form (if metadata is available).
     */
    render() {
        return html `
      <h1>Dynamic Assessment Form</h1>
      <label for="assessmentType">Select Assessment Type:</label>
      <select id="assessmentType" @change="${this.onAssessmentChange}">
        <option value="">Select...</option>
        ${this.assessments.map(type => html `<option value="${type}">${type}</option>`)}
      </select>
      ${this.renderForm()}
    `;
    }
};
DynamicAssessmentForm.styles = css `
    /* Basic styling for the form */
    select, input, button {
      padding: 8px;
      margin: 8px 0;
      display: block;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    .error {
      color: red;
      font-size: 0.8em;
    }
  `;
__decorate([
    property({ type: Array })
], DynamicAssessmentForm.prototype, "assessments", void 0);
__decorate([
    state()
], DynamicAssessmentForm.prototype, "metadata", void 0);
__decorate([
    state()
], DynamicAssessmentForm.prototype, "formData", void 0);
__decorate([
    state()
], DynamicAssessmentForm.prototype, "errors", void 0);
DynamicAssessmentForm = __decorate([
    customElement('dynamic-assessment-form')
], DynamicAssessmentForm);
