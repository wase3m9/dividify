import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeatureRequestBody {
  featureRequest: string;
  additionalDetails?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    
    // Create Supabase client to get user info if authenticated
    let userEmail = "Anonymous";
    let userName = "Anonymous User";
    
    if (authHeader) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        userEmail = user.email || "No email";
        
        // Try to get user's full name from profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        
        if (profile?.full_name) {
          userName = profile.full_name;
        }
      }
    }

    const body: FeatureRequestBody = await req.json();
    const { featureRequest, additionalDetails } = body;

    if (!featureRequest || featureRequest.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Feature request is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing feature request from: ${userEmail}`);

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Feature Request</title>
</head>
<body style="margin:0; padding:0; background:#f5f5fb; font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(15,23,42,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #9b87f5 0%, #7c3aed 100%); padding:24px; text-align:center;">
              <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:600;">
                💡 New Feature Request
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px; background:#f9fafb; border-radius:8px; padding:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px 0; font-size:12px; color:#6b7280; text-transform:uppercase; font-weight:600;">
                      Submitted by
                    </p>
                    <p style="margin:0; font-size:14px; color:#111827;">
                      ${userName}<br/>
                      <a href="mailto:${userEmail}" style="color:#7c3aed;">${userEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <div style="margin-bottom:20px;">
                <p style="margin:0 0 8px 0; font-size:12px; color:#6b7280; text-transform:uppercase; font-weight:600;">
                  Feature Request
                </p>
                <p style="margin:0; font-size:14px; color:#111827; background:#faf9fc; padding:16px; border-radius:8px; border-left:4px solid #9b87f5;">
                  ${featureRequest.replace(/\n/g, "<br>")}
                </p>
              </div>

              ${additionalDetails ? `
              <div>
                <p style="margin:0 0 8px 0; font-size:12px; color:#6b7280; text-transform:uppercase; font-weight:600;">
                  Additional Details
                </p>
                <p style="margin:0; font-size:14px; color:#111827; background:#f9fafb; padding:16px; border-radius:8px;">
                  ${additionalDetails.replace(/\n/g, "<br>")}
                </p>
              </div>
              ` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
              Sent from Dividify Feature Request System
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
      to: ["noreply@dividify.co.uk"],
      subject: `Feature Request from ${userName}`,
      html: htmlBody,
      reply_to: userEmail !== "Anonymous" ? userEmail : undefined,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(emailError.message || "Failed to send email");
    }

    console.log("Feature request email sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in feature-request function:", error);
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
