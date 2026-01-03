import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook started");
    
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    // Verify webhook signature - REQUIRED for security
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("ERROR", { message: "STRIPE_WEBHOOK_SECRET is not configured" });
      throw new Error("STRIPE_WEBHOOK_SECRET must be configured for secure webhook verification");
    }
    
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    logStep("Processing webhook event", { type: event.type, id: event.id });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing subscription event", { 
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status 
        });

        // Get customer email
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        
        if (!customerEmail) {
          throw new Error('Customer email not found');
        }

        // Determine plan from price
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        let planCode = 'starter';
        if (amount >= 2500) {
          planCode = 'enterprise';
        } else if (amount >= 1500) {
          planCode = 'professional';
        }

        // Get user by email
        const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
        const user = authUsers.users.find(u => u.email === customerEmail);
        
        if (!user) {
          throw new Error(`User not found for email: ${customerEmail}`);
        }

        // Upsert subscription record
        const { error: subError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            plan_code: planCode,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'stripe_subscription_id'
          });

        if (subError) throw subError;

        // Update user profile
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .update({
            subscription_plan: planCode,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        logStep("Subscription updated successfully", { userId: user.id, planCode });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status
        const { error } = await supabaseClient
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;

        // Reset user to trial plan
        const { data: subData } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (subData) {
          await supabaseClient
            .from('profiles')
            .update({
              subscription_plan: 'trial',
              updated_at: new Date().toISOString()
            })
            .eq('id', subData.user_id);
        }

        logStep("Subscription canceled", { subscriptionId: subscription.id });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabaseClient
            .from('subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabaseClient
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});