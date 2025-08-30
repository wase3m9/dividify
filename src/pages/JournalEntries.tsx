import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DividendRecord {
  id: string;
  shareholder_name: string;
  share_class: string;
  payment_date: string;
  dividend_per_share: number;
  total_dividend: number;
  number_of_shares: number;
  companies?: {
    name: string;
  };
}

interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
  description: string;
}

const JournalEntries = () => {
  const navigate = useNavigate();
  const [selectedDividendId, setSelectedDividendId] = useState<string>("");
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Fetch dividend records
  const { data: dividendRecords, isLoading } = useQuery({
    queryKey: ['dividend-records-for-journal'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('dividend_records')
        .select(`
          *,
          companies:company_id (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DividendRecord[];
    },
  });

  const generateJournalEntries = (dividend: DividendRecord) => {
    const entries: JournalEntry[] = [
      {
        account: "Retained Earnings",
        debit: dividend.total_dividend,
        credit: 0,
        description: `Dividend declared to ${dividend.shareholder_name}`
      },
      {
        account: "Dividends Payable",
        debit: 0,
        credit: dividend.total_dividend,
        description: `Dividend payable to ${dividend.shareholder_name}`
      }
    ];
    setJournalEntries(entries);
  };

  const handleDividendSelect = (dividendId: string) => {
    setSelectedDividendId(dividendId);
    const selectedDividend = dividendRecords?.find(d => d.id === dividendId);
    if (selectedDividend) {
      generateJournalEntries(selectedDividend);
    }
  };

  const selectedDividend = dividendRecords?.find(d => d.id === selectedDividendId);
  const totalDebits = journalEntries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = journalEntries.reduce((sum, entry) => sum + entry.credit, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6 text-[#9b87f5]" />
            <h1 className="text-3xl font-bold">Journal Entries Generator</h1>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Dividend Record</h2>
            <p className="text-gray-600 mb-6">
              Choose a dividend record to generate the corresponding journal entries for your accounting system.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Select Dividend Record
                </label>
                <Select value={selectedDividendId} onValueChange={handleDividendSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a dividend record..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading records...</SelectItem>
                    ) : dividendRecords && dividendRecords.length > 0 ? (
                      dividendRecords.map((record) => (
                        <SelectItem key={record.id} value={record.id}>
                          {record.companies?.name} - {record.shareholder_name} - £{record.total_dividend} ({new Date(record.payment_date).toLocaleDateString()})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No dividend records found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {selectedDividend && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Selected Dividend Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Company:</span> {selectedDividend.companies?.name}
                    </div>
                    <div>
                      <span className="font-medium">Shareholder:</span> {selectedDividend.shareholder_name}
                    </div>
                    <div>
                      <span className="font-medium">Share Class:</span> {selectedDividend.share_class}
                    </div>
                    <div>
                      <span className="font-medium">Payment Date:</span> {new Date(selectedDividend.payment_date).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Shares:</span> {selectedDividend.number_of_shares}
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span> £{selectedDividend.total_dividend}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {journalEntries.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Journal Entries</h2>
              <p className="text-gray-600 mb-6">
                The following journal entries should be recorded in your accounting system:
              </p>

              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Debit (£)
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credit (£)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {journalEntries.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {entry.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {entry.debit > 0 ? (
                            <Badge variant="outline" className="text-green-700 border-green-300">
                              £{entry.debit.toFixed(2)}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {entry.credit > 0 ? (
                            <Badge variant="outline" className="text-blue-700 border-blue-300">
                              £{entry.credit.toFixed(2)}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900">
                        Totals
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                        £{totalDebits.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                        £{totalCredits.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calculator className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Balanced Entry:</span> 
                      Debits (£{totalDebits.toFixed(2)}) = Credits (£{totalCredits.toFixed(2)})
                      {totalDebits === totalCredits ? " ✓" : " ✗"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Note for Accountants</h3>
                <p className="text-sm text-yellow-800">
                  These journal entries record the declaration of dividends. When the dividend is actually paid, 
                  you'll need an additional entry to debit "Dividends Payable" and credit "Cash" for the same amount.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalEntries;