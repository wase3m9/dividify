import React from 'react';

interface PreviewProps {
  template: 'basic' | 'classic' | 'modern';
  darkMode?: boolean;
}

export const DocumentPreview: React.FC<PreviewProps> = ({ template, darkMode = false }) => {
  const baseStyle = "w-full h-full flex flex-col p-4 text-xs";
  const textColor = darkMode ? "text-gray-300" : "text-gray-700";

  const renderBasicTemplate = () => (
    <div className={`${baseStyle} ${textColor}`}>
      <div className="text-center mb-4">
        <div className="font-bold">COMPANY NAME</div>
        <div className="text-[0.6rem]">Registered Address</div>
        <div className="text-[0.6rem]">Registration Number: 12345678</div>
      </div>
      <div className="text-right mb-4">
        <div>Voucher #001</div>
      </div>
      <div className="mb-4">
        <div>Shareholder Name</div>
        <div>Shareholder Address</div>
      </div>
      <div className="flex-grow">
        <div className="text-center mb-2">
          COMPANY NAME has declared the final dividend
          for the year ending as follows:
        </div>
        <div className="space-y-1">
          <div>Payment Date: DD/MM/YYYY</div>
          <div>Share Class: Ordinary</div>
          <div>Amount per Share: £0.00</div>
          <div>Total Amount: £0.00</div>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="border-t border-current pt-1">Director Signature</div>
        <div className="border-t border-current pt-1">Date</div>
      </div>
    </div>
  );

  const renderClassicTemplate = () => (
    <div className={`${baseStyle} ${textColor}`}>
      {/* Similar structure but with different styling */}
      <div className="text-center mb-4 border-b-2 pb-2">
        <div className="font-serif font-bold">COMPANY NAME</div>
        <div className="text-[0.6rem]">Registered Address</div>
      </div>
      {/* ... rest of classic template */}
    </div>
  );

  const renderModernTemplate = () => (
    <div className={`${baseStyle} ${textColor}`}>
      {/* Modern template with different layout */}
      <div className="flex justify-between mb-4">
        <div className="font-bold">COMPANY NAME</div>
        <div>Voucher #001</div>
      </div>
      {/* ... rest of modern template */}
    </div>
  );

  switch (template) {
    case 'classic':
      return renderClassicTemplate();
    case 'modern':
      return renderModernTemplate();
    default:
      return renderBasicTemplate();
  }
};