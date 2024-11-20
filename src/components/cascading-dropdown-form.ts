import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

interface Template {
  template_name: string;
  template_description: string;
}

interface SubType {
  row_index: number;
  subtype_name: string;
  templates: Template[];
}

interface RiskType {
  row_index: number;
  risk_type_name: string;
  sub_types: SubType[];
}

interface RiskTypeData {
  risk_types: RiskType[];
}

const sampleData: RiskTypeData = {
  risk_types: [
    {
      row_index: 1,
      risk_type_name: "Financial",
      sub_types: [
        {
          row_index: 1,
          subtype_name: "Forex",
          templates: [
            { template_name: "Template 1", template_description: "Detailed financial template" }
          ]
        },
        {
          row_index: 2,
          subtype_name: "Trading",
          templates: [
            { template_name: "Template 3", template_description: "Trading-focused template" }
          ]
        }
      ]
    },
    {
      row_index: 2,
      risk_type_name: "Compliance",
      sub_types: [
        {
          row_index: 1,
          subtype_name: "Environment",
          templates: [
            { template_name: "Template 2", template_description: "Compliance-related template" }
          ]
        }
      ]
    }
  ]
};

@customElement('cascading-dropdown-form')
class CascadingDropdownForm extends LitElement {
  @state() riskTypes: string[] = [];
  @state() subTypes: string[] = [];
  @state() templates: string[] = [];
  
  @state() selectedRiskType: string = '';
  @state() selectedSubType: string = '';

  static styles = css`
    select {
      padding: 8px;
      margin: 10px 0;
      display: block;
      width: 100%;
      max-width: 300px;
    }
    label {
      font-weight: bold;
      margin-top: 10px;
    }
  `;

  constructor() {
    super();
    // Prepopulate the risk types when the component is initialized
    this.riskTypes = this.getRiskTypeOptions();
  }

  getRiskTypeOptions(): string[] {
    return sampleData.risk_types.map((riskType) => riskType.risk_type_name);
  }

  getSubTypeOptions(selectedRiskType: string): string[] {
    const riskType = sampleData.risk_types.find((type) => type.risk_type_name === selectedRiskType);
    return riskType ? riskType.sub_types.map((subType) => subType.subtype_name) : [];
  }

  getTemplateOptions(selectedRiskType: string, selectedSubType: string): string[] {
    const riskType = sampleData.risk_types.find((type) => type.risk_type_name === selectedRiskType);
    const subType = riskType?.sub_types.find((sub) => sub.subtype_name === selectedSubType);
    return subType ? subType.templates.map((template) => template.template_name) : [];
  }

  handleRiskTypeChange(event: Event) {
    this.selectedRiskType = (event.target as HTMLSelectElement).value;
    this.subTypes = this.getSubTypeOptions(this.selectedRiskType);
    this.templates = []; // Reset templates when risk type changes
    this.selectedSubType = ''; // Reset selected sub type
  }

  handleSubTypeChange(event: Event) {
    this.selectedSubType = (event.target as HTMLSelectElement).value;
    this.templates = this.getTemplateOptions(this.selectedRiskType, this.selectedSubType);
  }

  render() {
    return html`
      <label for="riskType">Risk Type</label>
      <select id="riskType" @change="${this.handleRiskTypeChange}">
        <option value="">Select Risk Type</option>
        ${this.riskTypes.map((type) => html`<option value="${type}">${type}</option>`)}
      </select>

      <label for="subType">Risk Subtype</label>
      <select id="subType" ?disabled="${!this.subTypes.length}" @change="${this.handleSubTypeChange}">
        <option value="">Select Risk Subtype</option>
        ${this.subTypes.map((subType) => html`<option value="${subType}">${subType}</option>`)}
      </select>

      <label for="template">Risk Template</label>
      <select id="template" ?disabled="${!this.templates.length}">
        <option value="">Select Risk Template</option>
        ${this.templates.map((template) => html`<option value="${template}">${template}</option>`)}
      </select>
    `;
  }
}