/**
 * Specifies validation rules for individual form fields
 */
export interface FieldValidation {
    /*
    * 1. Specifies the validation rule for the character field
    */
    minLength?: number;
    maxLength?: number;
    /*
    * 2. Specifies the validation rule for the number field
    */
    min?: number;
    max?: number;
}
/**
 * Defines each column (or field) within a form
 */
export interface Column {
    label: string;
    type: 'text' | 'textarea' | 'dropdown' | 'boolean' | 'date' | 'number' | 'button';
    required: boolean;
    options?: string[]; // Optional options for dropdowns
    validation?: FieldValidation; // Validation rules if required
}
/**
 *  Represents blueprint of the form
 */
export interface Metadata {
    columns: Column[]; // Array of columns for the metadata. This array dictates the fields and layout for the entire form.
}
/**
 *  Holds the actual data input or values entered by the user
 */
export interface AssessmentData {
    [key: string]: any; // Key-value pairs for the assessment data
}

/**
 *  Represents the full response structure when fetching form data from the backend. 
 *  Should have metadata (column details) and values of each column
 */
export interface AssessmentResponse {
    metadata: Metadata; // Metadata containing the columns information
    values: AssessmentData[]; // Values associated with the assessment type
}
