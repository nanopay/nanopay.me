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
          user_id: string
        }
        Insert: {
          checksum: string
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          scopes: string[]
          service_id: string
          user_id: string
        }
        Update: {
          checksum?: string
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          scopes?: string[]
          service_id?: string
          user_id?: string
        }
      }
      hook_deliveries: {
        Row: {
          completed_at: string
          created_at: string | null
          id: number
          invoice_id: string
          payload: Json | null
          redelivery: boolean | null
          response_body: string | null
          started_at: string
          status_code: number
        }
        Insert: {
          completed_at: string
          created_at?: string | null
          id?: number
          invoice_id: string
          payload?: Json | null
          redelivery?: boolean | null
          response_body?: string | null
          started_at: string
          status_code: number
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          id?: number
          invoice_id?: string
          payload?: Json | null
          redelivery?: boolean | null
          response_body?: string | null
          started_at?: string
          status_code?: number
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
          refunded_amount: number | null
          service_id: string
          status: string | null
          title: string
          user_id: string
          webhook_url: string | null
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
          refunded_amount?: number | null
          service_id: string
          status?: string | null
          title: string
          user_id: string
          webhook_url?: string | null
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
          refunded_amount?: number | null
          service_id?: string
          status?: string | null
          title?: string
          user_id?: string
          webhook_url?: string | null
        }
      }
      services: {
        Row: {
          api_keys_count: number
          avatar_url: string | null
          contact_email: string | null
          description: string | null
          display_name: string | null
          id: string
          name: string
          user_id: string
          website: string | null
        }
        Insert: {
          api_keys_count?: number
          avatar_url?: string | null
          contact_email?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          name: string
          user_id: string
          website?: string | null
        }
        Update: {
          api_keys_count?: number
          avatar_url?: string | null
          contact_email?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          name?: string
          user_id?: string
          website?: string | null
        }
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          from: string
          hash: string
          id: number
          timestamp: number
          to: string
        }
        Insert: {
          amount: number
          created_at?: string
          from: string
          hash: string
          id?: number
          timestamp: number
          to: string
        }
        Update: {
          amount?: number
          created_at?: string
          from?: string
          hash?: string
          id?: number
          timestamp?: number
          to?: string
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
