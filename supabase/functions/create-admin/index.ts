import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey || !supabaseAnonKey) {
      throw new Error('Missing environment variables.')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
    
    // Verify the user is authenticated and has admin privileges
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user has admin role
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      
    if (!userRoles || userRoles.length === 0) {
      // Log unauthorized access attempt
      await supabaseAdmin.rpc('log_admin_action', {
        action_type: 'unauthorized_admin_access_attempt',
        target_user_id: user.id,
        details: { endpoint: 'create-admin', user_email: user.email }
      })
      
      return new Response(
        JSON.stringify({ error: 'Admin privileges required' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse request body to get email and generate secure password
    const body = await req.json()
    const targetEmail = body.email || 'wase3m@hotmail.com'
    const generatedPassword = crypto.randomUUID().substring(0, 16) + '!'

    // First, try to delete existing users with this email
    try {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const usersToDelete = existingUsers.users.filter(existingUser => existingUser.email === targetEmail)
      
      for (const existingUser of usersToDelete) {
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
        console.log('Deleted existing user:', existingUser.id)
      }
    } catch (err) {
      console.log('No existing users to delete or error deleting:', err)
    }

    // Wait a moment to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create user with admin role
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: targetEmail,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: { full_name: 'Professional Accountant' }
    })

    if (createError) {
      console.error('Create user error:', createError)
      throw createError
    }

    console.log('User created successfully:', authUser.user?.id)

    if (authUser.user) {
      // Insert or update profile to match current schema
      const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({ 
          id: authUser.user.id,
          full_name: 'Professional Accountant',
          subscription_plan: 'enterprise',
          current_month_dividends: 0,
          current_month_minutes: 0,
          user_type: 'accountant'
        }, { onConflict: 'id' })

      if (upsertError) {
        console.error('Profile upsert error:', upsertError)
        throw upsertError
      }

      // Add admin role to user_roles table
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: authUser.user.id,
          role: 'admin',
          created_by: user.id
        })

      if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
        console.error('Role assignment error:', roleError)
        throw roleError
      }

      console.log('Profile updated successfully')

      // Log the admin creation action
      await supabaseAdmin.rpc('log_admin_action', {
        action_type: 'admin_user_created',
        target_user_id: authUser.user.id,
        details: { target_email: targetEmail, created_by: user.id }
      })

      // Note: Password is returned only for display in the admin UI
      // The password is not logged and should be shown once then discarded
      // In a production environment, consider sending via secure email instead
      return new Response(
        JSON.stringify({ 
          message: 'Admin user created successfully',
          userId: authUser.user.id,
          email: authUser.user.email,
          // Password returned for one-time display only - not logged
          tempPassword: generatedPassword,
          note: 'This password is shown once only. Please copy it now and change it immediately after first login.',
          security: 'Do not share or store this password. It will not be shown again.'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, private',
            'Pragma': 'no-cache'
          } 
        }
      )
    }

    throw new Error('Failed to create user')
  } catch (error) {
    console.error('Function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})