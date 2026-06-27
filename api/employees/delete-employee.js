export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;


  return res.status(200).json({
    message: 'Employee deleted',
  });
}
