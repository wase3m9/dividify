export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounting_integrations: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          is_connected: boolean | null
          oauth_access_token: string | null
          oauth_expires_at: string | null
          oauth_refresh_token: string | null
          platform: Database["public"]["Enums"]["accounting_platform"]
          tenant_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          oauth_access_token?: string | null
          oauth_expires_at?: string | null
          oauth_refresh_token?: string | null
          platform: Database["public"]["Enums"]["accounting_platform"]
          tenant_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          is_connected?: boolean | null
          oauth_access_token?: string | null
          oauth_expires_at?: string | null
          oauth_refresh_token?: string | null
          platform?: Database["public"]["Enums"]["accounting_platform"]
          tenant_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_integrations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_mappings: {
        Row: {
          created_at: string | null
          id: string
          integration_id: string
          lovable_account_type: string
          platform_account_id: string
          platform_account_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          integration_id: string
          lovable_account_type: string
          platform_account_id: string
          platform_account_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          integration_id?: string
          lovable_account_type?: string
          platform_account_id?: string
          platform_account_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounting_mappings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "accounting_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      accounting_sync_logs: {
        Row: {
          created_at: string | null
          dividend_record_id: string
          error_message: string | null
          id: string
          integration_id: string
          platform_journal_id: string | null
          sync_status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dividend_record_id: string
          error_message?: string | null
          id?: string
          integration_id: string
          platform_journal_id?: string | null
          sync_status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dividend_record_id?: string
          error_message?: string | null
          id?: string
          integration_id?: string
          platform_journal_id?: string | null
          sync_status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounting_sync_logs_dividend_record_id_fkey"
            columns: ["dividend_record_id"]
            isOneToOne: false
            referencedRelation: "dividend_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounting_sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "accounting_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          accounting_category: string | null
          company_category: string | null
          company_status: string | null
          created_at: string
          id: string
          incorporation_date: string | null
          name: string
          place_of_registration: string | null
          registered_address: string | null
          registered_email: string | null
          registration_number: string | null
          trade_classification: string | null
          trading_on_market: boolean | null
          user_id: string
        }
        Insert: {
          accounting_category?: string | null
          company_category?: string | null
          company_status?: string | null
          created_at?: string
          id?: string
          incorporation_date?: string | null
          name: string
          place_of_registration?: string | null
          registered_address?: string | null
          registered_email?: string | null
          registration_number?: string | null
          trade_classification?: string | null
          trading_on_market?: boolean | null
          user_id: string
        }
        Update: {
          accounting_category?: string | null
          company_category?: string | null
          company_status?: string | null
          created_at?: string
          id?: string
          incorporation_date?: string | null
          name?: string
          place_of_registration?: string | null
          registered_address?: string | null
          registered_email?: string | null
          registration_number?: string | null
          trade_classification?: string | null
          trading_on_market?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dividend_records: {
        Row: {
          amount_per_share: number
          company_id: string
          created_at: string
          director_name: string
          file_path: string | null
          financial_year_ending: string
          id: string
          payment_date: string
          share_class: string
          shareholder_name: string
          total_amount: number
          user_id: string
        }
        Insert: {
          amount_per_share: number
          company_id: string
          created_at?: string
          director_name: string
          file_path?: string | null
          financial_year_ending: string
          id?: string
          payment_date: string
          share_class: string
          shareholder_name: string
          total_amount: number
          user_id: string
        }
        Update: {
          amount_per_share?: number
          company_id?: string
          created_at?: string
          director_name?: string
          file_path?: string | null
          financial_year_ending?: string
          id?: string
          payment_date?: string
          share_class?: string
          shareholder_name?: string
          total_amount?: number
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
        ]
      }
      minutes: {
        Row: {
          company_id: string
          created_at: string
          file_path: string
          id: string
          meeting_date: string
          title: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          file_path: string
          id?: string
          meeting_date: string
          title: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          file_path?: string
          id?: string
          meeting_date?: string
          title?: string
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
        ]
      }
      officers: {
        Row: {
          address: string
          company_id: string
          computed_full_name: string | null
          created_at: string
          date_of_appointment: string
          email: string
          forenames: string
          full_name: string
          id: string
          position: string | null
          surname: string
          title: string
          user_id: string
          waive_dividend: boolean | null
        }
        Insert: {
          address: string
          company_id: string
          computed_full_name?: string | null
          created_at?: string
          date_of_appointment?: string
          email: string
          forenames: string
          full_name: string
          id?: string
          position?: string | null
          surname: string
          title: string
          user_id: string
          waive_dividend?: boolean | null
        }
        Update: {
          address?: string
          company_id?: string
          computed_full_name?: string | null
          created_at?: string
          date_of_appointment?: string
          email?: string
          forenames?: string
          full_name?: string
          id?: string
          position?: string | null
          surname?: string
          title?: string
          user_id?: string
          waive_dividend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "officers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          companies_count: number | null
          current_month_dividends: number | null
          current_month_minutes: number | null
          full_name: string | null
          id: string
          job_title: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          subscription_plan: string | null
          telephone: string | null
          trial_expired: boolean | null
          trial_start_date: string | null
          updated_at: string | null
          usage_reset_date: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          companies_count?: number | null
          current_month_dividends?: number | null
          current_month_minutes?: number | null
          full_name?: string | null
          id: string
          job_title?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          subscription_plan?: string | null
          telephone?: string | null
          trial_expired?: boolean | null
          trial_start_date?: string | null
          updated_at?: string | null
          usage_reset_date?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          companies_count?: number | null
          current_month_dividends?: number | null
          current_month_minutes?: number | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          subscription_plan?: string | null
          telephone?: string | null
          trial_expired?: boolean | null
          trial_start_date?: string | null
          updated_at?: string | null
          usage_reset_date?: string | null
          username?: string | null
        }
        Relationships: []
      }
      share_classes: {
        Row: {
          company_id: string
          created_at: string
          id: string
          nominal_value: number
          share_class_name: string
          shares_issued: number
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          nominal_value?: number
          share_class_name: string
          shares_issued?: number
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          nominal_value?: number
          share_class_name?: string
          shares_issued?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      shareholders: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_share_class: boolean | null
          number_of_holders: number
          number_of_shares: number
          share_class: string
          shareholder_name: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_share_class?: boolean | null
          number_of_holders?: number
          number_of_shares: number
          share_class: string
          shareholder_name: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_share_class?: boolean | null
          number_of_holders?: number
          number_of_shares?: number
          share_class?: string
          shareholder_name?: string
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
            foreignKeyName: "shareholdings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      accounting_platform: "quickbooks" | "xero"
      app_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
