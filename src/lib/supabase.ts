import { Database } from '@/types/supabase'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
