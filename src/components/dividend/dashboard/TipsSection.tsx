import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ExternalLink, Download, Calendar, FileText } from "lucide-react";

export const TipsSection = () => {
  return (
    <Card className="p-6">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Tips & Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tips */}
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md w-full">
            <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-center">
              <p className="font-medium text-blue-900">Directors often declare dividends quarterly</p>
              <p className="text-blue-700">Consider timing around tax year-end and cash flow needs</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg max-w-md w-full">
            <FileText className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-sm text-center">
              <p className="font-medium text-green-900">Board minutes must match dividend dates</p>
              <p className="text-green-700">Ensure meeting dates align with dividend declaration dates</p>
            </div>
          </div>
        </div>

        {/* HMRC Links */}
        <div className="pt-2 border-t flex flex-col items-center">
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">HMRC Guidance</p>
          <div className="space-y-1 max-w-xs w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-xs h-8"
              onClick={() => window.open('https://www.gov.uk/running-a-limited-company/taking-money-out-of-a-limited-company', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Dividends Payment
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center text-xs h-8"
              onClick={() => window.open('https://www.gov.uk/tax-on-dividends/how-to-report-tax-on-dividends', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              How to report tax on dividends
            </Button>
          </div>
        </div>

        {/* Export Feature */}
        <div className="pt-2 border-t flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Export to Accounting Software</span>
            </div>
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Export journal entries to QuickBooks, Xero, and other platforms
          </p>
        </div>
      </CardContent>
    </Card>
  );
};