import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Building2, CheckCircle } from 'lucide-react';
import { useCompaniesHouse, CompanySearchResult, CompanyDetails } from '@/hooks/useCompaniesHouse';

interface CompanyHouseSearchProps {
  onSelectCompany: (company: CompanyDetails) => void;
  placeholder?: string;
  initialValue?: string;
}

export const CompanyHouseSearch = ({ 
  onSelectCompany, 
  placeholder = "Search company name or registration number...",
  initialValue = ""
}: CompanyHouseSearchProps) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDetails | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { searchCompanies, getCompanyDetails, formatAddress, isLoading } = useCompaniesHouse();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!query || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      const searchResults = await searchCompanies(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, searchCompanies]);

  const handleSelectCompany = async (result: CompanySearchResult) => {
    const details = await getCompanyDetails(result.company_number, true);
    if (details) {
      setSelectedCompany(details);
      setQuery(details.company_name);
      setIsOpen(false);
      onSelectCompany(details);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (selectedCompany && value !== selectedCompany.company_name) {
      setSelectedCompany(null);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : selectedCompany ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <Building2 className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
          <div className="p-2">
            {results.map((company) => (
              <Button
                key={company.company_number}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left"
                onClick={() => handleSelectCompany(company)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {company.company_name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {company.company_number} • {company.status}
                  </div>
                  {company.address && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatAddress(company.address)}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {selectedCompany && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Company verified with Companies House</span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            {selectedCompany.company_number} • {selectedCompany.status}
          </div>
        </div>
      )}
    </div>
  );
};