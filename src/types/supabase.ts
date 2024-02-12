export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
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
				Relationships: [
					{
						foreignKeyName: 'api_keys_service_id_fkey'
						columns: ['service_id']
						isOneToOne: false
						referencedRelation: 'services'
						referencedColumns: ['id']
					},
				]
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
				Relationships: [
					{
						foreignKeyName: 'hook_deliveries_hook_id_fkey'
						columns: ['hook_id']
						isOneToOne: false
						referencedRelation: 'hooks'
						referencedColumns: ['id']
					},
				]
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
				Relationships: [
					{
						foreignKeyName: 'hooks_service_id_fkey'
						columns: ['service_id']
						isOneToOne: false
						referencedRelation: 'services'
						referencedColumns: ['id']
					},
				]
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
				Relationships: [
					{
						foreignKeyName: 'invoices_service_id_fkey'
						columns: ['service_id']
						isOneToOne: false
						referencedRelation: 'services'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'invoices_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			payments: {
				Row: {
					amount: number
					amountRaws: string
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
					amountRaws?: string
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
					amountRaws?: string
					created_at?: string
					from?: string
					hash?: string
					id?: number
					invoice_id?: string
					timestamp?: number
					to?: string
				}
				Relationships: [
					{
						foreignKeyName: 'payments_invoice_id_fkey'
						columns: ['invoice_id']
						isOneToOne: false
						referencedRelation: 'invoices'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'payments_to_fkey'
						columns: ['to']
						isOneToOne: false
						referencedRelation: 'invoices'
						referencedColumns: ['pay_address']
					},
				]
			}
			profiles: {
				Row: {
					avatar_url: string | null
					created_at: string | null
					email: string
					name: string
					user_id: string
				}
				Insert: {
					avatar_url?: string | null
					created_at?: string | null
					email: string
					name: string
					user_id: string
				}
				Update: {
					avatar_url?: string | null
					created_at?: string | null
					email?: string
					name?: string
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'profiles_user_id_fkey'
						columns: ['user_id']
						isOneToOne: true
						referencedRelation: 'users'
						referencedColumns: ['id']
					},
				]
			}
			reserved_names: {
				Row: {
					created_at: string | null
					name: string
				}
				Insert: {
					created_at?: string | null
					name: string
				}
				Update: {
					created_at?: string | null
					name?: string
				}
				Relationships: []
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
					user_id?: string
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
				Relationships: [
					{
						foreignKeyName: 'services_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
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

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
			Database['public']['Views'])
	? (Database['public']['Tables'] &
			Database['public']['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R
	  }
		? R
		: never
	: never

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I
	  }
		? I
		: never
	: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof Database['public']['Tables']
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U
	  }
		? U
		: never
	: never

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof Database['public']['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
	? Database['public']['Enums'][PublicEnumNameOrOptions]
	: never
