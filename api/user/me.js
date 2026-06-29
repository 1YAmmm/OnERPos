// api/user/me.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  // ── Step 1: Get token from Authorization header ──
  const token = req.headers.authorization?.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // ── Step 2: Verify token and get auth user ──
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user)
    return res.status(401).json({ error: 'Invalid or expired token' });

  // ── Step 3: Get profile (role, full_name, email, is_active) ──
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) return res.status(404).json({ error: 'Profile not found' });

  // ── Step 4: Get role-specific data ──
  let roleData = null;

  if (profile.role === 'owner') {
    const { data } = await supabase
      .from('owner_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    roleData = data;
  }

  if (profile.role === 'employee') {
    const { data } = await supabase
      .from('employee_profiles')
      .select('position, owner_id, hourly_rate, hire_date') // explicit fields, position included
      .eq('id', user.id)
      .single();
    roleData = data;
  }

  // system_admin has no extra table — roleData stays null

  // ── Step 5: Return everything ──
  return res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      ...profile,
      ...roleData, // merge role-specific fields into profile
    },
  });
}
