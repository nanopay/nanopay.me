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
			api_keys: {
				Row: {
					checksum: string
					created_at: string
					description: string | null
					id: number
					name: string
					scopes: string[]
					service_id: string
				}
				Insert: {
					checksum: string
					created_at?: string
					description?: string | null
					id?: number
					name: string
					scopes: string[]
					service_id: string
				}
				Update: {
					checksum?: string
					created_at?: string
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
			invoices: {
				Row: {
					created_at: string
					currency: string
					description: string | null
					expires_at: string
					id: string
					index: number
					metadata: Json | null
					pay_address: string | null
					price: number
					received_amount: number
					recipient_address: string
					redirect_url: string | null
					refunded_amount: number
					service_id: string
					status: Database['public']['Enums']['invoice_status']
					title: string
				}
				Insert: {
					created_at?: string
					currency: string
					description?: string | null
					expires_at: string
					id: string
					index?: number
					metadata?: Json | null
					pay_address?: string | null
					price: number
					received_amount?: number
					recipient_address: string
					redirect_url?: string | null
					refunded_amount?: number
					service_id: string
					status?: Database['public']['Enums']['invoice_status']
					title: string
				}
				Update: {
					created_at?: string
					currency?: string
					description?: string | null
					expires_at?: string
					id?: string
					index?: number
					metadata?: Json | null
					pay_address?: string | null
					price?: number
					received_amount?: number
					recipient_address?: string
					redirect_url?: string | null
					refunded_amount?: number
					service_id?: string
					status?: Database['public']['Enums']['invoice_status']
					title?: string
				}
				Relationships: [
					{
						foreignKeyName: 'invoices_service_id_fkey'
						columns: ['service_id']
						isOneToOne: false
						referencedRelation: 'services'
						referencedColumns: ['id']
					},
				]
			}
			payments: {
				Row: {
					amount: number
					amount_raws: string
					created_at: string
					from: string
					hash: string
					id: string
					invoice_id: string
					timestamp: number
					to: string
				}
				Insert: {
					amount: number
					amount_raws: string
					created_at?: string
					from: string
					hash: string
					id?: string
					invoice_id: string
					timestamp: number
					to: string
				}
				Update: {
					amount?: number
					amount_raws?: string
					created_at?: string
					from?: string
					hash?: string
					id?: string
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
				]
			}
			profiles: {
				Row: {
					avatar_url: string | null
					created_at: string
					email: string
					name: string
					user_id: string
				}
				Insert: {
					avatar_url?: string | null
					created_at?: string
					email: string
					name: string
					user_id: string
				}
				Update: {
					avatar_url?: string | null
					created_at?: string
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
					created_at: string
					name: string
				}
				Insert: {
					created_at?: string
					name: string
				}
				Update: {
					created_at?: string
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
					display_name: string
					id: string
					invoices_count: number
					name: string
					user_id: string
					webhooks_count: number
					website: string | null
				}
				Insert: {
					api_keys_count?: number
					avatar_url?: string | null
					contact_email?: string | null
					created_at?: string
					description?: string | null
					display_name?: string
					id?: string
					invoices_count?: number
					name: string
					user_id?: string
					webhooks_count?: number
					website?: string | null
				}
				Update: {
					api_keys_count?: number
					avatar_url?: string | null
					contact_email?: string | null
					created_at?: string
					description?: string | null
					display_name?: string
					id?: string
					invoices_count?: number
					name?: string
					user_id?: string
					webhooks_count?: number
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
			settings: {
				Row: {
					created_at: string
					key: string
					value: Json
				}
				Insert: {
					created_at?: string
					key: string
					value: Json
				}
				Update: {
					created_at?: string
					key?: string
					value?: Json
				}
				Relationships: []
			}
			webhooks: {
				Row: {
					active: boolean
					created_at: string
					description: string | null
					event_types: string[]
					id: string
					name: string
					secret: string | null
					service_id: string
					url: string
				}
				Insert: {
					active?: boolean
					created_at?: string
					description?: string | null
					event_types: string[]
					id?: string
					name: string
					secret?: string | null
					service_id: string
					url: string
				}
				Update: {
					active?: boolean
					created_at?: string
					description?: string | null
					event_types?: string[]
					id?: string
					name?: string
					secret?: string | null
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
			webhooks_deliveries: {
				Row: {
					completed_at: string
					created_at: string
					id: string
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
					webhook_id: string
				}
				Insert: {
					completed_at: string
					created_at?: string
					id: string
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
					webhook_id: string
				}
				Update: {
					completed_at?: string
					created_at?: string
					id?: string
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
					webhook_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'webhook_deliveries_webhook_id_fkey'
						columns: ['webhook_id']
						isOneToOne: false
						referencedRelation: 'webhooks'
						referencedColumns: ['id']
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			is_invoice_owner:
				| {
						Args: {
							invoice_id: string
						}
						Returns: boolean
				  }
				| {
						Args: {
							invoice_id: string
						}
						Returns: boolean
				  }
			is_service_owner: {
				Args: {
					service_id: string
				}
				Returns: boolean
			}
			is_webhook_owner: {
				Args: {
					webhook_id: string
				}
				Returns: boolean
			}
			update_status_of_expired_invoices: {
				Args: Record<PropertyKey, never>
				Returns: undefined
			}
		}
		Enums: {
			invoice_status: 'pending' | 'paid' | 'expired' | 'error'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (PublicSchema['Tables'] & PublicSchema['Views'])
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
	: PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
			PublicSchema['Views'])
	? (PublicSchema['Tables'] &
			PublicSchema['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R
	  }
		? R
		: never
	: never

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
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
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I
	  }
		? I
		: never
	: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema['Tables']
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
	: PublicTableNameOrOptions extends keyof PublicSchema['Tables']
	? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U
	  }
		? U
		: never
	: never

export type Enums<
	PublicEnumNameOrOptions extends
		| keyof PublicSchema['Enums']
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
	? PublicSchema['Enums'][PublicEnumNameOrOptions]
	: never
