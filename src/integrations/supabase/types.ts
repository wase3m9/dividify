export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          accounting_category: string | null
          company_category: string | null
          company_status: string | null
          created_at: string | null
          id: string
          incorporation_date: string | null
          name: string
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
      dividend_records: {
        Row: {
          company_id: string
          created_at: string | null
          dividend_per_share: number
          file_path: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_monthly_dividends: {
        Args: { user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
