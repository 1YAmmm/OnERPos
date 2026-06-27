// api/employees/update-employee.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'PATCH')
    return res.status(405).json({ error: 'Method not allowed' });

  const { id, fullName, position, hourlyRate, hireDate, status } = req.body;

  if (!id) return res.status(400).json({ error: 'Employee id is required' });

  // ── Step 1: Verify the caller is an owner ──
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const {
    data: { user: callingUser },
    error: tokenError,
  } = await supabase.auth.getUser(token);

  if (tokenError || !callingUser)
    return res.status(401).json({ error: 'Invalid or expired token' });

  const { data: callerProfile, error: callerError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', callingUser.id)
    .single();

  if (callerError || callerProfile?.role !== 'owner')
    return res.status(403).json({ error: 'Only owners can update employees' });

  // ── Step 2: Confirm the employee belongs to this owner ──
  const { data: employeeProfile, error: empError } = await supabase
    .from('employee_profiles')
    .select('owner_id')
    .eq('id', id)
    .single();

  if (empError || !employeeProfile)
    return res.status(404).json({ error: 'Employee not found' });

  if (employeeProfile.owner_id !== callingUser.id)
    return res.status(403).json({ error: 'You do not own this employee' });

  // ── Step 3: Update profiles ──
  const profileUpdates = {
    ...(fullName !== undefined && { full_name: fullName }),
    ...(status !== undefined && { is_active: status === 'active' }),
  };

  if (Object.keys(profileUpdates).length > 0) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', id);

    if (profileError) {
      console.error('profiles update error:', profileError);
      return res.status(500).json({ error: profileError.message });
    }
  }

  // ── Step 4: Update employee_profiles ──
  const employeeUpdates = {
    ...(position !== undefined && { position }),
    ...(hourlyRate !== undefined && { hourly_rate: hourlyRate }),
    ...(hireDate !== undefined && { hire_date: hireDate }),
  };

  if (Object.keys(employeeUpdates).length > 0) {
    const { error: employeeError } = await supabase
      .from('employee_profiles')
      .update(employeeUpdates)
      .eq('id', id);

    if (employeeError) {
      console.error('employee_profiles update error:', employeeError);
      return res.status(500).json({ error: employeeError.message });
    }
  }

  return res.status(200).json({ message: 'Employee updated' });
}
