import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password, businessName, businessType, ownerName } = req.body;

  // Validate all fields
  if (!email || !password || !businessName || !businessType || !ownerName)
    return res.status(400).json({ error: "All fields are required" });

  // ── Step 1: Create auth user in Supabase Auth ──
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) return res.status(400).json({ error: authError.message });

  const userId = authData.user.id;

  // ── Step 2: Insert into profiles (role = owner) ──
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    role: "owner",
    full_name: ownerName,
    email: email,
    is_active: true,
  });

  if (profileError) {
    // Rollback: delete the auth user if profile insert fails
    await supabase.auth.admin.deleteUser(userId);
    return res.status(500).json({ error: profileError.message });
  }

  // ── Step 3: Insert into owner_profiles ──
  const { error: ownerError } = await supabase.from("owner_profiles").insert({
    id: userId,
    business_name: businessName,
    business_type: businessType,
  });

  if (ownerError) {
    // Rollback: delete auth user and profile if owner_profiles insert fails
    await supabase.auth.admin.deleteUser(userId);
    return res.status(500).json({ error: ownerError.message });
  }

  return res.status(201).json({ message: "Account created successfully" });
}
