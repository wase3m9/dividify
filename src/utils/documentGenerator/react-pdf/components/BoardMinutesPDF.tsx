import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { BoardMinutesData } from '../../types';
import { getTemplate } from '../templates';

interface BoardMinutesPDFProps {
  data: BoardMinutesData;
}

export const BoardMinutesPDF: React.FC<BoardMinutesPDFProps> = ({ data }) => {
  const template = getTemplate(data.templateStyle);
  const isPremium = ['executive', 'legal', 'corporateElite'].includes(data.templateStyle || '');
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: isPremium && data.templateStyle === 'executive' ? '#FAFAFA' : '#FFFFFF',
      padding: isPremium ? 40 : 30,
      fontFamily: isPremium ? 'Times-Roman' : 'Helvetica',
    },
    header: {
      marginBottom: isPremium ? 40 : 30,
      borderBottom: isPremium ? `3pt solid ${template.colors.primary}` : `2pt solid ${template.colors.primary}`,
      paddingBottom: isPremium ? 20 : 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.primary,
        marginHorizontal: -40,
        marginTop: -40,
        paddingHorizontal: 40,
        paddingTop: 30,
        marginBottom: 50,
      }),
    },
    headerContent: {
      flex: 1,
    },
    logo: {
      width: 60,
      height: 60,
      objectFit: 'contain',
    },
    title: {
      fontSize: template.fonts.title,
      fontWeight: 'bold',
      color: isPremium && data.templateStyle === 'executive' ? template.colors.accent : template.colors.primary,
      textAlign: 'center',
      marginBottom: isPremium ? 15 : 10,
      ...(isPremium && data.templateStyle === 'executive' && {
        color: template.colors.accent,
        textTransform: 'uppercase',
        letterSpacing: 2,
      }),
    },
    subtitle: {
      fontSize: template.fonts.heading,
      textAlign: 'center',
      color: template.colors.text,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: template.fonts.heading,
      fontWeight: 'bold',
      color: isPremium ? template.colors.accent : template.colors.text,
      marginBottom: isPremium ? 12 : 8,
      backgroundColor: isPremium && data.templateStyle === 'executive' ? template.colors.primary : template.colors.secondary,
      padding: isPremium ? 8 : 5,
      ...(isPremium && data.templateStyle === 'legal' && {
        borderLeft: `4pt solid ${template.colors.accent}`,
        paddingLeft: 12,
        backgroundColor: 'transparent',
      }),
      ...(isPremium && data.templateStyle === 'corporateElite' && {
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: template.colors.primary,
      }),
    },
    paragraph: {
      fontSize: template.fonts.body,
      lineHeight: 1.5,
      marginBottom: 10,
      color: template.colors.text,
    },
    list: {
      marginLeft: 15,
      marginBottom: 10,
    },
    listItem: {
      fontSize: template.fonts.body,
      marginBottom: 3,
      color: template.colors.text,
    },
    signatureSection: {
      marginTop: isPremium ? 60 : 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...(isPremium && {
        borderTop: `2pt solid ${template.colors.accent}`,
        paddingTop: 20,
      }),
    },
    signatureBox: {
      width: '45%',
      borderTop: isPremium ? `2pt solid ${template.colors.accent}` : `1pt solid ${template.colors.accent}`,
      paddingTop: isPremium ? 10 : 5,
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.secondary,
        padding: 10,
        borderTop: 'none',
        border: `1pt solid ${template.colors.accent}`,
      }),
    },
    signatureLabel: {
      fontSize: template.fonts.small,
      textAlign: 'center',
      color: template.colors.accent,
    },
    signatureName: {
      fontFamily: 'GreatVibes',
      fontSize: 24,
      textAlign: 'center',
      color: '#1a365d',
      marginBottom: 4,
    },
    signatureDateText: {
      fontSize: template.fonts.body,
      textAlign: 'center',
      color: template.colors.text,
      marginBottom: 4,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: template.fonts.small,
      color: template.colors.accent,
      borderTop: isPremium ? `2pt solid ${template.colors.accent}` : `1pt solid ${template.colors.accent}`,
      paddingTop: isPremium ? 15 : 10,
      ...(isPremium && data.templateStyle === 'executive' && {
        backgroundColor: template.colors.primary,
        color: template.colors.accent,
        marginHorizontal: -40,
        paddingHorizontal: 40,
        marginBottom: -40,
        paddingBottom: 40,
      }),
    },
    watermark: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) rotate(-45deg)',
      fontSize: 60,
      color: template.colors.secondary,
      opacity: 0.1,
      zIndex: -1,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {isPremium && (
          <Text style={styles.watermark}>PREMIUM</Text>
        )}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>BOARD MINUTES</Text>
            <Text style={styles.subtitle}>Dividend Declaration Meeting</Text>
          </View>
          {data.logoUrl && (
            <Image style={styles.logo} src={data.logoUrl} />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Information</Text>
          <Text style={styles.paragraph}>
            Company: {data.companyName}
          </Text>
          <Text style={styles.paragraph}>
            Date of Meeting: {format(new Date(data.boardDate), 'dd/MM/yyyy')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Directors Present</Text>
          <View style={styles.list}>
            {data.directorsPresent.map((director, index) => (
              <Text key={index} style={styles.listItem}>
                • {director}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolutions</Text>
          <Text style={styles.paragraph}>
            IT WAS RESOLVED that a dividend be declared and paid to shareholders as follows:
          </Text>
          <Text style={styles.paragraph}>
            • Dividend per share: £{data.dividendPerShare.toFixed(4)}
          </Text>
          <Text style={styles.paragraph}>
            • Total dividend amount: £{data.totalDividend.toFixed(2)}
          </Text>
          <Text style={styles.paragraph}>
            • Payment date: {format(new Date(data.paymentDate), 'dd/MM/yyyy')}
          </Text>
          <Text style={styles.paragraph}>
            The dividend shall be paid to all shareholders on the register at the close of business on the record date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusion</Text>
          <Text style={styles.paragraph}>
            There being no further business, the meeting was closed.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            {data.chairmanSignatureName ? (
              <>
                <Text style={styles.signatureName}>{data.chairmanSignatureName}</Text>
                <Text style={styles.signatureLabel}>Chairman</Text>
              </>
            ) : (
              <Text style={styles.signatureLabel}>Chairman Signature</Text>
            )}
          </View>
          <View style={styles.signatureBox}>
            {data.signatureDate ? (
              <>
                <Text style={styles.signatureDateText}>{format(new Date(data.signatureDate), 'dd/MM/yyyy')}</Text>
                <Text style={styles.signatureLabel}>Date</Text>
              </>
            ) : (
              <Text style={styles.signatureLabel}>Date</Text>
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          {isPremium && "PREMIUM DOCUMENT • "}
          {data.accountantFirmName 
            ? `These board minutes were prepared by ${data.accountantFirmName} and recorded in accordance with the Companies Act 2006.`
            : `These minutes were approved at the board meeting held on ${format(new Date(data.boardDate), 'dd/MM/yyyy')}.`
          }
          {isPremium && " • Professional Grade Documentation"}
        </Text>
      </Page>
    </Document>
  );
};