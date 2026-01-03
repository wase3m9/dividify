import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResourceDownloadRequest {
  email: string;
  resourceName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resourceName }: ResourceDownloadRequest = await req.json();

    console.log(`Resource download request: ${resourceName} for ${email}`);

    if (!email || !resourceName) {
      return new Response(
        JSON.stringify({ error: "Email and resource name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send notification email to Dividify
    if (RESEND_API_KEY) {
      const notificationRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Dividify <noreply@dividify.co.uk>",
          to: ["noreply@dividify.co.uk"],
          subject: `New Resource Download: ${resourceName}`,
          html: `
            <h2>New Resource Download</h2>
            <p><strong>Resource:</strong> ${resourceName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          `,
        }),
      });

      if (!notificationRes.ok) {
        const errorText = await notificationRes.text();
        console.error("Failed to send notification email:", errorText);
      } else {
        console.log("Notification email sent successfully");
      }
    } else {
      console.log("RESEND_API_KEY not configured, skipping email notification");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Download request processed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing resource download:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
