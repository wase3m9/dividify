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
  page2Header: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 15,
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
  
  // Intro Box (Golden Rules)
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
  paragraphIndent: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 10,
    lineHeight: 1.45,
    paddingLeft: 18,
  },
  smallText: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  
  // List Items (numbered)
  listContainer: {
    paddingLeft: 18,
    marginTop: 5,
    marginBottom: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  listNumber: {
    width: 18,
    fontSize: 13,
    color: colors.brandPurple,
    fontFamily: 'Helvetica-Bold',
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
  
  // Checkmark list items
  checkListItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  checkMark: {
    width: 18,
    fontSize: 13,
    color: colors.successGreen,
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
    fontSize: 12,
    color: '#822727',
    lineHeight: 1.4,
    marginBottom: 4,
  },
  
  // FAQ Section
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginBottom: 2,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#444444',
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
  ctaSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 15,
  },
  ctaTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 12,
    color: colors.textColor,
    textAlign: 'center',
    marginBottom: 8,
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

const NumberedListItem = ({ number, children }: { number: string; children: React.ReactNode }) => (
  <View style={styles.listItem}>
    <Text style={styles.listNumber}>{number}.</Text>
    <Text style={styles.listText}>{children}</Text>
  </View>
);

const CheckListItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.checkListItem}>
    <Text style={styles.checkMark}>✔</Text>
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
        Everything you need to know about paying dividends in 2025/26.
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>£500</Text>
          <Text style={styles.statLabel}>Dividend Allowance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>8.75%</Text>
          <Text style={styles.statLabel}>Basic Rate Tax</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>33.75%</Text>
          <Text style={styles.statLabel}>Higher Rate Tax</Text>
        </View>
      </View>

      {/* Golden Rules Intro Box */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          <Text style={styles.introStrong}>The Golden Rules:</Text>
          {'\n'}1. Dividends can only be paid from distributable profits (after tax).
          {'\n'}2. You must have paperwork: Minutes + Vouchers.
          {'\n'}3. No tax is deducted at source; you pay it via Self Assessment.
        </Text>
      </View>

      {/* Section 1 */}
      <SectionHeader number="1" title="Profits & Distributable Reserves" />
      <Text style={styles.paragraph}>
        Before declaring a dividend, you must confirm the company has enough "Distributable Reserves" (Retained Earnings). You cannot pay dividends from capital or future hoped-for income.
      </Text>
      <Text style={styles.paragraphIndent}>
        <Text style={styles.introStrong}>Practical Test:</Text> Take your last filed accounts, add profits earned since then, subtract any losses, subtract estimated Corporation Tax, and subtract any dividends already paid. The result is what you can pay.
      </Text>

      {/* Section 2 */}
      <SectionHeader number="2" title="Interim vs. Final Dividends" />
      <Text style={styles.paragraph}>
        Most small companies pay Interim Dividends. Here is the correct process:
      </Text>
      <View style={styles.listContainer}>
        <NumberedListItem number="1">Run the numbers: Confirm reserves are available.</NumberedListItem>
        <NumberedListItem number="2">Decision: Directors hold a meeting (or sign a written minute) declaring the dividend.</NumberedListItem>
        <NumberedListItem number="3">Voucher: Issue a dividend voucher to every shareholder.</NumberedListItem>
        <NumberedListItem number="4">Pay it: Bank transfer is best for a clear audit trail.</NumberedListItem>
      </View>

      {/* Section 3 */}
      <SectionHeader number="3" title="The Paperwork Pack" />
      <Text style={styles.paragraph}>
        If HMRC asks questions, this is the "Minimum Pack" you should have on file:
      </Text>
      <View style={styles.listContainer}>
        <CheckListItem>Dividend Calculation</CheckListItem>
        <CheckListItem>Board Minutes</CheckListItem>
        <CheckListItem>Dividend Vouchers</CheckListItem>
        <CheckListItem>Bank Statement Evidence</CheckListItem>
      </View>

      {/* Footer Page 1 */}
      <View style={styles.footer}>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 1 of 2</Text>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Page 2 Header */}
      <Text style={styles.page2Header}>UK Dividend Guide 2025/26 | Page 2</Text>

      {/* Section 4 */}
      <SectionHeader number="4" title="Tax on Dividends (Worked Examples)" />
      <Text style={styles.paragraph}>
        Dividends sit on top of your other income. You use your Personal Allowance (£12,570) first, then the £500 Dividend Allowance, then pay tax on the rest.
      </Text>
      
      {/* Tax Examples Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderCell}>Scenario</Text>
          <Text style={styles.tableHeaderCell}>Salary</Text>
          <Text style={styles.tableHeaderCell}>Dividends</Text>
          <Text style={styles.tableHeaderCell}>Est. Tax</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>A: Standard</Text>
          <Text style={styles.tableCell}>£12,570</Text>
          <Text style={styles.tableCell}>£30,000</Text>
          <Text style={styles.tableCell}>£2,581.25</Text>
        </View>
        <View style={[styles.tableRow, styles.tableRowEven]}>
          <Text style={styles.tableCell}>B: Higher Rate</Text>
          <Text style={styles.tableCell}>£12,570</Text>
          <Text style={styles.tableCell}>£70,000</Text>
          <Text style={styles.tableCell}>£14,031.25</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>C: Low Salary</Text>
          <Text style={styles.tableCell}>£12,400</Text>
          <Text style={styles.tableCell}>£37,600</Text>
          <Text style={styles.tableCell}>£3,231.38</Text>
        </View>
      </View>
      <Text style={styles.smallText}>
        *Rates for 2025/26. Basic rate: 8.75% | Higher: 33.75% | Additional: 39.35%
      </Text>

      {/* Section 5 */}
      <SectionHeader number="5" title="Director's Loan Accounts (DLA)" />
      <Text style={styles.paragraph}>
        If you take money that isn't salary or dividend, it goes to your DLA. You can clear an overdrawn DLA with a dividend, but the paperwork must be correct.
      </Text>

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningTitle}>⚠ Two Major Tax Traps</Text>
        </View>
        <Text style={styles.warningText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>s455 Tax (33.75%):</Text> Payable by the company if you owe it money 9 months after year-end. (Refundable when you repay the loan).
        </Text>
        <Text style={styles.warningText}>
          <Text style={{ fontFamily: 'Helvetica-Bold' }}>Benefit in Kind:</Text> If you owe {'>'} £10,000 at any point, it's a beneficial loan. You may need to file a P11D and pay Class 1A NICs.
        </Text>
      </View>

      {/* Section 6 */}
      <SectionHeader number="6" title="Frequently Asked Questions" />
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Can I pay monthly?</Text>
        <Text style={styles.faqAnswer}>Yes, if you have reserves and do the minutes + vouchers every time.</Text>
      </View>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Unequal dividends?</Text>
        <Text style={styles.faqAnswer}>Only if you have different share classes or a valid waiver. Otherwise, it must be equal.</Text>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Automate Your Paperwork</Text>
        <Text style={styles.ctaSubtitle}>Generate HMRC-compliant vouchers & minutes in seconds.</Text>
        <Link src="https://dividify.co.uk/get-started">
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Free Trial →</Text>
          </View>
        </Link>
        <Text style={styles.disclaimer}>
          Disclaimer: This guide is general information for UK companies. It does not cover complex scenarios. Always seek professional advice if unsure.
        </Text>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>

      <Text style={styles.pageNumber}>Page 2 of 2</Text>
    </Page>
  </Document>
);
