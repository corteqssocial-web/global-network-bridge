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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      city_ambassador_applications: {
        Row: {
          city: string
          country: string
          created_at: string
          email: string
          first_week_plan: string | null
          full_name: string
          id: string
          known_professionals: string | null
          motivation: string | null
          organized_events: string | null
          phone: string
          reach_count: number | null
          reach_description: string | null
          status: string
          updated_at: string
          user_id: string
          weekly_hours: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string
          email: string
          first_week_plan?: string | null
          full_name: string
          id?: string
          known_professionals?: string | null
          motivation?: string | null
          organized_events?: string | null
          phone: string
          reach_count?: number | null
          reach_description?: string | null
          status?: string
          updated_at?: string
          user_id: string
          weekly_hours?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          email?: string
          first_week_plan?: string | null
          full_name?: string
          id?: string
          known_professionals?: string | null
          motivation?: string | null
          organized_events?: string | null
          phone?: string
          reach_count?: number | null
          reach_description?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          weekly_hours?: string | null
        }
        Relationships: []
      }
      consultant_categories: {
        Row: {
          category: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          city: string | null
          country: string | null
          cover_image: string | null
          created_at: string
          description: string
          end_time: string | null
          event_date: string
          featured: boolean
          id: string
          location: string | null
          max_attendees: number | null
          online_url: string | null
          organizer_name: string | null
          organizer_type: string
          price: number | null
          start_time: string | null
          status: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description: string
          end_time?: string | null
          event_date: string
          featured?: boolean
          id?: string
          location?: string | null
          max_attendees?: number | null
          online_url?: string | null
          organizer_name?: string | null
          organizer_type?: string
          price?: number | null
          start_time?: string | null
          status?: string
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string
          end_time?: string | null
          event_date?: string
          featured?: boolean
          id?: string
          location?: string | null
          max_attendees?: number | null
          online_url?: string | null
          organizer_name?: string | null
          organizer_type?: string
          price?: number | null
          start_time?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interest_registrations: {
        Row: {
          attachment_urls: string[] | null
          category: string
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          heard_from: string | null
          id: string
          interest_area: string | null
          message: string | null
          name: string | null
          organization: string | null
          phone: string | null
          referral_code: string | null
          role: string | null
          source: string | null
          supply_demand: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          heard_from?: string | null
          id?: string
          interest_area?: string | null
          message?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          referral_code?: string | null
          role?: string | null
          source?: string | null
          supply_demand?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          heard_from?: string | null
          id?: string
          interest_area?: string | null
          message?: string | null
          name?: string | null
          organization?: string | null
          phone?: string | null
          referral_code?: string | null
          role?: string | null
          source?: string | null
          supply_demand?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          onboarding_completed: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_proposals: {
        Row: {
          consultant_id: string
          created_at: string
          estimated_duration: string | null
          id: string
          message: string
          payment_terms: string | null
          price: number | null
          request_id: string
          scope: string | null
          status: string | null
        }
        Insert: {
          consultant_id: string
          created_at?: string
          estimated_duration?: string | null
          id?: string
          message: string
          payment_terms?: string | null
          price?: number | null
          request_id: string
          scope?: string | null
          status?: string | null
        }
        Update: {
          consultant_id?: string
          created_at?: string
          estimated_duration?: string | null
          id?: string
          message?: string
          payment_terms?: string | null
          price?: number | null
          request_id?: string
          scope?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_proposals_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          attachment_urls: string[] | null
          budget_max: number | null
          budget_min: number | null
          category: string
          city: string | null
          country: string | null
          created_at: string
          description: string
          id: string
          preferred_time: string | null
          status: string | null
          subcategory: string | null
          title: string
          updated_at: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          attachment_urls?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          category: string
          city?: string | null
          country?: string | null
          created_at?: string
          description: string
          id?: string
          preferred_time?: string | null
          status?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          attachment_urls?: string[] | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string
          id?: string
          preferred_time?: string | null
          status?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      welcome_pack_orders: {
        Row: {
          adults: number
          arrival_date: string
          children: number
          city: string
          country: string
          created_at: string
          has_pet: boolean
          id: string
          mentor_type: string | null
          needs_airport_transfer: boolean
          needs_baby_seat: boolean
          needs_car_rental: boolean
          needs_flight_discount: boolean
          needs_mentor: boolean
          needs_sim_card: boolean
          notes: string | null
          pet_details: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          adults?: number
          arrival_date: string
          children?: number
          city: string
          country: string
          created_at?: string
          has_pet?: boolean
          id?: string
          mentor_type?: string | null
          needs_airport_transfer?: boolean
          needs_baby_seat?: boolean
          needs_car_rental?: boolean
          needs_flight_discount?: boolean
          needs_mentor?: boolean
          needs_sim_card?: boolean
          notes?: string | null
          pet_details?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          adults?: number
          arrival_date?: string
          children?: number
          city?: string
          country?: string
          created_at?: string
          has_pet?: boolean
          id?: string
          mentor_type?: string | null
          needs_airport_transfer?: boolean
          needs_baby_seat?: boolean
          needs_car_rental?: boolean
          needs_flight_discount?: boolean
          needs_mentor?: boolean
          needs_sim_card?: boolean
          notes?: string | null
          pet_details?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      welcome_pack_proposals: {
        Row: {
          category: string
          created_at: string
          details: string | null
          id: string
          message: string
          order_id: string
          price: number | null
          provider_id: string
          status: string
        }
        Insert: {
          category: string
          created_at?: string
          details?: string | null
          id?: string
          message: string
          order_id: string
          price?: number | null
          provider_id: string
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          details?: string | null
          id?: string
          message?: string
          order_id?: string
          price?: number | null
          provider_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "welcome_pack_proposals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "welcome_pack_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_join_requests: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          landing_id: string
          note: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          landing_id: string
          note?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          landing_id?: string
          note?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_join_requests_landing_id_fkey"
            columns: ["landing_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_landings"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_landings: {
        Row: {
          admin_contact: string | null
          admin_name: string | null
          call_to_action_text: string | null
          category: string
          city: string
          conditions: string | null
          country: string
          created_at: string
          description: string | null
          group_name: string
          hero_image: string | null
          id: string
          mode: string
          rejection_reason: string | null
          slug: string
          status: string
          tagline: string | null
          updated_at: string
          user_id: string
          whatsapp_link: string
        }
        Insert: {
          admin_contact?: string | null
          admin_name?: string | null
          call_to_action_text?: string | null
          category: string
          city: string
          conditions?: string | null
          country: string
          created_at?: string
          description?: string | null
          group_name: string
          hero_image?: string | null
          id?: string
          mode?: string
          rejection_reason?: string | null
          slug: string
          status?: string
          tagline?: string | null
          updated_at?: string
          user_id: string
          whatsapp_link: string
        }
        Update: {
          admin_contact?: string | null
          admin_name?: string | null
          call_to_action_text?: string | null
          category?: string
          city?: string
          conditions?: string | null
          country?: string
          created_at?: string
          description?: string | null
          group_name?: string
          hero_image?: string | null
          id?: string
          mode?: string
          rejection_reason?: string | null
          slug?: string
          status?: string
          tagline?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_link?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "user"
        | "consultant"
        | "association"
        | "blogger"
        | "admin"
        | "business"
        | "ambassador"
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
      app_role: [
        "user",
        "consultant",
        "association",
        "blogger",
        "admin",
        "business",
        "ambassador",
      ],
    },
  },
} as const
