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

// Styles matching the HTML exactly - Guide uses reduced spacing for 2-page fit
// Custom page size: A4 width (595pt) x taller height (950pt) for clean 2-page fit
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    color: colors.textColor,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Header
  header: {
    marginBottom: 25,
  },
  mainLogo: {
    width: 120,
    height: 'auto',
    marginBottom: 10,
  },
  title: {
    color: colors.brandDark,
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 15,
  },
  
  // Page 2 mini header
  miniHeader: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  statValue: {
    color: colors.brandPurple,
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 9,
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
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 25,
  },
  introTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 6,
  },
  introText: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 6,
  },
  sectionNumber: {
    backgroundColor: colors.brandPurple,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    color: colors.brandPurple,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  
  // Paragraph text
  paragraph: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  
  // Checklist items (unchecked)
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: colors.checkboxBorder,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
  },
  // Checked checkbox
  checkboxChecked: {
    width: 14,
    height: 14,
    backgroundColor: colors.brandPurple,
    borderWidth: 2,
    borderColor: colors.brandPurple,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  checklistText: {
    flex: 1,
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 1.5,
  },
  
  // Card box (Practical Test)
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 1.45,
  },
  
  // Table
  table: {
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.brandPurple,
  },
  tableHeaderCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 11,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 11,
    color: colors.textColor,
  },
  tableNote: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
  },
  
  // Warning container
  warningContainer: {
    borderWidth: 2,
    borderColor: colors.warningRedBorder,
    backgroundColor: colors.warningRedBg,
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warningIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  warningTitle: {
    color: colors.warningRedText,
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  warningBullet: {
    color: colors.warningRedBorder,
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
    marginTop: 1,
    width: 12,
  },
  warningText: {
    flex: 1,
    color: '#822727',
    fontSize: 11,
    lineHeight: 1.4,
  },
  warningTextBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // FAQ section
  faqItem: {
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 1.45,
  },
  
  // Footer
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 14,
    paddingBottom: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 5,
  },
  ctaSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 25,
    marginBottom: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  disclaimer: {
    fontSize: 9,
    color: '#999999',
    lineHeight: 1.4,
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
    maxWidth: 420,
  },
  footerLogoCenter: {
    width: 20,
    height: 'auto',
    opacity: 0.8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 50,
    fontSize: 10,
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
    {/* Page 1 - Custom size: A4 width x taller height */}
    <Page size={[595, 950]} style={styles.page}>
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

    {/* Page 2 - Custom size: A4 width x taller height */}
    <Page size={[595, 950]} style={styles.page}>
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
