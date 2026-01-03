import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import mainLogo from '@/assets/dividify-main-logo.png';
import iconLogo from '@/assets/dividify-icon-logo.png';

// Brand colors matching the HTML design exactly
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
  textLight: '#444444',
  borderLight: '#eeeeee',
  borderMedium: '#e0d4fc',
  checkboxBorder: '#cbd5e0',
};

// Styles matching the HTML exactly - Guide uses 50px 60px padding
const styles = StyleSheet.create({
  // Page layout - A4 with 50px 60px padding
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 60,
    paddingRight: 60,
    fontFamily: 'Helvetica',
    fontSize: 15,
    lineHeight: 1.6,
    color: colors.textColor,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
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
    color: colors.brandDark,
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    lineHeight: 1.2,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 20,
  },
  
  // Page 2 mini header
  miniHeader: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 25,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.borderLight,
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
    lineHeight: 1.2,
  },
  
  // Intro box (Golden Rules)
  introBox: {
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 25,
    marginBottom: 35,
  },
  introTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
    lineHeight: 1.5,
  },
  
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  sectionNumber: {
    backgroundColor: colors.brandPurple,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    color: colors.brandPurple,
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
  },
  
  // Paragraph text
  paragraph: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 15,
    lineHeight: 1.6,
  },
  
  // Checklist items (unchecked)
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: colors.checkboxBorder,
    borderRadius: 4,
    marginRight: 17,
    marginTop: 4,
  },
  // Checked checkbox
  checkboxChecked: {
    width: 18,
    height: 18,
    backgroundColor: colors.brandPurple,
    borderWidth: 2,
    borderColor: colors.brandPurple,
    borderRadius: 4,
    marginRight: 17,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 1.6,
  },
  
  // Card box (Practical Test)
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 1.6,
  },
  
  // Table
  table: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.brandPurple,
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: colors.textColor,
  },
  tableNote: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 10,
    fontStyle: 'italic',
  },
  
  // Warning container
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
    color: colors.warningRedText,
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  warningBullet: {
    color: colors.warningRedBorder,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginRight: 10,
    marginTop: 2,
    width: 15,
  },
  warningText: {
    flex: 1,
    color: '#822727',
    fontSize: 14,
    lineHeight: 1.4,
  },
  warningTextBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // FAQ section
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 1.5,
  },
  
  // Footer
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 15,
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginBottom: 10,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
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

// Helper Components
const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumber}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const ChecklistItem = ({ text, checked = false }: { text: string; checked?: boolean }) => (
  <View style={styles.checklistItem}>
    {checked ? (
      <View style={styles.checkboxChecked}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    ) : (
      <View style={styles.checkbox} />
    )}
    <Text style={styles.checklistText}>{text}</Text>
  </View>
);

const WarningItem = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.warningItem}>
    <Text style={styles.warningBullet}>✖</Text>
    <Text style={styles.warningText}>
      <Text style={styles.warningTextBold}>{title}: </Text>
      {description}
    </Text>
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
      <Text style={styles.subtitle}>Everything you need to know about paying dividends in 2025/26.</Text>

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

      {/* Golden Rules Box */}
      <View style={styles.introBox}>
        <Text style={styles.introTitle}>The Golden Rules:</Text>
        <Text style={styles.introText}>1. Dividends can only be paid from distributable profits (after tax).</Text>
        <Text style={styles.introText}>2. You must have paperwork: Minutes + Vouchers.</Text>
        <Text style={styles.introText}>3. No tax is deducted at source; you pay it via Self Assessment.</Text>
      </View>

      {/* Section 1: Profits & Distributable Reserves */}
      <SectionHeader number="1" title="Profits & Distributable Reserves" />
      <Text style={styles.paragraph}>
        Before declaring a dividend, you must confirm the company has enough "Distributable Reserves" (Retained Earnings). You cannot pay dividends from capital or future hoped-for income.
      </Text>
      
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>💡 Practical Test</Text>
        <Text style={styles.cardText}>
          Take your last filed accounts, add profits earned since then, subtract any losses, subtract estimated Corporation Tax, and subtract any dividends already paid. The result is what you can pay.
        </Text>
      </View>

      {/* Section 2: Interim vs. Final Dividends */}
      <SectionHeader number="2" title="Interim vs. Final Dividends" />
      <Text style={styles.paragraph}>
        Most small companies pay Interim Dividends. Here is the process:
      </Text>
      
      <ChecklistItem text="Run the numbers: Confirm reserves are available." />
      <ChecklistItem text="Decision: Directors hold a meeting (or sign a written minute)." />
      <ChecklistItem text="Voucher: Issue a dividend voucher to every shareholder." />
      <ChecklistItem text="Pay it: Bank transfer is best for a clear audit trail." />

      {/* Section 3: The Paperwork Pack */}
      <SectionHeader number="3" title="The Paperwork Pack" />
      <Text style={styles.paragraph}>
        If HMRC asks questions, this is the "Minimum Pack" required:
      </Text>
      
      <ChecklistItem text="Dividend Calculation" checked />
      <ChecklistItem text="Board Minutes (or Written Resolution)" checked />
      <ChecklistItem text="Dividend Vouchers" checked />
      <ChecklistItem text="Bank Statement Evidence" checked />

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
      <Text style={styles.miniHeader}>UK Dividend Guide 2025/26 | Page 2</Text>

      {/* Section 4: Tax on Dividends */}
      <SectionHeader number="4" title="Tax on Dividends (Worked Examples)" />
      <Text style={styles.paragraph}>
        Dividends sit on top of your other income. You use your Personal Allowance (£12,570) first, then the £500 Dividend Allowance, then pay tax on the rest.
      </Text>

      {/* Tax Table */}
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
        <View style={styles.tableRowAlt}>
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
      <Text style={styles.tableNote}>
        *Rates for 2025/26. Basic rate: 8.75% | Higher: 33.75% | Additional: 39.35%
      </Text>

      {/* Section 5: Director's Loan Accounts */}
      <SectionHeader number="5" title="Director's Loan Accounts (DLA)" />
      <Text style={styles.paragraph}>
        If you take money that isn't salary or dividend, it goes to your DLA. You can clear an overdrawn DLA with a dividend, but the paperwork must be correct.
      </Text>

      {/* Warning Container */}
      <View style={styles.warningContainer}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningTitle}>Two Major Tax Traps</Text>
        </View>
        <WarningItem 
          title="s455 Tax (33.75%)"
          description="Payable by the company if you owe it money 9 months after year-end. (Refundable when you repay the loan)."
        />
        <WarningItem 
          title="Benefit in Kind"
          description="If you owe >£10,000 at any point, it's a beneficial loan. You may need to file a P11D and pay Class 1A NICs."
        />
      </View>

      {/* Section 6: FAQs */}
      <SectionHeader number="6" title="Frequently Asked Questions" />
      
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Can I pay monthly?</Text>
        <Text style={styles.faqAnswer}>Yes, if you have reserves and do the minutes + vouchers every time.</Text>
      </View>
      <View style={styles.faqItem}>
        <Text style={styles.faqQuestion}>Unequal dividends?</Text>
        <Text style={styles.faqAnswer}>Only if you have different share classes or a valid waiver. Otherwise, it must be equal.</Text>
      </View>

      {/* CTA Footer */}
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

export default UKDividendGuidePDF;
