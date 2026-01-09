import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export type EventName =
  | 'generation_created'
  | 'generation_failed'
  | 'pdf_downloaded'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'api_call';

export interface EventMeta {
  doc_type?: 'dividend_voucher' | 'board_minutes';
  doc_id?: string;
  source?: 'web' | 'api' | 'scheduled';
  message?: string;
  endpoint?: string;
  method?: string;
  status?: number;
  ms?: number;
  stripe_subscription_id?: string;
  plan?: string;
  interval?: string;
  amount?: number;
  [key: string]: unknown;
}

/**
 * Track an event by calling the secure log_event RPC
 * This is the primary way to log events from the frontend
 */
export const trackEvent = async (
  eventName: EventName,
  companyId?: string | null,
  meta: EventMeta = {}
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_event', {
      p_event_name: eventName,
      p_company_id: companyId ?? null,
      p_meta: JSON.parse(JSON.stringify(meta)) as Json
    });

    if (error) {
      console.error('[Event Tracking] Failed to log event:', error);
    }
  } catch (err) {
    // Non-blocking - don't let tracking failures affect user experience
    console.error('[Event Tracking] Error:', err);
  }
};

/**
 * Track a document generation event
 */
export const trackGeneration = async (
  docType: 'dividend_voucher' | 'board_minutes',
  docId: string,
  companyId?: string | null
): Promise<void> => {
  return trackEvent('generation_created', companyId, {
    doc_type: docType,
    doc_id: docId,
    source: 'web'
  });
};

/**
 * Track a failed generation event
 */
export const trackGenerationFailed = async (
  docType: 'dividend_voucher' | 'board_minutes',
  errorMessage: string,
  companyId?: string | null
): Promise<void> => {
  return trackEvent('generation_failed', companyId, {
    doc_type: docType,
    message: errorMessage,
    source: 'web'
  });
};

/**
 * Track a PDF download event
 */
export const trackPdfDownload = async (
  docType: 'dividend_voucher' | 'board_minutes',
  docId?: string,
  companyId?: string | null
): Promise<void> => {
  return trackEvent('pdf_downloaded', companyId, {
    doc_type: docType,
    doc_id: docId
  });
};

/**
 * Track an API call event
 */
export const trackApiCall = async (
  endpoint: string,
  method: string,
  status: number,
  durationMs: number,
  companyId?: string | null
): Promise<void> => {
  return trackEvent('api_call', companyId, {
    endpoint,
    method,
    status,
    ms: durationMs
  });
};
