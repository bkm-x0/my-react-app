/* Test file to debug tax calculation
const TaxCalculator = require('./utils/taxCalculator');

console.log('Testing with percentage values (15, 5)...');
const result1 = TaxCalculator.calculateTaxAndInterest(100, 250, 1, 15/100, 5/100);
console.log('With 0.15, 0.05:', result1.taxRate, result1.interestRate, result1.netProfit);

console.log('\nTesting with raw percentage values (15, 5)...');
const result2 = TaxCalculator.calculateTaxAndInterest(100, 250, 1, 15, 5);
console.log('With 15, 5:', result2.taxRate, result2.interestRate, result2.netProfit);
*/