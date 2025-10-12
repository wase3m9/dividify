import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
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

    // Check if user is an admin first
    const { data: adminCheck } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (adminCheck) {
      logStep("Admin user detected, granting full access");
      
      // Update profile to ensure admin has full access
      await supabaseClient
        .from('profiles')
        .update({
          subscription_plan: 'enterprise',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      return new Response(JSON.stringify({
        subscribed: true,
        subscription_plan: 'enterprise',
        user_type: 'individual',
        is_trialing: false,
        has_payment_method: true,
        is_admin: true,
        message: "Admin access granted"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

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

    // Check if customer has payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    const hasPaymentMethod = paymentMethods.data.length > 0;
    logStep("Payment method check", { hasPaymentMethod, paymentMethodCount: paymentMethods.data.length });

    // Get active subscriptions (including trialing)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });

    // Filter for active or trialing subscriptions
    const activeSubscriptions = subscriptions.data.filter((sub: any) => 
      sub.status === 'active' || sub.status === 'trialing'
    );

    let subscriptionPlan = 'trial';
    let userType = 'individual';
    let isTrialing = false;
    
    // Only update to paid plans if there's a payment method AND active subscription
    if (activeSubscriptions.length > 0 && hasPaymentMethod) {
      const subscription = activeSubscriptions[0];
      const priceId = subscription.items.data[0].price.id;
      isTrialing = subscription.status === 'trialing';
      
      logStep("Active subscription found with payment method", { subscriptionId: subscription.id, priceId });

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
      logStep("No active subscription found or no payment method", { 
        hasActiveSubscription: activeSubscriptions.length > 0,
        hasPaymentMethod 
      });
      // Keep user on trial if no payment method, even if they have a subscription
      subscriptionPlan = 'trial';
      userType = 'individual';
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
      subscribed: activeSubscriptions.length > 0 && hasPaymentMethod,
      subscription_plan: subscriptionPlan,
      user_type: userType,
      is_trialing: isTrialing && hasPaymentMethod,
      has_payment_method: hasPaymentMethod,
      trial_end: isTrialing ? activeSubscriptions[0].trial_end : null,
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