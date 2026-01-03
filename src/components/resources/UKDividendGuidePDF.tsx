import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import mainLogo from '@/assets/dividify-main-logo.png';
import iconLogo from '@/assets/dividify-icon-logo.png';

// Brand colors matching the V3 HTML design
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
    padding: '50px 60px',
    paddingBottom: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    lineHeight: 1.6,
    position: 'relative',
  },
  
  // Header
  header: {
    marginBottom: 35,
  },
  mainLogo: {
    width: 150,
    height: 'auto',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginTop: 5,
    marginBottom: 5,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 20,
  },
  page2Header: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 20,
  },
  
  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  statValue: {
    color: colors.brandPurple,
    fontFamily: 'Helvetica-Bold',
    fontSize: 20,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  
  // Intro Box (Golden Rules)
  introBox: {
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.introBorder,
    padding: '18 25',
    marginBottom: 35,
    borderRadius: 8,
  },
  introText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 1.6,
  },
  introStrong: {
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
  },
  
  // Card Box
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: '20 25',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 1.6,
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 8,
    marginTop: 25,
    marginBottom: 20,
  },
  sectionNumber: {
    width: 30,
    height: 30,
    backgroundColor: colors.brandPurple,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
  },
  
  // Paragraph
  paragraph: {
    fontSize: 15,
    color: '#444444',
    marginBottom: 15,
    lineHeight: 1.6,
  },
  smallText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  
  // Checklist Items
  checklistContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingLeft: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderRadius: 4,
    marginRight: 15,
    marginTop: 2,
  },
  checkboxChecked: {
    width: 18,
    height: 18,
    backgroundColor: colors.brandPurple,
    borderWidth: 2,
    borderColor: colors.brandPurple,
    borderRadius: 4,
    marginRight: 15,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: '#444444',
    lineHeight: 1.6,
  },
  
  // Table
  table: {
    marginTop: 20,
    marginBottom: 20,
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
    padding: '12 15',
    color: '#FFFFFF',
    fontSize: 14,
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
    padding: '12 15',
    fontSize: 14,
    color: colors.textColor,
  },
  
  // Warning Container
  warningContainer: {
    borderWidth: 2,
    borderColor: colors.warningRedBorder,
    backgroundColor: colors.warningRedBg,
    borderRadius: 10,
    padding: 20,
    marginTop: 25,
    marginBottom: 25,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  warningTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.warningRedText,
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 0,
  },
  warningBullet: {
    width: 25,
    fontSize: 14,
    color: colors.warningRedBorder,
    fontFamily: 'Helvetica-Bold',
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#822727',
    lineHeight: 1.4,
  },
  warningTextBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // FAQ Section
  faqContainer: {
    marginTop: 10,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 1.6,
  },
  
  // Footer
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: colors.textColor,
    textAlign: 'center',
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: 15,
    marginBottom: 10,
  },
  ctaButtonText: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    color: '#999999',
    lineHeight: 1.4,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    maxWidth: 450,
  },
  footerLogoCenter: {
    width: 25,
    height: 'auto',
    opacity: 0.8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 60,
    fontSize: 12,
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

const ChecklistItem = ({ children, checked = false }: { children: React.ReactNode; checked?: boolean }) => (
  <View style={styles.checklistItem}>
    {checked ? (
      <View style={styles.checkboxChecked}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    ) : (
      <View style={styles.checkbox} />
    )}
    <Text style={styles.checklistText}>{children}</Text>
  </View>
);

const WarningItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.warningItem}>
    <Text style={styles.warningBullet}>✖</Text>
    <Text style={styles.warningText}>{children}</Text>
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
      
      {/* Card Box for Practical Test */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>💡 Practical Test</Text>
        <Text style={styles.cardText}>
          Take your last filed accounts, add profits earned since then, subtract any losses, subtract estimated Corporation Tax, and subtract any dividends already paid. The result is what you can pay.
        </Text>
      </View>

      {/* Section 2 */}
      <SectionHeader number="2" title="Interim vs. Final Dividends" />
      <Text style={styles.paragraph}>
        Most small companies pay Interim Dividends. Here is the process:
      </Text>
      <View style={styles.checklistContainer}>
        <ChecklistItem>Run the numbers: Confirm reserves are available.</ChecklistItem>
        <ChecklistItem>Decision: Directors hold a meeting (or sign a written minute).</ChecklistItem>
        <ChecklistItem>Voucher: Issue a dividend voucher to every shareholder.</ChecklistItem>
        <ChecklistItem>Pay it: Bank transfer is best for a clear audit trail.</ChecklistItem>
      </View>

      {/* Section 3 */}
      <SectionHeader number="3" title="The Paperwork Pack" />
      <Text style={styles.paragraph}>
        If HMRC asks questions, this is the "Minimum Pack" required:
      </Text>
      <View style={styles.checklistContainer}>
        <ChecklistItem checked>Dividend Calculation</ChecklistItem>
        <ChecklistItem checked>Board Minutes (or Written Resolution)</ChecklistItem>
        <ChecklistItem checked>Dividend Vouchers</ChecklistItem>
        <ChecklistItem checked>Bank Statement Evidence</ChecklistItem>
      </View>

      {/* Footer Page 1 */}
      <View style={{ marginTop: 'auto', alignItems: 'center', paddingTop: 15 }}>
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
        <WarningItem>
          <Text style={styles.warningTextBold}>s455 Tax (33.75%):</Text> Payable by the company if you owe it money 9 months after year-end. (Refundable when you repay the loan).
        </WarningItem>
        <WarningItem>
          <Text style={styles.warningTextBold}>Benefit in Kind:</Text> If you owe {'>'}{'\u00A0'}£10,000 at any point, it's a beneficial loan. You may need to file a P11D and pay Class 1A NICs.
        </WarningItem>
      </View>

      {/* Section 6 */}
      <SectionHeader number="6" title="Frequently Asked Questions" />
      <View style={styles.faqContainer}>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I pay monthly?</Text>
          <Text style={styles.faqAnswer}>Yes, if you have reserves and do the minutes + vouchers every time.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Unequal dividends?</Text>
          <Text style={styles.faqAnswer}>Only if you have different share classes or a valid waiver. Otherwise, it must be equal.</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.ctaTitle}>Automate Your Paperwork</Text>
        <Text style={styles.ctaSubtitle}>Generate compliant vouchers & minutes in seconds.</Text>
        <Link src="https://dividify.co.uk/get-started">
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Free Trial →</Text>
          </View>
        </Link>
        <Text style={styles.disclaimer}>
          Disclaimer: This guide is general information for UK companies. It does not cover complex scenarios like group structures or dividend waivers. Always seek professional advice if unsure.
        </Text>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 2 of 2</Text>
    </Page>
  </Document>
);
