import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DueSchedule {
  id: string;
  user_id: string;
  company_id: string;
  shareholder_id: string;
  amount_per_share: number;
  total_amount: number;
  share_class: string;
  number_of_shares: number;
  frequency: string;
  day_of_month: number;
  email_recipients: string[];
  include_board_minutes: boolean;
  template_preference: string;
  company_name: string;
  company_address: string;
  company_reg_number: string;
  shareholder_name: string;
  shareholder_address: string;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatCurrency(amount: number): string {
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getTaxYear(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // Tax year runs from 6th April to 5th April
  if (month < 3 || (month === 3 && day < 6)) {
    return `${year - 1}/${year}`;
  }
  return `${year}/${year + 1}`;
}

async function generateDividendVoucherPDF(schedule: DueSchedule, voucherNumber: number, paymentDate: Date): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const primaryColor = rgb(0.435, 0.302, 0.965); // Purple
  const textColor = rgb(0.067, 0.067, 0.067);
  const lightGray = rgb(0.6, 0.6, 0.6);
  
  let y = height - 60;
  
  // Company Header
  page.drawText(schedule.company_name, {
    x: 50,
    y,
    size: 18,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 20;
  if (schedule.company_address) {
    page.drawText(schedule.company_address, {
      x: 50,
      y,
      size: 10,
      font: helvetica,
      color: lightGray,
    });
    y -= 15;
  }
  
  if (schedule.company_reg_number) {
    page.drawText(`Company Registration No: ${schedule.company_reg_number}`, {
      x: 50,
      y,
      size: 10,
      font: helvetica,
      color: lightGray,
    });
  }
  
  // Title
  y -= 50;
  page.drawText("DIVIDEND VOUCHER", {
    x: 50,
    y,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  
  // Voucher Number
  page.drawText(`Voucher No: ${voucherNumber}`, {
    x: width - 150,
    y,
    size: 11,
    font: helvetica,
    color: textColor,
  });
  
  // Shareholder Details
  y -= 40;
  page.drawText("Payable to:", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: lightGray,
  });
  
  y -= 20;
  page.drawText(schedule.shareholder_name || "Shareholder", {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  if (schedule.shareholder_address) {
    y -= 18;
    const addressLines = schedule.shareholder_address.split(',');
    for (const line of addressLines) {
      page.drawText(line.trim(), {
        x: 50,
        y,
        size: 10,
        font: helvetica,
        color: textColor,
      });
      y -= 15;
    }
  }
  
  // Payment Details
  y -= 30;
  const detailsStartY = y;
  const labelX = 50;
  const valueX = 200;
  
  const details = [
    { label: "Payment Date:", value: formatDate(paymentDate) },
    { label: "Share Class:", value: schedule.share_class },
    { label: "Number of Shares:", value: schedule.number_of_shares.toLocaleString() },
    { label: "Amount per Share:", value: formatCurrency(schedule.amount_per_share) },
    { label: "Total Dividend:", value: formatCurrency(schedule.total_amount) },
  ];
  
  for (const detail of details) {
    page.drawText(detail.label, {
      x: labelX,
      y,
      size: 11,
      font: helvetica,
      color: lightGray,
    });
    page.drawText(detail.value, {
      x: valueX,
      y,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    y -= 25;
  }
  
  // Declaration
  y -= 30;
  page.drawText("DECLARATION", {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 25;
  const declarationText = `This voucher certifies that the above-named shareholder is entitled to receive the dividend specified above on their ${schedule.share_class} shares in ${schedule.company_name}.`;
  
  // Simple word wrap
  const words = declarationText.split(' ');
  let line = '';
  const maxWidth = width - 100;
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const textWidth = helvetica.widthOfTextAtSize(testLine, 10);
    
    if (textWidth > maxWidth) {
      page.drawText(line, { x: 50, y, size: 10, font: helvetica, color: textColor });
      line = word;
      y -= 15;
    } else {
      line = testLine;
    }
  }
  if (line) {
    page.drawText(line, { x: 50, y, size: 10, font: helvetica, color: textColor });
  }
  
  // Signature lines
  y -= 60;
  page.drawLine({
    start: { x: 50, y },
    end: { x: 200, y },
    thickness: 1,
    color: lightGray,
  });
  page.drawText("Director Signature", {
    x: 50,
    y: y - 15,
    size: 9,
    font: helvetica,
    color: lightGray,
  });
  
  page.drawLine({
    start: { x: 350, y },
    end: { x: 500, y },
    thickness: 1,
    color: lightGray,
  });
  page.drawText("Date", {
    x: 350,
    y: y - 15,
    size: 9,
    font: helvetica,
    color: lightGray,
  });
  
  // Footer
  page.drawText("This document was generated automatically by Dividify.", {
    x: 50,
    y: 50,
    size: 8,
    font: helvetica,
    color: lightGray,
  });
  
  return await pdfDoc.save();
}

async function generateBoardMinutesPDF(schedule: DueSchedule, paymentDate: Date): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const primaryColor = rgb(0.435, 0.302, 0.965);
  const textColor = rgb(0.067, 0.067, 0.067);
  const lightGray = rgb(0.6, 0.6, 0.6);
  
  let y = height - 60;
  
  // Company Header
  page.drawText(schedule.company_name, {
    x: 50,
    y,
    size: 18,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 20;
  if (schedule.company_reg_number) {
    page.drawText(`Company Registration No: ${schedule.company_reg_number}`, {
      x: 50,
      y,
      size: 10,
      font: helvetica,
      color: lightGray,
    });
  }
  
  // Title
  y -= 50;
  page.drawText("MINUTES OF BOARD MEETING", {
    x: 50,
    y,
    size: 20,
    font: helveticaBold,
    color: primaryColor,
  });
  
  y -= 35;
  page.drawText(`Date of Meeting: ${formatDate(paymentDate)}`, {
    x: 50,
    y,
    size: 11,
    font: helvetica,
    color: textColor,
  });
  
  y -= 20;
  page.drawText("Location: Via electronic communication", {
    x: 50,
    y,
    size: 11,
    font: helvetica,
    color: textColor,
  });
  
  // Notice and Quorum
  y -= 40;
  page.drawText("1. NOTICE AND QUORUM", {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 20;
  page.drawText("The Chairman noted that due notice of the meeting had been given and a quorum was present.", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: textColor,
  });
  
  // Dividend Resolution
  y -= 40;
  page.drawText("2. DIVIDEND PAYMENT", {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 25;
  const resolutionLines = [
    "IT WAS RESOLVED that an interim dividend be declared and paid as follows:",
    "",
    `Share Class: ${schedule.share_class}`,
    `Amount per Share: ${formatCurrency(schedule.amount_per_share)}`,
    `Total Distribution: ${formatCurrency(schedule.total_amount)}`,
    `Payment Date: ${formatDate(paymentDate)}`,
    "",
    "The Board confirmed that the company has sufficient distributable reserves to make this payment.",
  ];
  
  for (const line of resolutionLines) {
    page.drawText(line, {
      x: 50,
      y,
      size: 10,
      font: helvetica,
      color: textColor,
    });
    y -= 18;
  }
  
  // Close of Meeting
  y -= 20;
  page.drawText("3. CLOSE OF MEETING", {
    x: 50,
    y,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  
  y -= 20;
  page.drawText("There being no further business, the meeting was closed.", {
    x: 50,
    y,
    size: 10,
    font: helvetica,
    color: textColor,
  });
  
  // Signature
  y -= 50;
  page.drawLine({
    start: { x: 50, y },
    end: { x: 200, y },
    thickness: 1,
    color: lightGray,
  });
  page.drawText("Chairman", {
    x: 50,
    y: y - 15,
    size: 9,
    font: helvetica,
    color: lightGray,
  });
  
  page.drawLine({
    start: { x: 350, y },
    end: { x: 500, y },
    thickness: 1,
    color: lightGray,
  });
  page.drawText("Date", {
    x: 350,
    y: y - 15,
    size: 9,
    font: helvetica,
    color: lightGray,
  });
  
  // Footer
  page.drawText(`These minutes were approved at the board meeting held on ${formatDate(paymentDate)}.`, {
    x: 50,
    y: 50,
    size: 8,
    font: helvetica,
    color: lightGray,
  });
  
  return await pdfDoc.save();
}

function htmlEscape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function processSchedule(
  schedule: DueSchedule,
  supabaseAdmin: ReturnType<typeof createClient>,
  paymentDate: Date
): Promise<{ success: boolean; error?: string; dividendId?: string; minutesId?: string }> {
  console.log(`Processing schedule ${schedule.id} for ${schedule.company_name}`);
  
  try {
    // Get next voucher number
    const { data: voucherNum, error: voucherError } = await supabaseAdmin.rpc(
      'get_next_voucher_number',
      { company_id_param: schedule.company_id }
    );
    
    if (voucherError) {
      throw new Error(`Failed to get voucher number: ${voucherError.message}`);
    }
    
    const voucherNumber = voucherNum || 1;
    
    // Generate PDFs
    console.log(`Generating dividend voucher PDF...`);
    const voucherPdf = await generateDividendVoucherPDF(schedule, voucherNumber, paymentDate);
    
    let minutesPdf: Uint8Array | null = null;
    if (schedule.include_board_minutes) {
      console.log(`Generating board minutes PDF...`);
      minutesPdf = await generateBoardMinutesPDF(schedule, paymentDate);
    }
    
    // Upload voucher to storage
    const voucherPath = `${schedule.user_id}/${schedule.company_id}/scheduled-${paymentDate.toISOString().split('T')[0]}-voucher-${voucherNumber}.pdf`;
    console.log(`Uploading voucher to ${voucherPath}...`);
    
    const { error: voucherUploadError } = await supabaseAdmin.storage
      .from('dividend_vouchers')
      .upload(voucherPath, voucherPdf, {
        contentType: 'application/pdf',
        upsert: true,
      });
    
    if (voucherUploadError) {
      throw new Error(`Failed to upload voucher: ${voucherUploadError.message}`);
    }
    
    // Create dividend record
    const taxYear = getTaxYear(paymentDate);
    const { data: dividendRecord, error: dividendError } = await supabaseAdmin
      .from('dividend_records')
      .insert({
        user_id: schedule.user_id,
        company_id: schedule.company_id,
        shareholder_name: schedule.shareholder_name || 'Shareholder',
        share_class: schedule.share_class,
        payment_date: paymentDate.toISOString().split('T')[0],
        number_of_shares: schedule.number_of_shares,
        dividend_per_share: schedule.amount_per_share,
        total_dividend: schedule.total_amount,
        tax_year: taxYear,
        file_path: voucherPath,
        form_data: {
          scheduled: true,
          schedule_id: schedule.id,
          generated_at: new Date().toISOString(),
        },
      })
      .select()
      .single();
    
    if (dividendError) {
      throw new Error(`Failed to create dividend record: ${dividendError.message}`);
    }
    
    let minutesRecord = null;
    if (minutesPdf && schedule.include_board_minutes) {
      // Upload minutes to storage
      const minutesPath = `${schedule.user_id}/${schedule.company_id}/scheduled-${paymentDate.toISOString().split('T')[0]}-minutes.pdf`;
      console.log(`Uploading minutes to ${minutesPath}...`);
      
      const { error: minutesUploadError } = await supabaseAdmin.storage
        .from('Board Minutes')
        .upload(minutesPath, minutesPdf, {
          contentType: 'application/pdf',
          upsert: true,
        });
      
      if (minutesUploadError) {
        console.error(`Failed to upload minutes: ${minutesUploadError.message}`);
      } else {
        // Create minutes record
        const { data: mRecord, error: minutesDbError } = await supabaseAdmin
          .from('minutes')
          .insert({
            user_id: schedule.user_id,
            company_id: schedule.company_id,
            meeting_date: paymentDate.toISOString().split('T')[0],
            meeting_type: 'Board Meeting',
            attendees: ['Directors'],
            resolutions: [`Interim dividend of ${formatCurrency(schedule.amount_per_share)} per ${schedule.share_class} share declared.`],
            file_path: minutesPath,
            linked_dividend_id: dividendRecord.id,
            form_data: {
              scheduled: true,
              schedule_id: schedule.id,
              generated_at: new Date().toISOString(),
            },
          })
          .select()
          .single();
        
        if (minutesDbError) {
          console.error(`Failed to create minutes record: ${minutesDbError.message}`);
        } else {
          minutesRecord = mRecord;
          
          // Update dividend record with linked minutes
          await supabaseAdmin
            .from('dividend_records')
            .update({ linked_minutes_id: mRecord.id })
            .eq('id', dividendRecord.id);
        }
      }
    }
    
    // Increment usage counters
    await supabaseAdmin.rpc('increment_monthly_dividends', { user_id_param: schedule.user_id });
    if (minutesRecord) {
      await supabaseAdmin.rpc('increment_monthly_minutes', { user_id_param: schedule.user_id });
    }
    
    // Log activity
    await supabaseAdmin.rpc('log_activity', {
      user_id_param: schedule.user_id,
      company_id_param: schedule.company_id,
      action_param: 'scheduled_dividend_generated',
      description_param: `Scheduled dividend voucher generated: ${formatCurrency(schedule.total_amount)} to ${schedule.shareholder_name}`,
      metadata_param: {
        schedule_id: schedule.id,
        voucher_number: voucherNumber,
        total_amount: schedule.total_amount,
      },
    });
    
    return {
      success: true,
      dividendId: dividendRecord.id,
      minutesId: minutesRecord?.id,
    };
  } catch (error: any) {
    console.error(`Error processing schedule ${schedule.id}:`, error);
    return { success: false, error: error.message };
  }
}

async function sendNotificationEmail(
  schedule: DueSchedule,
  supabaseAdmin: ReturnType<typeof createClient>,
  dividendId: string,
  minutesId: string | undefined,
  paymentDate: Date
): Promise<boolean> {
  if (!schedule.email_recipients || schedule.email_recipients.length === 0) {
    console.log(`No email recipients for schedule ${schedule.id}`);
    return true;
  }
  
  console.log(`Sending notification email for schedule ${schedule.id}`);
  
  try {
    // Download the generated PDFs
    const attachments: { filename: string; content: string }[] = [];
    
    // Get voucher
    const { data: dividendRecord } = await supabaseAdmin
      .from('dividend_records')
      .select('file_path')
      .eq('id', dividendId)
      .single();
    
    if (dividendRecord?.file_path) {
      const { data: voucherFile } = await supabaseAdmin.storage
        .from('dividend_vouchers')
        .download(dividendRecord.file_path);
      
      if (voucherFile) {
        const arrayBuffer = await voucherFile.arrayBuffer();
        const base64Content = btoa(
          new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
        );
        attachments.push({
          filename: `Dividend-Voucher-${formatDate(paymentDate).replace(/\//g, '-')}.pdf`,
          content: base64Content,
        });
      }
    }
    
    // Get minutes if available
    if (minutesId) {
      const { data: minutesRecord } = await supabaseAdmin
        .from('minutes')
        .select('file_path')
        .eq('id', minutesId)
        .single();
      
      if (minutesRecord?.file_path) {
        const { data: minutesFile } = await supabaseAdmin.storage
          .from('Board Minutes')
          .download(minutesRecord.file_path);
        
        if (minutesFile) {
          const arrayBuffer = await minutesFile.arrayBuffer();
          const base64Content = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
          );
          attachments.push({
            filename: `Board-Minutes-${formatDate(paymentDate).replace(/\//g, '-')}.pdf`,
            content: base64Content,
          });
        }
      }
    }
    
    if (attachments.length === 0) {
      console.error("No attachments could be prepared for email");
      return false;
    }
    
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Scheduled Dividend Documents</title>
  </head>
  <body style="margin:0; padding:0; background:#f5f5fb; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:#f0f4ff; padding:24px 26px; text-align:left; border-bottom:1px solid #e5e7eb;">
                <img src="https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/public-assets/369eb256-c5f6-4c83-bdbd-985140819b13.png" alt="Dividify" style="height:56px; margin-bottom:10px;" />
                <div style="font-size:16px; color:#111827; font-weight:600;">
                  Scheduled Dividend for ${htmlEscape(schedule.company_name)}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px; color:#111827; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 16px 0;">
                  Your scheduled dividend has been processed automatically. Please find the attached documents for your records.
                </p>
                
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
                  <tr>
                    <td style="background:#faf9fc; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px;">
                      <div style="font-size:13px; color:#4b5563; margin-bottom:4px;">Payment Details</div>
                      <div style="font-size:15px; font-weight:600; color:#111827;">
                        ${htmlEscape(formatCurrency(schedule.total_amount))} to ${htmlEscape(schedule.shareholder_name || 'Shareholder')}
                      </div>
                      <div style="font-size:12px; color:#6b7280; margin-top:4px;">
                        ${schedule.share_class} shares • ${formatDate(paymentDate)}
                      </div>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 16px 0;">
                  <tr>
                    <td style="background:#faf9fc; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px;">
                      <div style="font-size:13px; font-weight:600; color:#4c1d95; margin-bottom:6px;">
                        Attached documents
                      </div>
                      <ul style="padding-left:18px; margin:0; font-size:13px; color:#111827;">
                        ${attachments.map(att => `<li>${att.filename}</li>`).join("")}
                      </ul>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 12px 0; font-size:13px; color:#4b5563;">
                  <em>These documents were generated automatically based on your recurring dividend schedule.</em>
                </p>

                <p style="margin:0 0 16px 0; font-size:13px; color:#4b5563;">
                  <em>Please save these files somewhere secure. You may need them for mortgage applications, lender checks or your Self Assessment tax return.</em>
                </p>

                <p style="margin:0 0 24px 0; text-align:center;">
                  <img src="https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/public-assets/Image%20logo.png" alt="Dividify" style="height:28px;" />
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px 18px 24px; text-align:center; font-size:11px; color:#9ca3af; border-top:1px solid #e5e7eb;">
                Sent securely via <span style="color:#6f4df6; font-weight:600;">Dividify</span> • Automated Dividend Scheduling
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;
    
    const { error: emailError } = await resend.emails.send({
      from: "Dividify <no-reply@dividify.co.uk>",
      to: schedule.email_recipients,
      subject: `Scheduled Dividend: ${formatCurrency(schedule.total_amount)} - ${schedule.company_name}`,
      html: htmlBody,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });
    
    if (emailError) {
      console.error("Failed to send email:", emailError);
      return false;
    }
    
    console.log(`Email sent successfully to ${schedule.email_recipients.join(', ')}`);
    return true;
  } catch (error: any) {
    console.error(`Error sending email for schedule ${schedule.id}:`, error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify cron secret for authentication
    const cronSecret = Deno.env.get("CRON_SECRET");
    const providedSecret = req.headers.get("x-cron-secret");
    
    // If CRON_SECRET is configured, require it for all requests
    if (cronSecret) {
      if (!providedSecret || providedSecret !== cronSecret) {
        console.error("Unauthorized cron invocation attempt - invalid or missing x-cron-secret header");
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      console.log("Cron invocation authorized via x-cron-secret header");
    } else {
      console.warn("CRON_SECRET not configured - running without authentication (not recommended for production)");
    }
    
    console.log("=== Processing Scheduled Dividends ===");
    console.log(`Timestamp: ${new Date().toISOString()}`);
    
    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all due schedules
    const { data: dueSchedules, error: fetchError } = await supabaseAdmin
      .rpc('get_due_dividend_schedules');
    
    if (fetchError) {
      throw new Error(`Failed to fetch due schedules: ${fetchError.message}`);
    }
    
    console.log(`Found ${dueSchedules?.length || 0} schedules due for processing`);
    
    if (!dueSchedules || dueSchedules.length === 0) {
      return new Response(
        JSON.stringify({ success: true, processed: 0, message: "No schedules due" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const results: { scheduleId: string; success: boolean; error?: string }[] = [];
    const paymentDate = new Date();
    
    for (const schedule of dueSchedules as DueSchedule[]) {
      // Create run record
      const { data: runRecord, error: runError } = await supabaseAdmin
        .from('scheduled_dividend_runs')
        .insert({
          schedule_id: schedule.id,
          user_id: schedule.user_id,
          company_id: schedule.company_id,
          scheduled_for: paymentDate.toISOString().split('T')[0],
          status: 'processing',
        })
        .select()
        .single();
      
      if (runError) {
        console.error(`Failed to create run record for ${schedule.id}:`, runError);
        continue;
      }
      
      // Process the schedule
      const result = await processSchedule(schedule, supabaseAdmin, paymentDate);
      
      if (result.success) {
        // Send notification email
        const emailSent = await sendNotificationEmail(
          schedule,
          supabaseAdmin,
          result.dividendId!,
          result.minutesId,
          paymentDate
        );
        
        // Update run record as completed
        await supabaseAdmin
          .from('scheduled_dividend_runs')
          .update({
            status: 'completed',
            executed_at: new Date().toISOString(),
            dividend_record_id: result.dividendId,
            minutes_record_id: result.minutesId,
            email_sent: emailSent,
            email_sent_at: emailSent ? new Date().toISOString() : null,
          })
          .eq('id', runRecord.id);
        
        // Calculate and update next run date
        const { data: nextRunDate } = await supabaseAdmin.rpc('calculate_next_run_date', {
          p_frequency: schedule.frequency,
          p_day_of_month: schedule.day_of_month,
          p_last_run: paymentDate.toISOString().split('T')[0],
          p_start_date: paymentDate.toISOString().split('T')[0],
        });
        
        await supabaseAdmin
          .from('recurring_dividends')
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: nextRunDate,
          })
          .eq('id', schedule.id);
        
        results.push({ scheduleId: schedule.id, success: true });
      } else {
        // Update run record as failed
        await supabaseAdmin
          .from('scheduled_dividend_runs')
          .update({
            status: 'failed',
            error_message: result.error,
            executed_at: new Date().toISOString(),
          })
          .eq('id', runRecord.id);
        
        results.push({ scheduleId: schedule.id, success: false, error: result.error });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`=== Processing Complete ===`);
    console.log(`Processed: ${results.length}, Success: ${successCount}, Failed: ${failCount}`);
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        successful: successCount,
        failed: failCount,
        results,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in process-scheduled-dividends:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
