import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format, isValid, parseISO } from 'date-fns';
import { DividendVoucherData } from '../../types';
import { getTemplate } from '../templates';

interface DividendVoucherPDFProps {
  data: DividendVoucherData;
}

export const DividendVoucherPDF: React.FC<DividendVoucherPDFProps> = ({ data }) => {
  const template = getTemplate(data.templateStyle);
  const isPremium = ['executive', 'legal', 'corporateElite', 'royal', 'elite', 'platinum', 'ornate', 'magistrate'].includes(data.templateStyle || '');
  
  // Helper function to safely format dates
  const formatDate = (dateString: string, fallback: string = 'Invalid Date'): string => {
    if (!dateString) return fallback;
    
    let date: Date;
    
    // Try parsing as ISO string first, then as regular Date
    if (dateString.includes('T') || dateString.includes('-')) {
      date = parseISO(dateString);
    } else {
      date = new Date(dateString);
    }
    
    if (!isValid(date)) {
      console.warn('Invalid date provided:', dateString);
      return fallback;
    }
    
    return format(date, 'dd/MM/yyyy');
  };
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: isPremium && data.templateStyle === 'executive' ? '#F8F8F8' : '#FFFFFF',
      padding: isPremium ? 40 : 30,
      fontFamily: isPremium ? 'Times-Roman' : 'Helvetica',
    },
    companyHeader: {
      marginBottom: 30,
      paddingBottom: isPremium ? 20 : 15,
      textAlign: 'center',
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.primary,
        marginHorizontal: -40,
        marginTop: -40,
        paddingHorizontal: 40,
        paddingTop: 30,
        marginBottom: 40,
      }),
    },
    logo: {
      width: 60,
      height: 60,
      objectFit: 'contain',
      alignSelf: 'center',
      marginBottom: 10,
    },
    companyName: {
      fontSize: template.fonts.title,
      fontWeight: 'bold',
      color: isPremium && data.templateStyle === 'executive' ? template.colors.accent : template.colors.primary,
      textAlign: 'center',
      marginBottom: 8,
      ...(isPremium && data.templateStyle === 'executive' && {
        color: template.colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }),
    },
    companyAddress: {
      fontSize: template.fonts.body,
      color: template.colors.text,
      textAlign: 'center',
      marginBottom: 5,
      ...(isPremium && data.templateStyle === 'executive' && {
        color: template.colors.accent,
      }),
    },
    registrationNumber: {
      fontSize: template.fonts.body,
      color: template.colors.text,
      textAlign: 'center',
      ...(isPremium && data.templateStyle === 'executive' && {
        color: template.colors.accent,
      }),
    },
    voucherNumber: {
      position: 'absolute',
      top: isPremium ? 80 : 70,
      right: 30,
      fontSize: template.fonts.body,
      color: template.colors.text,
    },
    shareholderSection: {
      marginTop: 40,
      marginBottom: 30,
      marginLeft: 0,
    },
    declarationSection: {
      marginBottom: 30,
    },
    paymentSection: {
      marginBottom: 40,
      paddingLeft: 50,
    },
    paymentRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    paymentLabel: {
      fontSize: template.fonts.body,
      fontWeight: 'bold',
      width: '30%',
      color: template.colors.text,
    },
    paymentValue: {
      fontSize: template.fonts.body,
      width: '70%',
      color: template.colors.text,
    },
    text: {
      fontSize: template.fonts.body,
      color: template.colors.text,
      marginBottom: 3,
    },
    signatureSection: {
      marginTop: isPremium ? 60 : 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...(isPremium && {
        borderTop: `2pt solid ${template.colors.accent}`,
        paddingTop: 20,
      }),
    },
    signatureBox: {
      width: '45%',
      borderTop: isPremium ? `2pt solid ${template.colors.accent}` : `1pt solid ${template.colors.accent}`,
      paddingTop: isPremium ? 10 : 5,
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.secondary,
        padding: 10,
        borderTop: 'none',
        border: `1pt solid ${template.colors.accent}`,
      }),
    },
    signatureLabel: {
      fontSize: template.fonts.small,
      textAlign: 'center',
      color: template.colors.accent,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: template.fonts.small,
      color: template.colors.accent,
      borderTop: isPremium ? `2pt solid ${template.colors.accent}` : `1pt solid ${template.colors.accent}`,
      paddingTop: isPremium ? 15 : 10,
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.primary,
        color: template.colors.accent,
        marginHorizontal: -40,
        paddingHorizontal: 40,
        marginBottom: -30,
        paddingBottom: 30,
      }),
    },
    watermark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: 60,
      color: template.colors.secondary,
      opacity: 0.1,
      zIndex: -1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isPremium && (
          <Text style={styles.watermark}>PREMIUM</Text>
        )}
        
        {/* Company Header */}
        <View style={styles.companyHeader}>
          {data.logoUrl && (
            <Image style={styles.logo} src={data.logoUrl} />
          )}
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.companyAddress}>{data.registeredAddress}</Text>
          <Text style={styles.registrationNumber}>Registered number: {data.registrationNumber}</Text>
        </View>

        {/* Voucher Number - Top Right */}
        <View style={styles.voucherNumber}>
          <Text style={styles.text}>Dividend voucher number: {data.voucherNumber}</Text>
        </View>

        {/* Director/Shareholder Address - Left Side */}
        <View style={styles.shareholderSection}>
          <Text style={styles.text}>{data.shareholderName}</Text>
          {data.shareholderAddress.split(',').map((line, index) => (
            <Text key={index} style={styles.text}>{line.trim()}</Text>
          ))}
        </View>

        {/* Declaration Statement */}
        <View style={styles.declarationSection}>
          <Text style={styles.text}>
            {data.companyName} has declared the final dividend for the year ending {formatDate(data.financialYearEnding, 'TBD')} on its Ordinary shares as follows:
          </Text>
        </View>

        {/* Payment Details - No Labels */}
        <View style={styles.paymentSection}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Payment Date:</Text>
            <Text style={styles.paymentValue}>{formatDate(data.paymentDate)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shareholders as at:</Text>
            <Text style={styles.paymentValue}>{formatDate(data.paymentDate)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Shareholder:</Text>
            <Text style={styles.paymentValue}>{data.shareholderName}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Holdings:</Text>
            <Text style={styles.paymentValue}>{data.holdings || '0'}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Dividend payable:</Text>
            <Text style={styles.paymentValue}>£{data.totalAmount}</Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Director Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          {data.accountantFirmName 
            ? `This dividend voucher was generated by ${data.accountantFirmName} and issued in accordance with the Companies Act 2006.`
            : "This dividend voucher is issued in accordance with the Companies Act 2006"
          }
        </Text>
      </Page>
    </Document>
  );
};