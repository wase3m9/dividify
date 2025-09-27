import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Define the admin accounts to set up
    const adminAccounts = [
      {
        email: 'wase3m@hotmail.com',
        userType: 'accountant',
        description: 'Accountant Dashboard Admin'
      },
      {
        email: 'wazamusa@hotmail.com', 
        userType: 'individual',
        description: 'Company Dashboard Admin'
      }
    ];

    const results = [];

    for (const account of adminAccounts) {
      console.log(`Setting up admin account for ${account.email}`);
      
      // Generate a secure random password
      const tempPassword = crypto.randomUUID().slice(0, 12) + 'A1!';
      
      try {
        // Check if user exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = existingUsers.users.find(u => u.email === account.email);
        
        let userId: string;
        
        if (existingUser) {
          userId = existingUser.id;
          console.log(`User ${account.email} exists, updating password`);
          
          // Update existing user's password
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            password: tempPassword
          });
        } else {
          console.log(`Creating new user ${account.email}`);
          
          // Create new user
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: account.email,
            password: tempPassword,
            email_confirm: true
          });
          
          if (createError) {
            throw createError;
          }
          
          userId = newUser.user.id;
        }
        
        // Update profile with correct user_type
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: userId,
            full_name: account.email,
            user_type: account.userType,
            subscription_plan: 'trial'
          });
        
        // Add admin role
        await supabaseAdmin
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'admin',
            created_by: userId
          });
        
        // Log the admin setup action
        await supabaseAdmin.rpc('log_admin_action', {
          action_type: 'admin_account_setup',
          target_user_id: userId,
          details: {
            email: account.email,
            user_type: account.userType,
            description: account.description
          }
        });
        
        results.push({
          email: account.email,
          userType: account.userType,
          tempPassword: tempPassword,
          success: true,
          description: account.description
        });
        
        console.log(`Successfully set up admin account for ${account.email}`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error setting up ${account.email}:`, error);
        results.push({
          email: account.email,
          success: false,
          error: errorMessage
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin accounts setup completed',
      results: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in setup-admin-accounts function:', error);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});