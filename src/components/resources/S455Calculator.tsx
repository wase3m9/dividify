import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Info } from "lucide-react";
import { calculateS455Tax, TAX_YEARS } from "@/utils/taxCalculations";

export const S455Calculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2024/25");

  const amount = parseFloat(loanAmount) || 0;
  const result = calculateS455Tax(amount, taxYear);

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
          <Calculator className="w-6 h-6 text-primary" />
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
            <Label htmlFor="s455-year">Tax Year</Label>
            <Select value={taxYear} onValueChange={setTaxYear}>
              <SelectTrigger id="s455-year">
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

            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">When does S455 apply?</p>
                  <p>
                    S455 tax is charged when a director's loan account is overdrawn at the company's 
                    year-end and not repaid within 9 months after the accounting period ends. 
                    The tax is refunded if the loan is repaid.
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
