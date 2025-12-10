import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { CapTableData } from '../types/boardPackTypes';
import { format, parseISO } from 'date-fns';

interface CapTablePDFProps {
  data: CapTableData;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 25,
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
    marginBottom: 15,
  },
  companyInfo: {
    marginBottom: 5,
  },
  companyName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#2d3748',
  },
  companyNumber: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  snapshotInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  snapshotText: {
    fontSize: 10,
    color: '#4a5568',
    marginBottom: 3,
  },
  snapshotValue: {
    fontFamily: 'Helvetica-Bold',
  },
  tableContainer: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a365d',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #e2e8f0',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    backgroundColor: '#f7fafc',
  },
  tableCell: {
    fontSize: 9,
    color: '#2d3748',
    textAlign: 'center',
  },
  colNum: { width: '5%' },
  colName: { width: '20%', textAlign: 'left' },
  colRole: { width: '12%' },
  colClass: { width: '12%' },
  colShares: { width: '12%' },
  colPercent: { width: '10%' },
  colVoting: { width: '12%' },
  colNotes: { width: '17%' },
  totalsRow: {
    flexDirection: 'row',
    backgroundColor: '#edf2f7',
    padding: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  totalsCell: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f7fafc',
    borderRadius: 4,
    borderLeft: '3pt solid #1a365d',
  },
  footerText: {
    fontSize: 9,
    color: '#4a5568',
    lineHeight: 1.5,
  },
  summarySection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryBox: {
    padding: 10,
    backgroundColor: '#edf2f7',
    borderRadius: 4,
    width: '30%',
  },
  summaryLabel: {
    fontSize: 8,
    color: '#718096',
    marginBottom: 3,
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1a365d',
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

export const CapTablePDF: React.FC<CapTablePDFProps> = ({ data }) => {
  const totalShares = data.entries.reduce((sum, entry) => sum + entry.sharesHeld, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{data.companyName}</Text>
              <Text style={styles.companyNumber}>Company Number: {data.companyNumber || 'N/A'}</Text>
            </View>
            {data.logoUrl && <Image src={data.logoUrl} style={styles.logo} />}
          </View>
          
          <Text style={styles.title}>Cap Table Snapshot</Text>
          
          <View style={styles.snapshotInfo}>
            <Text style={styles.snapshotText}>
              <Text style={styles.snapshotValue}>Snapshot as at: </Text>
              {formatDate(data.snapshotDate)}
            </Text>
            <Text style={styles.snapshotText}>
              <Text style={styles.snapshotValue}>Share class included: </Text>
              {data.shareClassIncluded}
            </Text>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colName]}>Shareholder</Text>
            <Text style={[styles.tableHeaderCell, styles.colRole]}>Role</Text>
            <Text style={[styles.tableHeaderCell, styles.colClass]}>Share Class</Text>
            <Text style={[styles.tableHeaderCell, styles.colShares]}>Shares Held</Text>
            <Text style={[styles.tableHeaderCell, styles.colPercent]}>% Ownership</Text>
            <Text style={[styles.tableHeaderCell, styles.colVoting]}>Voting Rights</Text>
            <Text style={[styles.tableHeaderCell, styles.colNotes]}>Notes</Text>
          </View>

          {data.entries.map((entry, index) => (
            <View 
              key={index} 
              style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}
            >
              <Text style={[styles.tableCell, styles.colNum]}>{index + 1}</Text>
              <Text style={[styles.tableCell, styles.colName]}>{entry.shareholderName}</Text>
              <Text style={[styles.tableCell, styles.colRole]}>{entry.role}</Text>
              <Text style={[styles.tableCell, styles.colClass]}>{entry.shareClass}</Text>
              <Text style={[styles.tableCell, styles.colShares]}>
                {entry.sharesHeld.toLocaleString()}
              </Text>
              <Text style={[styles.tableCell, styles.colPercent]}>
                {entry.percentageOwnership.toFixed(1)}%
              </Text>
              <Text style={[styles.tableCell, styles.colVoting]}>{entry.votingRights}</Text>
              <Text style={[styles.tableCell, styles.colNotes]}>{entry.notes || '-'}</Text>
            </View>
          ))}

          <View style={styles.totalsRow}>
            <Text style={[styles.totalsCell, styles.colNum]}></Text>
            <Text style={[styles.totalsCell, styles.colName]}>TOTAL</Text>
            <Text style={[styles.totalsCell, styles.colRole]}></Text>
            <Text style={[styles.totalsCell, styles.colClass]}></Text>
            <Text style={[styles.totalsCell, styles.colShares]}>
              {totalShares.toLocaleString()}
            </Text>
            <Text style={[styles.totalsCell, styles.colPercent]}>100%</Text>
            <Text style={[styles.totalsCell, styles.colVoting]}></Text>
            <Text style={[styles.totalsCell, styles.colNotes]}></Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Issued Shares</Text>
            <Text style={styles.summaryValue}>{totalShares.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Nominal Value per Share</Text>
            <Text style={styles.summaryValue}>£{data.nominalValuePerShare.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Share Capital</Text>
            <Text style={styles.summaryValue}>
              £{(totalShares * data.nominalValuePerShare).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This schedule shows the issued share capital and percentage holdings of {data.companyName} as at {formatDate(data.snapshotDate)}, based on the company's statutory registers. Dividends declared in this board pack have been calculated using these shareholdings.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
