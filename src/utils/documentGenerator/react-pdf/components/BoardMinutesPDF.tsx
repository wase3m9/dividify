import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { BoardMinutesData } from '../types';
import { getTemplate } from '../templates';

interface BoardMinutesPDFProps {
  data: BoardMinutesData;
}

export const BoardMinutesPDF: React.FC<BoardMinutesPDFProps> = ({ data }) => {
  const template = getTemplate(data.templateStyle);
  
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Helvetica',
    },
    header: {
      marginBottom: 30,
      borderBottom: `2pt solid ${template.colors.primary}`,
      paddingBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      color: template.colors.primary,
      textAlign: 'center',
      marginBottom: 10,
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
      color: template.colors.text,
      marginBottom: 8,
      backgroundColor: template.colors.secondary,
      padding: 5,
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
      marginTop: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    signatureBox: {
      width: '45%',
      borderTop: `1pt solid ${template.colors.accent}`,
      paddingTop: 5,
    },
    signatureLabel: {
      fontSize: template.fonts.small,
      textAlign: 'center',
      color: template.colors.accent,
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: template.fonts.small,
      color: template.colors.accent,
      borderTop: `1pt solid ${template.colors.accent}`,
      paddingTop: 10,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
            <Text style={styles.signatureLabel}>Chairman Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Date</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          {data.accountantFirmName 
            ? `These board minutes were prepared by ${data.accountantFirmName} and recorded in accordance with the Companies Act 2006.`
            : "These minutes were approved at the board meeting held on [DATE]"
          }
        </Text>
      </Page>
    </Document>
  );
};