import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ltqnukboqdtwvjluhjsp.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_B_hnkYUmNgf0CKaKeigz7g__qSnl0am"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
