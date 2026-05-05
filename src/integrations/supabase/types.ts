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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      advisor_social_media_links: {
        Row: {
          added_by: string
          contacted_email: boolean
          contacted_instagram: boolean
          contacted_phone: boolean
          contacted_whatsapp: boolean
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          link: string | null
          name: string
          phone: string | null
          platform: string
          whatsapp: string | null
        }
        Insert: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Update: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      arge_cards: {
        Row: {
          content: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      arge_files: {
        Row: {
          card_id: string | null
          created_at: string
          created_by: string
          description: string | null
          file_name: string
          file_path: string
          id: string
          title: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          file_name: string
          file_path: string
          id?: string
          title: string
        }
        Update: {
          card_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          file_name?: string
          file_path?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "arge_files_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "arge_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      arge_links: {
        Row: {
          card_id: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          card_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "arge_links_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "arge_cards"
            referencedColumns: ["id"]
          },
        ]
      }
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
      consultant_social_media_links: {
        Row: {
          added_by: string
          contacted_email: boolean
          contacted_instagram: boolean
          contacted_phone: boolean
          contacted_whatsapp: boolean
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          link: string | null
          name: string
          phone: string | null
          platform: string
          whatsapp: string | null
        }
        Insert: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Update: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact: string
          created_at: string
          durum: string | null
          durum_customer: string | null
          durum_dm: string | null
          id: string
          sorumlu: string | null
          telefon: string | null
          tur: string | null
          updated_at: string
          websitesi: string | null
          yorumlar: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          durum?: string | null
          durum_customer?: string | null
          durum_dm?: string | null
          id?: string
          sorumlu?: string | null
          telefon?: string | null
          tur?: string | null
          updated_at?: string
          websitesi?: string | null
          yorumlar?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          durum?: string | null
          durum_customer?: string | null
          durum_dm?: string | null
          id?: string
          sorumlu?: string | null
          telefon?: string | null
          tur?: string | null
          updated_at?: string
          websitesi?: string | null
          yorumlar?: string | null
        }
        Relationships: []
      }
      contributor_social_media_links: {
        Row: {
          added_by: string
          contacted_email: boolean
          contacted_instagram: boolean
          contacted_phone: boolean
          contacted_whatsapp: boolean
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          link: string | null
          name: string
          phone: string | null
          platform: string
          whatsapp: string | null
        }
        Insert: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Update: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      diaspora_city_scan_queue: {
        Row: {
          city: string
          city_slug: string
          country: string
          country_tr: string | null
          created_at: string | null
          id: string
          last_scan_at: string | null
          priority: number | null
          scan_count: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          city: string
          city_slug: string
          country?: string
          country_tr?: string | null
          created_at?: string | null
          id?: string
          last_scan_at?: string | null
          priority?: number | null
          scan_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          city_slug?: string
          country?: string
          country_tr?: string | null
          created_at?: string | null
          id?: string
          last_scan_at?: string | null
          priority?: number | null
          scan_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      diaspora_instagram_accounts: {
        Row: {
          bio: string | null
          category: string | null
          city: string
          city_slug: string | null
          classification_reason: string | null
          confidence_score: number | null
          country: string
          country_tr: string | null
          created_at: string | null
          diaspora_usefulness: string | null
          display_name: string | null
          first_seen_at: string | null
          id: string
          instagram_url: string
          language: string | null
          last_checked_at: string | null
          last_seen_at: string | null
          raw_payload: Json | null
          relevance_score: number | null
          review_notes: string | null
          source_query: string | null
          source_snippet: string | null
          source_title: string | null
          source_url: string | null
          status: string
          subcategory: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          bio?: string | null
          category?: string | null
          city: string
          city_slug?: string | null
          classification_reason?: string | null
          confidence_score?: number | null
          country?: string
          country_tr?: string | null
          created_at?: string | null
          diaspora_usefulness?: string | null
          display_name?: string | null
          first_seen_at?: string | null
          id?: string
          instagram_url: string
          language?: string | null
          last_checked_at?: string | null
          last_seen_at?: string | null
          raw_payload?: Json | null
          relevance_score?: number | null
          review_notes?: string | null
          source_query?: string | null
          source_snippet?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          bio?: string | null
          category?: string | null
          city?: string
          city_slug?: string | null
          classification_reason?: string | null
          confidence_score?: number | null
          country?: string
          country_tr?: string | null
          created_at?: string | null
          diaspora_usefulness?: string | null
          display_name?: string | null
          first_seen_at?: string | null
          id?: string
          instagram_url?: string
          language?: string | null
          last_checked_at?: string | null
          last_seen_at?: string | null
          raw_payload?: Json | null
          relevance_score?: number | null
          review_notes?: string | null
          source_query?: string | null
          source_snippet?: string | null
          source_title?: string | null
          source_url?: string | null
          status?: string
          subcategory?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      diaspora_scan_runs: {
        Row: {
          brave_results_checked: number | null
          city: string
          city_slug: string
          country: string
          country_tr: string | null
          duplicate_records: number | null
          error_message: string | null
          finished_at: string | null
          id: string
          inserted_records: number | null
          instagram_urls_found: number | null
          needs_review_records: number | null
          queries_executed: number | null
          raw_report: Json | null
          started_at: string | null
          status: string
          valid_candidates: number | null
        }
        Insert: {
          brave_results_checked?: number | null
          city: string
          city_slug: string
          country: string
          country_tr?: string | null
          duplicate_records?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          inserted_records?: number | null
          instagram_urls_found?: number | null
          needs_review_records?: number | null
          queries_executed?: number | null
          raw_report?: Json | null
          started_at?: string | null
          status?: string
          valid_candidates?: number | null
        }
        Update: {
          brave_results_checked?: number | null
          city?: string
          city_slug?: string
          country?: string
          country_tr?: string | null
          duplicate_records?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          inserted_records?: number | null
          instagram_urls_found?: number | null
          needs_review_records?: number | null
          queries_executed?: number | null
          raw_report?: Json | null
          started_at?: string | null
          status?: string
          valid_candidates?: number | null
        }
        Relationships: []
      }
      doc_categories: {
        Row: {
          created_at: string
          default_expanded: boolean
          icon_key: string
          id: string
          label: string
          short_description: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_expanded?: boolean
          icon_key: string
          id?: string
          label: string
          short_description: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_expanded?: boolean
          icon_key?: string
          id?: string
          label?: string
          short_description?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      draft_notlar: {
        Row: {
          created_at: string | null
          icerik: string
          id: string
        }
        Insert: {
          created_at?: string | null
          icerik: string
          id?: string
        }
        Update: {
          created_at?: string | null
          icerik?: string
          id?: string
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
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description: string
          expense_date: string
          id: string
          invoice_url: string | null
          is_virtual_card: boolean
          note: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          person: Database["public"]["Enums"]["person_type"]
          status: Database["public"]["Enums"]["expense_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description: string
          expense_date: string
          id?: string
          invoice_url?: string | null
          is_virtual_card?: boolean
          note?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          person: Database["public"]["Enums"]["person_type"]
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string
          expense_date?: string
          id?: string
          invoice_url?: string | null
          is_virtual_card?: boolean
          note?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          person?: Database["public"]["Enums"]["person_type"]
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
        }
        Relationships: []
      }
      gorevler: {
        Row: {
          aciklama: string | null
          atanan: string | null
          baslangic: string | null
          bitis: string | null
          created_at: string | null
          durum: string | null
          gorev: string | null
          id: string
          link: string | null
        }
        Insert: {
          aciklama?: string | null
          atanan?: string | null
          baslangic?: string | null
          bitis?: string | null
          created_at?: string | null
          durum?: string | null
          gorev?: string | null
          id?: string
          link?: string | null
        }
        Update: {
          aciklama?: string | null
          atanan?: string | null
          baslangic?: string | null
          bitis?: string | null
          created_at?: string | null
          durum?: string | null
          gorev?: string | null
          id?: string
          link?: string | null
        }
        Relationships: []
      }
      incomes: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["income_category"]
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["currency_code"]
          description: string
          id: string
          income_date: string
          link: string | null
          note: string | null
          source: string
          status: Database["public"]["Enums"]["income_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["income_category"]
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description: string
          id?: string
          income_date: string
          link?: string | null
          note?: string | null
          source: string
          status?: Database["public"]["Enums"]["income_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["income_category"]
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string
          id?: string
          income_date?: string
          link?: string | null
          note?: string | null
          source?: string
          status?: Database["public"]["Enums"]["income_status"]
          updated_at?: string
        }
        Relationships: []
      }
      influencer_social_media_links: {
        Row: {
          added_by: string
          contacted_email: boolean
          contacted_instagram: boolean
          contacted_phone: boolean
          contacted_whatsapp: boolean
          created_at: string
          description: string | null
          email: string | null
          id: string
          instagram: string | null
          link: string | null
          name: string
          phone: string | null
          platform: string
          whatsapp: string | null
        }
        Insert: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
        }
        Update: {
          added_by?: string
          contacted_email?: boolean
          contacted_instagram?: boolean
          contacted_phone?: boolean
          contacted_whatsapp?: boolean
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          instagram?: string | null
          link?: string | null
          name?: string
          phone?: string | null
          platform?: string
          whatsapp?: string | null
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
      lansman_registrations: {
        Row: {
          created_at: string
          description: string | null
          first_name: string
          id: string
          initials: string | null
          instagram: string | null
          last_name: string
          linkedin: string | null
          phone: string
          status: string
          twitter: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          first_name: string
          id?: string
          initials?: string | null
          instagram?: string | null
          last_name: string
          linkedin?: string | null
          phone: string
          status?: string
          twitter?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          first_name?: string
          id?: string
          initials?: string | null
          instagram?: string | null
          last_name?: string
          linkedin?: string | null
          phone?: string
          status?: string
          twitter?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          added_by: string
          created_at: string
          description: string | null
          id: string
          link: string | null
          type: string
        }
        Insert: {
          added_by?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          type?: string
        }
        Update: {
          added_by?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          type?: string
        }
        Relationships: []
      }
      marquee_items: {
        Row: {
          created_at: string
          detail_content: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          is_active: boolean
          link_enabled: boolean
          metric_value: string | null
          news_post_id: number | null
          published_at: string
          slug: string | null
          sort_order: number
          summary: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          detail_content?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          link_enabled?: boolean
          metric_value?: string | null
          news_post_id?: number | null
          published_at?: string
          slug?: string | null
          sort_order?: number
          summary: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          detail_content?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          is_active?: boolean
          link_enabled?: boolean
          metric_value?: string | null
          news_post_id?: number | null
          published_at?: string
          slug?: string | null
          sort_order?: number
          summary?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          match_reason: string | null
          match_score: number | null
          match_type: string
          matched_submission_id: string
          notified_source: boolean
          notified_target: boolean
          source_submission_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_reason?: string | null
          match_score?: number | null
          match_type?: string
          matched_submission_id: string
          notified_source?: boolean
          notified_target?: boolean
          source_submission_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_reason?: string | null
          match_score?: number | null
          match_type?: string
          matched_submission_id?: string
          notified_source?: boolean
          notified_target?: boolean
          source_submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_matched_submission_id_fkey"
            columns: ["matched_submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_source_submission_id_fkey"
            columns: ["source_submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_notes: {
        Row: {
          category: string
          content: string
          created_at: string
          date: string
          id: string
          sort_order: number | null
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          date: string
          id?: string
          sort_order?: number | null
          source: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          date?: string
          id?: string
          sort_order?: number | null
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mvp_items: {
        Row: {
          added_by: string
          ayrinti: string | null
          created_at: string
          id: string
          is_seed: boolean
          konu: string
          mvp_level: string
          sub: string | null
          updated_at: string
        }
        Insert: {
          added_by?: string
          ayrinti?: string | null
          created_at?: string
          id?: string
          is_seed?: boolean
          konu: string
          mvp_level?: string
          sub?: string | null
          updated_at?: string
        }
        Update: {
          added_by?: string
          ayrinti?: string | null
          created_at?: string
          id?: string
          is_seed?: boolean
          konu?: string
          mvp_level?: string
          sub?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      news_posts: {
        Row: {
          category: string | null
          city: string | null
          country: string | null
          created_at: string | null
          id: number
          image_url: string | null
          language: string | null
          original_url: string | null
          published_at: string | null
          source_name: string | null
          source_url: string | null
          status: string | null
          summary: string | null
          title: string
          unique_hash: string
        }
        Insert: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: never
          image_url?: string | null
          language?: string | null
          original_url?: string | null
          published_at?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title: string
          unique_hash: string
        }
        Update: {
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: never
          image_url?: string | null
          language?: string | null
          original_url?: string | null
          published_at?: string | null
          source_name?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          unique_hash?: string
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
          created_at?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rag_documents: {
        Row: {
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          source: string | null
          title: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          title?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          source?: string | null
          title?: string | null
        }
        Relationships: []
      }
      referral_code_usages: {
        Row: {
          email: string | null
          full_name: string | null
          id: string
          referral_code_id: string
          submission_id: string
          used_at: string
        }
        Insert: {
          email?: string | null
          full_name?: string | null
          id?: string
          referral_code_id: string
          submission_id: string
          used_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          id?: string
          referral_code_id?: string
          submission_id?: string
          used_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_code_usages_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_code_usages_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          group_code: string
          group_id: string
          id: string
          is_active: boolean
          is_used: boolean
          month_num: number
          note: string | null
          random_part: string
          source_code: string
          source_id: string
          type_code: string
          type_id: string
          usage_count: number
          used_at: string | null
          valid_from: string
          valid_until: string
          year_short: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          group_code: string
          group_id: string
          id?: string
          is_active?: boolean
          is_used?: boolean
          month_num: number
          note?: string | null
          random_part: string
          source_code: string
          source_id: string
          type_code: string
          type_id: string
          usage_count?: number
          used_at?: string | null
          valid_from: string
          valid_until: string
          year_short: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          group_code?: string
          group_id?: string
          id?: string
          is_active?: boolean
          is_used?: boolean
          month_num?: number
          note?: string | null
          random_part?: string
          source_code?: string
          source_id?: string
          type_code?: string
          type_id?: string
          usage_count?: number
          used_at?: string | null
          valid_from?: string
          valid_until?: string
          year_short?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_codes_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "referral_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "referral_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_codes_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "referral_types"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes_legacy: {
        Row: {
          check_char: string
          code: string
          code_prefix: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          is_used: boolean
          month_char: string
          note: string | null
          random_part: string
          referral_date: string
          source_char: string
          source_key: string
          type_char: string
          type_key: string
          used_at: string | null
          used_by: string | null
          year_short: string
        }
        Insert: {
          check_char: string
          code: string
          code_prefix: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_used?: boolean
          month_char: string
          note?: string | null
          random_part: string
          referral_date: string
          source_char: string
          source_key: string
          type_char: string
          type_key: string
          used_at?: string | null
          used_by?: string | null
          year_short: string
        }
        Update: {
          check_char?: string
          code?: string
          code_prefix?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          is_used?: boolean
          month_char?: string
          note?: string | null
          random_part?: string
          referral_date?: string
          source_char?: string
          source_key?: string
          type_char?: string
          type_key?: string
          used_at?: string | null
          used_by?: string | null
          year_short?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "referral_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      referral_groups: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      referral_sources: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      referral_types: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
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
      social_media_links: {
        Row: {
          added_by: string
          created_at: string
          description: string | null
          id: string
          link: string | null
          platform: string
        }
        Insert: {
          added_by?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          platform?: string
        }
        Update: {
          added_by?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          platform?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          business: string | null
          category: string | null
          city: string
          company_name: string | null
          consent: boolean
          contact_email_reached: boolean
          contact_instagram_reached: boolean
          contact_phone_reached: boolean
          contact_whatsapp_reached: boolean
          contest_interest: boolean | null
          country: string
          created_at: string
          description: string | null
          document_name: string | null
          document_url: string | null
          documents: Json
          donation_amount: number | null
          donation_currency: string | null
          email: string
          facebook: string | null
          field: string
          form_type: string
          fullname: string
          id: string
          instagram: string | null
          linkedin: string | null
          notes: string | null
          offers_needs: string | null
          phone: string
          referral_code: string | null
          referral_code_id: string | null
          referral_detail: string | null
          referral_source: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          source_external_id: string | null
          source_type: string
          status: string
          tiktok: string | null
          twitter: string | null
          website: string | null
          whatsapp_interest: boolean | null
        }
        Insert: {
          business?: string | null
          category?: string | null
          city: string
          company_name?: string | null
          consent?: boolean
          contact_email_reached?: boolean
          contact_instagram_reached?: boolean
          contact_phone_reached?: boolean
          contact_whatsapp_reached?: boolean
          contest_interest?: boolean | null
          country: string
          created_at?: string
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          documents?: Json
          donation_amount?: number | null
          donation_currency?: string | null
          email: string
          facebook?: string | null
          field: string
          form_type?: string
          fullname: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          notes?: string | null
          offers_needs?: string | null
          phone: string
          referral_code?: string | null
          referral_code_id?: string | null
          referral_detail?: string | null
          referral_source?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_external_id?: string | null
          source_type?: string
          status?: string
          tiktok?: string | null
          twitter?: string | null
          website?: string | null
          whatsapp_interest?: boolean | null
        }
        Update: {
          business?: string | null
          category?: string | null
          city?: string
          company_name?: string | null
          consent?: boolean
          contact_email_reached?: boolean
          contact_instagram_reached?: boolean
          contact_phone_reached?: boolean
          contact_whatsapp_reached?: boolean
          contest_interest?: boolean | null
          country?: string
          created_at?: string
          description?: string | null
          document_name?: string | null
          document_url?: string | null
          documents?: Json
          donation_amount?: number | null
          donation_currency?: string | null
          email?: string
          facebook?: string | null
          field?: string
          form_type?: string
          fullname?: string
          id?: string
          instagram?: string | null
          linkedin?: string | null
          notes?: string | null
          offers_needs?: string | null
          phone?: string
          referral_code?: string | null
          referral_code_id?: string | null
          referral_detail?: string | null
          referral_source?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          source_external_id?: string | null
          source_type?: string
          status?: string
          tiktok?: string | null
          twitter?: string | null
          website?: string | null
          whatsapp_interest?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      todo_items: {
        Row: {
          acil: boolean
          ayrinti: string | null
          created_at: string
          durum: string
          id: string
          kim: string
          konu: string
          ne_zaman: string | null
          updated_at: string
        }
        Insert: {
          acil?: boolean
          ayrinti?: string | null
          created_at?: string
          durum?: string
          id?: string
          kim?: string
          konu: string
          ne_zaman?: string | null
          updated_at?: string
        }
        Update: {
          acil?: boolean
          ayrinti?: string | null
          created_at?: string
          durum?: string
          id?: string
          kim?: string
          konu?: string
          ne_zaman?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          created_at: string
          durum: string
          gorev: string | null
          id: number
          konu: string
          sorumlu: string | null
          tarih: string
          zaman: string | null
        }
        Insert: {
          created_at?: string
          durum?: string
          gorev?: string | null
          id?: number
          konu: string
          sorumlu?: string | null
          tarih?: string
          zaman?: string | null
        }
        Update: {
          created_at?: string
          durum?: string
          gorev?: string | null
          id?: number
          konu?: string
          sorumlu?: string | null
          tarih?: string
          zaman?: string | null
        }
        Relationships: []
      }
      user_cvs: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          first_name: string
          id: string
          instagram_url: string | null
          last_name: string
          linkedin_url: string | null
          role: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          first_name: string
          id?: string
          instagram_url?: string | null
          last_name: string
          linkedin_url?: string | null
          role?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          first_name?: string
          id?: string
          instagram_url?: string | null
          last_name?: string
          linkedin_url?: string | null
          role?: string | null
          website_url?: string | null
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
      wa_messages: {
        Row: {
          created_at: string | null
          id: number
          message_text: string | null
          reply_text: string | null
          wa_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          message_text?: string | null
          reply_text?: string | null
          wa_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          message_text?: string | null
          reply_text?: string | null
          wa_id?: string
        }
        Relationships: []
      }
      wa_tasks: {
        Row: {
          created_at: string | null
          id: number
          status: string
          task: string
          wa_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          status?: string
          task: string
          wa_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          status?: string
          task?: string
          wa_id?: string
        }
        Relationships: []
      }
      wa_users: {
        Row: {
          category: string | null
          city: string | null
          conversation_mode: string | null
          country: string | null
          created_at: string | null
          current_step: string
          discovery_source: string | null
          email: string | null
          funnel_interest: boolean | null
          id: number
          name: string | null
          note: string | null
          occupation_interest: string | null
          organization: string | null
          phone: string | null
          privacy_consent: boolean | null
          referral_code: string | null
          registration_completed_at: string | null
          registration_status: string | null
          surname: string | null
          updated_at: string | null
          wa_id: string
          whatsapp_group_interest: boolean | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          conversation_mode?: string | null
          country?: string | null
          created_at?: string | null
          current_step?: string
          discovery_source?: string | null
          email?: string | null
          funnel_interest?: boolean | null
          id?: never
          name?: string | null
          note?: string | null
          occupation_interest?: string | null
          organization?: string | null
          phone?: string | null
          privacy_consent?: boolean | null
          referral_code?: string | null
          registration_completed_at?: string | null
          registration_status?: string | null
          surname?: string | null
          updated_at?: string | null
          wa_id: string
          whatsapp_group_interest?: boolean | null
        }
        Update: {
          category?: string | null
          city?: string | null
          conversation_mode?: string | null
          country?: string | null
          created_at?: string | null
          current_step?: string
          discovery_source?: string | null
          email?: string | null
          funnel_interest?: boolean | null
          id?: never
          name?: string | null
          note?: string | null
          occupation_interest?: string | null
          organization?: string | null
          phone?: string | null
          privacy_consent?: boolean | null
          referral_code?: string | null
          registration_completed_at?: string | null
          registration_status?: string | null
          surname?: string | null
          updated_at?: string | null
          wa_id?: string
          whatsapp_group_interest?: boolean | null
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
      v_muhasebe_by_category: {
        Row: {
          category: Database["public"]["Enums"]["expense_category"] | null
          record_count: number | null
          total_try: number | null
        }
        Relationships: []
      }
      v_muhasebe_by_person: {
        Row: {
          paid_try: number | null
          pending_try: number | null
          person: Database["public"]["Enums"]["person_type"] | null
          record_count: number | null
          total_try: number | null
        }
        Relationships: []
      }
      v_muhasebe_cashflow_monthly: {
        Row: {
          baris_try: number | null
          burak_try: number | null
          expense_paid_try: number | null
          expense_pending_try: number | null
          expense_try: number | null
          income_collected_try: number | null
          income_pending_try: number | null
          income_try: number | null
          month_num: number | null
          net_try: number | null
          ortak_try: number | null
          year_num: number | null
        }
        Relationships: []
      }
      v_muhasebe_kpi: {
        Row: {
          net_position_try: number | null
          pending_expense_try: number | null
          pending_income_try: number | null
          total_expense_try: number | null
          total_income_try: number | null
          total_records: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      match_rag_documents: {
        Args: { match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: string
          similarity: number
          source: string
          title: string
        }[]
      }
      validate_and_bind_referral_code: {
        Args: { input_code: string; reference_time?: string }
        Returns: {
          group_code: string
          message: string
          normalized_code: string
          referral_code_id: string
          source_code: string
          status: string
          type_code: string
          valid_from: string
          valid_until: string
        }[]
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
      currency_code: "TRY" | "USD" | "EUR" | "GBP" | "QAR"
      expense_category:
        | "yazilim_araclar"
        | "hosting_sunucu"
        | "alan_adi_ssl"
        | "pazarlama_reklam"
        | "hukuki_danismanlik"
        | "muhasebe_finans"
        | "seyahat_ulasim"
        | "ofis_kirtasiye"
        | "maas_ucret"
        | "esop_hisse"
        | "banka_komisyon"
        | "diger_gider"
      expense_status: "odendi" | "bekliyor" | "iptal"
      income_category:
        | "pilot_gelir"
        | "danismanlik_geliri"
        | "hibe_grant"
        | "yatirim_taahhudu"
        | "demo_geliri"
        | "diger_gelir"
      income_status: "tahsil_edildi" | "bekliyor" | "iptal"
      payment_method:
        | "sanal_kart_burak"
        | "sanal_kart_baris"
        | "kisisel_kart_burak"
        | "kisisel_kart_baris"
        | "havale_eft"
        | "nakit"
        | "diger"
      person_type: "burak" | "baris" | "ortak"
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
      currency_code: ["TRY", "USD", "EUR", "GBP", "QAR"],
      expense_category: [
        "yazilim_araclar",
        "hosting_sunucu",
        "alan_adi_ssl",
        "pazarlama_reklam",
        "hukuki_danismanlik",
        "muhasebe_finans",
        "seyahat_ulasim",
        "ofis_kirtasiye",
        "maas_ucret",
        "esop_hisse",
        "banka_komisyon",
        "diger_gider",
      ],
      expense_status: ["odendi", "bekliyor", "iptal"],
      income_category: [
        "pilot_gelir",
        "danismanlik_geliri",
        "hibe_grant",
        "yatirim_taahhudu",
        "demo_geliri",
        "diger_gelir",
      ],
      income_status: ["tahsil_edildi", "bekliyor", "iptal"],
      payment_method: [
        "sanal_kart_burak",
        "sanal_kart_baris",
        "kisisel_kart_burak",
        "kisisel_kart_baris",
        "havale_eft",
        "nakit",
        "diger",
      ],
      person_type: ["burak", "baris", "ortak"],
    },
  },
} as const
