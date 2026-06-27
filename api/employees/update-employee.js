export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, fullName, position, hourlyRate, hireDate, status } = req.body;

  // Authenticate owner...

  // Update profiles

  // Update employee_profiles

  return res.status(200).json({
    message: 'Employee updated',
  });
}
