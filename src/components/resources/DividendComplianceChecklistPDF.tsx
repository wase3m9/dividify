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
    marginBottom: 10,
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
    fontWeight: 500,
    marginBottom: 20,
  },
  page2Header: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  
  // Intro Box
  introBox: {
    backgroundColor: colors.brandLightPurple,
    borderWidth: 1,
    borderColor: colors.introBorder,
    borderRadius: 10,
    padding: '18 25',
    marginBottom: 35,
  },
  introText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 1.6,
  },
  introNote: {
    fontSize: 13,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
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
  
  // Checklist Items
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 18,
    paddingLeft: 0,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#cbd5e0',
    borderRadius: 4,
    marginRight: 14,
    marginTop: 2,
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: '#444444',
    lineHeight: 1.6,
  },
  checklistBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Card Box
  cardBox: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: '20 25',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
    marginBottom: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    width: 16,
    fontSize: 14,
    color: colors.brandPurple,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textColor,
    lineHeight: 1.5,
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
    fontSize: 20,
    marginRight: 10,
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
  warningItemIcon: {
    width: 24,
    fontSize: 14,
    color: colors.warningRedBorder,
    fontFamily: 'Helvetica-Bold',
  },
  warningItemText: {
    flex: 1,
    fontSize: 14,
    color: '#822727',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  warningItemBold: {
    fontFamily: 'Helvetica-Bold',
  },
  
  // Handy Notes Items
  noteItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    color: '#444444',
    lineHeight: 1.6,
  },
  noteBold: {
    fontFamily: 'Helvetica-Bold',
    color: colors.brandDark,
  },
  
  // CTA Section
  ctaSection: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: colors.brandPurple,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: colors.textColor,
    textAlign: 'center',
    marginBottom: 15,
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: colors.brandPurple,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: 10,
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
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  footerLogoCenter: {
    width: 25,
    height: 'auto',
    opacity: 0.8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 60,
    fontSize: 11,
    color: '#cccccc',
  },
});

const ChecklistItem = ({ title, description }: { title?: string; description: string }) => (
  <View style={styles.checklistItem}>
    <View style={styles.checkbox} />
    <Text style={styles.checklistText}>
      {title && <Text style={styles.checklistBold}>{title}: </Text>}
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
    <Text style={styles.warningItemIcon}>✖</Text>
    <Text style={styles.warningItemText}>
      <Text style={styles.warningItemBold}>{title}: </Text>
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
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image src={mainLogo} style={styles.mainLogo} />
      </View>

      <Text style={styles.title}>Dividend Compliance Checklist</Text>
      <Text style={styles.subtitle}>
        Management Made Simple for UK Directors
      </Text>

      {/* Intro Box */}
      <View style={styles.introBox}>
        <Text style={styles.introText}>
          <Text style={styles.checklistBold}>Overview:</Text> Follow this compliance flow to ensure your dividends are legal and HMRC-compliant.
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

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      {/* Page 2 Header */}
      <Text style={styles.page2Header}>Dividend Compliance Checklist | Page 2</Text>

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

      {/* CTA Section */}
      <View style={styles.ctaSection}>
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
