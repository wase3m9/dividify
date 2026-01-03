import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoundSterling, Info } from "lucide-react";
import { calculateDividendTax, TAX_YEARS, PERSONAL_ALLOWANCE } from "@/utils/taxCalculations";

export const DividendTaxCalculator = () => {
  const [dividendAmount, setDividendAmount] = useState<string>("");
  const [otherIncome, setOtherIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2024/25");

  const dividend = parseFloat(dividendAmount) || 0;
  const income = parseFloat(otherIncome) || 0;
  const result = calculateDividendTax(dividend, income, taxYear);
  const currentConfig = TAX_YEARS[taxYear];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
                {Object.keys(TAX_YEARS).map((year) => (
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
            <h4 className="font-semibold text-foreground">Results</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gross Dividend</span>
                <span className="font-medium">{formatCurrency(result.grossDividend)}</span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span>Tax-Free (£500 allowance)</span>
                <span className="font-medium">{formatCurrency(result.taxFreeAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Taxable Dividend</span>
                <span className="font-medium">{formatCurrency(result.taxableDividend)}</span>
              </div>
              
              {result.bands.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {result.bands.map((band, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{band.band}</span>
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

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Dividend Tax Rates {taxYear}</p>
                  <ul className="space-y-1">
                    <li>• £500 dividend allowance (0%)</li>
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
