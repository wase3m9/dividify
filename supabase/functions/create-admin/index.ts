
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
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

    // Create client for auth verification
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey)
    
    // Verify the user is authenticated and has admin role
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user has admin role
    const { data: userRole, error: roleError } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single()

    if (roleError || !userRole) {
      console.log('Admin creation attempt by non-admin user:', user.email)
      return new Response(
        JSON.stringify({ error: 'Admin privileges required' }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // First, try to delete ALL existing users with this email
    try {
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const usersToDelete = existingUsers.users.filter(user => user.email === 'wase3m@hotmail.com')
      
      for (const user of usersToDelete) {
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        console.log('Deleted existing user:', user.id)
      }
    } catch (err) {
      console.log('No existing users to delete or error deleting:', err)
    }

    // Wait a moment to ensure deletion is processed
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Get request body for admin user details
    const body = await req.json()
    const { email, password, full_name } = body

    if (!email || !password || !full_name) {
      throw new Error('Email, password, and full_name are required')
    }

    // Generate secure password if not provided
    const securePassword = password || crypto.randomUUID().slice(0, 16)

    // Create user with admin role
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: securePassword,
      email_confirm: true,
      user_metadata: { full_name: full_name }
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
          full_name: full_name,
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

      if (roleError) {
        console.error('Role assignment error:', roleError)
        throw roleError
      }

      // Log admin creation action
      const { error: logError } = await supabaseAdmin
        .from('activity_log')
        .insert({
          user_id: user.id,
          action: 'admin_action',
          description: 'create_admin_user',
          metadata: {
            target_user_id: authUser.user.id,
            target_email: email,
            created_at: new Date().toISOString()
          }
        })

      if (logError) {
        console.error('Activity log error:', logError)
      }

      console.log('Admin user created successfully')

      return new Response(
        JSON.stringify({ 
          message: 'Admin user created successfully',
          userId: authUser.user.id,
          email: authUser.user.email
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Failed to create user')
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
