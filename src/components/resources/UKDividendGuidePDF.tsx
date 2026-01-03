import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import mainLogo from '@/assets/dividify-main-logo.png';
import iconLogo from '@/assets/dividify-icon-logo.png';

// Brand colors matching the HTML design
const colors = {
  brandPurple: '#5227cc',
  brandLightPurple: '#f8f5ff',
  brandDark: '#1a1a2e',
  successGreen: '#27ae60',
  warningRedBg: '#fff5f5',
  warningRedBorder: '#e53e3e',
  warningRedText: '#c53030',
  textColor: '#333333',
  textMuted: '#666666',
  border: '#f0f0f0',
  introBorder: '#e0d4fc',
};

const styles = StyleSheet.create({
  page: {
    padding: '12mm 15mm',
    paddingBottom: 45,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 13,
    lineHeight: 1.45,
    position: 'relative',
  },
  
  // Header
  header: {
    marginBottom: 20,
  },
  mainLogo: {
    width: 130,
    height: 'auto',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginTop: 5,
    marginBottom: 5,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: 500,
    marginBottom: 10,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.introBorder,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    color: colors.brandPurple,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  
  // Intro Box
  introBox: {
    backgroundColor: '#fafafa',
    borderLeftWidth: 4,
    borderLeftColor: colors.brandPurple,
    padding: '12 15',
    marginBottom: 25,
    borderRadius: 4,
  },
  introText: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 1.45,
  },
  introStrong: {
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionNumber: {
    width: 22,
    height: 22,
    backgroundColor: colors.brandPurple,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
  },
  
  // Paragraph
  paragraph: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 10,
    lineHeight: 1.45,
  },
  
  // List Items
  listContainer: {
    paddingLeft: 18,
    marginTop: 5,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  listBullet: {
    width: 12,
    fontSize: 13,
    color: colors.brandPurple,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: '#444444',
    lineHeight: 1.45,
  },
  
  // Table
  table: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.brandPurple,
  },
  tableHeaderCell: {
    flex: 1,
    padding: '8 10',
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  tableRowEven: {
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    flex: 1,
    padding: '8 10',
    fontSize: 12,
    color: colors.textColor,
  },
  
  // Warning Container
  warningContainer: {
    borderWidth: 1,
    borderColor: colors.warningRedBorder,
    backgroundColor: colors.warningRedBg,
    borderRadius: 8,
    padding: '12 15',
    marginTop: 15,
    marginBottom: 15,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  warningTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.warningRedText,
  },
  warningText: {
    fontSize: 13,
    color: '#822727',
    lineHeight: 1.45,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 15,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 10,
  },
  ctaButtonText: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 9,
    color: '#999999',
    lineHeight: 1.3,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  footerLogoCenter: {
    width: 20,
    height: 'auto',
    opacity: 0.8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    fontSize: 10,
    color: '#cccccc',
  },
});

const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumber}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.listBullet}>•</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

export const UKDividendGuidePDF = () => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={mainLogo} style={styles.mainLogo} />
      </View>

      <Text style={styles.title}>UK Dividend Guide 2025/26</Text>
      <Text style={styles.subtitle}>
        Everything you need to know about paying dividends correctly
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>£500</Text>
          <Text style={styles.statLabel}>Tax-Free Allowance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>8.75%</Text>
          <Text style={styles.statLabel}>Basic Rate</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>33.75%</Text>
          <Text style={styles.statLabel}>Higher Rate</Text>
        </View>
      </View>

      {/* Intro Box */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          <Text style={styles.introStrong}>Quick Rule: </Text>
          Dividends can only be paid from company profits after corporation tax. You need proper paperwork 
          (board minutes + dividend vouchers) and shareholders receive dividends in proportion to their shares.
        </Text>
      </View>

      {/* Section 1 */}
      <SectionHeader number="1" title="What is a Dividend?" />
      <Text style={styles.paragraph}>
        A dividend is a distribution of company profits to shareholders. Unlike salary, dividends are not 
        subject to National Insurance, making them a tax-efficient way to extract profits from your company.
      </Text>
      <View style={styles.listContainer}>
        <ListItem>Paid from post-tax company profits (retained earnings)</ListItem>
        <ListItem>No employer or employee National Insurance contributions</ListItem>
        <ListItem>Must be declared properly with board minutes and vouchers</ListItem>
        <ListItem>Shareholders receive dividends based on their shareholding percentage</ListItem>
      </View>

      {/* Section 2 */}
      <SectionHeader number="2" title="Dividend Tax Rates 2025/26" />
      <Text style={styles.paragraph}>
        Dividend income is taxed at different rates depending on your total taxable income:
      </Text>

      {/* Tax Rates Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Tax Band</Text>
          <Text style={styles.tableHeaderCell}>Income Range</Text>
          <Text style={styles.tableHeaderCell}>Rate</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Dividend Allowance</Text>
          <Text style={styles.tableCell}>First £500</Text>
          <Text style={styles.tableCell}>0%</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={styles.tableCell}>Basic Rate</Text>
          <Text style={styles.tableCell}>£12,571 - £50,270</Text>
          <Text style={styles.tableCell}>8.75%</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Higher Rate</Text>
          <Text style={styles.tableCell}>£50,271 - £125,140</Text>
          <Text style={styles.tableCell}>33.75%</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={styles.tableCell}>Additional Rate</Text>
          <Text style={styles.tableCell}>Over £125,140</Text>
          <Text style={styles.tableCell}>39.35%</Text>
        </View>
      </View>

      {/* Section 3 */}
      <SectionHeader number="3" title="Required Documentation" />
      <Text style={styles.paragraph}>
        Every dividend payment requires proper documentation to be legally valid:
      </Text>
      <View style={styles.listContainer}>
        <ListItem>Board minutes recording the dividend declaration</ListItem>
        <ListItem>Individual dividend voucher for each shareholder</ListItem>
        <ListItem>Up-to-date management accounts showing distributable reserves</ListItem>
        <ListItem>Bank payment records matching the declared amounts</ListItem>
      </View>

      {/* Footer Page 1 */}
      <View style={styles.footer}>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 1</Text>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Section 4 */}
      <SectionHeader number="4" title="Interim vs Final Dividends" />
      <Text style={styles.paragraph}>
        Understanding the difference between interim and final dividends:
      </Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Interim Dividend</Text>
          <Text style={styles.tableHeaderCell}>Final Dividend</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Declared by directors</Text>
          <Text style={styles.tableCell}>Recommended by directors</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={styles.tableCell}>Paid during financial year</Text>
          <Text style={styles.tableCell}>Paid after year-end</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Board resolution only</Text>
          <Text style={styles.tableCell}>Requires shareholder approval</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={styles.tableCell}>Can be cancelled before payment</Text>
          <Text style={styles.tableCell}>Binding once approved</Text>
        </View>
      </View>

      {/* Section 5 */}
      <SectionHeader number="5" title="Distributable Reserves" />
      <Text style={styles.paragraph}>
        You can only pay dividends if your company has sufficient distributable reserves:
      </Text>
      <View style={styles.listContainer}>
        <ListItem>Accumulated profits minus accumulated losses</ListItem>
        <ListItem>Must account for corporation tax liability</ListItem>
        <ListItem>Check reserves before each dividend declaration</ListItem>
        <ListItem>Illegal dividends may need to be repaid by directors</ListItem>
      </View>

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningTitle}>⚠ Director's Loan Accounts</Text>
        </View>
        <Text style={styles.warningText}>
          If you owe money to your company (overdrawn DLA), you may face S455 tax of 33.75% if not 
          repaid within 9 months of year-end. Consider declaring dividends to clear the balance, 
          but ensure proper documentation is in place.
        </Text>
      </View>

      {/* Section 6 */}
      <SectionHeader number="6" title="Common Mistakes to Avoid" />
      <View style={styles.listContainer}>
        <ListItem>Paying dividends without sufficient profits</ListItem>
        <ListItem>Missing or incomplete dividend vouchers</ListItem>
        <ListItem>Backdating documentation after payment</ListItem>
        <ListItem>Unequal dividends without different share classes</ListItem>
        <ListItem>Forgetting to budget for personal tax liability</ListItem>
      </View>

      {/* CTA Section */}
      <View style={{ marginTop: 15, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: colors.brandPurple, marginBottom: 4 }}>
          Need Help with Dividend Documentation?
        </Text>
        <Text style={{ fontSize: 12, color: colors.textColor, textAlign: 'center', marginBottom: 8 }}>
          Dividify generates compliant board minutes and dividend vouchers in seconds.
        </Text>
        <Link src="https://dividify.co.uk/get-started">
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Free Trial →</Text>
          </View>
        </Link>
      </View>

      {/* Footer Page 2 */}
      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          This guide is for general information only. Tax rates and allowances may change. 
          Consult a qualified accountant for advice specific to your situation.
        </Text>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 2</Text>
    </Page>
  </Document>
);
