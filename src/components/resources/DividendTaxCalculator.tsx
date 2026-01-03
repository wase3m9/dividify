import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoundSterling, Info, TrendingUp, TrendingDown } from "lucide-react";
import { calculateDividendTax, compareTaxYears, TAX_YEARS } from "@/utils/taxCalculations";

export const DividendTaxCalculator = () => {
  const [dividendAmount, setDividendAmount] = useState<string>("");
  const [otherIncome, setOtherIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2025/26");

  const dividend = parseFloat(dividendAmount) || 0;
  const income = parseFloat(otherIncome) || 0;
  const result = calculateDividendTax(dividend, income, taxYear);
  const currentConfig = TAX_YEARS[taxYear];
  const comparison = dividend > 0 ? compareTaxYears(dividend, income) : null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const taxYears = Object.keys(TAX_YEARS);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
          <PoundSterling className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">Dividend Tax Calculator</CardTitle>
        <CardDescription>
          Calculate personal tax on dividend income based on your tax band
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="div-amount">Dividend Amount (£)</Label>
            <Input
              id="div-amount"
              type="number"
              placeholder="e.g. 30000"
              value={dividendAmount}
              onChange={(e) => setDividendAmount(e.target.value)}
              min="0"
              step="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other-income">Other Annual Income (£)</Label>
            <Input
              id="other-income"
              type="number"
              placeholder="e.g. 12570 (salary)"
              value={otherIncome}
              onChange={(e) => setOtherIncome(e.target.value)}
              min="0"
              step="100"
            />
            <p className="text-xs text-muted-foreground">
              Include salary, rental income, etc. (before tax)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="div-year">Tax Year</Label>
            <Select value={taxYear} onValueChange={setTaxYear}>
              <SelectTrigger id="div-year">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {taxYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {dividend > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-foreground">Results for {taxYear}</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gross Dividend</span>
                <span className="font-medium">{formatCurrency(result.grossDividend)}</span>
              </div>
              
              {result.unusedPersonalAllowance > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Unused Personal Allowance applied</span>
                  <span className="font-medium">-{formatCurrency(result.unusedPersonalAllowance)}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center text-green-600">
                <span>Tax-Free (Dividend Allowance)</span>
                <span className="font-medium">-{formatCurrency(result.dividendAllowanceUsed)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taxable Dividend</span>
                <span className="font-medium">{formatCurrency(result.taxableDividend)}</span>
              </div>
              
              {result.bands.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {result.bands.map((band, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {band.band} on {formatCurrency(band.amount)}
                      </span>
                      <span>{formatCurrency(band.tax)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center text-lg pt-2 border-t">
                <span className="font-semibold text-foreground">Total Dividend Tax</span>
                <span className="font-bold text-primary">{formatCurrency(result.totalTax)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Net Dividend (after tax)</span>
                <span className="font-medium text-green-600">{formatCurrency(result.netDividend)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Effective Tax Rate</span>
                <span className="font-medium">{result.effectiveRate.toFixed(2)}%</span>
              </div>
            </div>

            {/* Tax Year Comparison */}
            {comparison && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-foreground mb-3">Compare Tax Years</h4>
                <div className="grid grid-cols-3 gap-2">
                  {taxYears.map((year) => {
                    const yearResult = comparison[year];
                    const isSelected = year === taxYear;
                    const config = TAX_YEARS[year];
                    
                    // Calculate difference from selected year
                    const diff = yearResult.totalTax - result.totalTax;
                    
                    return (
                      <div 
                        key={year}
                        className={`p-3 rounded-lg border text-center ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        <p className="text-xs font-medium text-muted-foreground mb-1">{year}</p>
                        <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {formatCurrency(yearResult.totalTax)}
                        </p>
                        {!isSelected && diff !== 0 && (
                          <div className={`flex items-center justify-center gap-1 text-xs mt-1 ${
                            diff > 0 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {diff > 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            <span>{diff > 0 ? '+' : ''}{formatCurrency(diff)}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Basic: {(config.basicRate * 100).toFixed(2)}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Dividend Tax Rates {taxYear}</p>
                  <ul className="space-y-1">
                    <li>• Personal Allowance: £{currentConfig.personalAllowance.toLocaleString()}</li>
                    <li>• Dividend Allowance: £{currentConfig.dividendAllowance} (0%)</li>
                    <li>• Basic rate: {(currentConfig.basicRate * 100).toFixed(2)}%</li>
                    <li>• Higher rate: {(currentConfig.higherRate * 100).toFixed(2)}%</li>
                    <li>• Additional rate: {(currentConfig.additionalRate * 100).toFixed(2)}%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};