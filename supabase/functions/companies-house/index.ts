import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

const CH_BASE = "https://api.company-information.service.gov.uk";

function chHeaders(apiKey: string) {
  const token = btoa(`${apiKey}:`);
  return { Authorization: `Basic ${token}` };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("CH_API_KEY") ?? Deno.env.get("API_KEY") ?? Deno.env.get("API key") ?? "";

    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: "Missing CH_API_KEY" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let q: string | null = null;
    let number: string | null = null;
    let includeOfficers = false;
    let debug = false;

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      q = body.q ?? null;
      number = body.number ?? null;
      includeOfficers = Boolean(body.include_officers);
      debug = Boolean(body.debug);
    } else if (req.method === "GET") {
      const { searchParams } = new URL(req.url);
      q = searchParams.get("q");
      number = searchParams.get("number");
      includeOfficers = ["1", "true", "yes"].includes((searchParams.get("include_officers") ?? "").toLowerCase());
      debug = ["1", "true", "yes"].includes((searchParams.get("debug") ?? "").toLowerCase());
    }

    if (debug) {
      return new Response(JSON.stringify({ ok: true, has_key: !!apiKey, key_len: apiKey.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Search companies by name
    if (q) {
      const url = `${CH_BASE}/search/companies?q=${encodeURIComponent(q)}&items_per_page=10`;
      const r = await fetch(url, { headers: chHeaders(apiKey) });
      
      if (!r.ok) {
        const txt = await r.text();
        console.error("Companies House search failed:", r.status, txt);
        return new Response(JSON.stringify({ 
          ok: false, 
          stage: "search", 
          error: "Companies House search failed", 
          upstream_status: r.status, 
          upstream_body: txt 
        }), {
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      const data = await r.json();
      const items = data?.items ?? [];
      const results = items.map((c: any) => ({
        company_name: c.title ?? c.company_name ?? "",
        company_number: c.company_number ?? "",
        status: c.company_status ?? c.company_status_detail ?? null,
        address: c.address ?? c.address_snippet ?? null,
      }));
      
      return new Response(JSON.stringify({ ok: true, results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get company profile by number
    if (number) {
      const url = `${CH_BASE}/company/${encodeURIComponent(number)}`;
      const r = await fetch(url, { headers: chHeaders(apiKey) });
      
      if (!r.ok) {
        const txt = await r.text();
        console.error("Companies House profile failed:", r.status, txt);
        return new Response(JSON.stringify({ 
          ok: false, 
          stage: "profile", 
          error: "Companies House profile failed", 
          upstream_status: r.status, 
          upstream_body: txt 
        }), {
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      
      const profile = await r.json();
      const accounts = profile.accounts ?? {};
      const conf = profile.confirmation_statement ?? {};
      const ard = accounts.accounting_reference_date ?? {};
      
      const payload: any = {
        company_name: profile.company_name ?? "",
        company_number: profile.company_number ?? number,
        status: profile.company_status ?? null,
        date_of_creation: profile.date_of_creation ?? null,
        registered_office_address: profile.registered_office_address ?? null,
        accounting_reference_date: { day: ard.day ?? null, month: ard.month ?? null },
        accounts_next_due: accounts.next_due ?? null,
        accounts_last_made_up_to: accounts.last_accounts?.made_up_to ?? null,
        accounts_next_made_up_to: accounts.next_made_up_to ?? null,
        confirmation_statement_next_due: conf.next_due ?? null,
        confirmation_statement_last_made_up_to: conf.last_made_up_to ?? null,
        confirmation_statement_next_made_up_to: conf.next_made_up_to ?? null,
      };

      // Fetch officers if requested
      if (includeOfficers) {
        try {
          const officersUrl = `${CH_BASE}/company/${encodeURIComponent(number)}/officers`;
          const officersResponse = await fetch(officersUrl, { headers: chHeaders(apiKey) });
          
          if (officersResponse.ok) {
            const officersData = await officersResponse.json();
            const officers = (officersData?.items ?? []).map((officer: any) => ({
              name: officer.name ?? "",
              officer_role: officer.officer_role ?? "",
              appointed_on: officer.appointed_on ?? null,
              resigned_on: officer.resigned_on ?? null,
              nationality: officer.nationality ?? null,
              occupation: officer.occupation ?? null,
              country_of_residence: officer.country_of_residence ?? null,
              date_of_birth: officer.date_of_birth ? {
                month: officer.date_of_birth.month,
                year: officer.date_of_birth.year
              } : null,
              address: officer.address ?? null,
            }));
            payload.officers = officers;
          }
        } catch (error) {
          console.error("Failed to fetch officers:", error);
          // Don't fail the whole request if officers fetch fails
        }
      }
      
      return new Response(JSON.stringify({ ok: true, ...payload }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: "Provide q (search) or number (profile)" }), {
      status: 200, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("Companies House function error:", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});