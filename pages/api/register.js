if (!global.leads) global.leads = []

function generateRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'FLNT-'
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, whatsapp, city, level, score, referralFrom, religion, church } = req.body
  if (!name || !whatsapp) return res.status(400).json({ error: 'Name and WhatsApp required' })

  const existing = global.leads.find(l => l.whatsapp === whatsapp)
  if (existing) return res.json({ success: true, referralCode: existing.referralCode, level: existing.level })

  const referralCode = generateRef()
  const lead = {
    id: Date.now().toString(),
    name: name.trim(),
    whatsapp: whatsapp.trim(),
    city: city || 'Unknown',
    level: level || 'Medium',
    score: score || 0,
    referralCode,
    referralFrom: referralFrom || '',
    referralCount: 0,
    religion: religion || '',
    church: church || '',
    joinDate: new Date().toISOString(),
  }

  global.leads.push(lead)

  if (referralFrom) {
    const referrer = global.leads.find(l => l.referralCode === referralFrom)
    if (referrer) referrer.referralCount = (referrer.referralCount || 0) + 1
  }

  return res.json({ success: true, referralCode, level })
}
