import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase: SupabaseClient | null =
	supabaseUrl && serviceRoleKey
		? createClient(supabaseUrl, serviceRoleKey)
		: null;
