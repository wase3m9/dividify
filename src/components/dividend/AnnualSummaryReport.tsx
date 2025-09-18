import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Download, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/utils/excelExport";
import { exportToPDF } from "@/utils/pdfExport";

interface AnnualSummaryReportProps {
  companyId?: string;
}

export const AnnualSummaryReport: FC<AnnualSummaryReportProps> = ({ companyId }) => {
  const [selectedDirector, setSelectedDirector] = useState<string>("");
  const [selectedTaxYear, setSelectedTaxYear] = useState<string>("");
  const { toast } = useToast();

  // Fetch directors for the company
  const { data: directors } = useQuery({
    queryKey: ['directors', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: dividendRecords } = useQuery({
    queryKey: ['dividend-records', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('dividend_records')
        .select('*')
        .eq('company_id', companyId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId,
  });

  // Generate tax years from records
  const taxYears = dividendRecords 
    ? [...new Set(dividendRecords.map(record => record.tax_year))].sort()
    : [];

  const generateExcelReport = () => {
    const result = validateAndGetData();
    if (!result) return;

    const { selectedDirectorData, filteredRecords } = result;

    // Export to Excel
    const filename = `${selectedDirectorData.computed_full_name?.replace(/\s+/g, '_')}_dividend_summary_${selectedTaxYear}.xlsx`;
    exportToExcel(filteredRecords, filename);

    toast({
      title: "Excel Report Generated",
      description: `Annual summary report for ${selectedDirectorData.computed_full_name} (${selectedTaxYear}) downloaded as Excel file`,
    });
  };

  const generatePDFReport = () => {
    const result = validateAndGetData();
    if (!result) return;

    const { selectedDirectorData, filteredRecords } = result;

    // Export to PDF
    const filename = `${selectedDirectorData.computed_full_name?.replace(/\s+/g, '_')}_dividend_summary_${selectedTaxYear}.pdf`;
    exportToPDF(filteredRecords, filename, selectedDirectorData.computed_full_name || '', selectedTaxYear);

    toast({
      title: "PDF Report Generated",
      description: `Annual summary report for ${selectedDirectorData.computed_full_name} (${selectedTaxYear}) downloaded as PDF file`,
    });
  };

  const validateAndGetData = () => {
    if (!selectedDirector) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a director",
      });
      return null;
    }

    if (!selectedTaxYear) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a tax year",
      });
      return null;
    }

    const selectedDirectorData = directors?.find(d => d.id === selectedDirector);
    const directorName = selectedDirectorData?.computed_full_name;

    console.log('Debug info:', {
      selectedDirectorData,
      directorName,
      selectedTaxYear,
      allDividendRecords: dividendRecords,
      availableShareholderNames: dividendRecords?.map(r => r.shareholder_name),
      availableTaxYears: dividendRecords?.map(r => r.tax_year)
    });

    // Try different matching strategies
    let filteredRecords = dividendRecords?.filter(
      record => record.shareholder_name === directorName && record.tax_year === selectedTaxYear
    ) || [];

    // If no exact match, try partial matching
    if (filteredRecords.length === 0 && directorName) {
      // Try matching with different name formats
      const nameParts = directorName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      filteredRecords = dividendRecords?.filter(record => {
        const recordName = record.shareholder_name.toLowerCase();
        const searchName = directorName.toLowerCase();
        return (recordName.includes(firstName.toLowerCase()) && recordName.includes(lastName.toLowerCase())) &&
               record.tax_year === selectedTaxYear;
      }) || [];
      
      if (filteredRecords.length > 0) {
        console.log('Found records with partial name matching:', filteredRecords);
      }
    }

    console.log('Filtered records:', filteredRecords);

    if (filteredRecords.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data",
        description: `No dividend records found for "${directorName}" in tax year ${selectedTaxYear}. Available shareholders: ${dividendRecords?.map(r => r.shareholder_name).join(', ')}`,
      });
      return null;
    }

    return { selectedDirectorData, filteredRecords };
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-[#9b87f5]" />
          Annual Summary Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Director</label>
            <Select value={selectedDirector} onValueChange={setSelectedDirector}>
              <SelectTrigger>
                <SelectValue placeholder="Select director" />
              </SelectTrigger>
              <SelectContent>
                {directors?.map((director) => (
                  <SelectItem key={director.id} value={director.id}>
                    {director.computed_full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tax Year</label>
            <Select value={selectedTaxYear} onValueChange={setSelectedTaxYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax year" />
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
          
          <div className="flex items-end gap-2">
            <Button 
              onClick={generateExcelReport}
              disabled={!selectedDirector || !selectedTaxYear}
              variant="outline"
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button 
              onClick={generatePDFReport}
              disabled={!selectedDirector || !selectedTaxYear}
              className="flex-1 bg-[#9b87f5] hover:bg-[#8b77e5]"
            >
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          Generate a comprehensive Excel or PDF report of all dividend vouchers for the selected director and tax year for self-assessment purposes.
        </p>
      </CardContent>
    </Card>
  );
};