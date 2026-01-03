import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link, Image } from '@react-pdf/renderer';
import mainLogo from '@/assets/dividify-main-logo.png';
import iconLogo from '@/assets/dividify-icon-logo.png';

// Dividify brand colors (purple theme)
const colors = {
  primary: '#6B46C1', // Purple
  primaryLight: '#9F7AEA',
  background: '#FAFAFA',
  text: '#1A1A2E',
  textMuted: '#64748B',
  border: '#E2E8F0',
  success: '#22C55E',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingTop: 30,
    paddingBottom: 60,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    alignItems: 'center',
  },
  mainLogo: {
    width: 140,
    height: 40,
    marginBottom: 2,
  },
  tagline: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.text,
    marginTop: 4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    backgroundColor: colors.primary,
    padding: 5,
    paddingLeft: 10,
    marginBottom: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  subsectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  checkbox: {
    width: 9,
    height: 9,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
  },
  checklistText: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.35,
  },
  infoBox: {
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 3,
    marginTop: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  infoBoxTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginBottom: 3,
  },
  infoBoxText: {
    fontSize: 7,
    color: colors.text,
    lineHeight: 1.35,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingLeft: 2,
  },
  bullet: {
    width: 8,
    fontSize: 7,
    color: colors.primary,
  },
  bulletText: {
    flex: 1,
    fontSize: 7,
    color: colors.text,
    lineHeight: 1.3,
  },
  mistakeItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  mistakeIcon: {
    width: 10,
    fontSize: 8,
    color: '#EF4444',
    marginRight: 4,
  },
  mistakeText: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.35,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 4,
  },
  tipIcon: {
    width: 10,
    fontSize: 8,
    color: colors.success,
    marginRight: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.35,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerIconLogo: {
    width: 20,
    height: 20,
  },
  footerText: {
    fontSize: 8,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 8,
    color: colors.primary,
    textDecoration: 'none',
  },
  pageNumber: {
    fontSize: 8,
    color: colors.textMuted,
  },
  disclaimer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 3,
  },
  disclaimerText: {
    fontSize: 7,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  ctaBox: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  ctaTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 8,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  ctaLink: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textDecoration: 'underline',
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

const MistakeItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.mistakeItem}>
    <Text style={styles.mistakeIcon}>✗</Text>
    <Text style={styles.mistakeText}>{children}</Text>
  </View>
);

const TipItem = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipIcon}>✓</Text>
    <Text style={styles.tipText}>{children}</Text>
  </View>
);

const Header = () => (
  <View style={styles.header}>
    <Image src={mainLogo} style={styles.mainLogo} />
    <Text style={styles.tagline}>Dividend Management Made Simple</Text>
  </View>
);

const Footer = ({ pageNumber }: { pageNumber: number }) => (
  <View style={styles.footer}>
    <Image src={iconLogo} style={styles.footerIconLogo} />
    <Link src="https://dividify.co.uk" style={styles.footerLink}>dividify.co.uk</Link>
    <Text style={styles.pageNumber}>Page {pageNumber}</Text>
  </View>
);

export const DividendComplianceChecklistPDF = () => (
  <Document>
    {/* Page 1 - Sections 1, 2, and 3 */}
    <Page size="A4" style={styles.page}>
      <Header />

      <Text style={styles.title}>Dividend Compliance Checklist</Text>
      <Text style={styles.subtitle}>
        A quick-reference checklist to help UK limited company directors pay dividends properly — with the right paperwork and the right order of steps.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>What this covers</Text>
        <Text style={styles.infoBoxText}>
          Interim & final dividends, distributable reserves, board minutes, dividend vouchers, and the most common mistakes.
        </Text>
        <Text style={{ ...styles.infoBoxTitle, marginTop: 4 }}>What this is not</Text>
        <Text style={styles.infoBoxText}>
          Personal tax planning advice. Use this as a compliance checklist and consult your accountant if anything is unclear.
        </Text>
      </View>

      {/* Section 1 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1) Before You Declare a Dividend</Text>
        </View>
        
        <ChecklistItem>
          Confirm the company has distributable reserves (retained profits). You generally cannot pay dividends from capital or future hoped-for income.
        </ChecklistItem>
        <ChecklistItem>
          Check the Articles of Association and share structure (ordinary vs different classes). Make sure the dividend you plan to pay matches the rights of each share class.
        </ChecklistItem>
        <ChecklistItem>
          Decide whether this is an interim dividend (board decision) or a final dividend (typically recommended by directors and approved by shareholders).
        </ChecklistItem>
        <ChecklistItem>
          Ensure the dividend is fair and correctly allocated across shareholders. Unequal payments usually require different share classes or a lawful waiver process.
        </ChecklistItem>
        <ChecklistItem>
          If you are using the dividend to clear an overdrawn director's loan account, make sure the paperwork still supports it (minute + voucher) and that the company has profits.
        </ChecklistItem>
      </View>

      {/* Section 2 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>2) Declare It Properly (Decision + Paperwork)</Text>
        </View>
        
        <ChecklistItem>
          Hold a directors' meeting (or written resolution) and record: dividend type (interim/final), total amount, amount per share, record date, payment date, and which shareholders are entitled.
        </ChecklistItem>
        <ChecklistItem>
          If it's a final dividend, obtain shareholder approval (written resolution is common for small companies).
        </ChecklistItem>
        <ChecklistItem>
          Prepare a dividend voucher for each shareholder (including directors).
        </ChecklistItem>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Dividend Voucher — Minimum Details</Text>
          <BulletItem>Company name and registration number</BulletItem>
          <BulletItem>Shareholder name and address</BulletItem>
          <BulletItem>Date of payment (or date declared, if you show both)</BulletItem>
          <BulletItem>Dividend amount (gross) and share class / number of shares (optional but helpful)</BulletItem>
          <BulletItem>Signature (director / company secretary) and a reference number (optional)</BulletItem>
        </View>
      </View>

      {/* Section 3 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>3) Pay and Record It Correctly</Text>
        </View>
        
        <ChecklistItem>
          Make the payment (bank transfer is easiest for audit trail) and ensure it matches what was declared.
        </ChecklistItem>
        <ChecklistItem>
          Post the bookkeeping entries: dividend debited to retained earnings / reserves and credited to dividends payable (then cleared when paid).
        </ChecklistItem>
        <ChecklistItem>
          Keep the supporting documents together: management accounts, minutes/resolutions, vouchers, bank evidence, and shareholder approval (if final dividend).
        </ChecklistItem>
        <ChecklistItem>
          If the payment is to a director personally, make sure you do not accidentally treat it as salary. Dividends are not payroll items.
        </ChecklistItem>
      </View>

      <Footer pageNumber={1} />
    </Page>

    {/* Page 2 - Sections 4, 5, CTA and Disclaimer */}
    <Page size="A4" style={styles.page}>
      <Header />

      {/* Section 4 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>4) Common Mistakes to Avoid</Text>
        </View>
        
        <MistakeItem>
          Paying dividends when there are no profits (or losses wipe out reserves).
        </MistakeItem>
        <MistakeItem>
          Backdating minutes or creating vouchers after the fact to match payments already made.
        </MistakeItem>
        <MistakeItem>
          Unequal dividends between shareholders without the correct share classes or waivers.
        </MistakeItem>
        <MistakeItem>
          Mixing drawings and dividends (calling personal spending a dividend without the required steps).
        </MistakeItem>
        <MistakeItem>
          Forgetting the personal tax: the company doesn't deduct tax at source for dividends, so directors should budget for their Self Assessment bill.
        </MistakeItem>
      </View>

      {/* Section 5 */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>5) Handy Notes for Directors</Text>
        </View>
        
        <TipItem>
          Dividends are paid from post-tax profits. If the company has corporation tax due, factor that in when assessing reserves.
        </TipItem>
        <TipItem>
          Keep the story consistent: the minutes, vouchers, and bank payments should all line up (dates and amounts).
        </TipItem>
        <TipItem>
          If you're planning regular monthly dividends, keep a simple routine: monthly management accounts + minutes + vouchers + payment.
        </TipItem>
      </View>

      {/* CTA Box */}
      <View style={styles.ctaBox}>
        <Text style={styles.ctaTitle}>Need Templates?</Text>
        <Text style={styles.ctaText}>
          Dividify provides professional dividend vouchers, board minutes, and written resolutions — all in one place.
        </Text>
        <Link src="https://dividify.co.uk" style={styles.ctaLink}>
          Get Started at dividify.co.uk
        </Link>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Disclaimer: This checklist is general information for UK companies. It does not cover every scenario (for example, different share classes, dividend waivers, or complex group structures). If you are unsure, get professional advice before paying dividends.
        </Text>
      </View>

      <Footer pageNumber={2} />
    </Page>
  </Document>
);
