var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Mock data for different assessment types
// to create a key value pair, key being the string value from the dropdown and value should be of type assessmentResponse
const mockResponses = {
    Risk: {
        metadata: {
            columns: [
                { label: 'Risk Type', type: 'text', required: true },
                { label: 'Risk Sub Type', type: 'text', required: true },
                { label: 'Assessment', type: 'text', required: false },
                { label: 'Status', type: 'text', required: true },
                { label: 'Action', type: 'boolean', required: false },
            ],
        },
        values: [
            { 'Risk Type': 'Operational', 'Risk Sub Type': 'IT', 'Assessment': 'High', 'Status': 'Active', 'Action': false },
            { 'Risk Type': 'Financial', 'Risk Sub Type': 'Market', 'Assessment': 'Moderate', 'Status': 'Pending', 'Action': true },
        ],
    },
    Fraud: {
        metadata: {
            columns: [
                { label: 'Fraud Type', type: 'text', required: true },
                { label: 'Fraud Sub Type', type: 'text', required: true },
                { label: 'Method', type: 'dropdown', required: true, options: ['Phishing', 'Identity Theft', 'Card Fraud'] },
                { label: 'Decision', type: 'text', required: false },
                { label: 'Status', type: 'text', required: true },
            ],
        },
        values: [
            { 'Fraud Type': 'Identity', 'Fraud Sub Type': 'Theft', 'Method': 'Phishing', 'Decision': 'Investigate', 'Status': 'Pending' },
            { 'Fraud Type': 'Financial', 'Fraud Sub Type': 'Credit Card', 'Method': 'Card Fraud', 'Decision': 'Escalate', 'Status': 'Closed' },
        ],
    },
    Forex: {
        metadata: {
            columns: [
                { label: 'Currency Pair', type: 'text', required: true },
                { label: 'Issue Type', type: 'text', required: true },
                { label: 'Severity', type: 'dropdown', required: true, options: ['Low', 'Medium', 'High'] },
                { label: 'Maker', type: 'boolean', required: false },
                { label: 'Checker', type: 'boolean', required: false },
            ],
        },
        values: [
            { 'Currency Pair': 'USD/EUR', 'Issue Type': 'Exchange Rate', 'Severity': 'High', 'Maker': true, 'Checker': true },
            { 'Currency Pair': 'GBP/USD', 'Issue Type': 'Liquidity', 'Severity': 'Medium', 'Maker': true, 'Checker': true },
        ],
    },
    MoneyLaundering: {
        metadata: {
            columns: [
                { label: 'Currency Pair', type: 'text', required: true },
                { label: 'Issue Type', type: 'text', required: true },
                { label: 'Severity', type: 'dropdown', required: true, options: ['Low', 'Medium', 'High'] },
                { label: 'Status', type: 'text', required: true },
            ],
        },
        values: [
            { 'Currency Pair': 'USD/EUR', 'Issue Type': 'Exchange Rate', 'Severity': 'High', 'Status': 'Active' },
            { 'Currency Pair': 'GBP/USD', 'Issue Type': 'Liquidity', 'Severity': 'Medium', 'Status': 'Resolved' },
        ],
    },
};
/**
 * Fetch function that makes call to backend to get metadata and form values
 * @param {string} assessmentType
 * @returns {JSON} mockResponses
 */
export function fetchAssessmentData(assessmentType) {
    return __awaiter(this, void 0, void 0, function* () {
        // Simulate an async fetch with a small delay
        yield new Promise(resolve => setTimeout(resolve, 100));
        // Return the hardcoded data based on assessment type
        if (mockResponses[assessmentType]) {
            console.log(mockResponses[assessmentType]);
            return mockResponses[assessmentType];
        }
        else {
            throw new Error(`No mock data available for assessment type: ${assessmentType}`);
        }
    });
}
