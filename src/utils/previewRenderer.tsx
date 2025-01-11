import React from 'react';
import { templates, TemplateId } from './documentGenerator/templates';

interface PreviewProps {
  template: TemplateId;
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
        <div className="text-[0.6rem] mt-1">123 Shareholder Street</div>
        <div className="text-[0.6rem]">City, Country</div>
        <div className="text-[0.6rem]">Postcode</div>
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
      <div className="bg-[#98E2D0] -m-4 p-4 mb-4">
        <div className="text-center">
          <div className="font-bold text-base">COMPANY NAME</div>
          <div className="text-[0.6rem]">Registered Address</div>
          <div className="text-[0.6rem]">Registration Number: 12345678</div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">Shareholder Name</div>
            <div className="text-[0.6rem] mt-1">123 Shareholder Street</div>
            <div className="text-[0.6rem]">City, Country</div>
            <div className="text-[0.6rem]">Postcode</div>
          </div>
          <div>
            <div>Voucher #001</div>
          </div>
        </div>
        <div className="bg-[#98E2D0]/10 p-2 rounded">
          <div className="text-center mb-2">
            COMPANY NAME has declared the final dividend
            for the year ending as follows:
          </div>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="py-1">Payment Date:</td>
                <td>DD/MM/YYYY</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Share Class:</td>
                <td>Ordinary</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Amount per Share:</td>
                <td>£0.00</td>
              </tr>
              <tr>
                <td className="py-1">Total Amount:</td>
                <td>£0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-auto pt-4 flex justify-between">
        <div className="border-t border-current pt-1">Director Signature</div>
        <div className="border-t border-current pt-1">Date</div>
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className={`${baseStyle} ${textColor}`}>
      <div className="bg-[#002B4E] text-white -m-4 p-4 mb-6">
        <div className="text-center">
          <div className="font-bold text-base tracking-wide">COMPANY NAME</div>
          <div className="text-[0.6rem] opacity-80">Registered Address</div>
          <div className="text-[0.6rem] opacity-80">Registration Number: 12345678</div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">Shareholder Name</div>
            <div className="text-[0.6rem] mt-1">123 Shareholder Street</div>
            <div className="text-[0.6rem]">City, Country</div>
            <div className="text-[0.6rem]">Postcode</div>
          </div>
          <div>
            <div className="text-[0.6rem] text-gray-500">Voucher</div>
            <div className="font-medium">#001</div>
          </div>
        </div>
        <div className="border-l-2 border-[#002B4E] pl-2">
          <div className="mb-2">
            COMPANY NAME has declared the final dividend
            for the year ending as follows:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[0.6rem] text-gray-500">Payment Date</div>
              <div>DD/MM/YYYY</div>
            </div>
            <div>
              <div className="text-[0.6rem] text-gray-500">Share Class</div>
              <div>Ordinary</div>
            </div>
            <div>
              <div className="text-[0.6rem] text-gray-500">Amount per Share</div>
              <div>£0.00</div>
            </div>
            <div>
              <div className="text-[0.6rem] text-gray-500">Total Amount</div>
              <div>£0.00</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[0.6rem] text-gray-500">Director Signature</div>
          <div className="border-t border-current mt-2"></div>
        </div>
        <div>
          <div className="text-[0.6rem] text-gray-500">Date</div>
          <div className="border-t border-current mt-2"></div>
        </div>
      </div>
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