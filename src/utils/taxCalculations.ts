// Tax rates and thresholds for UK dividend and S455 calculations

export interface TaxYearConfig {
  dividendAllowance: number;
  basicRateThreshold: number;
  higherRateThreshold: number;
  additionalRateThreshold: number;
  basicRate: number;
  higherRate: number;
  additionalRate: number;
  s455Rate: number;
}

export const TAX_YEARS: Record<string, TaxYearConfig> = {
  "2024/25": {
    dividendAllowance: 500,
    basicRateThreshold: 37700, // Taxable income band (after personal allowance)
    higherRateThreshold: 125140,
    additionalRateThreshold: 125140,
    basicRate: 0.0875,
    higherRate: 0.3375,
    additionalRate: 0.3935,
    s455Rate: 0.3375,
  },
  "2025/26": {
    dividendAllowance: 500,
    basicRateThreshold: 37700,
    higherRateThreshold: 125140,
    additionalRateThreshold: 125140,
    basicRate: 0.0875,
    higherRate: 0.3375,
    additionalRate: 0.3935,
    s455Rate: 0.3375,
  },
  "2026/27": {
    dividendAllowance: 500,
    basicRateThreshold: 37700,
    higherRateThreshold: 125140,
    additionalRateThreshold: 125140,
    basicRate: 0.0875,
    higherRate: 0.3375,
    additionalRate: 0.3935,
    s455Rate: 0.3375,
  },
};

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
  taxFreeAmount: number;
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
  
  // Calculate tax-free amount (dividend allowance)
  const taxFreeAmount = Math.min(dividendAmount, config.dividendAllowance);
  const taxableDividend = Math.max(0, dividendAmount - config.dividendAllowance);
  
  // Calculate taxable income before dividends
  const taxableOtherIncome = Math.max(0, otherIncome - PERSONAL_ALLOWANCE);
  
  const bands: DividendTaxBand[] = [];
  let remainingDividend = taxableDividend;
  let totalTax = 0;
  
  // Calculate remaining space in basic rate band
  const basicRateSpace = Math.max(0, config.basicRateThreshold - taxableOtherIncome);
  
  // Basic rate band
  if (remainingDividend > 0 && basicRateSpace > 0) {
    const basicRateAmount = Math.min(remainingDividend, basicRateSpace);
    const basicRateTax = basicRateAmount * config.basicRate;
    bands.push({
      band: "Basic Rate (8.75%)",
      amount: basicRateAmount,
      rate: config.basicRate,
      tax: basicRateTax,
    });
    totalTax += basicRateTax;
    remainingDividend -= basicRateAmount;
  }
  
  // Higher rate band
  const higherRateSpace = config.additionalRateThreshold - config.basicRateThreshold;
  if (remainingDividend > 0) {
    // Check if we're already in higher rate from other income
    const usedHigherRate = Math.max(0, taxableOtherIncome - config.basicRateThreshold);
    const availableHigherRate = Math.max(0, higherRateSpace - usedHigherRate);
    
    if (availableHigherRate > 0) {
      const higherRateAmount = Math.min(remainingDividend, availableHigherRate);
      const higherRateTax = higherRateAmount * config.higherRate;
      bands.push({
        band: "Higher Rate (33.75%)",
        amount: higherRateAmount,
        rate: config.higherRate,
        tax: higherRateTax,
      });
      totalTax += higherRateTax;
      remainingDividend -= higherRateAmount;
    }
  }
  
  // Additional rate band
  if (remainingDividend > 0) {
    const additionalRateTax = remainingDividend * config.additionalRate;
    bands.push({
      band: "Additional Rate (39.35%)",
      amount: remainingDividend,
      rate: config.additionalRate,
      tax: additionalRateTax,
    });
    totalTax += additionalRateTax;
  }
  
  const effectiveRate = dividendAmount > 0 ? (totalTax / dividendAmount) * 100 : 0;
  
  return {
    grossDividend: dividendAmount,
    taxFreeAmount,
    taxableDividend,
    bands,
    totalTax,
    netDividend: dividendAmount - totalTax,
    effectiveRate,
  };
}
