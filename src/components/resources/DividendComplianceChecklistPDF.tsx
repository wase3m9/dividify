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
    padding: 40,
    paddingLeft: 50,
    paddingRight: 50,
    paddingBottom: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 11,
    lineHeight: 1.4,
    position: 'relative',
  },
  
  // Header
  header: {
    marginBottom: 20,
  },
  mainLogo: {
    width: 120,
    height: 'auto',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
    marginTop: 3,
    marginBottom: 3,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: 500,
    marginBottom: 12,
  },
  
  // Intro Box
  introBox: {
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.introBorder,
    borderRadius: 6,
    padding: 12,
    marginBottom: 18,
  },
  introText: {
    fontSize: 10,
    color: '#555555',
    lineHeight: 1.4,
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: 5,
    marginTop: 14,
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
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
  },
  
  // Checklist Items
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 0,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: '#cbd5e0',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
  },
  checklistText: {
    flex: 1,
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.4,
  },
  
  // Card Box
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: colors.brandPurple,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: colors.textColor,
    lineHeight: 1.3,
  },
  
  // Warning Container
  warningContainer: {
    borderWidth: 1.5,
    borderColor: colors.warningRedBorder,
    backgroundColor: colors.warningRedBg,
    borderRadius: 6,
    padding: 12,
    marginTop: 14,
    marginBottom: 14,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  warningTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.warningRedText,
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 0,
  },
  warningItemIcon: {
    width: 16,
    fontSize: 10,
    color: colors.warningRedBorder,
    fontFamily: 'Helvetica-Bold',
  },
  warningItemText: {
    flex: 1,
    fontSize: 9,
    color: '#822727',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  
  // Tip Items (green checkmarks)
  tipItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tipIcon: {
    width: 14,
    fontSize: 10,
    color: colors.successGreen,
    fontFamily: 'Helvetica-Bold',
  },
  tipText: {
    flex: 1,
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.4,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 12,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 6,
  },
  ctaButtonText: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 8,
    color: '#999999',
    lineHeight: 1.3,
    marginTop: 10,
    marginBottom: 6,
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
    right: 50,
    fontSize: 9,
    color: '#cccccc',
  },
});

const ChecklistItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.checklistItem}>
    <View style={styles.checkbox} />
    <Text style={styles.checklistText}>{children}</Text>
  </View>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bulletItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const WarningItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.warningItem}>
    <Text style={styles.warningItemIcon}>✖</Text>
    <Text style={styles.warningItemText}>{children}</Text>
  </View>
);

const TipItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipIcon}>✓</Text>
    <Text style={styles.tipText}>{children}</Text>
  </View>
);

const SectionHeader = ({ number, title }: { number: string; title: string }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumber}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </View>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

export const DividendComplianceChecklistPDF = () => (
  <Document>
    {/* Page 1 - Header, Intro, Sections 1 and 2 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={mainLogo} style={styles.mainLogo} />
      </View>

      <Text style={styles.title}>Dividend Compliance Checklist</Text>
      <Text style={styles.subtitle}>
        Your essential guide to paying dividends correctly in 2025/26
      </Text>

      {/* Intro Box */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          This checklist helps UK limited company directors pay dividends legally and with the correct paperwork. 
          It covers distributable reserves, board minutes, dividend vouchers, and common pitfalls to avoid.
        </Text>
      </View>

      {/* Section 1 */}
      <SectionHeader number="1" title="Before You Declare" />
      
      <ChecklistItem>
        Confirm the company has distributable reserves (retained profits after tax).
      </ChecklistItem>
      <ChecklistItem>
        Check the Articles of Association and share structure (ordinary vs different classes).
      </ChecklistItem>
      <ChecklistItem>
        Decide whether this is an interim dividend (board decision) or a final dividend (shareholder approval required).
      </ChecklistItem>
      <ChecklistItem>
        Ensure the dividend is correctly allocated across shareholders based on shareholding.
      </ChecklistItem>
      <ChecklistItem>
        If clearing a director's loan account, ensure proper paperwork supports it.
      </ChecklistItem>

      {/* Section 2 */}
      <SectionHeader number="2" title="Declare It Properly" />
      
      <ChecklistItem>
        Hold a directors' meeting and record: dividend type, total amount, amount per share, record date, and payment date.
      </ChecklistItem>
      <ChecklistItem>
        For final dividends, obtain shareholder approval (written resolution is common).
      </ChecklistItem>
      <ChecklistItem>
        Prepare a dividend voucher for each shareholder (including directors).
      </ChecklistItem>

      {/* Card Box */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>Dividend Voucher — Minimum Details</Text>
        <BulletItem>Company name and registration number</BulletItem>
        <BulletItem>Shareholder name and address</BulletItem>
        <BulletItem>Date of payment and dividend amount (gross)</BulletItem>
        <BulletItem>Share class and number of shares held</BulletItem>
        <BulletItem>Director signature and reference number</BulletItem>
      </View>

      {/* Footer Page 1 */}
      <View style={styles.footer}>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 1</Text>
    </Page>

    {/* Page 2 - Sections 3, 4, 5, CTA */}
    <Page size="A4" style={styles.page}>
      {/* Section 3 */}
      <SectionHeader number="3" title="Pay and Record Correctly" />
      
      <ChecklistItem>
        Make the payment (bank transfer is easiest for audit trail) matching what was declared.
      </ChecklistItem>
      <ChecklistItem>
        Post the bookkeeping entries: debit retained earnings, credit dividends payable.
      </ChecklistItem>
      <ChecklistItem>
        Keep supporting documents together: management accounts, minutes, vouchers, bank evidence.
      </ChecklistItem>
      <ChecklistItem>
        If paying to a director, ensure it's not treated as salary. Dividends are not payroll items.
      </ChecklistItem>

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningTitle}>Common Mistakes to Avoid</Text>
        </View>
        <WarningItem>Paying dividends when there are no profits (or losses wipe out reserves).</WarningItem>
        <WarningItem>Backdating minutes or creating vouchers after the fact.</WarningItem>
        <WarningItem>Unequal dividends without correct share classes or waivers.</WarningItem>
        <WarningItem>Mixing drawings and dividends without proper documentation.</WarningItem>
        <WarningItem>Forgetting personal tax — budget for Self Assessment liability.</WarningItem>
      </View>

      {/* Section 4 - Handy Notes */}
      <SectionHeader number="4" title="Handy Notes for Directors" />
      
      <TipItem>
        Dividends are paid from post-tax profits. Factor in corporation tax when assessing reserves.
      </TipItem>
      <TipItem>
        Keep the story consistent: minutes, vouchers, and bank payments should all align.
      </TipItem>
      <TipItem>
        For regular monthly dividends: monthly management accounts + minutes + vouchers + payment.
      </TipItem>

      {/* CTA Section */}
      <View style={{ marginTop: 18, alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: colors.brandPurple, marginBottom: 5 }}>
          Need Templates?
        </Text>
        <Text style={{ fontSize: 10, color: colors.textColor, textAlign: 'center', marginBottom: 10 }}>
          Dividify provides professional dividend vouchers, board minutes, and written resolutions — all in one place.
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
          Disclaimer: This checklist is general information for UK companies. It does not cover every scenario. 
          If you are unsure, get professional advice before paying dividends.
        </Text>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 2</Text>
    </Page>
  </Document>
);
