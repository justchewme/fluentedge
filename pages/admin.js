import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const ADMIN_PW_FALLBACK = 'R184'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const [filterCity, setFilterCity] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [search, setSearch] = useState('')

  const [sortKey, setSortKey] = useState('JoinDate')
  const [sortDir, setSortDir] = useState('desc')

  const handleLogin = () => {
    if (!pwInput.trim()) { setPwError('Enter password'); return }
    setPwError('')
    setAuthed(true)
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setFetchError('')
    try {
      const res = await fetch(`/api/admin/users?password=${encodeURIComponent(pwInput || ADMIN_PW_FALLBACK)}`)
      const data = await res.json()
      if (data.error) {
        if (res.status === 401) {
          setAuthed(false)
          setPwError('Incorrect password')
        } else {
          setFetchError(data.error)
        }
      } else {
        setUsers(data.users || [])
      }
    } catch (e) {
      setFetchError('Failed to load users')
    }
    setLoading(false)
  }, [pwInput])

  useEffect(() => {
    if (authed) fetchUsers()
  }, [authed, fetchUsers])

  // ─── Filter + Sort ──────────────────────────────────────────────────────
  const filtered = users
    .filter((u) => {
      const matchCity = !filterCity || u.City === filterCity
      const matchLevel = !filterLevel || (u.Level || '').includes(filterLevel)
      const matchSearch = !search || (u.Name || '').toLowerCase().includes(search.toLowerCase()) || (u.WhatsApp || '').includes(search)
      return matchCity && matchLevel && matchSearch
    })
    .sort((a, b) => {
      let va = a[sortKey] || ''
      let vb = b[sortKey] || ''
      if (sortKey === 'Score') { va = Number(va) || 0; vb = Number(vb) || 0 }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  // ─── CSV export ──────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ['Name', 'WhatsApp', 'City', 'Level', 'Score', 'ReferralCode', 'ReferralFrom', 'Source', 'JoinDate']
    const rows = filtered.map((u) => headers.map((h) => `"${(u[h] || '').replace(/"/g, '""')}"`).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fluentedge-users-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const maskWA = (wa) => {
    if (!wa) return '—'
    if (wa.length <= 6) return wa
    return wa.substring(0, 5) + '****' + wa.substring(wa.length - 3)
  }

  const levelBadgeColor = (level) => {
    if (!level) return '#555'
    if (level.includes('High')) return '#FFD700'
    if (level.includes('Medium')) return '#00BFFF'
    return '#9B59B6'
  }

  const CITIES = ['Batam', 'Tanjung Pinang', 'Bintan', 'Karimun', 'Kota lain']
  const LEVELS = ['Lower', 'Medium', 'High']

  // ─── Styles ──────────────────────────────────────────────────────────────
  const s = {
    bg: { minHeight: '100vh', background: '#0A0F1E', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#fff', padding: '0' },
    header: { background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)' },
    logo: { fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #00BFFF, #9B59B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    adminBadge: { background: 'rgba(0,191,255,0.12)', border: '1px solid rgba(0,191,255,0.25)', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', color: '#00BFFF', fontWeight: '700' },
    main: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
    input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#fff', padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', width: '100%' },
    select: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#fff', padding: '10px 14px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', cursor: 'pointer' },
    btn: { padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' },
    td: { padding: '12px 14px', fontSize: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' },
  }

  // ─── Login Screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <>
        <Head>
          <title>FluentEdge Admin</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <div style={{ ...s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          {/* Orbs */}
          {[
            { top: '-80px', left: '-80px', size: '300px', color: 'rgba(0,191,255,0.2)' },
            { bottom: '-60px', right: '-60px', size: '250px', color: 'rgba(155,89,182,0.15)' },
          ].map((orb, i) => (
            <div key={i} style={{ position: 'fixed', width: orb.size, height: orb.size, borderRadius: '50%', background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`, filter: 'blur(60px)', top: orb.top, left: orb.left, bottom: orb.bottom, right: orb.right, zIndex: 0 }} />
          ))}

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '360px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🔐</div>
              <div style={{ ...s.logo, fontSize: '26px' }}>FluentEdge</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Admin Dashboard</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '28px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
                Admin Password
              </label>
              <input
                style={s.input}
                type="password"
                placeholder="Enter password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
              />
              {pwError && (
                <div style={{ color: '#FF4757', fontSize: '13px', marginTop: '8px' }}>{pwError}</div>
              )}
              <button
                onClick={handleLogin}
                style={{ ...s.btn, marginTop: '16px', width: '100%', background: 'linear-gradient(135deg, #00BFFF, #0080FF)', color: '#fff', padding: '14px', fontSize: '15px', boxShadow: '0 0 20px rgba(0,191,255,0.3)' }}
              >
                Login →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ─── Admin Dashboard ──────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>FluentEdge Admin</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.bg}>
        {/* Header */}
        <div style={s.header}>
          <span style={s.logo}>FluentEdge</span>
          <span style={s.adminBadge}>Admin</span>
        </div>

        <div style={s.main}>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Users', value: users.length, icon: '👥' },
              { label: 'Batam Region', value: users.filter(u => ['Batam','Tanjung Pinang','Bintan','Karimun'].includes(u.City)).length, icon: '📍' },
              { label: 'High (B2)', value: users.filter(u => (u.Level||'').includes('High')).length, icon: '🏆' },
              { label: 'With Referrals', value: users.filter(u => u.ReferralFrom).length, icon: '🔗' },
            ].map((stat) => (
              <div key={stat.label} style={{ flex: '1', minWidth: '140px', padding: '16px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{stat.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <input
              style={{ ...s.input, maxWidth: '220px', flex: '1' }}
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* City filter */}
            <select style={s.select} value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              <option value="">All Cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Level filter */}
            <select style={s.select} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
              <option value="">All Levels</option>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>

            {/* Refresh */}
            <button onClick={fetchUsers} style={{ ...s.btn, background: 'rgba(0,191,255,0.12)', color: '#00BFFF', border: '1px solid rgba(0,191,255,0.25)' }}>
              {loading ? '⟳ Loading...' : '⟳ Refresh'}
            </button>

            {/* Export CSV */}
            <button onClick={exportCSV} style={{ ...s.btn, background: 'rgba(37,211,102,0.12)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}>
              ↓ Export CSV
            </button>
          </div>

          {/* Result count */}
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px' }}>
            Showing {filtered.length} of {users.length} users
          </div>

          {/* Error */}
          {fetchError && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: '10px', color: '#FF4757', fontSize: '14px', marginBottom: '16px' }}>
              {fetchError}
            </div>
          )}

          {/* Table */}
          <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                Loading users...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                No users found
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {[
                      { key: 'Name', label: 'Name' },
                      { key: 'WhatsApp', label: 'WhatsApp' },
                      { key: 'City', label: 'City' },
                      { key: 'Level', label: 'Level' },
                      { key: 'Score', label: 'Score' },
                      { key: 'ReferralCode', label: 'Ref Code' },
                      { key: 'ReferralFrom', label: 'Referred By' },
                      { key: 'JoinDate', label: 'Joined' },
                      { key: '_action', label: 'Action' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        style={s.th}
                        onClick={() => col.key !== '_action' && handleSort(col.key)}
                      >
                        {col.label}
                        {sortKey === col.key && col.key !== '_action' && (
                          <span style={{ marginLeft: '4px' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, idx) => (
                    <tr key={user.id || idx} style={{ transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={s.td}>
                        <div style={{ fontWeight: '600' }}>{user.Name || '—'}</div>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                          {maskWA(user.WhatsApp)}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {user.City || '—'}
                        </span>
                      </td>
                      <td style={s.td}>
                        {user.Level ? (
                          <span style={{ padding: '3px 10px', background: `${levelBadgeColor(user.Level)}22`, border: `1px solid ${levelBadgeColor(user.Level)}55`, borderRadius: '99px', fontSize: '12px', color: levelBadgeColor(user.Level), fontWeight: '700', whiteSpace: 'nowrap' }}>
                            {user.Level}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ ...s.td, textAlign: 'center' }}>
                        <span style={{ fontWeight: '700', color: user.Score >= 4 ? '#FFD700' : user.Score >= 2 ? '#00BFFF' : 'rgba(255,255,255,0.4)' }}>
                          {user.Score ?? '—'}/5
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00BFFF' }}>
                          {user.ReferralCode || '—'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                          {user.ReferralFrom || '—'}
                        </span>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                          {user.JoinDate ? new Date(user.JoinDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </td>
                      <td style={s.td}>
                        {user.WhatsApp && (
                          <a
                            href={`https://wa.me/${user.WhatsApp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '8px', color: '#25D366', fontSize: '12px', fontWeight: '700', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            Chat
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
            FluentEdge Admin Panel · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  )
}
