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

// Styles matching the HTML exactly - Checklist uses tighter spacing
// Custom page size: A4 width (595pt) x taller height (950pt) for clean 2-page fit
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 35,
    paddingRight: 35,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    color: colors.textColor,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  
  // Header
  header: {
    marginBottom: 18,
  },
  mainLogo: {
    width: 110,
    height: 'auto',
    marginBottom: 8,
  },
  title: {
    color: colors.brandDark,
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    lineHeight: 1.2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  
  // Page 2 mini header
  miniHeader: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 15,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  // Intro box
  introBox: {
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  introText: {
    fontSize: 11,
    color: '#555555',
    marginBottom: 4,
  },
  introBold: {
    fontFamily: 'Helvetica-Bold',
  },
  introNote: {
    fontSize: 11,
    color: '#555555',
    fontStyle: 'italic',
  },
  
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 4,
  },
  sectionNumber: {
    backgroundColor: colors.brandPurple,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionNumberText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    color: colors.brandPurple,
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  
  // Checklist items
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    width: 13,
    height: 13,
    borderWidth: 2,
    borderColor: colors.checkboxBorder,
    borderRadius: 3,
    marginRight: 10,
    marginTop: 1,
  },
  checklistText: {
    flex: 1,
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  checklistBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Card box
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 6,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 10,
    color: colors.brandPurple,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 1.35,
  },
  
  // Warning container
  warningContainer: {
    borderWidth: 1,
    borderColor: colors.warningRedBorder,
    backgroundColor: colors.warningRedBg,
    borderRadius: 6,
    padding: 10,
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
    color: colors.warningRedText,
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  warningBullet: {
    color: colors.warningRedBorder,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginRight: 6,
    width: 12,
  },
  warningText: {
    flex: 1,
    color: '#822727',
    fontSize: 10,
    lineHeight: 1.35,
  },
  warningTextBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Notes section
  noteItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  noteBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Footer
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.textColor,
    marginBottom: 5,
  },
  ctaSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 8,
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 8,
    marginBottom: 6,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },
  disclaimer: {
    fontSize: 8,
    color: '#999999',
    lineHeight: 1.3,
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
    maxWidth: 380,
  },
  footerLogoCenter: {
    width: 18,
    height: 'auto',
    opacity: 0.8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 12,
    right: 18,
    fontSize: 9,
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

const ChecklistItem = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.checklistItem}>
    <View style={styles.checkbox} />
    <Text style={styles.checklistText}>
      <Text style={styles.checklistBold}>{title}: </Text>
      {description}
    </Text>
  </View>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.bulletItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
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

const NoteItem = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.noteItem}>
    <Text style={styles.noteText}>
      <Text style={styles.noteBold}>{title}: </Text>
      {description}
    </Text>
  </View>
);

export const DividendComplianceChecklistPDF = () => (
  <Document>
    {/* Page 1 - Custom size: A4 width x taller height */}
    <Page size={[595, 950]} style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={mainLogo} style={styles.mainLogo} />
      </View>

      <Text style={styles.title}>Dividend Compliance Checklist</Text>
      <Text style={styles.subtitle}>Management Made Simple for UK Directors</Text>

      {/* Intro Box */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          <Text style={styles.introBold}>Overview:</Text> Follow this compliance flow to ensure your dividends are legal and HMRC-compliant.
        </Text>
        <Text style={styles.introNote}>Note: This does not constitute tax advice.</Text>
      </View>

      {/* Section 1 - Before You Declare */}
      <SectionHeader number="1" title="Before You Declare" />
      
      <ChecklistItem 
        title="Confirm Distributable Reserves"
        description="Ensure the company has retained profits. You generally cannot pay dividends from capital or future income."
      />
      <ChecklistItem 
        title="Check Share Structure"
        description="Verify ordinary shares vs. different classes in your Articles of Association. Make sure the plan matches rights."
      />
      <ChecklistItem 
        title="Determine Dividend Type"
        description="Decide if this is an interim (board decision) or final (shareholder approval) dividend."
      />
      <ChecklistItem 
        title="Ensure Fairness"
        description="Confirm the dividend is correctly allocated. Unequal payments usually require separate share classes or waivers."
      />
      <ChecklistItem 
        title="Director's Loans"
        description="If clearing an overdrawn DLA, ensure paperwork supports it and profits exist."
      />

      {/* Section 2 - Declare It Properly */}
      <SectionHeader number="2" title="Declare It Properly" />
      
      <ChecklistItem 
        title="Hold a Board Meeting"
        description="Record the dividend type, total amount, amount per share, record date, and payment date."
      />
      <ChecklistItem 
        title="Shareholder Approval"
        description="Obtain a written resolution if declaring a Final Dividend."
      />
      <ChecklistItem 
        title="Prepare Dividend Vouchers"
        description="Create a voucher for every shareholder."
      />

      {/* Card Box - Dividend Voucher Requirements */}
      <View style={styles.cardBox}>
        <Text style={styles.cardTitle}>📄 Dividend Voucher Requirements</Text>
        <BulletItem>Company Name & Registration Number</BulletItem>
        <BulletItem>Shareholder Name & Address</BulletItem>
        <BulletItem>Date of Payment (or Declaration)</BulletItem>
        <BulletItem>Gross Dividend Amount & Share Class</BulletItem>
        <BulletItem>Director's Signature</BulletItem>
      </View>

      {/* Footer Page 1 */}
      <View style={styles.footer}>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 1 of 2</Text>
    </Page>

    {/* Page 2 - Custom size: A4 width x taller height */}
    <Page size={[595, 950]} style={styles.page}>
      {/* Page 2 Header */}
      <Text style={styles.miniHeader}>Dividend Compliance Checklist | Page 2</Text>

      {/* Section 3 - Pay and Record */}
      <SectionHeader number="3" title="Pay and Record" />
      
      <ChecklistItem 
        title="Make the Payment"
        description="Use bank transfer for a clear audit trail. Ensure it matches the minutes exactly."
      />
      <ChecklistItem 
        title="Post Bookkeeping"
        description="Debit retained earnings; Credit dividends payable (then clear when paid)."
      />
      <ChecklistItem 
        title="Archive Documents"
        description="Store minutes, vouchers, and bank proof together."
      />
      <ChecklistItem 
        title="Not Payroll"
        description="Do not treat this as salary. Dividends are not payroll items."
      />

      {/* Warning Section */}
      <View style={styles.warningContainer}>
        <View style={styles.warningHeader}>
          <Text style={styles.warningIcon}>⚠</Text>
          <Text style={styles.warningTitle}>Common Mistakes to Avoid</Text>
        </View>
        <WarningItem 
          title="Illegal Dividends"
          description="Paying dividends when there are no retained profits (or when losses wipe out reserves)."
        />
        <WarningItem 
          title="Backdating Paperwork"
          description="Creating minutes or vouchers months later to match random cash withdrawals."
        />
        <WarningItem 
          title="Unequal Payments"
          description="Paying different amounts to shareholders holding the same share class without a waiver."
        />
        <WarningItem 
          title="Mixing Drawings & Dividends"
          description="Treating company money as a personal wallet without formal declaration steps."
        />
        <WarningItem 
          title="Ignoring Personal Tax"
          description="Forgetting that dividends are paid gross, so you must save for Self Assessment."
        />
      </View>

      {/* Section 5 - Handy Notes */}
      <SectionHeader number="5" title="Handy Notes for Directors" />
      
      <NoteItem 
        title="Corporation Tax"
        description="Dividends are paid from post-tax profits. Always set aside Corporation Tax before calculating what is available to withdraw."
      />
      <NoteItem 
        title="Consistency is Key"
        description="Your board minutes, vouchers, and bank statement dates must all align perfectly."
      />
      <NoteItem 
        title="Routine"
        description="If you pay monthly, establish a 'Month End' routine: Management Accounts → Minutes → Voucher → Pay."
      />

      {/* CTA Footer */}
      <View style={styles.footer}>
        <Text style={styles.ctaTitle}>Need Professional Templates?</Text>
        <Text style={styles.ctaSubtitle}>Generate compliant vouchers & minutes in seconds.</Text>
        <Link src="https://dividify.co.uk/get-started">
          <View style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Start Free Trial →</Text>
          </View>
        </Link>
        <Text style={styles.disclaimer}>
          Disclaimer: This checklist is for general information only. It does not cover complex scenarios like group structures or dividend waivers. Always seek professional advice if unsure.
        </Text>
        <Link src="https://dividify.co.uk">
          <Image src={iconLogo} style={styles.footerLogoCenter} />
        </Link>
      </View>
      <Text style={styles.pageNumber}>Page 2 of 2</Text>
    </Page>
  </Document>
);

export default DividendComplianceChecklistPDF;
