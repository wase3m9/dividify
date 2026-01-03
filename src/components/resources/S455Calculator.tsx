import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info, TrendingUp, TrendingDown } from "lucide-react";
import { calculateS455Tax, TAX_YEARS } from "@/utils/taxCalculations";

export const S455Calculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [accountingPeriod, setAccountingPeriod] = useState<string>("2024/25");

  const amount = parseFloat(loanAmount) || 0;
  const result = calculateS455Tax(amount, accountingPeriod);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const periods = Object.keys(TAX_YEARS);

  // Calculate comparison across all periods
  const comparison = amount > 0 ? periods.map(period => ({
    period,
    result: calculateS455Tax(amount, period),
    config: TAX_YEARS[period],
  })) : null;

  return (
    <Card className="h-full bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
      <CardHeader>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mb-4">
          <Calculator className="w-6 h-6 text-amber-600" />
        </div>
        <CardTitle className="text-xl">S455 Tax Calculator</CardTitle>
        <CardDescription>
          Calculate the Section 455 tax charge on an overdrawn director's loan account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s455-loan">Outstanding Loan Amount (£)</Label>
            <Input
              id="s455-loan"
              type="number"
              placeholder="e.g. 10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              min="0"
              step="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="s455-period">Accounting Period End</Label>
            <Select value={accountingPeriod} onValueChange={setAccountingPeriod}>
              <SelectTrigger id="s455-period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the accounting period in which the loan was outstanding at year-end
            </p>
          </div>
        </div>

        {amount > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-foreground">Results</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">{formatCurrency(result.loanAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">S455 Tax Rate</span>
                <span className="font-medium">{(result.taxRate * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-foreground">S455 Tax Charge</span>
                <span className="font-bold text-primary">{formatCurrency(result.taxCharge)}</span>
              </div>
            </div>

            {/* Accounting Period Comparison */}
            {comparison && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-foreground mb-3">Compare Accounting Periods</h4>
                <div className="grid grid-cols-3 gap-2">
                  {comparison.map(({ period, result: periodResult, config }) => {
                    const isSelected = period === accountingPeriod;
                    const diff = periodResult.taxCharge - result.taxCharge;
                    
                    return (
                      <div 
                        key={period}
                        className={`p-3 rounded-lg border text-center ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-muted/20'
                        }`}
                      >
                        <p className="text-xs font-medium text-muted-foreground mb-1">{period}</p>
                        <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          {formatCurrency(periodResult.taxCharge)}
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
                          Rate: {(config.s455Rate * 100).toFixed(2)}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-amber-100/50 rounded-lg p-4 mt-4 border border-amber-200/30">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">When does S455 apply?</p>
                  <p>
                    S455 tax is triggered if a director's loan remains outstanding 9 months and 1 day 
                    after your company's accounting period end. For example, if your accounting period 
                    ends 31 March 2025, S455 is due if the loan isn't repaid by 1 January 2026. 
                    The tax is refundable once the loan is repaid or written off.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};