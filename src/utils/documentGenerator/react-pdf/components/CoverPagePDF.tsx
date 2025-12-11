import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CoverPageData } from '../types/boardPackTypes';
import { format, parseISO } from 'date-fns';

interface CoverPagePDFProps {
  data: CoverPageData;
}

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  border: {
    border: '2pt solid #1a365d',
    padding: 40,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: 'contain',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 30,
  },
  companySection: {
    alignItems: 'center',
    marginVertical: 30,
    padding: 20,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  companyName: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyNumber: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
  },
  yearEndSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  yearEndLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 4,
  },
  yearEndDate: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
  },
  contentsSection: {
    marginVertical: 30,
    padding: 20,
  },
  contentsTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
    marginBottom: 15,
    textAlign: 'center',
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 40,
  },
  checkmark: {
    fontSize: 12,
    color: '#38a169',
    marginRight: 10,
  },
  contentText: {
    fontSize: 11,
    color: '#4a5568',
  },
  footer: {
    borderTop: '1pt solid #e2e8f0',
    paddingTop: 20,
    alignItems: 'center',
  },
  generatedText: {
    fontSize: 9,
    color: '#a0aec0',
    marginBottom: 4,
  },
  firmName: {
    fontSize: 10,
    color: '#718096',
    fontFamily: 'Helvetica-Bold',
  },
});

const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'd MMMM yyyy');
  } catch {
    return dateString;
  }
};

export const CoverPagePDF: React.FC<CoverPagePDFProps> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border}>
          <View>
            <View style={styles.header}>
              {data.logoUrl && (
                <Image src={data.logoUrl} style={styles.logo} />
              )}
              <Text style={styles.mainTitle}>Dividend and Board Pack</Text>
              <Text style={styles.subtitle}>Corporate Documentation Package</Text>
            </View>

            <View style={styles.companySection}>
              <Text style={styles.companyName}>{data.companyName}</Text>
              <Text style={styles.companyNumber}>Company Number: {data.companyNumber || 'N/A'}</Text>
            </View>

            <View style={styles.yearEndSection}>
              <Text style={styles.yearEndLabel}>Year Ended</Text>
              <Text style={styles.yearEndDate}>{formatDate(data.yearEndDate)}</Text>
            </View>

            <View style={styles.contentsSection}>
              <Text style={styles.contentsTitle}>Contents</Text>
              <View style={styles.contentItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.contentText}>Board Minutes</Text>
              </View>
              <View style={styles.contentItem}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.contentText}>
                  Dividend Vouchers ({data.shareholderCount} shareholder{data.shareholderCount !== 1 ? 's' : ''})
                </Text>
              </View>
              {data.includeCapTable && (
                <View style={styles.contentItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.contentText}>Cap Table Snapshot</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.generatedText}>
              Generated on {formatDate(data.generatedDate)}
            </Text>
            {data.accountantFirmName && (
              <Text style={styles.firmName}>Prepared by {data.accountantFirmName}</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
