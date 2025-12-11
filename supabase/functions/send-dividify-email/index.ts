import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  companyId: string;
  companyName: string;
  to: string[];
  cc?: string[];
  subject: string;
  message: string;
  documents: {
    id: string;
    type: "voucher" | "minutes";
    file_path: string;
    label: string;
  }[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // Service role client for storage access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body: EmailRequest = await req.json();
    const { companyId, companyName, to, cc, subject, message, documents } = body;

    console.log(`Processing email request for company: ${companyName}`);
    console.log(`Documents to attach: ${documents.length}`);

    // Build attachments array
    const attachments: { filename: string; content: string }[] = [];

    for (const doc of documents) {
      try {
        const bucket = doc.type === "voucher" ? "dividend_vouchers" : "Board Minutes";
        
        console.log(`Downloading ${doc.type} from bucket: ${bucket}, path: ${doc.file_path}`);

        // Download file from storage
        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from(bucket)
          .download(doc.file_path);

        if (downloadError) {
          console.error(`Failed to download ${doc.label}:`, downloadError);
          continue;
        }

        // Convert to base64
        const arrayBuffer = await fileData.arrayBuffer();
        const base64Content = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        const filename = `${doc.label.replace(/[^a-zA-Z0-9-_ ]/g, "")}.pdf`;
        attachments.push({
          filename,
          content: base64Content,
        });

        console.log(`Successfully prepared attachment: ${filename}`);
      } catch (err) {
        console.error(`Error processing document ${doc.label}:`, err);
      }
    }

    if (attachments.length === 0) {
      throw new Error("No documents could be attached to the email");
    }

    // Build HTML email body with professional template
    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Dividend Documents</title>
  </head>
  <body style="margin:0; padding:0; background:#f5f5fb; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
            <!-- Header -->
            <tr>
              <td style="background:#6f4df6; padding:18px 26px; color:#ffffff; text-align:left;">
                <img src="https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/public-assets/369eb256-c5f6-4c83-bdbd-985140819b13.png" alt="Dividify" style="height:32px; margin-bottom:8px;" />
                <div style="font-size:16px; opacity:0.98;">
                  Dividend documentation for ${companyName}
                </div>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px 24px 8px 24px; color:#111827; font-size:14px; line-height:1.6;">
                <p style="margin:0 0 12px 0; font-size:13px; color:#4b5563;">
                  <em>These documents were created automatically in Dividify on behalf of your accountant for your records and compliance.</em>
                </p>

                <p style="margin:0 0 16px 0; font-size:13px; color:#4b5563;">
                  Please do not reply to this message.
                </p>

                <!-- Attachment summary card -->
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

                <p style="margin:0 0 16px 0; font-size:13px; color:#4b5563;">
                  Please save these files somewhere secure. You may need them for mortgage applications, lender checks or your Self Assessment tax return.
                </p>

                <p style="margin:0 0 24px 0; font-size:13px; color:#4b5563;">
                  This email was sent from an unattended address. If you have any questions, please contact your accountant directly.
                </p>

                <p style="margin:0 0 24px 0; text-align:center;">
                  <img src="https://vkllrotescxmqwogfamo.supabase.co/storage/v1/object/public/public-assets/Image%20logo.png" alt="Dividify" style="height:28px;" />
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:12px 24px 18px 24px; text-align:center; font-size:11px; color:#9ca3af; border-top:1px solid #e5e7eb;">
                Sent securely via <span style="color:#6f4df6; font-weight:600;">Dividify</span>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `;

    console.log(`Sending email to: ${to.join(", ")}`);

    // Send email via Resend
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Dividify <no-reply@dividify.co.uk>",
      to: to,
      cc: cc?.length ? cc : undefined,
      subject: subject,
      html: htmlBody,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      
      // Log failed email
      await supabase.from("sent_emails").insert({
        user_id: user.id,
        company_id: companyId,
        related_type: documents.length === 1 ? documents[0].type : "mixed",
        related_ids: documents.map(d => d.id),
        to_emails: to.join(", "),
        cc_emails: cc?.join(", ") || null,
        subject: subject,
        message: message,
        status: "failed",
        error_message: emailError.message || "Unknown error",
      });

      throw new Error(emailError.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResult);

    // Log successful email
    await supabase.from("sent_emails").insert({
      user_id: user.id,
      company_id: companyId,
      related_type: documents.length === 1 ? documents[0].type : "mixed",
      related_ids: documents.map(d => d.id),
      to_emails: to.join(", "),
      cc_emails: cc?.join(", ") || null,
      subject: subject,
      message: message,
      status: "sent",
    });

    return new Response(
      JSON.stringify({ success: true, messageId: emailResult?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-dividify-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
