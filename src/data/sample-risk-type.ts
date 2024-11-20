import { RiskTypeData } from "../models/risk-type.interfaces";

export const sampleData: RiskTypeData = {
  risk_types: [
    {
      row_index: 1,
      risk_type_name: "Financial",
      sub_types: [
        {
          row_index: 1,
          subtype_name: "Forex",
          templates: [
            { template_name: "Template 1", template_description: "Detailed financial template" },
          ],
        },
        {
          row_index: 2,
          subtype_name: "Trading",
          templates: [
            { template_name: "Template 3", template_description: "Trading-focused template" },
          ],
        },
      ],
    },
    {
      row_index: 2,
      risk_type_name: "Compliance",
      sub_types: [
        {
          row_index: 1,
          subtype_name: "Environment",
          templates: [
            { template_name: "Template 2", template_description: "Compliance-related template" },
          ],
        },
      ],
    },
  ],
};