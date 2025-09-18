import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { DividendVoucherData } from '../types';
import { getTemplate } from '../templates';

interface DividendVoucherPDFProps {
  data: DividendVoucherData;
}

export const DividendVoucherPDF: React.FC<DividendVoucherPDFProps> = ({ data }) => {
  const template = getTemplate(data.templateStyle);
  const isPremium = ['executive', 'legal', 'corporateElite', 'royal', 'elite', 'platinum', 'ornate', 'magistrate'].includes(data.templateStyle || '');
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: isPremium && data.templateStyle === 'executive' ? '#FAFAFA' : '#FFFFFF',
      padding: isPremium ? 40 : 30,
      fontFamily: isPremium ? 'Times-Roman' : 'Helvetica',
    },
    header: {
      marginBottom: isPremium ? 40 : 30,
      borderBottom: isPremium ? `3pt solid ${template.colors.primary}` : `2pt solid ${template.colors.primary}`,
      paddingBottom: isPremium ? 20 : 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.primary,
        marginHorizontal: -40,
        marginTop: -40,
        paddingHorizontal: 40,
        paddingTop: 30,
        marginBottom: 50,
      }),
    },
    headerContent: {
      flex: 1,
    },
    logo: {
      width: 60,
      height: 60,
      objectFit: 'contain',
    },
    title: {
      fontSize: template.fonts.title,
      fontWeight: 'bold',
      color: isPremium && data.templateStyle === 'executive' ? template.colors.accent : template.colors.primary,
      textAlign: 'center',
      marginBottom: isPremium ? 15 : 10,
      ...(isPremium && data.templateStyle === 'executive' && {
        color: template.colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }),
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: template.fonts.heading,
      fontWeight: 'bold',
      color: isPremium ? template.colors.accent : template.colors.text,
      marginBottom: isPremium ? 12 : 8,
      backgroundColor: isPremium && data.templateStyle === 'executive' ? template.colors.primary : template.colors.secondary,
      padding: isPremium ? 8 : 5,
      ...(isPremium && data.templateStyle === 'legal' && {
        borderLeft: `4pt solid ${template.colors.accent}`,
        paddingLeft: 12,
        backgroundColor: 'transparent',
      }),
      ...(isPremium && data.templateStyle === 'corporateElite' && {
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: template.colors.primary,
      }),
    },
    row: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    label: {
      fontSize: template.fonts.body,
      fontWeight: 'bold',
      width: '40%',
      color: template.colors.text,
    },
    value: {
      fontSize: template.fonts.body,
      width: '60%',
      color: template.colors.text,
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
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>DIVIDEND VOUCHER</Text>
          </View>
          {data.logoUrl && (
            <Image style={styles.logo} src={data.logoUrl} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Company Name:</Text>
            <Text style={styles.value}>{data.companyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Registration Number:</Text>
            <Text style={styles.value}>{data.companyRegNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{data.companyAddress}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shareholder Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Shareholder Name:</Text>
            <Text style={styles.value}>{data.shareholderName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{data.shareholderAddress}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dividend Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>{format(new Date(data.paymentDate), 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shareholders as at:</Text>
            <Text style={styles.value}>{format(new Date(data.shareholdersAsAtDate), 'dd/MM/yyyy')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Number of Shares:</Text>
            <Text style={styles.value}>{data.sharesHeld.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Dividend Amount:</Text>
            <Text style={styles.value}>£{data.dividendAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Director Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

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