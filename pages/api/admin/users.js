if (!global.leads) global.leads = []

export default function handler(req, res) {
  const { password } = req.query
  const adminPassword = process.env.ADMIN_PASSWORD || 'R184'
  if (password !== adminPassword) return res.status(401).json({ error: 'Unauthorized' })

  const sorted = [...global.leads].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
  return res.json({ total: sorted.length, leads: sorted })
}
