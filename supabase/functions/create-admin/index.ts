
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing environment variables.')
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

    // Create user with admin role
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'wase3m@hotmail.com',
      password: 'password',
      email_confirm: true,
      user_metadata: { full_name: 'Admin User' }
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
          full_name: 'Admin User',
          subscription_plan: 'enterprise',
          current_month_dividends: 0,
          current_month_minutes: 0
        }, { onConflict: 'id' })

      if (upsertError) {
        console.error('Profile upsert error:', upsertError)
        throw upsertError
      }

      console.log('Profile updated successfully')

      return new Response(
        JSON.stringify({ 
          message: 'Admin user created successfully',
          userId: authUser.user.id,
          email: authUser.user.email,
          credentials: {
            email: 'wase3m@hotmail.com',
            password: 'password'
          }
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
