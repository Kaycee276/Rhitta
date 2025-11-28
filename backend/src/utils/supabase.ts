import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
	process.env.SUPABASE_URL || "https://smzevuezpbxxtapzjnpe.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!serviceRoleKey) {
	throw new Error("SUPABASE_KEY is not set in ENV");
}

export const supabase = createClient(supabaseUrl, serviceRoleKey);
