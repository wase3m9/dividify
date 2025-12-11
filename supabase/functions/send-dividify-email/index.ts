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

    // Build HTML email body
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">
${message.replace(/\n/g, "<br>")}
        </div>
        
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin-bottom: 8px;">
            <strong>Attached Documents:</strong>
          </p>
          <ul style="color: #666; font-size: 14px; padding-left: 20px;">
            ${attachments.map(att => `<li>${att.filename}</li>`).join("")}
          </ul>
        </div>
        
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            This email was sent via <a href="https://dividify.co.uk" style="color: #9b87f5;">Dividify</a>.
          </p>
        </div>
      </div>
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
