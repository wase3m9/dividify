import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PDFAttachment {
  filename: string;
  base64: string;
}

interface BoardPackEmailRequest {
  companyId: string;
  companyName: string;
  yearEndDate: string;
  to: string;
  cc?: string;
  subject: string;
  message: string;
  attachments: PDFAttachment[];
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("send-boardpack-email function started");

    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("User authenticated:", user.id);

    // Parse request body
    const body: BoardPackEmailRequest = await req.json();
    const { companyId, companyName, yearEndDate, to, cc, subject, message, attachments } = body;

    console.log(`Processing board pack email for company: ${companyName}`);
    console.log(`Sending to: ${to}`);
    console.log(`Request body keys: ${Object.keys(body).join(', ')}`);
    
    // Validate attachments
    if (!attachments || !Array.isArray(attachments)) {
      console.error("Attachments missing or invalid:", typeof attachments);
      return new Response(
        JSON.stringify({ error: "No attachments provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Number of PDF attachments: ${attachments.length}`);

    // Build HTML email
    const htmlMessage = message.replace(/\n/g, '<br>');
    
    // Build attachments list for display
    const attachmentsList = attachments.map(a => `<li style="margin:4px 0; color:#374151;">${a.filename}</li>`).join('');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f9fafb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f9fafb;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.08); max-width:100%;">
                <!-- Header -->
                <tr>
                  <td style="background:#f0f4ff; padding:24px 26px; text-align:left; border-bottom:1px solid #e5e7eb;">
                    <img src="https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/public-assets/369eb256-c5f6-4c83-bdbd-985140819b13.png" alt="Dividify" style="height:56px; margin-bottom:10px;" />
                    <div style="font-size:16px; color:#111827; font-weight:600;">
                      Board Pack for ${companyName}
                    </div>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:28px 26px;">
                    <p style="margin:0 0 18px; color:#374151; font-size:15px; line-height:1.6;">
                      ${htmlMessage}
                    </p>
                    
                    <!-- Attachments Info -->
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:16px; margin:20px 0;">
                      <div style="font-weight:600; color:#1e293b; font-size:14px; margin-bottom:8px;">
                        📎 Attached Documents (${attachments.length} files)
                      </div>
                      <ul style="margin:0; padding-left:20px; font-size:13px;">
                        ${attachmentsList}
                      </ul>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 26px; border-top:1px solid #e5e7eb; background:#f9fafb;">
                    <p style="margin:0 0 8px; color:#6b7280; font-size:12px; font-style:italic;">
                      This board pack was generated automatically in Dividify on behalf of your accountant for your records and compliance.
                    </p>
                    <p style="margin:0 0 8px; color:#6b7280; font-size:12px; font-style:italic;">
                      Please save these files somewhere secure. You may need them for mortgage applications, lender checks or your Self Assessment tax return.
                    </p>
                    <p style="margin:0 0 8px; color:#6b7280; font-size:12px; font-style:italic;">
                      This email was sent from an unattended address. If you have any questions, please contact your accountant directly.
                    </p>
                    <p style="margin:0; color:#6b7280; font-size:12px; font-style:italic;">
                      Please do not reply to this message.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Prepare recipients
    const toEmails = to.split(',').map(e => e.trim()).filter(Boolean);
    const ccEmails = cc ? cc.split(',').map(e => e.trim()).filter(Boolean) : undefined;

    // Convert base64 PDFs to attachments - use base64 strings directly like in send-dividify-email
    const emailAttachments = attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.base64,
    }));

    console.log(`Sending email with ${emailAttachments.length} PDF attachments`);

    // Send email with Resend
    const emailResponse = await resend.emails.send({
      from: "Dividify <notifications@dividify.co.uk>",
      to: toEmails,
      cc: ccEmails,
      subject: subject,
      html: html,
      attachments: emailAttachments,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log to sent_emails table
    try {
      await supabase.from('sent_emails').insert({
        user_id: user.id,
        company_id: companyId,
        to_emails: to,
        cc_emails: cc || null,
        subject: subject,
        message: message,
        related_type: 'board_pack',
        related_ids: { yearEndDate, attachmentCount: attachments.length },
        status: 'sent',
      });
    } catch (logError) {
      console.error("Failed to log email:", logError);
    }

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-boardpack-email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
