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
      directors: {
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
            foreignKeyName: "directors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      dividend_records: {
        Row: {
          amount_per_share: number
          company_id: string
          created_at: string
          director_name: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      shareholders: {
        Row: {
          company_id: string
          created_at: string
          id: string
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
          number_of_holders?: number
          number_of_shares?: number
          share_class?: string
          shareholder_name?: string
          user_id?: string
        }
        Relationships: [
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
      [_ in never]: never
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
