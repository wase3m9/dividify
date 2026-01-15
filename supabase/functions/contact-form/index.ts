import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

function validateContactForm(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else {
    const trimmed = data.name.trim();
    if (trimmed.length === 0) errors.push('Name cannot be empty');
    else if (trimmed.length > 100) errors.push('Name must be less than 100 characters');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = data.email.trim();
    if (!emailRegex.test(trimmed)) errors.push('Invalid email address');
    else if (trimmed.length > 255) errors.push('Email must be less than 255 characters');
  }
  
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else {
    const trimmed = data.message.trim();
    if (trimmed.length < 10) errors.push('Message must be at least 10 characters');
    else if (trimmed.length > 2000) errors.push('Message must be less than 2000 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10000) {
      return new Response(JSON.stringify({ error: 'Request payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let formData: ContactFormData;
    try {
      formData = await req.json();
    } catch (e) {
      console.error('JSON parse error:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const validation = validateContactForm(formData);
    if (!validation.valid) {
      console.error('Validation failed:', validation.errors);
      return new Response(JSON.stringify({ error: validation.errors.join(', ') }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const sanitizedData: ContactFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      message: sanitizeInput(formData.message)
    };

    console.log('Processing contact form submission');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: insertError } = await supabaseClient
      .from('contact_submissions')
      .insert([{
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
      }])

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        console.log('Sending email via Resend...');
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Dividify <onboarding@resend.dev>',
            to: ['noreply@dividify.co.uk'],
            subject: 'New Contact Form Submission - Dividify',
            html: `
              <h2>New Contact Form Submission from Dividify</h2>
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Message:</strong></p>
              <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p><small>This message was sent via the Dividify contact form.</small></p>
            `,
          }),
        });

        if (!res.ok) {
          console.error('Email send failed:', await res.text());
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Contact form submitted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
