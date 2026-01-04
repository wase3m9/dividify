import { useState, useMemo, lazy, Suspense } from "react";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { SiteBreadcrumbs } from "@/components/navigation/SiteBreadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calculator, 
  Shield, 
  AlertTriangle, 
  Copy, 
  Check, 
  FileText, 
  Users, 
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  TrendingUp,
  PoundSterling,
  ChevronRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { calculateDividendTax, TAX_YEARS } from "@/utils/taxCalculations";

// Lazy load chart component
const TakeHomeChart = lazy(() => import("@/components/calculator/TakeHomeChart"));

const DividendTaxCalculator = () => {
  // Calculator inputs
  const [salary, setSalary] = useState<string>("");
  const [dividends, setDividends] = useState<string>("");
  const [otherIncome, setOtherIncome] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>("2025/26");
  
  // Smart Shield inputs
  const [smartShieldEnabled, setSmartShieldEnabled] = useState(false);
  const [retainedProfits, setRetainedProfits] = useState<string>("");
  const [currentYearProfit, setCurrentYearProfit] = useState<string>("");
  const [dividendsPaid, setDividendsPaid] = useState<string>("0");
  const [ctReserve, setCtReserve] = useState<string>("25");
  
  const [copied, setCopied] = useState(false);

  // Calculations
  const salaryNum = parseFloat(salary) || 0;
  const dividendsNum = parseFloat(dividends) || 0;
  const otherIncomeNum = parseFloat(otherIncome) || 0;
  const totalOtherIncome = salaryNum + otherIncomeNum;
  
  const result = useMemo(() => 
    calculateDividendTax(dividendsNum, totalOtherIncome, taxYear),
    [dividendsNum, totalOtherIncome, taxYear]
  );
  
  // Smart Shield calculations
  const retainedNum = parseFloat(retainedProfits) || 0;
  const profitNum = parseFloat(currentYearProfit) || 0;
  const paidNum = parseFloat(dividendsPaid) || 0;
  const ctPercent = parseFloat(ctReserve) || 25;
  
  const smartShieldCalc = useMemo(() => {
    const estimatedCT = profitNum * (ctPercent / 100);
    const postTaxProfit = profitNum - estimatedCT;
    const estimatedDistributableReserves = retainedNum + postTaxProfit - paidNum;
    const isOverdrawn = dividendsNum > estimatedDistributableReserves;
    const safeAmount = Math.max(0, estimatedDistributableReserves);
    
    // Safety meter calculation
    const totalAvailable = estimatedDistributableReserves;
    const ctReserveAmount = estimatedCT;
    const remainingBuffer = Math.max(0, estimatedDistributableReserves - dividendsNum);
    
    let safetyLevel: 'green' | 'amber' | 'red' = 'green';
    if (isOverdrawn) {
      safetyLevel = 'red';
    } else if (remainingBuffer < estimatedDistributableReserves * 0.2) {
      safetyLevel = 'amber';
    }
    
    return {
      estimatedCT,
      postTaxProfit,
      estimatedDistributableReserves,
      isOverdrawn,
      safeAmount,
      ctReserveAmount,
      remainingBuffer,
      safetyLevel
    };
  }, [retainedNum, profitNum, paidNum, ctPercent, dividendsNum]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(value);

  const handleCopySummary = () => {
    const summary = `Dividend Tax Summary (${taxYear})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gross Dividends: ${formatCurrency(result.grossDividend)}
Estimated Personal Tax: ${formatCurrency(result.totalTax)}
Net In-Pocket: ${formatCurrency(result.netDividend)}
Effective Tax Rate: ${result.effectiveRate.toFixed(2)}%

Calculated using Dividify.co.uk`;
    
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentConfig = TAX_YEARS[taxYear];

  // Structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the UK dividend tax rates for 2025/26?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For the 2025/26 tax year, UK dividend tax rates are: 8.75% basic rate, 33.75% higher rate, and 39.35% additional rate. The tax-free dividend allowance is £500."
        }
      },
      {
        "@type": "Question",
        name: "What are the UK dividend tax rates for 2026/27?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "From April 2026, UK dividend tax rates increase to: 10.75% basic rate (up from 8.75%), 35.75% higher rate (up from 33.75%), and 39.35% additional rate. The £500 dividend allowance remains."
        }
      },
      {
        "@type": "Question",
        name: "How do I calculate dividend tax in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "First, add your dividends to other income. Apply the £500 dividend allowance. Any remaining dividends are taxed at your marginal rate: basic (8.75%/10.75%), higher (33.75%/35.75%), or additional (39.35%) depending on total income."
        }
      },
      {
        "@type": "Question",
        name: "When does the dividend tax increase take effect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The dividend tax increase takes effect from 6 April 2026 (2026/27 tax year). Basic rate increases from 8.75% to 10.75%, and higher rate from 33.75% to 35.75%."
        }
      }
    ]
  };

  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dividify Dividend Tax Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: "Free UK dividend tax calculator for 2025/26 and 2026/27 tax years. Calculate personal tax on dividends with Smart Shield affordability check.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Dividend Tax Calculator (2025/26 + 2026/27 UK) | Dividify</title>
        <meta 
          name="description" 
          content="Calculate your UK dividend tax for 2025/26 and see the April 2026 rate rise impact. Plan salary and dividends and estimate take-home pay in seconds." 
        />
        <meta 
          name="keywords" 
          content="dividend tax calculator UK, dividend tax rates 2025/26, dividend tax increase April 2026, UK dividend calculator, dividend allowance, dividend tax 2026/27" 
        />
        <link rel="canonical" href="https://dividify.co.uk/dividend-tax-calculator" />
        
        <meta property="og:title" content="Free UK Dividend Tax Calculator (2025/26 Update) | Dividify" />
        <meta property="og:description" content="Calculate your UK dividend tax for 2025/26 and see the April 2026 rate rise impact. Plan salary and dividends and estimate take-home pay in seconds." />
        <meta property="og:url" content="https://dividify.co.uk/dividend-tax-calculator" />
        <meta property="og:type" content="website" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free UK Dividend Tax Calculator (2025/26 Update) | Dividify" />
        <meta name="twitter:description" content="Calculate your UK dividend tax and plan your salary vs dividends." />
        
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareAppSchema)}</script>
      </Helmet>

      <Navigation />
      <SiteBreadcrumbs />

      {/* Hero Calculator Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Updated for 2025/26 & 2026/27 tax years
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Free UK Dividend Tax Calculator
              <span className="block text-primary">(2025/26 Update)</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your personal dividend tax liability and see how the April 2026 rate changes affect you.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Calculator Card - Glassmorphism */}
            <div className="lg:col-span-3">
              <Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
                <CardContent className="p-6 md:p-8">
                  {/* Tax Year Selector */}
                  <div className="mb-6">
                    <Label htmlFor="tax-year" className="text-base font-semibold mb-2 block">Tax Year</Label>
                    <Select value={taxYear} onValueChange={setTaxYear}>
                      <SelectTrigger id="tax-year" className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025/26">2025/26 (Current)</SelectItem>
                        <SelectItem value="2026/27">2026/27 (New Rates)</SelectItem>
                      </SelectContent>
                    </Select>
                    {taxYear === "2026/27" && (
                      <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Rates increase from April 2026
                      </p>
                    )}
                  </div>

                  {/* Main Inputs */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="salary" className="text-sm font-medium">Annual Salary (£)</Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder="e.g. 12570"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        className="h-12 text-lg mt-1"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dividends" className="text-sm font-medium">Annual Dividends (£)</Label>
                      <Input
                        id="dividends"
                        type="number"
                        placeholder="e.g. 40000"
                        value={dividends}
                        onChange={(e) => setDividends(e.target.value)}
                        className="h-12 text-lg mt-1"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="other-income" className="text-sm font-medium">Other Income (£)</Label>
                      <Input
                        id="other-income"
                        type="number"
                        placeholder="e.g. 0"
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(e.target.value)}
                        className="h-12 text-lg mt-1"
                        min="0"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Rental, interest, etc.</p>
                    </div>
                  </div>

                  {/* Smart Shield Toggle */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <Label htmlFor="smart-shield" className="text-base font-semibold cursor-pointer">
                            Smart Shield
                          </Label>
                          <p className="text-sm text-muted-foreground">Check dividend affordability</p>
                        </div>
                      </div>
                      <Switch
                        id="smart-shield"
                        checked={smartShieldEnabled}
                        onCheckedChange={setSmartShieldEnabled}
                      />
                    </div>

                    {smartShieldEnabled && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="retained-profits" className="text-sm">Retained Profits B/F (£)</Label>
                            <Input
                              id="retained-profits"
                              type="number"
                              placeholder="From last accounts"
                              value={retainedProfits}
                              onChange={(e) => setRetainedProfits(e.target.value)}
                              className="mt-1"
                              min="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="current-profit" className="text-sm">Est. Current Year Profit (£)</Label>
                            <Input
                              id="current-profit"
                              type="number"
                              placeholder="Before tax"
                              value={currentYearProfit}
                              onChange={(e) => setCurrentYearProfit(e.target.value)}
                              className="mt-1"
                              min="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dividends-paid" className="text-sm">Dividends Already Paid (£)</Label>
                            <Input
                              id="dividends-paid"
                              type="number"
                              placeholder="0"
                              value={dividendsPaid}
                              onChange={(e) => setDividendsPaid(e.target.value)}
                              className="mt-1"
                              min="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ct-reserve" className="text-sm">Corporation Tax Reserve (%)</Label>
                            <Input
                              id="ct-reserve"
                              type="number"
                              placeholder="25"
                              value={ctReserve}
                              onChange={(e) => setCtReserve(e.target.value)}
                              className="mt-1"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>

                        {/* Safety Meter */}
                        {(retainedNum > 0 || profitNum > 0) && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Dividend Safety Meter</p>
                            <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                              <div 
                                className="h-full bg-amber-500 transition-all"
                                style={{ width: `${Math.min(100, (smartShieldCalc.ctReserveAmount / (smartShieldCalc.estimatedDistributableReserves + smartShieldCalc.ctReserveAmount)) * 100)}%` }}
                                title="Corporation Tax Reserve"
                              />
                              <div 
                                className={`h-full transition-all ${smartShieldCalc.safetyLevel === 'red' ? 'bg-red-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(100, (dividendsNum / (smartShieldCalc.estimatedDistributableReserves + smartShieldCalc.ctReserveAmount)) * 100)}%` }}
                                title="Planned Dividends"
                              />
                              <div 
                                className="h-full bg-green-500 transition-all"
                                style={{ width: `${Math.max(0, (smartShieldCalc.remainingBuffer / (smartShieldCalc.estimatedDistributableReserves + smartShieldCalc.ctReserveAmount)) * 100)}%` }}
                                title="Remaining Buffer"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-amber-500" /> CT Reserve
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-primary" /> Dividends
                              </span>
                              <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500" /> Buffer
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Warning Banner */}
                        {smartShieldCalc.isOverdrawn && dividendsNum > 0 && (
                          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                            <div className="flex gap-3">
                              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-red-800 dark:text-red-200">Dividend Sustainability Alert</h4>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                  Based on the figures entered, this dividend may exceed distributable reserves after allowing for Corporation Tax and liabilities. Dividends should only be paid from profits available for distribution.
                                </p>
                                <div className="flex gap-2 mt-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-red-300 text-red-700 hover:bg-red-100"
                                    onClick={() => setDividends(smartShieldCalc.safeAmount.toString())}
                                  >
                                    Adjust to safe amount
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-red-700"
                                    onClick={() => {}}
                                  >
                                    Show calculation
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live Chart */}
                  {dividendsNum > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm font-medium mb-3">Take-Home Breakdown</p>
                      <Suspense fallback={<div className="h-32 bg-muted/50 rounded animate-pulse" />}>
                        <TakeHomeChart 
                          netDividend={result.netDividend} 
                          tax={result.totalTax} 
                        />
                      </Suspense>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Dynamic Summary Panel */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Summary ({taxYear})
                  </h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Gross Dividends</span>
                      <span className="text-xl font-bold">{formatCurrency(result.grossDividend)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-muted-foreground">Estimated Personal Tax</span>
                      <span className="text-xl font-bold text-amber-600">{formatCurrency(result.totalTax)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-3">
                      <span className="font-medium">Net In-Pocket</span>
                      <span className="text-2xl font-bold text-primary">{formatCurrency(result.netDividend)}</span>
                    </div>

                    {dividendsNum > 0 && (
                      <div className="text-sm text-muted-foreground space-y-1 pt-2">
                        <p>Effective tax rate: <strong>{result.effectiveRate.toFixed(2)}%</strong></p>
                        {result.bands.map((band, i) => (
                          <p key={i}>{band.band}: {formatCurrency(band.amount)}</p>
                        ))}
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={handleCopySummary}
                    >
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? "Copied!" : "Copy Summary"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sticky CTA */}
              <Link to="/signup" className="block">
                <Card className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Ready to issue dividends?</p>
                      <p className="text-sm opacity-90">Generate HMRC-compliant vouchers</p>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Dividify Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Why Use Dividify?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Automation</h3>
              <p className="text-muted-foreground">Generate dividend vouchers and board minutes in seconds, not hours.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">HMRC-Compliant Paperwork</h3>
              <p className="text-muted-foreground">Every document follows UK company law and HMRC requirements.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Accountant-Ready Vouchers</h3>
              <p className="text-muted-foreground">Export records your accountant will love. Clean, professional, complete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Rates Table */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">UK Dividend Tax Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-4 font-semibold">Tax Band</th>
                  <th className="text-center p-4 font-semibold">2025/26</th>
                  <th className="text-center p-4 font-semibold">2026/27</th>
                  <th className="text-center p-4 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Dividend Allowance</td>
                  <td className="p-4 text-center">£500</td>
                  <td className="p-4 text-center">£500</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Basic Rate (up to £50,270)</td>
                  <td className="p-4 text-center">8.75%</td>
                  <td className="p-4 text-center">10.75%</td>
                  <td className="p-4 text-center text-red-600">+2%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Higher Rate (£50,271 - £125,140)</td>
                  <td className="p-4 text-center">33.75%</td>
                  <td className="p-4 text-center">35.75%</td>
                  <td className="p-4 text-center text-red-600">+2%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Additional Rate (over £125,140)</td>
                  <td className="p-4 text-center">39.35%</td>
                  <td className="p-4 text-center">39.35%</td>
                  <td className="p-4 text-center text-muted-foreground">—</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-4">
            <Info className="w-4 h-4 inline mr-1" />
            Rates apply from 6 April each year. Personal allowance: £12,570.
          </p>
        </div>
      </section>

      {/* How to Issue Compliant Dividend */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How to Issue a Compliant Dividend</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">1</div>
                <h3 className="font-semibold text-lg">Board Minute</h3>
              </div>
              <p className="text-muted-foreground pl-14">Directors declare the dividend at a board meeting and record it in the minutes.</p>
              <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">2</div>
                <h3 className="font-semibold text-lg">Dividend Voucher</h3>
              </div>
              <p className="text-muted-foreground pl-14">Issue a voucher to each shareholder showing amount, date, and company details.</p>
              <ChevronRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">3</div>
                <h3 className="font-semibold text-lg">Record It</h3>
              </div>
              <p className="text-muted-foreground pl-14">Keep records for at least 6 years for HMRC and your accountant.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Generate Your Vouchers Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">Trusted by UK directors</p>
            <div className="flex justify-center items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="ml-2 text-muted-foreground">4.9/5 from 127 reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t lg:hidden z-50">
        <Link to="/signup" className="block">
          <Button className="w-full h-12 text-base gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Generate Your Vouchers Now
          </Button>
        </Link>
      </div>

      <div className="pb-20 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default DividendTaxCalculator;