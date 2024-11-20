export interface Template {
  template_name: string;
  template_description: string;
}

export interface SubType {
  row_index: number;
  subtype_name: string;
  templates: Template[];
}

export interface RiskType {
  row_index: number;
  risk_type_name: string;
  sub_types: SubType[];
}

export interface RiskTypeData {
  risk_types: RiskType[];
}