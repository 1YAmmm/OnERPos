import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, fullName, position, hourlyRate, hireDate, ownerId } =
    req.body;

  // ── Validate required fields ──
  if (!email || !password || !fullName || !ownerId)
    return res
      .status(400)
      .json({ error: 'email, password, fullName, and ownerId are required' });

  // ── Step 1: Verify the caller is actually an owner ──
  // Pull the Authorization header the owner's client sent
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // Validate the token and get the calling user
  const {
    data: { user: callingUser },
    error: tokenError,
  } = await supabase.auth.getUser(token);

  if (tokenError || !callingUser)
    return res.status(401).json({ error: 'Invalid or expired token' });

  // Confirm the calling user is an owner AND matches the ownerId in the body
  const { data: callerProfile, error: callerError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', callingUser.id)
    .single();

  if (callerError || callerProfile?.role !== 'owner')
    return res
      .status(403)
      .json({ error: 'Only owners can register employees' });

  if (callingUser.id !== ownerId)
    return res
      .status(403)
      .json({ error: 'ownerId must match authenticated owner' });

  // ── Step 2: Create auth user ──
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) return res.status(400).json({ error: authError.message });

  const employeeId = authData.user.id;

  // ── Step 3: Insert into profiles (role = employee) ──
  const { error: profileError } = await supabase.from('profiles').insert({
    id: employeeId,
    role: 'employee',
    full_name: fullName,
    email,
    is_active: true,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(employeeId);
    return res.status(500).json({ error: profileError.message });
  }

  // ── Step 4: Insert into employee_profiles ──
  const { error: employeeError } = await supabase
    .from('employee_profiles')
    .insert({
      id: employeeId,
      owner_id: ownerId,
      position: position || null,
      hourly_rate: hourlyRate ?? 0,
      hire_date: hireDate || new Date().toISOString().split('T')[0],
    });

  if (employeeError) {
    await supabase.auth.admin.deleteUser(employeeId);
    return res.status(500).json({ error: employeeError.message });
  }

  return res.status(201).json({ message: 'Employee created successfully' });
}
