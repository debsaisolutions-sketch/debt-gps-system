import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://egyruxwhldsmxhiqcekl.supabase.co'
const supabaseAnonKey = 'sb_publishable_9AsiDMx2RM8e657vv0w0lg__glnZ3hv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)