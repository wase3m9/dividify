import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  user_id: string;
  email: string;
  full_name: string;
  user_type: string;
  signup_plan?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, full_name, user_type, signup_plan }: SignupNotificationRequest = await req.json();

    console.log("Processing signup notification for:", email);

    const emailResponse = await resend.emails.send({
      from: "Dividify <noreply@dividify.co.uk>",
      to: ["info@dividify.co.uk"],
      subject: `New User Signup - ${full_name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #9b87f5; margin: 0; font-size: 28px; font-weight: bold;">New User Signup</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #9b87f5; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">User Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555; width: 120px;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${full_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">User Type:</td>
                <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${user_type}</td>
              </tr>
              ${signup_plan ? `
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Selected Plan:</td>
                <td style="padding: 8px 0; color: #333; text-transform: capitalize;">${signup_plan}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">User ID:</td>
                <td style="padding: 8px 0; color: #777; font-family: monospace; font-size: 12px;">${user_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: 600; color: #555;">Signup Time:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString('en-UK', { 
                  timeZone: 'Europe/London',
                  day: '2-digit',
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #777; margin: 0; font-size: 14px;">
              This notification was sent automatically from Dividify when a new user completed registration.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Signup notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-signup function:", error);
    
    // Don't throw error to avoid blocking signup process
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        note: "Signup process continued despite notification failure"
      }),
      {
        status: 200, // Return 200 to not block signup
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);