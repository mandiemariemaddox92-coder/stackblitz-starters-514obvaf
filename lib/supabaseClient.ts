import { createClient } from '@supabase/supabase-js'

// 1. Check your .env.local file in the sidebar. 
// It MUST have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. This creates the connection that store.tsx uses
export const supabase = createClient(supabaseUrl, supabaseAnonKey)