// Tax rates and thresholds for UK dividend and S455 calculations

/**
 * ACCEPTANCE TEST - MUST PASS:
 * 
 * Input:
 *   salary = 12166, dividends = 50000, otherIncome = 0, taxYear = "2025/26"
 * 
 * Expected Output:
 *   remainingPA = 404
 *   taxableDividendsBeforeAllowance = 49596
 *   dividendAllowanceUsed = 500
 *   taxableDividendsAfterAllowance = 49096
 *   taxableNonDividend = 0
 *   basicBandRemaining = 37700
 *   dividendsThatUseBands = 49596 (KEY: includes allowance for band consumption)
 *   dividendsInBasicBand = 37700 (of which 500 at 0%, 37200 at 8.75%)
 *   dividendsInHigherBand = 11896 (at 33.75%)
 *   
 *   Basic rate tax: 37200 × 8.75% = 3255.00
 *   Higher rate tax: 11896 × 33.75% = 4014.90
 *   Total tax: 7269.90
 *   Net dividend: 42730.10
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
  
  // Step 1: Apply Personal Allowance to non-dividend income first
  // Any remaining PA can reduce dividends
  const unusedPersonalAllowance = Math.max(0, config.personalAllowance - otherIncome);
  const dividendAfterPA = Math.max(0, dividendAmount - unusedPersonalAllowance);
  
  // Step 2: Apply Dividend Allowance (taxed at 0% but STILL consumes band space)
  const dividendAllowanceUsed = Math.min(dividendAfterPA, config.dividendAllowance);
  const taxableDividend = Math.max(0, dividendAfterPA - config.dividendAllowance);
  
  // Step 3: Calculate taxable non-dividend income (portion above Personal Allowance)
  const taxableNonDividend = Math.max(0, otherIncome - config.personalAllowance);
  
  // Step 4: Calculate basic band remaining after non-dividend income uses it
  // Basic band = £37,700 (the band itself, not including PA)
  const basicBand = config.basicBandLimit - config.personalAllowance; // £37,700
  const basicBandRemaining = Math.max(0, basicBand - taxableNonDividend);
  
  // Step 5: KEY FIX - Dividend allowance still consumes band capacity even though taxed at 0%
  // This is the critical fix: we allocate bands based on dividends INCLUDING the allowance
  const dividendsThatUseBands = taxableDividend + dividendAllowanceUsed;
  
  // Step 6: Allocate dividends to bands
  const dividendsInBasicBand = Math.min(dividendsThatUseBands, basicBandRemaining);
  const dividendsAboveBasicBand = dividendsThatUseBands - dividendsInBasicBand;
  
  // Step 7: Within basic band, first portion is allowance (0%), rest is 8.75%
  const allowanceInBasicBand = Math.min(dividendAllowanceUsed, dividendsInBasicBand);
  const basicRateTaxable = dividendsInBasicBand - allowanceInBasicBand;
  
  // Step 8: Allocate remaining to higher and additional bands
  const higherBand = config.higherBandLimit - config.basicBandLimit; // £74,870
  const dividendsInHigherBand = Math.min(dividendsAboveBasicBand, higherBand);
  const dividendsInAdditionalBand = Math.max(0, dividendsAboveBasicBand - higherBand);
  
  // Build bands array
  const bands: DividendTaxBand[] = [];
  let totalTax = 0;
  
  // Dividend Allowance band (0%)
  if (dividendAllowanceUsed > 0) {
    bands.push({
      band: "Dividend Allowance (0%)",
      amount: dividendAllowanceUsed,
      rate: 0,
      tax: 0,
    });
  }
  
  // Basic rate band (8.75% / 10.75%)
  if (basicRateTaxable > 0) {
    const basicRateTax = basicRateTaxable * config.basicRate;
    bands.push({
      band: `Basic Rate (${(config.basicRate * 100).toFixed(2)}%)`,
      amount: basicRateTaxable,
      rate: config.basicRate,
      tax: basicRateTax,
    });
    totalTax += basicRateTax;
  }
  
  // Higher rate band (33.75% / 35.75%)
  if (dividendsInHigherBand > 0) {
    const higherRateTax = dividendsInHigherBand * config.higherRate;
    bands.push({
      band: `Higher Rate (${(config.higherRate * 100).toFixed(2)}%)`,
      amount: dividendsInHigherBand,
      rate: config.higherRate,
      tax: higherRateTax,
    });
    totalTax += higherRateTax;
  }
  
  // Additional rate band (39.35%)
  if (dividendsInAdditionalBand > 0) {
    const additionalRateTax = dividendsInAdditionalBand * config.additionalRate;
    bands.push({
      band: `Additional Rate (${(config.additionalRate * 100).toFixed(2)}%)`,
      amount: dividendsInAdditionalBand,
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
