import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found, setting trial plan");
      
      // Update profile to trial if no customer exists
      await supabaseClient
        .from('profiles')
        .update({
          subscription_plan: 'trial',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_plan: 'trial',
        message: "No active subscription found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    let subscriptionPlan = 'trial';
    let userType = 'individual';
    
    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0];
      const priceId = subscription.items.data[0].price.id;
      
      logStep("Active subscription found", { subscriptionId: subscription.id, priceId });

      // Map price IDs to plans and user types - using the same mapping as create-checkout
      const priceMapping: { [key: string]: { plan: string; userType: string } } = {
        'price_1S1d26DQxPzFmGY056CeyPNE': { plan: 'starter', userType: 'individual' },
        'price_1S1czXDQxPzFmGY0BNG13iVd': { plan: 'professional', userType: 'individual' },
        'price_1S1d1PDQxPzFmGY0UNNWf8bW': { plan: 'professional', userType: 'individual' },
        'price_1S1cmEDQxPzFmGY0PEEAQmpr': { plan: 'enterprise', userType: 'individual' },
        'price_1S1cwCDQxPzFmGY0vqjzr51R': { plan: 'enterprise', userType: 'individual' },
        'price_1QiOntDQxPzFmGY0u6RQ4C0f': { plan: 'accountant', userType: 'accountant' },
        'price_1S1ctdDQxPzFmGY0iyYLKRXp': { plan: 'accountant', userType: 'accountant' },
      };

      const mapping = priceMapping[priceId];
      if (mapping) {
        subscriptionPlan = mapping.plan;
        userType = mapping.userType;
      }

      logStep("Determined plan from subscription", { subscriptionPlan, userType });
    } else {
      logStep("No active subscription found");
    }

    // Update user profile with current subscription status
    await supabaseClient
      .from('profiles')
      .update({
        subscription_plan: subscriptionPlan,
        user_type: userType,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    logStep("Updated user profile", { subscriptionPlan, userType });

    return new Response(JSON.stringify({
      subscribed: subscriptions.data.length > 0,
      subscription_plan: subscriptionPlan,
      user_type: userType,
      message: "Subscription status updated successfully"
    }), {
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