
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceId } = await req.json();
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }

    logStep("Price ID received", { priceId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    }

    // Determine user type and subscription plan based on price ID
    let userType = 'individual';
    let subscriptionPlan = 'starter';
    
    // Map price IDs to plans and user types
    const priceMapping: { [key: string]: { plan: string; userType: string } } = {
      'price_1QTr2mP5i3F4Z8xZyNQJBjhD': { plan: 'starter', userType: 'individual' },
      'price_1QTr3QP5i3F4Z8xZuDHGNLzS': { plan: 'professional', userType: 'individual' },
      'price_1QTr4AP5i3F4Z8xZK8b2tLmX': { plan: 'enterprise', userType: 'individual' },
      'price_1QTr4sP5i3F4Z8xZvBpQMbRz': { plan: 'accountant', userType: 'accountant' },
    };

    const mapping = priceMapping[priceId];
    if (mapping) {
      userType = mapping.userType;
      subscriptionPlan = mapping.plan;
    }

    logStep("Determined user type and plan", { userType, subscriptionPlan });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        user_type: userType,
        subscription_plan: subscriptionPlan,
      },
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Update user profile with user type and subscription plan
    await supabaseClient
      .from('profiles')
      .update({
        user_type: userType,
        subscription_plan: subscriptionPlan,
      })
      .eq('id', user.id);

    logStep("User profile updated", { userType, subscriptionPlan });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
