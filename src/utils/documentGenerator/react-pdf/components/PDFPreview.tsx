import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Eye, EyeOff } from 'lucide-react';
import { DividendVoucherPDF } from './DividendVoucherPDF';
import { BoardMinutesPDF } from './BoardMinutesPDF';
import { DividendVoucherData, BoardMinutesData } from '../types';

interface PDFPreviewProps {
  data: DividendVoucherData | BoardMinutesData;
  documentType: 'dividend-voucher' | 'board-minutes';
  filename: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ data, documentType, filename }) => {
  const [showPreview, setShowPreview] = useState(true);

  const renderDocument = () => {
    if (documentType === 'dividend-voucher') {
      return <DividendVoucherPDF data={data as DividendVoucherData} />;
    } else {
      return <BoardMinutesPDF data={data as BoardMinutesData} />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">PDF Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <PDFDownloadLink
            document={renderDocument()}
            fileName={filename}
          >
            {({ loading }) => (
              <Button disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
      
      {showPreview && (
        <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
          <PDFViewer width="100%" height="100%">
            {renderDocument()}
          </PDFViewer>
        </div>
      )}
    </Card>
  );
};