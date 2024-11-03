import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fetchAssessmentData } from '../services/api';
import { Metadata, AssessmentData, AssessmentResponse } from '../types/types';
import './field-renderer';

@customElement('dynamic-assessment-form')
class DynamicAssessmentForm extends LitElement {
  @property({ type: Array }) assessments = ['Risk', 'Fraud', 'Forex', 'MoneyLaundering'];
  @state() metadata: Metadata | null = null;
  @state() formData: AssessmentData[] = [];
  @state() errors: Record<string, string> = {};

  static styles = css`
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
  /**
   * Fetches new metadata and form data when a different assessment type is selected from the drop down
   * @param event 
   */
  async onAssessmentChange(event: Event) {
    console.log("onAssessmentChange")
    const select = event.target as HTMLSelectElement;
    const assessmentType = select.value;

    if (assessmentType) {
      try {
        const assessmentData: AssessmentResponse = await fetchAssessmentData(assessmentType);
        /*
        * 1. Update the metadata and form data with the new assessment data
        */
        console.log("metadata -> " + assessmentData.metadata);
        console.log("value -> " + assessmentData.values);

        this.metadata = assessmentData.metadata;
        this.formData = assessmentData.values;
        this.errors = {};
      } catch (error) {
        /*
        * 2. If there's an error, display the error message
        */
        console.error(error);
        this.metadata = null;
        this.formData = [];
      }
    } else {
      /*
      * 3. If no assessment type is selected, reset the metadata and form data
      */
      this.metadata = null;
      this.formData = [];
    }
  }
  /**
   * Updates formData based on user input for a specific field and row, using data passed in a CustomEvent.
   * @param event 
   */
  updateFieldValue(event: CustomEvent) {
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
      index === rowIndex ? { ...row, [field]: value } : row
    );
    /*
    * 4. Validate the updated formData and update the errors object if necessary
    */
    this.requestUpdate();
  }

  /**
   * Checks each required field and populates the errors object with messages for empty required fields
   * @returns boolean if form is valid or not
   */
  validateForm(): boolean {
    if (!this.metadata) return false;
    let isValid = true;
    const newErrors: Record<string, string> = {};

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
  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.validateForm()) {
      try {
        const response = await fetch('http://localhost:3000/api/submit', { // Update with your actual submit endpoint
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        });
        if (response.ok) {
          console.log('Form submitted successfully');
          // Optionally, reset the form or provide user feedback
        } else {
          console.error('Failed to submit form');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    }
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

    return html`
      <form @submit="${this.handleSubmit}">
        <table>
          <thead>
            <tr>
              ${this.metadata ? this.metadata.columns.map(column => html`<th>${column.label}</th>`) : null}
            </tr>
          </thead>
          <tbody>
            ${this.formData.map((row, rowIndex) => {
      console.log(`Rendering row ${rowIndex} with data:`, row);
      return html`
                <tr>
                  ${this.metadata ? this.metadata.columns.map(column => {
        const cellValue = row[column.label];
        console.log(`Rendering the column ${column.label} with value:`, cellValue);
        return html`
                      <td>
                        <field-renderer
                          .column="${column}"
                          .value="${cellValue}"
                          .rowIndex="${rowIndex}"
                          @field-change="${this.updateFieldValue}"
                        ></field-renderer>
                        ${this.errors[`${column.label}-${rowIndex}`] ? html`
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
    return html`
      <h1>Dynamic Assessment Form</h1>
      <label for="assessmentType">Select Assessment Type:</label>
      <select id="assessmentType" @change="${this.onAssessmentChange}">
        <option value="">Select...</option>
        ${this.assessments.map(type => html`<option value="${type}">${type}</option>`)}
      </select>
      ${this.renderForm()}
    `;
  }
}
