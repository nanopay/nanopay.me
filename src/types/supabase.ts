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
          id: number
          project_id: number
          scopes: string[]
        }
        Insert: {
          checksum: string
          created_at?: string | null
          id?: number
          project_id: number
          scopes: string[]
        }
        Update: {
          checksum?: string
          created_at?: string | null
          id?: number
          project_id?: number
          scopes?: string[]
        }
      }
      hook_deliveries: {
        Row: {
          completed_at: string
          created_at: string | null
          hook_id: number
          id: number
          payload: Json | null
          redelivery: boolean | null
          response_body: string | null
          started_at: string
          status_code: number
        }
        Insert: {
          completed_at: string
          created_at?: string | null
          hook_id: number
          id?: number
          payload?: Json | null
          redelivery?: boolean | null
          response_body?: string | null
          started_at: string
          status_code: number
        }
        Update: {
          completed_at?: string
          created_at?: string | null
          hook_id?: number
          id?: number
          payload?: Json | null
          redelivery?: boolean | null
          response_body?: string | null
          started_at?: string
          status_code?: number
        }
      }
      hooks: {
        Row: {
          body: Json | null
          created_at: string | null
          id: number
          method: string
          retry: boolean | null
          status: string
          url: string
        }
        Insert: {
          body?: Json | null
          created_at?: string | null
          id?: number
          method: string
          retry?: boolean | null
          status: string
          url: string
        }
        Update: {
          body?: Json | null
          created_at?: string | null
          id?: number
          method?: string
          retry?: boolean | null
          status?: string
          url?: string
        }
      }
      invoices: {
        Row: {
          created_at: string | null
          currency: string | null
          expires_at: string
          id: number
          pay_address: string | null
          price: number
          received_amount: number | null
          recipient_address: string
          refunded_amount: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          expires_at: string
          id?: number
          pay_address?: string | null
          price: number
          received_amount?: number | null
          recipient_address: string
          refunded_amount?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          expires_at?: string
          id?: number
          pay_address?: string | null
          price?: number
          received_amount?: number | null
          recipient_address?: string
          refunded_amount?: number | null
          status?: string | null
        }
      }
      projects: {
        Row: {
          avatar_url: string | null
          description: string | null
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          description?: string | null
          id?: string
          name?: string | null
          user_id?: string
        }
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          from: string
          hash: string
          id: number
          to: string
        }
        Insert: {
          amount: number
          created_at?: string
          from: string
          hash: string
          id?: number
          to: string
        }
        Update: {
          amount?: number
          created_at?: string
          from?: string
          hash?: string
          id?: number
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
