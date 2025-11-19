export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          company_id: string | null
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          status: string | null
          title: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message: string
          sender_type: string
          user_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message: string
          sender_type: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          accounting_category: string | null
          company_category: string | null
          company_status: string | null
          created_at: string | null
          id: string
          incorporation_date: string | null
          name: string
          next_voucher_number: number
          place_of_registration: string | null
          registered_address: string | null
          registered_email: string | null
          registration_number: string | null
          trade_classification: string | null
          trading_on_market: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accounting_category?: string | null
          company_category?: string | null
          company_status?: string | null
          created_at?: string | null
          id?: string
          incorporation_date?: string | null
          name: string
          next_voucher_number?: number
          place_of_registration?: string | null
          registered_address?: string | null
          registered_email?: string | null
          registration_number?: string | null
          trade_classification?: string | null
          trading_on_market?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accounting_category?: string | null
          company_category?: string | null
          company_status?: string | null
          created_at?: string | null
          id?: string
          incorporation_date?: string | null
          name?: string
          next_voucher_number?: number
          place_of_registration?: string | null
          registered_address?: string | null
          registered_email?: string | null
          registration_number?: string | null
          trade_classification?: string | null
          trading_on_market?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      dividend_records: {
        Row: {
          company_id: string
          created_at: string | null
          dividend_per_share: number
          file_path: string | null
          form_data: Json | null
          id: string
          number_of_shares: number
          payment_date: string
          share_class: string
          shareholder_name: string
          tax_year: string
          total_dividend: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          dividend_per_share: number
          file_path?: string | null
          form_data?: Json | null
          id?: string
          number_of_shares: number
          payment_date: string
          share_class: string
          shareholder_name: string
          tax_year: string
          total_dividend: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          dividend_per_share?: number
          file_path?: string | null
          form_data?: Json | null
          id?: string
          number_of_shares?: number
          payment_date?: string
          share_class?: string
          shareholder_name?: string
          tax_year?: string
          total_dividend?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dividend_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dividend_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      minutes: {
        Row: {
          attendees: string[]
          company_id: string
          created_at: string | null
          file_path: string | null
          form_data: Json | null
          id: string
          meeting_date: string
          meeting_type: string
          resolutions: string[]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attendees: string[]
          company_id: string
          created_at?: string | null
          file_path?: string | null
          form_data?: Json | null
          id?: string
          meeting_date: string
          meeting_type: string
          resolutions: string[]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attendees?: string[]
          company_id?: string
          created_at?: string | null
          file_path?: string | null
          form_data?: Json | null
          id?: string
          meeting_date?: string
          meeting_type?: string
          resolutions?: string[]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "minutes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "minutes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      officers: {
        Row: {
          address: string
          company_id: string
          computed_full_name: string | null
          created_at: string | null
          date_of_appointment: string
          email: string
          forenames: string
          id: string
          position: string | null
          surname: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          company_id: string
          computed_full_name?: string | null
          created_at?: string | null
          date_of_appointment: string
          email: string
          forenames: string
          id?: string
          position?: string | null
          surname: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          company_id?: string
          computed_full_name?: string | null
          created_at?: string | null
          date_of_appointment?: string
          email?: string
          forenames?: string
          id?: string
          position?: string | null
          surname?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "officers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "officers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          current_month_dividends: number | null
          current_month_minutes: number | null
          full_name: string | null
          id: string
          logo_url: string | null
          subscription_plan: string | null
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          current_month_dividends?: number | null
          current_month_minutes?: number | null
          full_name?: string | null
          id: string
          logo_url?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          current_month_dividends?: number | null
          current_month_minutes?: number | null
          full_name?: string | null
          id?: string
          logo_url?: string | null
          subscription_plan?: string | null
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      shareholders: {
        Row: {
          address: string | null
          company_id: string
          created_at: string | null
          id: string
          is_share_class: boolean | null
          number_of_holders: number | null
          number_of_shares: number
          share_class: string
          shareholder_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          is_share_class?: boolean | null
          number_of_holders?: number | null
          number_of_shares: number
          share_class: string
          shareholder_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_share_class?: boolean | null
          number_of_holders?: number | null
          number_of_shares?: number
          share_class?: string
          shareholder_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shareholders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shareholders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_code: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_code?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_code?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invitee_email: string
          inviter_id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invitee_email: string
          inviter_id: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invitee_email?: string
          inviter_id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          member_id: string
          owner_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id: string
          owner_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string
          owner_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard_metrics: {
        Row: {
          accountant_users: number | null
          active_subscriptions: number | null
          dividends_this_month: number | null
          individual_users: number | null
          minutes_this_month: number | null
          total_companies: number | null
          total_users: number | null
          trial_users: number | null
          trials_expiring_soon: number | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          action: string | null
          created_at: string | null
          description: string | null
          full_name: string | null
          id: string | null
          metadata: Json | null
          user_id: string | null
          user_type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_team_invitation: {
        Args: { invitation_id: string }
        Returns: undefined
      }
      admin_cancel_subscription: {
        Args: { reason?: string; subscription_id_param: string }
        Returns: undefined
      }
      admin_reactivate_subscription: {
        Args: { extend_days?: number; subscription_id_param: string }
        Returns: undefined
      }
      admin_update_user_profile: {
        Args: {
          new_full_name?: string
          new_subscription_plan?: string
          new_user_type?: string
          user_id_param: string
        }
        Returns: undefined
      }
      check_and_reset_monthly_counters: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      extend_user_trial: {
        Args: { days_to_extend: number; user_id_param: string }
        Returns: undefined
      }
      get_document_stats: {
        Args: { days_back?: number }
        Returns: {
          date: string
          minutes: number
          vouchers: number
        }[]
      }
      get_next_voucher_number: {
        Args: { company_id_param: string }
        Returns: number
      }
      get_subscription_details: {
        Args: { subscription_id_param: string }
        Returns: {
          company_count: number
          created_at: string
          current_month_dividends: number
          current_month_minutes: number
          current_period_end: string
          current_period_start: string
          email: string
          full_name: string
          id: string
          logo_url: string
          monthly_amount: number
          plan_code: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string
          user_id: string
          user_type: string
        }[]
      }
      get_subscription_metrics: {
        Args: never
        Returns: {
          active_subscriptions_count: number
          canceled_this_month: number
          enterprise_count: number
          past_due_count: number
          professional_count: number
          starter_count: number
          total_mrr: number
          trial_conversions_this_month: number
          trial_subscriptions_count: number
        }[]
      }
      get_subscriptions_list: {
        Args: {
          filter_plan?: string
          filter_status?: string
          page_number?: number
          page_size?: number
          search_term?: string
        }
        Returns: {
          created_at: string
          current_period_end: string
          current_period_start: string
          email: string
          full_name: string
          id: string
          monthly_amount: number
          plan_code: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          user_id: string
        }[]
      }
      get_user_details: {
        Args: { user_id_param: string }
        Returns: {
          created_at: string
          current_month_dividends: number
          current_month_minutes: number
          current_period_end: string
          current_period_start: string
          email: string
          full_name: string
          id: string
          logo_url: string
          stripe_customer_id: string
          stripe_subscription_id: string
          subscription_id: string
          subscription_plan: string
          subscription_status: string
          user_type: string
        }[]
      }
      get_user_growth: {
        Args: { days_back?: number }
        Returns: {
          date: string
          new_users: number
        }[]
      }
      get_users_list: {
        Args: {
          filter_subscription_status?: string
          filter_user_type?: string
          page_number?: number
          page_size?: number
          search_term?: string
        }
        Returns: {
          company_count: number
          created_at: string
          current_month_dividends: number
          current_month_minutes: number
          current_period_end: string
          email: string
          full_name: string
          id: string
          subscription_plan: string
          subscription_status: string
          user_type: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_monthly_dividends: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      increment_monthly_minutes: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      log_activity: {
        Args: {
          action_param: string
          company_id_param?: string
          description_param: string
          metadata_param?: Json
          user_id_param: string
        }
        Returns: undefined
      }
      log_admin_action: {
        Args: { action_type: string; details?: Json; target_user_id?: string }
        Returns: undefined
      }
      reset_monthly_counters: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user" | "owner" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "owner", "support"],
    },
  },
} as const
