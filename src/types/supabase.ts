export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: {
          checksum: string
          created_at: string | null
          description: string | null
          id: number
          name: string
          scopes: string[]
          service_id: string
        }
        Insert: {
          checksum: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          scopes: string[]
          service_id: string
        }
        Update: {
          checksum?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          scopes?: string[]
          service_id?: string
        }
      }
      hook_deliveries: {
        Row: {
          completed_at: string
          created_at: string | null
          hook_id: string
          id: number
          redelivery: boolean
          request_body: Json
          request_headers: Json
          response_body: string | null
          response_headers: Json
          started_at: string
          status_code: number
          success: boolean
          type: string
          url: string
        }
        Insert: {
          completed_at: string
          created_at?: string | null
          hook_id: string
          id?: number
          redelivery?: boolean
          request_body: Json
          request_headers: Json
          response_body?: string | null
          response_headers: Json
          started_at: string
          status_code: number
          success: boolean
          type: string
          url: string
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          hook_id?: string
          id?: number
          redelivery?: boolean
          request_body?: Json
          request_headers?: Json
          response_body?: string | null
          response_headers?: Json
          started_at?: string
          status_code?: number
          success?: boolean
          type?: string
          url?: string
        }
      }
      hooks: {
        Row: {
          active: boolean
          created_at: string | null
          description: string | null
          event_types: string[]
          headers: Json
          id: string
          method: string
          name: string
          service_id: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          description?: string | null
          event_types: string[]
          headers: Json
          id?: string
          method?: string
          name: string
          service_id: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          description?: string | null
          event_types?: string[]
          headers?: Json
          id?: string
          method?: string
          name?: string
          service_id?: string
          url?: string
        }
      }
      invoices: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          expires_at: string
          id: string
          index: number
          metadata: Json | null
          pay_address: string | null
          price: number
          received_amount: number | null
          recipient_address: string
          redirect_url: string | null
          refunded_amount: number | null
          service_id: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at: string
          id: string
          index?: number
          metadata?: Json | null
          pay_address?: string | null
          price: number
          received_amount?: number | null
          recipient_address: string
          redirect_url?: string | null
          refunded_amount?: number | null
          service_id?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          expires_at?: string
          id?: string
          index?: number
          metadata?: Json | null
          pay_address?: string | null
          price?: number
          received_amount?: number | null
          recipient_address?: string
          redirect_url?: string | null
          refunded_amount?: number | null
          service_id?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          from: string
          hash: string
          id: number
          invoice_id: string
          timestamp: number
          to: string
        }
        Insert: {
          amount: number
          created_at?: string
          from: string
          hash: string
          id?: number
          invoice_id: string
          timestamp: number
          to: string
        }
        Update: {
          amount?: number
          created_at?: string
          from?: string
          hash?: string
          id?: number
          invoice_id?: string
          timestamp?: number
          to?: string
        }
      }
      services: {
        Row: {
          api_keys_count: number
          avatar_url: string | null
          contact_email: string | null
          created_at: string
          description: string | null
          display_name: string | null
          hooks_count: number
          id: string
          invoices_count: number
          name: string
          user_id: string
          website: string | null
        }
        Insert: {
          api_keys_count?: number
          avatar_url?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          display_name?: string | null
          hooks_count?: number
          id?: string
          invoices_count?: number
          name: string
          user_id: string
          website?: string | null
        }
        Update: {
          api_keys_count?: number
          avatar_url?: string | null
          contact_email?: string | null
          created_at?: string
          description?: string | null
          display_name?: string | null
          hooks_count?: number
          id?: string
          invoices_count?: number
          name?: string
          user_id?: string
          website?: string | null
        }
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

