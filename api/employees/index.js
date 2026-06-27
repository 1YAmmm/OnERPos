import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET')
      return res.status(405).json({ error: 'Method not allowed' });

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const {
      data: { user },
      error: tokenError,
    } = await supabase.auth.getUser(token);
    if (tokenError || !user)
      return res.status(401).json({ error: 'Invalid token' });

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (callerProfile?.role !== 'owner')
      return res.status(403).json({ error: 'Forbidden' });

    const { data: employees, error } = await supabase
      .from('employee_profiles')
      .select(
        `
        id,
        position,
        hourly_rate,
        hire_date,
        profiles!employee_profiles_id_fkey (
          full_name,
          email,
          is_active
        )
      `
      )
      .eq('owner_id', user.id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    const flat = employees.map(
      ({ id, position, hourly_rate, hire_date, profiles: p }) => ({
        id,
        name: p?.full_name ?? '',
        email: p?.email ?? '',
        role: position ?? '—',
        salary: hourly_rate ?? 0,
        joined: hire_date ?? '—',
        status: p?.is_active ? 'active' : 'inactive',
      })
    );

    return res.status(200).json({ employees: flat });
  } catch (err) {
    console.error('Unhandled error:', err);
    return res.status(500).json({ error: err.message });
  }
}
