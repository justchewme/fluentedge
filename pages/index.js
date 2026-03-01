import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOALS = [
  { id: 'career', icon: '💼', ID: 'Karir & Pekerjaan', EN: 'Career & Work', subID: 'Promosi & gaji lebih besar', subEN: 'Promotions & better salary' },
  { id: 'business', icon: '🤝', ID: 'Meeting & Bisnis', EN: 'Business Meetings', subID: 'Rapat dan presentasi profesional', subEN: 'Professional meetings & presentations' },
  { id: 'daily', icon: '💬', ID: 'Percakapan Sehari-hari', EN: 'Daily Conversation', subID: 'Ngobrol lebih lancar dan percaya diri', subEN: 'Speak more fluently & confidently' },
  { id: 'travel', icon: '✈️', ID: 'Perjalanan & Wisata', EN: 'Travel & Tourism', subID: 'Komunikasi lancar saat bepergian', subEN: 'Communicate when traveling' },
]

const LEVELS = [
  { id: 'lower', badge: 'A1–A2', ID: 'Pemula', EN: 'Beginner', subID: 'Saya tahu sedikit kata-kata dasar', subEN: 'I know some basic words', color: '#4CAF50' },
  { id: 'medium', badge: 'B1–B2', ID: 'Menengah', EN: 'Intermediate', subID: 'Saya bisa berbicara tapi masih banyak kesalahan', subEN: 'I can speak but make many mistakes', color: '#00BFFF' },
  { id: 'high', badge: 'C1', ID: 'Mahir', EN: 'Advanced', subID: 'Cukup lancar, ingin lebih profesional', subEN: 'Fairly fluent, want to sound more professional', color: '#9B59B6' },
]

const TIMES = [
  { id: 5, ID: '5 menit / hari', EN: '5 min / day', subID: 'Santai tapi konsisten', subEN: 'Relaxed but consistent' },
  { id: 10, ID: '10 menit / hari', EN: '10 min / day', subID: 'Jadwal terbaik untuk pemula', subEN: 'Best schedule for most people', highlight: true },
  { id: 15, ID: '15 menit / hari', EN: '15 min / day', subID: 'Progres lebih cepat', subEN: 'Faster progress' },
]

const COMMUNITIES = [
  { id: 'work', icon: '🏢', ID: 'Komunitas Profesional', EN: 'Professional Community' },
  { id: 'faith', icon: '⛪', ID: 'Komunitas Gereja / Iman', EN: 'Church / Faith Community' },
  { id: 'campus', icon: '🎓', ID: 'Komunitas Kampus', EN: 'Campus Community' },
  { id: 'social', icon: '👥', ID: 'Komunitas Umum', EN: 'General Community' },
]

const LESSONS = {
  lower: {
    word: 'SCHEDULE', phonetic: '/ˈsked.juːl/',
    meaningID: 'Jadwal / Menjadwalkan', meaningEN: 'A plan of times and events',
    sentenceEN: 'Can we schedule a meeting for Monday?', sentenceID: 'Bisakah kita jadwalkan meeting hari Senin?',
    quizQID: 'Apa arti kalimat ini?', quizQEN: 'What does this mean?', quizSentence: '"Can we schedule a call?"',
    opts: [
      { ID: 'Bisakah kita batalkan panggilan?', EN: 'Can we cancel the call?' },
      { ID: 'Bisakah kita jadwalkan panggilan?', EN: 'Can we arrange a call time?' },
      { ID: 'Bisakah kita rekam panggilan?', EN: 'Can we record the call?' },
      { ID: 'Bisakah kita lewatkan panggilan?', EN: 'Can we skip the call?' },
    ],
    ans: 1,
    tipID: 'Di Batam, frase ini sangat umum saat berkoordinasi dengan klien dari Singapore. Coba pakai di WhatsApp atau email profesionalmu besok.',
    tipEN: 'In Batam, this phrase is common when coordinating with Singapore clients. Try using it in WhatsApp or email tomorrow.',
  },
  medium: {
    word: 'NEGOTIATE', phonetic: '/nɪˈɡoʊ.ʃi.eɪt/',
    meaningID: 'Bernegosiasi / Merundingkan', meaningEN: 'To discuss to reach an agreement',
    sentenceEN: 'We need to negotiate the contract terms before Friday.', sentenceID: 'Kita perlu merundingkan syarat kontrak sebelum Jumat.',
    quizQID: 'Kalimat mana yang paling profesional?', quizQEN: 'Which sentence is most professional?', quizSentence: null,
    opts: [
      { ID: '"Your price is too high"', EN: '"Your price is too high"' },
      { ID: '"Give me a discount please"', EN: '"Give me a discount please"' },
      { ID: '"Can we negotiate the pricing?"', EN: '"Can we negotiate the pricing?"' },
      { ID: '"I want it cheaper"', EN: '"I want it cheaper"' },
    ],
    ans: 2,
    tipID: 'Di zona perdagangan bebas Batam, kemampuan negosiasi dalam bahasa Inggris sangat dicari perusahaan joint-venture Indonesia–Singapore.',
    tipEN: "In Batam's free trade zone, English negotiation skills are the most in-demand at Indonesia–Singapore joint-venture companies.",
  },
  high: {
    word: 'LEVERAGE', phonetic: '/ˈlev.ər.ɪdʒ/',
    meaningID: 'Memanfaatkan / Keunggulan strategis', meaningEN: 'To use something to maximum advantage',
    sentenceEN: 'We can leverage our local network to win the Singapore contract.', sentenceID: 'Kita bisa memanfaatkan jaringan lokal untuk memenangkan kontrak Singapore.',
    quizQID: 'Mana penggunaan "leverage" yang tepat dalam bisnis?', quizQEN: 'Which use of "leverage" is correct in a business context?', quizSentence: null,
    opts: [
      { ID: '"We leverage our team\'s expertise"', EN: '"We leverage our team\'s expertise"' },
      { ID: '"The leverage was too much"', EN: '"The leverage was too much"' },
      { ID: '"I leveraged to the meeting"', EN: '"I leveraged to the meeting"' },
      { ID: '"She is a great leverage"', EN: '"She is a great leverage"' },
    ],
    ans: 0,
    tipID: '"Leverage" sering muncul di pitch deck dan board meeting antara perusahaan Batam dan investor Singapore.',
    tipEN: '"Leverage" frequently appears in pitch decks and board meetings between Batam companies and Singapore investors.',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function speak(text) {
  if (typeof window === 'undefined') return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.82
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #0A0F1E 0%, #0D1526 60%, #0F1A2E 100%)' },
  wrap: { maxWidth: 480, margin: '0 auto', padding: '80px 22px 60px' },
  stepLabel: { fontSize: 12, color: '#00BFFF', fontWeight: 800, letterSpacing: 3, marginBottom: 14 },
  h1: { fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 10 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 },
  card: {
    display: 'flex', alignItems: 'center', gap: 16,
    padding: '18px 20px', borderRadius: 18,
    background: 'rgba(255,255,255,0.05)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', textAlign: 'left', width: '100%',
    transition: 'border-color 0.15s, background 0.15s',
    marginBottom: 10,
  },
  cardActive: { background: 'rgba(0,191,255,0.1)', borderColor: '#00BFFF' },
  cardLabel: { color: '#fff', fontWeight: 700, fontSize: 16 },
  cardSub: { color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 2 },
  btnPrimary: {
    width: '100%', padding: '19px', borderRadius: 16,
    background: 'linear-gradient(135deg, #00BFFF, #0088BB)',
    color: '#fff', fontWeight: 800, fontSize: 17,
    border: 'none', cursor: 'pointer', letterSpacing: 0.3,
    boxShadow: '0 8px 32px rgba(0,191,255,0.25)',
    transition: 'opacity 0.15s',
  },
  btnBack: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 15, padding: '0 0 20px', display: 'block' },
  statCard: { flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px 8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' },
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState('ID')
  const [screen, setScreen] = useState('splash')
  const [goal, setGoal] = useState(null)
  const [level, setLevel] = useState(null)
  const [dailyTime, setDailyTime] = useState(null)
  const [community, setCommunity] = useState(null)
  const [buildPct, setBuildPct] = useState(0)
  const [lessonStep, setLessonStep] = useState(0) // 0=vocab, 1=quiz, 2=tip
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [xp, setXP] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [refFrom, setRefFrom] = useState('')
  const [refCode, setRefCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [copied, setCopied] = useState(false)
  const splashTimer = useRef(null)

  const t = (id, en) => lang === 'ID' ? id : en
  const ls = LESSONS[level] || LESSONS.medium

  // Load lang preference + referral code from URL
  useEffect(() => {
    const saved = localStorage.getItem('fe_lang')
    if (saved === 'EN' || saved === 'ID') setLang(saved)
    const p = new URLSearchParams(window.location.search)
    if (p.get('ref')) setRefFrom(p.get('ref'))
  }, [])

  const toggleLang = () => {
    const next = lang === 'ID' ? 'EN' : 'ID'
    setLang(next)
    localStorage.setItem('fe_lang', next)
  }

  // Splash auto-advance
  useEffect(() => {
    if (screen === 'splash') {
      splashTimer.current = setTimeout(() => setScreen('goal'), 2800)
      return () => clearTimeout(splashTimer.current)
    }
  }, [screen])

  // Building path animation
  useEffect(() => {
    if (screen !== 'building') return
    setBuildPct(0)
    let v = 0
    const iv = setInterval(() => {
      v += Math.random() * 18 + 4
      if (v >= 100) {
        v = 100; clearInterval(iv)
        setTimeout(() => { setLessonStep(0); setQuizAnswer(null); setScreen('lesson') }, 700)
      }
      setBuildPct(Math.min(v, 100))
    }, 180)
    return () => clearInterval(iv)
  }, [screen])

  async function handleRegister() {
    if (!phone.trim()) { setSubmitError(t('Masukkan nomor WhatsApp kamu', 'Enter your WhatsApp number')); return }
    setSubmitting(true); setSubmitError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || t('Pengguna FluentEdge', 'FluentEdge User'),
          whatsapp: phone.trim(), city: 'Batam',
          level: level || 'medium', score: xp,
          referralFrom: refFrom, religion: community, community,
        }),
      })
      const data = await res.json()
      if (data.referralCode) { setRefCode(data.referralCode); setScreen('success') }
      else setSubmitError(t('Terjadi kesalahan. Coba lagi.', 'Something went wrong. Please try again.'))
    } catch { setSubmitError(t('Terjadi kesalahan. Coba lagi.', 'Something went wrong. Please try again.')) }
    finally { setSubmitting(false) }
  }

  function copyCode(text) {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const waLink = (code) => `https://wa.me/?text=${encodeURIComponent(t(
    `Hei! Aku lagi pakai FluentEdge buat belajar bahasa Inggris. Gratis & bagus banget! Coba juga yuk 👉 https://fluentedge-three.vercel.app${code ? '?ref=' + code : ''}`,
    `Hey! I'm using FluentEdge to improve my English. It's free and amazing! Join me 👉 https://fluentedge-three.vercel.app${code ? '?ref=' + code : ''}`
  ))}`

  // ─── Screens ────────────────────────────────────────────────────────────────

  function Splash() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 32, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1, background: 'linear-gradient(135deg, #fff 0%, #00BFFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
            FluentEdge
          </div>
          <div style={{ width: 60, height: 3, background: 'linear-gradient(90deg, #00BFFF, #9B59B6)', borderRadius: 2, margin: '0 auto 20px' }} />
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 18, lineHeight: 1.6 }}>
            {t('Kuasai bahasa Inggris profesional.', 'Master professional English.')}<br />
            <span style={{ color: '#00BFFF', fontWeight: 700 }}>{t('Dibuat untuk kamu di Batam.', 'Built for you in Batam.')}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? '#00BFFF' : 'rgba(255,255,255,0.25)', transition: 'background 0.5s' }} />)}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 40 }}>{t('Memuat...', 'Loading...')}</p>
      </div>
    )
  }

  function Goal() {
    return (
      <div style={S.wrap}>
        <div style={S.stepLabel}>{t('LANGKAH 1 DARI 4', 'STEP 1 OF 4')}</div>
        <h1 style={S.h1}>{t('Apa tujuanmu belajar bahasa Inggris?', "What's your English goal?")}</h1>
        <p style={S.sub}>{t('Pilih satu — kami akan sesuaikan perjalanan belajarmu', 'Pick one — we\'ll tailor your journey')}</p>
        {GOALS.map(g => (
          <button key={g.id} style={{ ...S.card, ...(goal === g.id ? S.cardActive : {}) }}
            onClick={() => { setGoal(g.id); setScreen('level') }}>
            <span style={{ fontSize: 34, flexShrink: 0 }}>{g.icon}</span>
            <div>
              <div style={S.cardLabel}>{g[lang]}</div>
              <div style={S.cardSub}>{lang === 'ID' ? g.subID : g.subEN}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>
    )
  }

  function Level() {
    return (
      <div style={S.wrap}>
        <button style={S.btnBack} onClick={() => setScreen('goal')}>← {t('Kembali', 'Back')}</button>
        <div style={S.stepLabel}>{t('LANGKAH 2 DARI 4', 'STEP 2 OF 4')}</div>
        <h1 style={S.h1}>{t('Seberapa lancar bahasa Inggrismu sekarang?', "How's your English right now?")}</h1>
        <p style={S.sub}>{t('Jujur saja — tidak ada jawaban yang salah', "Be honest — there's no wrong answer")}</p>
        {LEVELS.map(lv => (
          <button key={lv.id} style={{ ...S.card, ...(level === lv.id ? { background: `${lv.color}18`, borderColor: lv.color } : {}) }}
            onClick={() => { setLevel(lv.id); setScreen('time') }}>
            <div style={{ background: lv.color, borderRadius: 8, padding: '5px 11px', fontSize: 12, fontWeight: 800, color: '#000', flexShrink: 0 }}>{lv.badge}</div>
            <div>
              <div style={S.cardLabel}>{lv[lang]}</div>
              <div style={S.cardSub}>{lang === 'ID' ? lv.subID : lv.subEN}</div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  function Time() {
    return (
      <div style={S.wrap}>
        <button style={S.btnBack} onClick={() => setScreen('level')}>← {t('Kembali', 'Back')}</button>
        <div style={S.stepLabel}>{t('LANGKAH 3 DARI 4', 'STEP 3 OF 4')}</div>
        <h1 style={S.h1}>{t('Berapa lama kamu bisa belajar setiap hari?', 'How much time can you practice daily?')}</h1>
        <p style={S.sub}>{t('Konsistensi lebih penting dari durasi', 'Consistency beats duration every time')}</p>
        {TIMES.map(tm => (
          <button key={tm.id} style={{ ...S.card, ...(dailyTime === tm.id ? S.cardActive : {}), ...(tm.highlight && !dailyTime ? { borderColor: 'rgba(0,191,255,0.4)' } : {}) }}
            onClick={() => { setDailyTime(tm.id); setScreen('community') }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(0,191,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#00BFFF', fontWeight: 900, fontSize: 20 }}>{tm.id}'</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={S.cardLabel}>{tm[lang]}</span>
                {tm.highlight && <span style={{ fontSize: 11, background: '#00BFFF', color: '#000', fontWeight: 800, borderRadius: 6, padding: '2px 8px' }}>{t('TERBAIK', 'BEST')}</span>}
              </div>
              <div style={S.cardSub}>{lang === 'ID' ? tm.subID : tm.subEN}</div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  function Community() {
    return (
      <div style={S.wrap}>
        <button style={S.btnBack} onClick={() => setScreen('time')}>← {t('Kembali', 'Back')}</button>
        <div style={S.stepLabel}>{t('LANGKAH 4 DARI 4', 'STEP 4 OF 4')}</div>
        <h1 style={S.h1}>{t('Kamu aktif di komunitas mana?', 'Which community are you part of?')}</h1>
        <p style={S.sub}>{t('Kami akan sesuaikan materi belajarmu', "We'll personalize your content around this")}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {COMMUNITIES.map(c => (
            <button key={c.id}
              onClick={() => { setCommunity(c.id); setScreen('building') }}
              style={{ padding: '24px 16px', borderRadius: 18, background: community === c.id ? 'rgba(0,191,255,0.12)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${community === c.id ? '#00BFFF' : 'rgba(255,255,255,0.1)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>{c.icon}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.4 }}>{c[lang]}</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  function Building() {
    const pct = Math.round(buildPct)
    const steps = [
      { threshold: 0, ID: 'Menganalisa tujuanmu...', EN: 'Analyzing your goals...' },
      { threshold: 30, ID: 'Menyesuaikan level...', EN: 'Calibrating your level...' },
      { threshold: 60, ID: 'Menyiapkan konten Batam...', EN: 'Preparing Batam content...' },
      { threshold: 88, ID: '✓ Jalur belajarmu siap!', EN: '✓ Your learning path is ready!' },
    ]
    const current = steps.filter(s => pct >= s.threshold).pop()
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
          {t('Menyiapkan jalur belajarmu', 'Building your learning path')}
        </h2>
        <p style={{ color: '#00BFFF', fontWeight: 600, fontSize: 15, marginBottom: 40, minHeight: 24 }}>{current?.[lang]}</p>
        <div style={{ width: '100%', maxWidth: 320, background: 'rgba(255,255,255,0.1)', borderRadius: 100, height: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${buildPct}%`, height: '100%', background: 'linear-gradient(90deg, #00BFFF, #9B59B6)', borderRadius: 100, transition: 'width 0.3s ease' }} />
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>{pct}%</p>
        <div style={{ display: 'flex', gap: 28, marginTop: 48 }}>
          {[
            { label: { ID: 'Level', EN: 'Level' }, val: LEVELS.find(l => l.id === level)?.[lang] || '—' },
            { label: { ID: 'Target', EN: 'Goal' }, val: `${dailyTime || 10} ${t('mnt', 'min')}` },
            { label: { ID: 'Tujuan', EN: 'Focus' }, val: GOALS.find(g => g.id === goal)?.[lang] || '—' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 5 }}>{item.label[lang].toUpperCase()}</div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Lesson() {
    // Step 0 — Vocabulary card
    if (lessonStep === 0) return (
      <div style={S.wrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ background: 'rgba(0,191,255,0.15)', color: '#00BFFF', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 800 }}>{t('PELAJARAN 1', 'LESSON 1')}</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>1 / 3</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 22 }}>{t('Kata Baru Hari Ini', "Today's Word")}</h2>

        {/* Word card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,191,255,0.08), rgba(155,89,182,0.06))', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 22, padding: 28, marginBottom: 18 }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#00BFFF', letterSpacing: 3, marginBottom: 6 }}>{ls.word}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 16 }}>{ls.phonetic}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 18 }}>{lang === 'ID' ? ls.meaningID : ls.meaningEN}</div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 16 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, marginBottom: 10 }}>{t('CONTOH KALIMAT', 'EXAMPLE SENTENCE')}</div>
            <div style={{ color: '#fff', fontSize: 16, fontStyle: 'italic', lineHeight: 1.6 }}>"{ls.sentenceEN}"</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 8 }}>"{ls.sentenceID}"</div>
          </div>
        </div>

        {/* Listen button */}
        <button onClick={() => { speak(ls.word + '. ' + ls.sentenceEN); setSpeaking(true); setTimeout(() => setSpeaking(false), 2500) }}
          style={{ width: '100%', padding: 16, borderRadius: 14, background: speaking ? 'rgba(0,191,255,0.2)' : 'rgba(255,255,255,0.05)', border: `1.5px solid ${speaking ? '#00BFFF' : 'rgba(255,255,255,0.12)'}`, color: speaking ? '#00BFFF' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22, transition: 'all 0.2s' }}>
          <span style={{ fontSize: 20 }}>{speaking ? '🔊' : '▶️'}</span>
          {speaking ? t('Memainkan...', 'Playing...') : t('Dengarkan Pengucapan', 'Listen to Pronunciation')}
        </button>

        <button style={S.btnPrimary} onClick={() => setLessonStep(1)}>
          {t('Lanjut ke Quiz →', 'Continue to Quiz →')}
        </button>
      </div>
    )

    // Step 1 — Quiz
    if (lessonStep === 1) {
      const answered = quizAnswer !== null
      const correct = quizAnswer === ls.ans
      return (
        <div style={S.wrap}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <span style={{ background: 'rgba(0,191,255,0.15)', color: '#00BFFF', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 800 }}>{t('PELAJARAN 1', 'LESSON 1')}</span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>2 / 3</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{t('Quiz Cepat', 'Quick Quiz')}</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 22 }}>{lang === 'ID' ? ls.quizQID : ls.quizQEN}</p>
          {ls.quizSentence && (
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', marginBottom: 22, fontSize: 19, color: '#fff', fontStyle: 'italic', textAlign: 'center' }}>
              {ls.quizSentence}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {ls.opts.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.05)', border = 'rgba(255,255,255,0.1)', color = '#fff'
              if (answered) {
                if (i === ls.ans) { bg = 'rgba(76,175,80,0.18)'; border = '#4CAF50'; color = '#4CAF50' }
                else if (i === quizAnswer) { bg = 'rgba(244,67,54,0.18)'; border = '#F44336'; color = '#F44336' }
              }
              return (
                <button key={i} disabled={answered}
                  onClick={() => { setQuizAnswer(i); if (i === ls.ans) setXP(prev => prev + 50) }}
                  style={{ padding: '16px 20px', borderRadius: 14, fontSize: 15, fontWeight: 600, background: bg, border: `1.5px solid ${border}`, color, cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  {lang === 'ID' ? opt.ID : opt.EN}
                </button>
              )
            })}
          </div>
          {answered && (
            <>
              <div style={{ padding: 16, borderRadius: 14, background: correct ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)', border: `1px solid ${correct ? '#4CAF50' : '#F44336'}`, marginBottom: 18 }}>
                <div style={{ color: correct ? '#4CAF50' : '#F44336', fontWeight: 800, fontSize: 16, marginBottom: correct ? 0 : 6 }}>
                  {correct ? t('✓ Benar! +50 XP', '✓ Correct! +50 XP') : t('✗ Belum tepat', '✗ Not quite')}
                </div>
                {!correct && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{t('Jawaban:', 'Answer:')} <strong style={{ color: '#fff' }}>{lang === 'ID' ? ls.opts[ls.ans].ID : ls.opts[ls.ans].EN}</strong></div>}
              </div>
              <button style={S.btnPrimary} onClick={() => setLessonStep(2)}>{t('Lanjut →', 'Continue →')}</button>
            </>
          )}
        </div>
      )
    }

    // Step 2 — Real-world tip
    return (
      <div style={S.wrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ background: 'rgba(0,191,255,0.15)', color: '#00BFFF', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 800 }}>{t('PELAJARAN 1', 'LESSON 1')}</span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>3 / 3</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💡 {t('Tips Dunia Nyata', 'Real-World Tip')}</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24 }}>{t('Khusus untuk konteks Batam', 'Specifically for Batam')}</p>

        <div style={{ background: 'linear-gradient(135deg, rgba(0,191,255,0.08), rgba(155,89,182,0.08))', border: '1px solid rgba(0,191,255,0.2)', borderRadius: 22, padding: '28px 24px', marginBottom: 22 }}>
          <div style={{ fontSize: 40, marginBottom: 18 }}>🇮🇩 → 🇸🇬</div>
          <p style={{ color: '#fff', fontSize: 17, lineHeight: 1.8, fontWeight: 500 }}>{lang === 'ID' ? ls.tipID : ls.tipEN}</p>
        </div>

        <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 26, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🎯</span>
          <div>
            <div style={{ color: '#FFD700', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{t('Tantangan Hari Ini', "Today's Challenge")}</div>
            <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.6 }}>{t(`Gunakan kata "${ls.word}" dalam 1 percakapan hari ini`, `Use "${ls.word}" in 1 conversation today`)}</div>
          </div>
        </div>

        <button style={S.btnPrimary} onClick={() => setScreen('lesson-done')}>{t('Selesaikan Pelajaran →', 'Complete Lesson →')}</button>
      </div>
    )
  }

  function LessonDone() {
    return (
      <div style={{ ...S.wrap, textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🎉</div>
        <h1 style={{ ...S.h1, textAlign: 'center' }}>{t('Pelajaran 1 Selesai!', 'Lesson 1 Complete!')}</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32 }}>{t('Kamu baru saja memulai perjalananmu.', "You've started your journey.")}</p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {[
            { icon: '⚡', label: 'XP', val: '+50', color: '#FFD700' },
            { icon: '🔥', label: t('Streak', 'Streak'), val: `${t('Hari', 'Day')} 1`, color: '#FF6B35' },
            { icon: '📚', label: t('Kata baru', 'New words'), val: '1', color: '#00BFFF' },
          ].map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 900, fontSize: 20 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Locked next lesson */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, marginBottom: 28, border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.04)', filter: 'blur(2px)' }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 6 }}>{t('PELAJARAN 2', 'LESSON 2')}</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>DELEGATE</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t('Mendelegasikan tugas dengan efektif', 'Delegating tasks effectively')}</div>
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(2px)' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🔒</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t('Simpan progress untuk membuka', 'Save progress to unlock')}</div>
          </div>
        </div>

        <button style={{ ...S.btnPrimary, marginBottom: 12 }} onClick={() => setScreen('register')}>
          {t('💾 Simpan Progress dengan WhatsApp', '💾 Save Progress with WhatsApp')}
        </button>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{t('Gratis. Tidak perlu password.', 'Free. No password needed.')}</p>
      </div>
    )
  }

  function Register() {
    return (
      <div style={S.wrap}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📱</div>
          <h1 style={{ ...S.h1, textAlign: 'center' }}>{t('Simpan Progressmu', 'Save Your Progress')}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>
            {t('Masukkan nomor WhatsApp untuk menyimpan streak dan membuka pelajaran berikutnya.', 'Enter your WhatsApp number to save your streak and unlock the next lessons.')}
          </p>
        </div>

        {/* Progress recap */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px', marginBottom: 28, justifyContent: 'space-around' }}>
          {[
            { val: '1', label: t('Pelajaran', 'Lesson') },
            { val: '50', label: 'XP' },
            { val: '🔥 1', label: t('Hari streak', 'Day streak') },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#00BFFF', fontWeight: 900, fontSize: 22 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>{t('Nama (opsional)', 'Name (optional)')}</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={t('Nama kamu...', 'Your name...')}
              style={{ width: '100%', padding: 16, borderRadius: 14, fontSize: 16, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>{t('Nomor WhatsApp *', 'WhatsApp Number *')}</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ padding: '16px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>🇮🇩 +62</div>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="8123456789" type="tel"
                style={{ flex: 1, padding: 16, borderRadius: 14, fontSize: 16, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }} />
            </div>
          </div>
          {refFrom ? (
            <div style={{ background: 'rgba(255,215,0,0.07)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: 12, padding: '12px 16px', fontSize: 14, color: '#FFD700' }}>
              ✓ {t('Kode referral:', 'Referral code:')} <strong>{refFrom}</strong>
            </div>
          ) : (
            <div>
              <label style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>{t('Kode referral (opsional)', 'Referral code (optional)')}</label>
              <input value={refFrom} onChange={e => setRefFrom(e.target.value.toUpperCase())} placeholder="FLNT-XXXX"
                style={{ width: '100%', padding: 16, borderRadius: 14, fontSize: 16, background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', boxSizing: 'border-box', letterSpacing: 1 }} />
            </div>
          )}
        </div>

        {submitError && <div style={{ color: '#F44336', fontSize: 14, marginBottom: 16, padding: 12, background: 'rgba(244,67,54,0.1)', borderRadius: 10 }}>{submitError}</div>}

        <button style={{ ...S.btnPrimary, opacity: submitting ? 0.7 : 1, marginBottom: 14 }} onClick={handleRegister} disabled={submitting}>
          {submitting ? t('Menyimpan...', 'Saving...') : t('✓ Simpan & Lanjutkan', '✓ Save & Continue')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <span>🔒</span>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{t('Data kamu aman, tidak akan dibagikan', 'Your data is safe and never shared')}</p>
        </div>
      </div>
    )
  }

  function Success() {
    return (
      <div style={{ ...S.wrap, textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 12 }}>🎊</div>
        <h1 style={{ ...S.h1, textAlign: 'center' }}>{t('Kamu sudah terdaftar!', "You're registered!")}</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 30, lineHeight: 1.7 }}>
          {t('Progressmu tersimpan. Undang teman untuk membuka konten eksklusif.', 'Your progress is saved. Invite friends to unlock exclusive content.')}
        </p>

        {/* Referral code */}
        <div style={{ background: 'rgba(255,215,0,0.07)', border: '2px solid rgba(255,215,0,0.35)', borderRadius: 22, padding: 26, marginBottom: 24 }}>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>{t('KODE REFERRALMU', 'YOUR REFERRAL CODE')}</div>
          <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 4, color: '#FFD700', marginBottom: 14 }}>{refCode}</div>
          <button onClick={() => copyCode(refCode)}
            style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 10, padding: '10px 22px', color: '#FFD700', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            {copied ? t('✓ Disalin!', '✓ Copied!') : t('📋 Salin Kode', '📋 Copy Code')}
          </button>
        </div>

        {/* Reward tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 26, textAlign: 'left' }}>
          {[
            { icon: '🎁', n: 1, reward: { ID: 'Business English Pack (20 pelajaran)', EN: 'Business English Pack (20 lessons)' } },
            { icon: '🎤', n: 3, reward: { ID: 'Speaking Pro — latihan berbicara tak terbatas', EN: 'Speaking Pro — unlimited speaking practice' } },
            { icon: '⭐', n: 5, reward: { ID: '1 bulan FluentEdge Pro gratis', EN: '1 month FluentEdge Pro free' } },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 18px' }}>
              <span style={{ fontSize: 26 }}>{r.icon}</span>
              <div>
                <div style={{ color: '#FFD700', fontWeight: 700, fontSize: 13 }}>{t(`Undang ${r.n} teman`, `Invite ${r.n} friend${r.n > 1 ? 's' : ''}`)}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{r.reward[lang]}</div>
              </div>
            </div>
          ))}
        </div>

        <a href={waLink(refCode)} target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', padding: 18, borderRadius: 16, background: '#25D366', color: '#fff', fontWeight: 800, fontSize: 17, textDecoration: 'none', marginBottom: 12 }}>
          📤 {t('Bagikan ke WhatsApp', 'Share to WhatsApp')}
        </a>
        <button onClick={() => setScreen('dashboard')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 15, padding: 8 }}>
          {t('Lanjut ke Dashboard →', 'Go to Dashboard →')}
        </button>
      </div>
    )
  }

  function Dashboard() {
    const lvInfo = LEVELS.find(l => l.id === level) || LEVELS[1]
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px 100px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t('Selamat datang kembali 👋', 'Welcome back 👋')}</div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 22 }}>{name || t('Pengguna FluentEdge', 'FluentEdge User')}</div>
          </div>
          <div style={{ background: lvInfo.color, borderRadius: 10, padding: '6px 14px', color: '#000', fontWeight: 900, fontSize: 13 }}>{lvInfo.badge}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '🔥', label: t('Streak', 'Streak'), val: `1 ${t('hari', 'day')}`, color: '#FF6B35' },
            { icon: '⚡', label: 'XP', val: '50', color: '#FFD700' },
            { icon: '📚', label: t('Pelajaran', 'Lessons'), val: '1/30', color: '#00BFFF' },
          ].map((s, i) => (
            <div key={i} style={S.statCard}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 900, fontSize: 18 }}>{s.val}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Today's Plan */}
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 14 }}>📋 {t('Rencana Hari Ini', "Today's Plan")}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {/* Done */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(76,175,80,0.1)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(76,175,80,0.25)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(76,175,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>✓</div>
            <div>
              <div style={{ color: '#4CAF50', fontWeight: 700, fontSize: 15 }}>Pelajaran 1 — {ls.word}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{t('Selesai ✓', 'Completed ✓')}</div>
            </div>
          </div>
          {/* Next lesson */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px 18px', border: '1.5px solid rgba(0,191,255,0.3)' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(0,191,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#00BFFF', fontWeight: 700, fontSize: 15 }}>{t('Pelajaran 2 — DELEGATE', 'Lesson 2 — DELEGATE')}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{t('Tersedia besok', 'Available tomorrow')}</div>
            </div>
            <span style={{ color: '#00BFFF', fontSize: 18 }}>›</span>
          </div>
          {/* Speaking - locked */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '16px 18px', border: '1px solid rgba(255,255,255,0.07)', opacity: 0.6 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>🔒</div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 15 }}>{t('Latihan Berbicara', 'Speaking Practice')}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{t('Undang 1 teman untuk membuka', 'Invite 1 friend to unlock')}</div>
            </div>
          </div>
        </div>

        {/* Referral banner */}
        {refCode && (
          <div style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.06))', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 18, padding: '20px', marginBottom: 22 }}>
            <div style={{ color: '#FFD700', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>🎁 {t('Undang Teman, Dapat Reward!', 'Invite Friends, Get Rewards!')}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginBottom: 14 }}>
              {t('Kode referralmu: ', 'Your code: ')}<strong style={{ color: '#FFD700', letterSpacing: 2 }}>{refCode}</strong>
            </div>
            <a href={waLink(refCode)} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
              📤 {t('Bagikan Sekarang', 'Share Now')}
            </a>
          </div>
        )}

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: 600 }}>{t('Progress Jalur', 'Path Progress')} — {lvInfo[lang]}</span>
            <span style={{ color: '#00BFFF', fontWeight: 700, fontSize: 14 }}>1/30</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 100, height: 8, overflow: 'hidden' }}>
            <div style={{ width: '3.3%', height: '100%', background: 'linear-gradient(90deg, #00BFFF, #9B59B6)', borderRadius: 100 }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 10 }}>
            {t('29 pelajaran lagi untuk selesaikan jalur ini', '29 more lessons to complete this path')}
          </div>
        </div>
      </div>
    )
  }

  // ─── Toggle ───────────────────────────────────────────────────────────────────

  const SCREEN_MAP = { splash: Splash, goal: Goal, level: Level, time: Time, community: Community, building: Building, lesson: Lesson, 'lesson-done': LessonDone, register: Register, success: Success, dashboard: Dashboard }
  const Screen = SCREEN_MAP[screen] || Splash

  return (
    <>
      <Head>
        <title>FluentEdge — Bahasa Inggris Profesional</title>
        <meta name="description" content={t('Kuasai bahasa Inggris profesional dalam 4-6 bulan. Dibuat untuk warga Batam.', 'Master professional English in 4-6 months. Built for Batam.')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0A0F1E" />
      </Head>
      <div style={S.page}>
        {/* Lang toggle — hidden on splash */}
        {screen !== 'splash' && (
          <button onClick={toggleLang}
            aria-label={lang === 'EN' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
            style={{ position: 'fixed', top: 'max(16px, env(safe-area-inset-top, 16px))', right: 16, zIndex: 1000, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: '8px 16px', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {lang === 'ID' ? '🇬🇧 EN' : '🇮🇩 ID'}
          </button>
        )}
        <Screen />
      </div>
    </>
  )
}
