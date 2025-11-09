import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCompaniesHouse } from '@/hooks/useCompaniesHouse';
import { Users, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Officer {
  name: string;
  officer_role: string;
  appointed_on: string | null;
  resigned_on: string | null;
  nationality: string | null;
  occupation: string | null;
  country_of_residence: string | null;
  date_of_birth: { month: number; year: number } | null;
  address: any;
}

interface OfficersAutoFillProps {
  companyNumber?: string;
  companyId: string;
  onOfficersImported: () => void;
}

export const OfficersAutoFill = ({ companyNumber, companyId, onOfficersImported }: OfficersAutoFillProps) => {
  const [inputCompanyNumber, setInputCompanyNumber] = useState(companyNumber || '');
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const { getCompanyDetails, isLoading } = useCompaniesHouse();
  const { toast } = useToast();

  const fetchOfficers = async () => {
    if (!inputCompanyNumber.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a company number",
      });
      return;
    }

    const details = await getCompanyDetails(inputCompanyNumber.trim(), true);
    if (details?.officers) {
      // Filter out resigned officers
      const activeOfficers = details.officers.filter(officer => !officer.resigned_on);
      setOfficers(activeOfficers);
      toast({
        title: "Success",
        description: `Found ${activeOfficers.length} active officers`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "No Officers Found",
        description: "No officer information available for this company",
      });
    }
  };

  const importOfficers = async () => {
    if (officers.length === 0) return;

    setIsImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch existing officers for this company
      const { data: existingOfficers } = await supabase
        .from('officers')
        .select('computed_full_name, forenames, surname')
        .eq('company_id', companyId);

      const officersToInsert = officers.map(officer => {
        // Split name into forenames and surname
        const nameParts = officer.name.split(',').map(part => part.trim());
        let surname = '';
        let forenames = '';
        let title = '';
        
        if (nameParts.length >= 2) {
          // Format: "SURNAME, Title Forenames" or "SURNAME, Forenames"
          surname = nameParts[0];
          const remaining = nameParts.slice(1).join(' ');
          
          // Common titles to extract
          const titles = ['MR', 'MRS', 'MISS', 'MS', 'DR', 'PROF', 'SIR', 'LADY', 'LORD'];
          const words = remaining.split(' ').filter(word => word.length > 0);
          
          // Check if first word is a title
          if (words.length > 0 && titles.includes(words[0].toUpperCase())) {
            title = words[0];
            forenames = words.slice(1).join(' ');
          } else {
            forenames = remaining;
          }
        } else {
          // If no comma, assume last word is surname
          const words = officer.name.split(' ');
          if (words.length > 1) {
            surname = words[words.length - 1];
            forenames = words.slice(0, -1).join(' ');
          } else {
            surname = officer.name;
            forenames = '';
          }
        }

        // Create display name in "First Name Surname" format
        const displayName = title ? 
          `${title} ${forenames} ${surname}`.trim() : 
          `${forenames} ${surname}`.trim();
        
        // Capitalize first letter of position
        const capitalizedPosition = officer.officer_role.charAt(0).toUpperCase() + officer.officer_role.slice(1).toLowerCase();

        return {
          user_id: user.id,
          company_id: companyId,
          forenames: forenames || 'N/A',
          surname: surname || 'N/A',
          title: title || '', // Will be selectable in form
          position: capitalizedPosition,
          email: '', // Not available from Companies House - user will need to add
          address: officer.address ? [
            officer.address.address_line_1,
            officer.address.address_line_2,
            officer.address.locality,
            officer.address.region,
            officer.address.postal_code,
            officer.address.country
          ].filter(Boolean).join(', ') : '',
          date_of_appointment: officer.appointed_on || new Date().toISOString().split('T')[0],
          computed_full_name: displayName
        };
      });

      // Filter out duplicates by checking name match
      const duplicates: string[] = [];
      const uniqueOfficers = officersToInsert.filter(officer => {
        const isDuplicate = existingOfficers?.some(existing => {
          const existingNameLower = (existing.computed_full_name || `${existing.forenames} ${existing.surname}`).toLowerCase().trim();
          const newNameLower = officer.computed_full_name.toLowerCase().trim();
          return existingNameLower === newNameLower;
        });
        
        if (isDuplicate) {
          duplicates.push(officer.computed_full_name);
        }
        return !isDuplicate;
      });

      if (duplicates.length > 0) {
        toast({
          variant: "destructive",
          title: "Duplicate Officers Detected",
          description: `${duplicates.length} officer(s) already exist: ${duplicates.join(', ')}`,
        });
      }

      if (uniqueOfficers.length === 0) {
        toast({
          title: "No New Officers",
          description: "All officers already exist in the system",
        });
        setOfficers([]);
        setIsImporting(false);
        return;
      }

      const { error } = await supabase
        .from('officers')
        .insert(uniqueOfficers);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Imported ${uniqueOfficers.length} new officer(s)${duplicates.length > 0 ? `. Skipped ${duplicates.length} duplicate(s)` : ''}`,
      });
      
      setOfficers([]);
      onOfficersImported();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import Error",
        description: error.message || "Failed to import officers",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#9b87f5]" />
          <h3 className="text-lg font-semibold">Import Officers from Companies House</h3>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter company number (e.g., 12345678)"
            value={inputCompanyNumber}
            onChange={(e) => setInputCompanyNumber(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={fetchOfficers}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Fetch Officers"
            )}
          </Button>
        </div>

        {officers.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Found {officers.length} Active Officers:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {officers.map((officer, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium">{officer.name}</div>
                  <div className="text-sm text-gray-600">{officer.officer_role}</div>
                  {officer.appointed_on && (
                    <div className="text-xs text-gray-500">
                      Appointed: {new Date(officer.appointed_on).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button 
              onClick={importOfficers}
              disabled={isImporting}
              className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Import {officers.length} Officers
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};