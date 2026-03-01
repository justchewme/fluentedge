// Simple in-memory lead store + console log
// Replace with Airtable/DB integration when ready
if (!global.fe_leads) global.fe_leads = []

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const lead = { ...req.body, receivedAt: new Date().toISOString() }
    global.fe_leads.push(lead)
    console.log('[FluentEdge lead]', JSON.stringify(lead))
    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save lead' })
  }
}
