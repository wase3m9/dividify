import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Input validation
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function validateMessages(messages: unknown): messages is Message[] {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0 || messages.length > 50) return false;
  
  return messages.every(msg => {
    if (typeof msg !== 'object' || msg === null) return false;
    if (!['user', 'assistant', 'system'].includes((msg as any).role)) return false;
    if (typeof (msg as any).content !== 'string') return false;
    if ((msg as any).content.length === 0 || (msg as any).content.length > 5000) return false;
    return true;
  });
}

function sanitizeContent(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

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
    if (contentLength && parseInt(contentLength) > 100000) {
      return new Response(JSON.stringify({ error: 'Request payload too large' }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let body: { messages: unknown };
    try {
      body = await req.json();
    } catch (e) {
      console.error('JSON parse error:', e);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!validateMessages(body.messages)) {
      console.error('Invalid messages format');
      return new Response(JSON.stringify({ 
        error: 'Invalid messages format. Expected 1-50 messages with role and content (max 5000 chars)' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const sanitizedMessages = (body.messages as Message[]).map(msg => ({
      ...msg,
      content: sanitizeContent(msg.content)
    }));
    
    console.log('Chat support request received with', sanitizedMessages.length, 'messages');
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a helpful customer support assistant for Dividify, a UK dividend voucher and board minutes generation platform.

Key information about Dividify:
- Individual Plan: £6/month - Up to 5 dividend vouchers, 3 board minutes, all templates, HMRC compliant
- Accountants Plan: £30/month - Unlimited companies, unlimited documents, white-label branding, priority support
- Both plans include free trials
- All documents are HMRC compliant and follow UK company law
- Documents can be downloaded in PDF or Word format
- Supports multiple shareholders and share classes
- Includes automatic tax calculations

Be helpful, concise, and professional. If you don't know something specific, direct users to contact support@dividify.com.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...sanitizedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
