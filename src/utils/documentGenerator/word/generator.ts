import { Document } from 'docx';
import { DividendVoucherData } from '../types';
import { createCompanyHeader } from './companyHeader';
import { createShareholderDetails } from './shareholderDetails';
import { createDeclarationSection } from './declarationSection';
import { createPaymentDetails } from './paymentDetails';
import { createSignatureSection } from './signatureSection';

export const generateWord = async (data: DividendVoucherData) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        ...createCompanyHeader(data),
        ...createShareholderDetails(data),
        ...createDeclarationSection(data),
        ...createPaymentDetails(data),
        ...createSignatureSection(),
      ],
    }],
  });

  return doc;
};