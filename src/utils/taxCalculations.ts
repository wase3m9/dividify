// Tax rates and thresholds for UK dividend and S455 calculations

/**
 * Test case for dividend tax calculation:
 * - dividends = £37,600
 * - otherIncome = £12,400
 * - taxYear = 2025/26
 * 
 * Expected calculation:
 * - Personal Allowance = £12,570
 * - Unused PA = max(0, 12,570 - 12,400) = £170
 * - Dividend after PA = max(0, 37,600 - 170) = £37,430
 * - Dividend Allowance = £500
 * - Taxable Dividend = max(0, 37,430 - 500) = £36,930
 * 
 * Band allocation (other income uses bands first):
 * - Taxable other income = max(0, 12,400 - 12,570) = £0
 * - Basic band limit = £50,270
 * - Remaining basic band = max(0, 50,270 - max(12,400, 12,570)) = 50,270 - 12,570 = £37,700
 * - Basic rate tax = £36,930 × 8.75% = £3,231.38
 * 
 * Total tax = £3,231.38
 */

export interface TaxYearConfig {
  personalAllowance: number;
  dividendAllowance: number;
  basicBandLimit: number; // Upper limit of basic rate (£50,270)
  higherBandLimit: number; // Upper limit of higher rate (£125,140)
  basicRate: number;
  higherRate: number;
  additionalRate: number;
  s455Rate: number;
}

export const TAX_YEARS: Record<string, TaxYearConfig> = {
  "2024/25": {
    personalAllowance: 12570,
    dividendAllowance: 500,
    basicBandLimit: 50270, // £12,570 PA + £37,700 basic rate band
    higherBandLimit: 125140,
    basicRate: 0.0875,
    higherRate: 0.3375,
    additionalRate: 0.3935,
    s455Rate: 0.3375,
  },
  "2025/26": {
    personalAllowance: 12570,
    dividendAllowance: 500,
    basicBandLimit: 50270,
    higherBandLimit: 125140,
    basicRate: 0.0875,
    higherRate: 0.3375,
    additionalRate: 0.3935,
    s455Rate: 0.3375,
  },
  "2026/27": {
    personalAllowance: 12570,
    dividendAllowance: 500,
    basicBandLimit: 50270,
    higherBandLimit: 125140,
    basicRate: 0.1075,
    higherRate: 0.3575,
    additionalRate: 0.3935,
    s455Rate: 0.3575,
  },
};

// Legacy export for backward compatibility
export const PERSONAL_ALLOWANCE = 12570;

export interface S455Result {
  loanAmount: number;
  taxRate: number;
  taxCharge: number;
  netCostToCompany: number;
}

export function calculateS455Tax(loanAmount: number, taxYear: string): S455Result {
  const config = TAX_YEARS[taxYear] || TAX_YEARS["2024/25"];
  const taxCharge = loanAmount * config.s455Rate;
  
  return {
    loanAmount,
    taxRate: config.s455Rate,
    taxCharge,
    netCostToCompany: loanAmount + taxCharge,
  };
}

export interface DividendTaxBand {
  band: string;
  amount: number;
  rate: number;
  tax: number;
}

export interface DividendTaxResult {
  grossDividend: number;
  unusedPersonalAllowance: number;
  dividendAfterPA: number;
  dividendAllowanceUsed: number;
  taxableDividend: number;
  bands: DividendTaxBand[];
  totalTax: number;
  netDividend: number;
  effectiveRate: number;
}

export function calculateDividendTax(
  dividendAmount: number,
  otherIncome: number,
  taxYear: string
): DividendTaxResult {
  const config = TAX_YEARS[taxYear] || TAX_YEARS["2024/25"];
  
  // Step 1: Apply unused Personal Allowance to dividends first
  const unusedPersonalAllowance = Math.max(0, config.personalAllowance - otherIncome);
  const dividendAfterPA = Math.max(0, dividendAmount - unusedPersonalAllowance);
  
  // Step 2: Apply Dividend Allowance
  const dividendAllowanceUsed = Math.min(dividendAfterPA, config.dividendAllowance);
  const taxableDividend = Math.max(0, dividendAfterPA - config.dividendAllowance);
  
  // Step 3: Calculate band allocation
  // Other income uses up tax bands first
  const incomeForBandCalc = Math.max(otherIncome, config.personalAllowance);
  const remainingBasicBand = Math.max(0, config.basicBandLimit - incomeForBandCalc);
  const remainingHigherBand = Math.max(0, config.higherBandLimit - config.basicBandLimit);
  
  const bands: DividendTaxBand[] = [];
  let remainingDividend = taxableDividend;
  let totalTax = 0;
  
  // Basic rate band
  if (remainingDividend > 0 && remainingBasicBand > 0) {
    const basicRateAmount = Math.min(remainingDividend, remainingBasicBand);
    const basicRateTax = basicRateAmount * config.basicRate;
    bands.push({
      band: `Basic Rate (${(config.basicRate * 100).toFixed(2)}%)`,
      amount: basicRateAmount,
      rate: config.basicRate,
      tax: basicRateTax,
    });
    totalTax += basicRateTax;
    remainingDividend -= basicRateAmount;
  }
  
  // Higher rate band
  if (remainingDividend > 0 && remainingHigherBand > 0) {
    const higherRateAmount = Math.min(remainingDividend, remainingHigherBand);
    const higherRateTax = higherRateAmount * config.higherRate;
    bands.push({
      band: `Higher Rate (${(config.higherRate * 100).toFixed(2)}%)`,
      amount: higherRateAmount,
      rate: config.higherRate,
      tax: higherRateTax,
    });
    totalTax += higherRateTax;
    remainingDividend -= higherRateAmount;
  }
  
  // Additional rate band
  if (remainingDividend > 0) {
    const additionalRateTax = remainingDividend * config.additionalRate;
    bands.push({
      band: `Additional Rate (${(config.additionalRate * 100).toFixed(2)}%)`,
      amount: remainingDividend,
      rate: config.additionalRate,
      tax: additionalRateTax,
    });
    totalTax += additionalRateTax;
  }
  
  const effectiveRate = dividendAmount > 0 ? (totalTax / dividendAmount) * 100 : 0;
  
  return {
    grossDividend: dividendAmount,
    unusedPersonalAllowance,
    dividendAfterPA,
    dividendAllowanceUsed,
    taxableDividend,
    bands,
    totalTax,
    netDividend: dividendAmount - totalTax,
    effectiveRate,
  };
}

// Compare tax across all years for given inputs
export function compareTaxYears(dividendAmount: number, otherIncome: number): Record<string, DividendTaxResult> {
  const results: Record<string, DividendTaxResult> = {};
  for (const year of Object.keys(TAX_YEARS)) {
    results[year] = calculateDividendTax(dividendAmount, otherIncome, year);
  }
  return results;
}
