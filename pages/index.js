import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#EEF2F7',
  surface:      '#FFFFFF',
  border:       '#DDE4EE',
  borderLight:  '#EEF2F7',
  primary:      '#0D47A1',
  primaryDark:  '#0A3880',
  primaryLight: '#EBF3FF',
  primaryMid:   '#1565C0',
  text:         '#0F172A',
  textMuted:    '#5B6B82',
  textLight:    '#94A3B8',
  success:      '#065F46',
  successBg:    '#D1FAE5',
  error:        '#991B1B',
  errorBg:      '#FEE2E2',
  gold:         '#B45309',
  goldBg:       '#FEF3C7',
  wa:           '#128C7E',
  waBg:         '#D1FAE5',
  shadow:       '0 1px 4px rgba(13,71,161,0.06), 0 4px 16px rgba(13,71,161,0.06)',
  shadowSm:     '0 1px 3px rgba(0,0,0,0.07)',
  shadowLg:     '0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(13,71,161,0.1)',
  radius:       '12px',
  radiusSm:     '8px',
  radiusLg:     '16px',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GOALS = [
  { id: 'career',   icon: '💼', ID: 'Karir & Pekerjaan',       EN: 'Career & Work',         subID: 'Promosi dan peluang kerja lebih besar',      subEN: 'Advance your career and earn more' },
  { id: 'business', icon: '🤝', ID: 'Meeting & Presentasi',     EN: 'Business Communication', subID: 'Rapat, negosiasi, dan presentasi profesional', subEN: 'Meetings, negotiations, presentations' },
  { id: 'daily',    icon: '💬', ID: 'Percakapan Sehari-hari',   EN: 'Daily Conversation',    subID: 'Ngobrol lebih lancar dan percaya diri',       subEN: 'Speak fluently and confidently' },
  { id: 'travel',   icon: '✈️', ID: 'Perjalanan & Internasional', EN: 'Travel & International', subID: 'Komunikasi saat bepergian ke luar negeri',    subEN: 'Communicate confidently abroad' },
]

const LEVELS = [
  { id: 'lower',  badge: 'A1–A2', ID: 'Pemula',    EN: 'Beginner',     subID: 'Saya tahu sedikit kata-kata dasar',                  subEN: 'I know basic words and simple phrases',           color: '#059669' },
  { id: 'medium', badge: 'B1–B2', ID: 'Menengah',  EN: 'Intermediate', subID: 'Saya bisa berbicara, tapi masih sering salah',        subEN: 'I can hold a conversation but make errors',       color: '#0D47A1' },
  { id: 'high',   badge: 'C1',    ID: 'Mahir',     EN: 'Advanced',     subID: 'Cukup lancar, ingin terdengar lebih profesional',     subEN: 'Fluent, but want to sound more professional',     color: '#7C3AED' },
]

const COMMUNITIES = [
  { id: 'work',   icon: '🏢', ID: 'Komunitas Profesional',    EN: 'Professional / Workplace' },
  { id: 'faith',  icon: '⛪', ID: 'Komunitas Gereja / Iman',  EN: 'Church / Faith Community' },
  { id: 'campus', icon: '🎓', ID: 'Komunitas Kampus',         EN: 'University / Campus' },
  { id: 'social', icon: '👥', ID: 'Komunitas Umum',           EN: 'General / Social' },
]

const LESSONS = {
  lower: {
    word: 'SCHEDULE', phonetic: '/ˈsked.juːl/',
    meaningID: 'Jadwal / Menjadwalkan', meaningEN: 'A plan that gives times for events',
    sentenceEN: 'Can we schedule a meeting for Monday?', sentenceID: 'Bisakah kita jadwalkan rapat hari Senin?',
    quizQID: 'Apa arti kalimat ini?', quizQEN: 'What does this mean?',
    quizSentence: '"Can we schedule a call?"',
    opts: [
      { ID: 'Bisakah kita batalkan panggilan?',   EN: 'Can we cancel the call?' },
      { ID: 'Bisakah kita jadwalkan panggilan?',  EN: 'Can we arrange a call?' },
      { ID: 'Bisakah kita rekam panggilan?',      EN: 'Can we record the call?' },
      { ID: 'Bisakah kita lewatkan panggilan?',   EN: 'Can we skip the call?' },
    ],
    ans: 1,
    tipID: 'Di Batam, frasa ini sangat umum dalam koordinasi dengan klien Singapore. Gunakan di email atau WhatsApp profesional.',
    tipEN: 'In Batam, this phrase is common when coordinating with Singapore clients. Use it in professional emails or WhatsApp.',
  },
  medium: {
    word: 'NEGOTIATE', phonetic: '/nɪˈɡoʊ.ʃi.eɪt/',
    meaningID: 'Bernegosiasi / Merundingkan', meaningEN: 'To discuss in order to reach agreement',
    sentenceEN: 'We need to negotiate the contract terms before Friday.', sentenceID: 'Kita perlu merundingkan syarat kontrak sebelum Jumat.',
    quizQID: 'Kalimat mana yang paling profesional?', quizQEN: 'Which sentence is most professional?',
    quizSentence: null,
    opts: [
      { ID: '"Your price is too high"',        EN: '"Your price is too high"' },
      { ID: '"Give me a discount please"',     EN: '"Give me a discount please"' },
      { ID: '"Can we negotiate the pricing?"', EN: '"Can we negotiate the pricing?"' },
      { ID: '"I want it cheaper"',             EN: '"I want it cheaper"' },
    ],
    ans: 2,
    tipID: 'Di zona perdagangan bebas Batam, kemampuan negosiasi dalam bahasa Inggris adalah kompetensi yang paling dicari perusahaan joint-venture.',
    tipEN: "In Batam's free trade zone, English negotiation is the most sought-after skill at joint-venture companies.",
  },
  high: {
    word: 'LEVERAGE', phonetic: '/ˈlev.ər.ɪdʒ/',
    meaningID: 'Memanfaatkan / Keunggulan strategis', meaningEN: 'To use something to maximum advantage',
    sentenceEN: 'We can leverage our local network to secure the Singapore contract.', sentenceID: 'Kita bisa memanfaatkan jaringan lokal untuk mengamankan kontrak Singapore.',
    quizQID: 'Mana yang tepat dalam konteks bisnis?', quizQEN: 'Which use is correct in a business context?',
    quizSentence: null,
    opts: [
      { ID: '"We leverage our team\'s expertise"', EN: '"We leverage our team\'s expertise"' },
      { ID: '"The leverage was too big"',          EN: '"The leverage was too big"' },
      { ID: '"I leveraged to the meeting"',        EN: '"I leveraged to the meeting"' },
      { ID: '"She is a great leverage"',           EN: '"She is a great leverage"' },
    ],
    ans: 0,
    tipID: '"Leverage" sering muncul di pitch deck dan board meeting perusahaan Batam dengan investor Singapore.',
    tipEN: '"Leverage" frequently appears in pitch decks and board meetings between Batam firms and Singapore investors.',
  },
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function speak(text) {
  if (typeof window === 'undefined') return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'; u.rate = 0.82
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────

function PageWrap({ children, style = {} }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', ...style }}>
      {children}
    </div>
  )
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.surface, borderRadius: C.radiusLg,
      border: `1px solid ${C.border}`, boxShadow: C.shadowSm,
      ...style,
    }}>
      {children}
    </div>
  )
}

function PrimaryBtn({ children, onClick, disabled, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '16px 24px', borderRadius: C.radius,
      background: disabled ? '#94A3B8' : C.primary,
      color: '#fff', fontWeight: 700, fontSize: 16,
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: 0.2, transition: 'background 0.15s',
      boxShadow: disabled ? 'none' : `0 2px 8px ${C.primary}40`,
      ...style,
    }}>
      {children}
    </button>
  )
}

function BackBtn({ onClick, lang }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'none', border: 'none', color: C.textMuted,
      fontSize: 14, fontWeight: 500, padding: '0 0 20px',
      cursor: 'pointer',
    }}>
      <span style={{ fontSize: 16 }}>←</span> {lang === 'ID' ? 'Kembali' : 'Back'}
    </button>
  )
}

function StepLabel({ step, total, lang }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{
            width: i + 1 === step ? 20 : 8, height: 6, borderRadius: 100,
            background: i + 1 <= step ? C.primary : C.border,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <span style={{ color: C.textLight, fontSize: 12, fontWeight: 600 }}>
        {lang === 'ID' ? `${step} / ${total}` : `${step} of ${total}`}
      </span>
    </div>
  )
}

function LangToggle({ lang, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      position: 'fixed', top: 16, right: 16, zIndex: 1000,
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 99, padding: '7px 14px',
      color: C.textMuted, fontWeight: 600, fontSize: 13,
      boxShadow: C.shadowSm, cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {lang === 'ID' ? '🇬🇧 EN' : '🇮🇩 ID'}
    </button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState('ID')
  const [screen, setScreen] = useState('splash')
  const [goal, setGoal] = useState(null)
  const [level, setLevel] = useState(null)
  const [community, setCommunity] = useState(null)
  const [buildPct, setBuildPct] = useState(0)
  const [lessonStep, setLessonStep] = useState(0)
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

  const t = (id, en) => lang === 'ID' ? id : en
  const ls = LESSONS[level] || LESSONS.medium

  useEffect(() => {
    const saved = localStorage.getItem('fe_lang')
    if (saved === 'EN' || saved === 'ID') setLang(saved)
    const p = new URLSearchParams(window.location.search)
    if (p.get('ref')) setRefFrom(p.get('ref'))
  }, [])

  const toggleLang = () => {
    const next = lang === 'ID' ? 'EN' : 'ID'
    setLang(next); localStorage.setItem('fe_lang', next)
  }

  // Splash auto-advance
  useEffect(() => {
    if (screen !== 'splash') return
    const t = setTimeout(() => setScreen('goal'), 2600)
    return () => clearTimeout(t)
  }, [screen])

  // Building animation
  useEffect(() => {
    if (screen !== 'building') return
    setBuildPct(0)
    let v = 0
    const iv = setInterval(() => {
      v += Math.random() * 20 + 5
      if (v >= 100) {
        v = 100; clearInterval(iv)
        setTimeout(() => { setLessonStep(0); setQuizAnswer(null); setScreen('lesson') }, 500)
      }
      setBuildPct(Math.min(v, 100))
    }, 160)
    return () => clearInterval(iv)
  }, [screen])

  async function handleRegister() {
    if (!phone.trim()) { setSubmitError(t('Masukkan nomor WhatsApp', 'Enter your WhatsApp number')); return }
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
    } catch { setSubmitError(t('Terjadi kesalahan. Coba lagi.', 'Something went wrong.')) }
    finally { setSubmitting(false) }
  }

  function copyCode(text) {
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const waLink = (code) => {
    const ref = code ? `?ref=${code}` : ''
    return `https://wa.me/?text=${encodeURIComponent(t(
      `Hei! Aku lagi belajar bahasa Inggris di FluentEdge — gratis dan profesional. Coba juga: https://fluent-english-id.vercel.app${ref}`,
      `Hey! I'm learning professional English on FluentEdge — it's free and excellent. Try it: https://fluent-english-id.vercel.app${ref}`
    ))}`
  }

  // ─── Screens ────────────────────────────────────────────────────────────────

  const Wrap = ({ children, noPad }) => (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: noPad ? 0 : '72px 20px 48px', width: '100%' }}>
      {children}
    </div>
  )

  function Splash() {
    return (
      <div style={{
        minHeight: '100vh', background: C.primary,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 32, textAlign: 'center',
      }}>
        {/* Logo mark */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24, border: '1.5px solid rgba(255,255,255,0.25)',
        }}>
          <span style={{ fontSize: 36 }}>📘</span>
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>
          FluentEdge
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 400, lineHeight: 1.6, maxWidth: 280 }}>
          {t('Bahasa Inggris profesional untuk karir yang lebih baik', 'Professional English for a stronger career')}
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 40 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)',
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }} />
          ))}
        </div>
      </div>
    )
  }

  function Goal() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          {/* Header brand strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16 }}>📘</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>FluentEdge</span>
          </div>

          <StepLabel step={1} total={3} lang={lang} />

          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 8 }}>
            {t('Apa tujuanmu belajar bahasa Inggris?', "What's your English goal?")}
          </h1>
          <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            {t('Pilih satu — kami akan menyesuaikan program belajarmu', 'Choose one — we\'ll tailor your programme')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {GOALS.map(g => (
              <button key={g.id}
                onClick={() => { setGoal(g.id); setScreen('level') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px', borderRadius: C.radiusLg,
                  background: goal === g.id ? C.primaryLight : C.surface,
                  border: `1.5px solid ${goal === g.id ? C.primary : C.border}`,
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: C.shadowSm, transition: 'all 0.15s',
                }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: goal === g.id ? `${C.primary}18` : C.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 2 }}>{g[lang]}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.4 }}>{lang === 'ID' ? g.subID : g.subEN}</div>
                </div>
                <div style={{ color: goal === g.id ? C.primary : C.textLight, fontSize: 18, fontWeight: 300 }}>›</div>
              </button>
            ))}
          </div>
        </Wrap>
      </PageWrap>
    )
  }

  function Level() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <BackBtn onClick={() => setScreen('goal')} lang={lang} />
          <StepLabel step={2} total={3} lang={lang} />

          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 8 }}>
            {t('Seberapa lancar bahasa Inggrismu?', "How's your English right now?")}
          </h1>
          <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            {t('Jujur saja — tidak ada jawaban yang salah', "Be honest — there's no wrong answer")}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEVELS.map(lv => (
              <button key={lv.id}
                onClick={() => { setLevel(lv.id); setScreen('community') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 20px', borderRadius: C.radiusLg,
                  background: level === lv.id ? C.primaryLight : C.surface,
                  border: `1.5px solid ${level === lv.id ? C.primary : C.border}`,
                  cursor: 'pointer', textAlign: 'left',
                  boxShadow: C.shadowSm, transition: 'all 0.15s',
                }}>
                <div style={{
                  flexShrink: 0, borderRadius: 8, padding: '5px 12px',
                  background: `${lv.color}18`, border: `1px solid ${lv.color}40`,
                  color: lv.color, fontWeight: 800, fontSize: 12, whiteSpace: 'nowrap',
                }}>{lv.badge}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 2 }}>{lv[lang]}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.4 }}>{lang === 'ID' ? lv.subID : lv.subEN}</div>
                </div>
                <div style={{ color: level === lv.id ? C.primary : C.textLight, fontSize: 18, fontWeight: 300 }}>›</div>
              </button>
            ))}
          </div>
        </Wrap>
      </PageWrap>
    )
  }

  function Community() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <BackBtn onClick={() => setScreen('level')} lang={lang} />
          <StepLabel step={3} total={3} lang={lang} />

          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, lineHeight: 1.25, marginBottom: 8 }}>
            {t('Kamu aktif di komunitas mana?', 'Which community are you part of?')}
          </h1>
          <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            {t('Kami akan menyesuaikan materi dengan konteks komunitasmu', "We'll tailor content to your community context")}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {COMMUNITIES.map(c => (
              <button key={c.id}
                onClick={() => { setCommunity(c.id); setScreen('building') }}
                style={{
                  padding: '22px 16px', borderRadius: C.radiusLg, textAlign: 'center',
                  background: community === c.id ? C.primaryLight : C.surface,
                  border: `1.5px solid ${community === c.id ? C.primary : C.border}`,
                  cursor: 'pointer', boxShadow: C.shadowSm, transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.text, lineHeight: 1.4 }}>{c[lang]}</div>
              </button>
            ))}
          </div>
        </Wrap>
      </PageWrap>
    )
  }

  function Building() {
    const pct = Math.round(buildPct)
    const steps = [
      { min: 0,  ID: 'Menganalisa tujuanmu...', EN: 'Analysing your goals...' },
      { min: 30, ID: 'Menyesuaikan level...', EN: 'Calibrating your level...' },
      { min: 60, ID: 'Menyiapkan konten Batam...', EN: 'Preparing Batam content...' },
      { min: 88, ID: 'Jalur belajarmu siap!', EN: 'Your learning path is ready!' },
    ]
    const step = steps.filter(s => pct >= s.min).pop()
    return (
      <div style={{ minHeight: '100vh', background: C.primary, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, border: '1.5px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: 32 }}>✨</span>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          {t('Menyiapkan jalur belajarmu', 'Building your learning path')}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 40, minHeight: 22 }}>
          {step?.[lang]}
        </p>

        <div style={{ width: '100%', maxWidth: 300 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 100, height: 6, overflow: 'hidden', marginBottom: 10 }}>
            <div style={{ width: `${buildPct}%`, height: '100%', background: '#fff', borderRadius: 100, transition: 'width 0.25s ease' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{pct}%</p>
        </div>

        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {[
            { label: { ID: 'Level', EN: 'Level' }, val: LEVELS.find(l => l.id === level)?.[lang] || '—' },
            { label: { ID: 'Tujuan', EN: 'Goal' }, val: GOALS.find(g => g.id === goal)?.[lang] || '—' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, marginBottom: 4 }}>
                {item.label[lang].toUpperCase()}
              </div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function Lesson() {
    const lvInfo = LEVELS.find(l => l.id === level) || LEVELS[1]

    const ProgressBar = ({ step, total }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 10px', borderRadius: 99 }}>
          {t('PELAJARAN 1', 'LESSON 1')}
        </span>
        <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ width: `${(step / total) * 100}%`, height: '100%', background: C.primary, borderRadius: 100, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 12, color: C.textLight, fontWeight: 600 }}>{step}/{total}</span>
      </div>
    )

    // Step 0: Vocabulary
    if (lessonStep === 0) return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <ProgressBar step={1} total={3} />

          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 20 }}>
            {t('Kata Baru Hari Ini', "Today's New Word")}
          </h2>

          {/* Word card */}
          <Card style={{ padding: '28px 24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 34, fontWeight: 800, color: C.primary, letterSpacing: 1, marginBottom: 4 }}>
                  {ls.word}
                </div>
                <div style={{ color: C.textMuted, fontSize: 14 }}>{ls.phonetic}</div>
              </div>
              <div style={{ flexShrink: 0, padding: '4px 12px', borderRadius: 8, background: `${lvInfo.color}15`, border: `1px solid ${lvInfo.color}30`, color: lvInfo.color, fontWeight: 700, fontSize: 11 }}>
                {lvInfo.badge}
              </div>
            </div>

            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 16 }}>
              {lang === 'ID' ? ls.meaningID : ls.meaningEN}
            </div>

            <div style={{ background: C.bg, borderRadius: C.radius, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.textLight, letterSpacing: 1.5, marginBottom: 10 }}>
                {t('CONTOH KALIMAT', 'EXAMPLE SENTENCE')}
              </div>
              <div style={{ fontSize: 15, color: C.text, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 8 }}>
                "{ls.sentenceEN}"
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                "{ls.sentenceID}"
              </div>
            </div>
          </Card>

          {/* Listen button */}
          <button
            onClick={() => { speak(ls.word + '. ' + ls.sentenceEN); setSpeaking(true); setTimeout(() => setSpeaking(false), 2500) }}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: C.radius,
              background: speaking ? C.primaryLight : C.surface,
              border: `1.5px solid ${speaking ? C.primary : C.border}`,
              color: speaking ? C.primary : C.textMuted,
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginBottom: 20, transition: 'all 0.2s',
            }}>
            <span style={{ fontSize: 18 }}>{speaking ? '🔊' : '▶'}</span>
            {speaking ? t('Memainkan...', 'Playing...') : t('Dengarkan Pengucapan', 'Hear Pronunciation')}
          </button>

          <PrimaryBtn onClick={() => setLessonStep(1)}>
            {t('Lanjut ke Quiz →', 'Continue to Quiz →')}
          </PrimaryBtn>
        </Wrap>
      </PageWrap>
    )

    // Step 1: Quiz
    if (lessonStep === 1) {
      const answered = quizAnswer !== null
      const correct = quizAnswer === ls.ans
      return (
        <PageWrap>
          <LangToggle lang={lang} onToggle={toggleLang} />
          <Wrap>
            <ProgressBar step={2} total={3} />

            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>
              {t('Quiz Cepat', 'Quick Quiz')}
            </h2>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {lang === 'ID' ? ls.quizQID : ls.quizQEN}
            </p>

            {ls.quizSentence && (
              <Card style={{ padding: '16px 20px', marginBottom: 20, background: C.bg }}>
                <div style={{ fontSize: 17, color: C.text, fontStyle: 'italic', textAlign: 'center', fontWeight: 500 }}>
                  {ls.quizSentence}
                </div>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {ls.opts.map((opt, i) => {
                let bg = C.surface, border = C.border, color = C.text
                let iconEl = null
                if (answered) {
                  if (i === ls.ans) {
                    bg = C.successBg; border = '#059669'; color = C.success
                    iconEl = <span style={{ marginLeft: 'auto', fontSize: 16 }}>✓</span>
                  } else if (i === quizAnswer) {
                    bg = C.errorBg; border = '#DC2626'; color = C.error
                    iconEl = <span style={{ marginLeft: 'auto', fontSize: 16 }}>✗</span>
                  }
                }
                return (
                  <button key={i} disabled={answered}
                    onClick={() => { setQuizAnswer(i); if (i === ls.ans) setXP(p => p + 50) }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      padding: '15px 18px', borderRadius: C.radius,
                      background: bg, border: `1.5px solid ${border}`, color,
                      fontWeight: 600, fontSize: 14, cursor: answered ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all 0.2s',
                      boxShadow: answered ? 'none' : C.shadowSm,
                    }}>
                    <span style={{ flex: 1 }}>{lang === 'ID' ? opt.ID : opt.EN}</span>
                    {iconEl}
                  </button>
                )
              })}
            </div>

            {answered && (
              <>
                <Card style={{
                  padding: '16px 18px', marginBottom: 18,
                  background: correct ? C.successBg : C.errorBg,
                  borderColor: correct ? '#059669' : '#DC2626',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: correct ? C.success : C.error, marginBottom: correct ? 0 : 6 }}>
                    {correct ? t('✓ Benar! +50 XP', '✓ Correct! +50 XP') : t('✗ Belum tepat', '✗ Not quite right')}
                  </div>
                  {!correct && (
                    <div style={{ color: C.textMuted, fontSize: 13 }}>
                      {t('Jawaban benar: ', 'Answer: ')}
                      <strong style={{ color: C.text }}>{lang === 'ID' ? ls.opts[ls.ans].ID : ls.opts[ls.ans].EN}</strong>
                    </div>
                  )}
                </Card>
                <PrimaryBtn onClick={() => setLessonStep(2)}>{t('Lanjut →', 'Continue →')}</PrimaryBtn>
              </>
            )}
          </Wrap>
        </PageWrap>
      )
    }

    // Step 2: Real-world tip
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <ProgressBar step={3} total={3} />

          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>
            {t('Konteks Dunia Nyata', 'Real-World Context')}
          </h2>
          <p style={{ color: C.textMuted, fontSize: 14, marginBottom: 24 }}>
            {t('Khusus untuk konteks profesional di Batam', 'Specifically for the Batam professional context')}
          </p>

          <Card style={{ padding: '24px', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🇮🇩</div>
              <span style={{ fontSize: 16, color: C.textMuted, fontWeight: 400 }}>→</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🇸🇬</div>
              <span style={{ fontWeight: 700, fontSize: 14, color: C.primary, marginLeft: 8 }}>Batam Context</span>
            </div>
            <p style={{ color: C.text, fontSize: 16, lineHeight: 1.75, fontWeight: 400 }}>
              {lang === 'ID' ? ls.tipID : ls.tipEN}
            </p>
          </Card>

          <Card style={{ padding: '18px 20px', marginBottom: 28, background: C.goldBg, borderColor: '#D97706' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.gold, marginBottom: 4 }}>
                  {t('Tantangan Hari Ini', "Today's Challenge")}
                </div>
                <div style={{ fontSize: 14, color: '#92400E', lineHeight: 1.6 }}>
                  {t(`Gunakan kata "${ls.word}" dalam satu percakapan hari ini`, `Use the word "${ls.word}" in one conversation today`)}
                </div>
              </div>
            </div>
          </Card>

          <PrimaryBtn onClick={() => setScreen('lesson-done')}>
            {t('Selesaikan Pelajaran →', 'Complete Lesson →')}
          </PrimaryBtn>
        </Wrap>
      </PageWrap>
    )
  }

  function LessonDone() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          {/* Completion header */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.successBg, border: `2px solid #059669`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
              ✓
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 6 }}>
              {t('Pelajaran 1 Selesai!', 'Lesson 1 Complete!')}
            </h1>
            <p style={{ color: C.textMuted, fontSize: 15 }}>
              {t('Kerja bagus. Kamu sudah memulai perjalananmu.', "Well done. You've started your journey.")}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {[
              { icon: '⚡', label: 'XP', val: '+50', color: C.gold, bg: C.goldBg },
              { icon: '🔥', label: t('Streak', 'Streak'), val: `${t('Hari', 'Day')} 1`, color: '#EA580C', bg: '#FFF7ED' },
              { icon: '📚', label: t('Kata', 'Words'), val: '1', color: C.primary, bg: C.primaryLight },
            ].map((s, i) => (
              <Card key={i} style={{ flex: 1, padding: '16px 8px', textAlign: 'center', background: s.bg, borderColor: 'transparent' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Next lesson locked */}
          <Card style={{ marginBottom: 24, overflow: 'hidden', position: 'relative' }}>
            <div style={{ padding: '18px 20px', filter: 'blur(3px)', userSelect: 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textLight, letterSpacing: 1, marginBottom: 6 }}>
                {t('PELAJARAN 2', 'LESSON 2')}
              </div>
              <div style={{ fontWeight: 700, fontSize: 17, color: C.text }}>DELEGATE</div>
              <div style={{ fontSize: 14, color: C.textMuted }}>
                {t('Mendelegasikan tugas secara efektif', 'Delegating tasks effectively')}
              </div>
            </div>
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 24, color: C.textMuted }}>🔒</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                {t('Simpan progress untuk membuka', 'Save progress to unlock')}
              </div>
            </div>
          </Card>

          <PrimaryBtn onClick={() => setScreen('register')} style={{ marginBottom: 10 }}>
            {t('💾  Simpan Progress dengan WhatsApp', '💾  Save Progress with WhatsApp')}
          </PrimaryBtn>
          <p style={{ textAlign: 'center', color: C.textLight, fontSize: 13 }}>
            {t('Gratis. Tidak perlu password.', 'Free. No password needed.')}
          </p>
        </Wrap>
      </PageWrap>
    )
  }

  function Register() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📱</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>
              {t('Simpan Progressmu', 'Save Your Progress')}
            </h1>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7 }}>
              {t('Masukkan nomor WhatsApp untuk menyimpan streak dan membuka pelajaran berikutnya.', 'Enter your WhatsApp number to save your streak and unlock the next lesson.')}
            </p>
          </div>

          {/* Progress recap */}
          <Card style={{ padding: '16px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              {[
                { val: '1', label: t('Pelajaran', 'Lesson') },
                { val: '50 XP', label: t('Poin diperoleh', 'Points earned') },
                { val: '🔥 1', label: t('Hari streak', 'Day streak') },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: C.primary }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                {t('Nama (opsional)', 'Name (optional)')}
              </label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={t('Nama kamu...', 'Your name...')}
                style={{ width: '100%', padding: '13px 16px', borderRadius: C.radius, fontSize: 15, background: C.surface, border: `1.5px solid ${C.border}`, color: C.text, outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                {t('Nomor WhatsApp *', 'WhatsApp Number *')}
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ padding: '13px 14px', borderRadius: C.radius, background: C.bg, border: `1.5px solid ${C.border}`, fontWeight: 700, fontSize: 14, color: C.text, whiteSpace: 'nowrap' }}>
                  🇮🇩 +62
                </div>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="8123456789" type="tel"
                  style={{ flex: 1, padding: '13px 16px', borderRadius: C.radius, fontSize: 15, background: C.surface, border: `1.5px solid ${C.border}`, color: C.text, outline: 'none' }}
                />
              </div>
            </div>

            {refFrom ? (
              <Card style={{ padding: '12px 16px', background: C.goldBg, borderColor: '#D97706' }}>
                <span style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>
                  ✓ {t('Kode referral:', 'Referral code:')} <strong>{refFrom}</strong>
                </span>
              </Card>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                  {t('Kode referral (opsional)', 'Referral code (optional)')}
                </label>
                <input value={refFrom} onChange={e => setRefFrom(e.target.value.toUpperCase())}
                  placeholder="FLNT-XXXX"
                  style={{ width: '100%', padding: '13px 16px', borderRadius: C.radius, fontSize: 15, background: C.surface, border: `1.5px solid ${C.border}`, color: C.text, outline: 'none', letterSpacing: 1 }}
                />
              </div>
            )}
          </div>

          {submitError && (
            <Card style={{ padding: '12px 16px', marginBottom: 16, background: C.errorBg, borderColor: '#DC2626' }}>
              <span style={{ color: C.error, fontSize: 14 }}>{submitError}</span>
            </Card>
          )}

          <PrimaryBtn onClick={handleRegister} disabled={submitting} style={{ marginBottom: 12 }}>
            {submitting ? t('Menyimpan...', 'Saving...') : t('✓  Simpan & Lanjutkan', '✓  Save & Continue')}
          </PrimaryBtn>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <span style={{ fontSize: 14, color: C.textLight }}>🔒</span>
            <p style={{ fontSize: 13, color: C.textLight }}>
              {t('Data kamu aman dan tidak akan dibagikan', 'Your data is safe and never shared')}
            </p>
          </div>
        </Wrap>
      </PageWrap>
    )
  }

  function Success() {
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />
        <Wrap>
          <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎊</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 8 }}>
              {t('Kamu sudah terdaftar!', "You're registered!")}
            </h1>
            <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7 }}>
              {t('Progressmu tersimpan. Undang teman dan buka konten eksklusif.', 'Your progress is saved. Invite friends to unlock exclusive content.')}
            </p>
          </div>

          {/* Referral code */}
          <Card style={{ padding: '24px', marginBottom: 20, textAlign: 'center', background: C.goldBg, borderColor: '#D97706' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, letterSpacing: 2, marginBottom: 12 }}>
              {t('KODE REFERRALMU', 'YOUR REFERRAL CODE')}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 4, color: C.text, marginBottom: 14 }}>
              {refCode}
            </div>
            <button onClick={() => copyCode(refCode)}
              style={{ padding: '9px 20px', borderRadius: C.radiusSm, background: C.surface, border: `1.5px solid ${C.border}`, color: C.gold, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {copied ? t('✓ Disalin!', '✓ Copied!') : t('📋  Salin Kode', '📋  Copy Code')}
            </button>
          </Card>

          {/* Reward tiers */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 12 }}>
              {t('REWARD REFERRAL', 'REFERRAL REWARDS')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { n: 1, icon: '🎁', reward: { ID: 'Business English Pack — 20 pelajaran eksklusif', EN: 'Business English Pack — 20 exclusive lessons' } },
                { n: 3, icon: '🎤', reward: { ID: 'Speaking Pro — latihan berbicara tak terbatas', EN: 'Speaking Pro — unlimited speaking practice' } },
                { n: 5, icon: '⭐', reward: { ID: '1 bulan FluentEdge Pro gratis', EN: '1 month FluentEdge Pro free' } },
              ].map((r, i) => (
                <Card key={i} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.primary }}>
                      {t(`Undang ${r.n} teman`, `Invite ${r.n} friend${r.n > 1 ? 's' : ''}`)}
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{r.reward[lang]}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <a href={waLink(refCode)} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '16px', borderRadius: C.radius,
              background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 16,
              marginBottom: 12, boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t('Bagikan ke WhatsApp', 'Share to WhatsApp')}
          </a>
          <button onClick={() => setScreen('dashboard')}
            style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: C.textMuted, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {t('Lanjut ke Dashboard →', 'Continue to Dashboard →')}
          </button>
        </Wrap>
      </PageWrap>
    )
  }

  function Dashboard() {
    const lvInfo = LEVELS.find(l => l.id === level) || LEVELS[1]
    return (
      <PageWrap>
        <LangToggle lang={lang} onToggle={toggleLang} />

        {/* Top bar */}
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📘</div>
              <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>FluentEdge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: '4px 12px', borderRadius: 8, background: `${lvInfo.color}15`, border: `1px solid ${lvInfo.color}30`, color: lvInfo.color, fontWeight: 700, fontSize: 12 }}>
                {lvInfo.badge}
              </div>
            </div>
          </div>
        </div>

        <Wrap>
          {/* Greeting */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: C.textMuted, fontSize: 14 }}>{t('Selamat datang kembali', 'Welcome back')} 👋</p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{name || t('Pengguna FluentEdge', 'FluentEdge User')}</h1>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {[
              { icon: '🔥', label: t('Streak', 'Streak'), val: `1 ${t('hari', 'day')}`, color: '#EA580C', bg: '#FFF7ED' },
              { icon: '⚡', label: 'XP',              val: '50',                   color: C.gold,    bg: C.goldBg },
              { icon: '📚', label: t('Progress', 'Progress'), val: '1/30',           color: C.primary, bg: C.primaryLight },
            ].map((s, i) => (
              <Card key={i} style={{ flex: 1, padding: '14px 8px', textAlign: 'center', background: s.bg, borderColor: 'transparent' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Today's plan */}
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 14 }}>
            📋 {t('Rencana Hari Ini', "Today's Plan")}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {/* Completed */}
            <Card style={{ padding: '16px 18px', background: C.successBg, borderColor: '#059669' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#059669', fontSize: 18, fontWeight: 700 }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.success }}>{t(`Pelajaran 1 — ${ls.word}`, `Lesson 1 — ${ls.word}`)}</div>
                  <div style={{ fontSize: 12, color: '#059669', marginTop: 2 }}>{t('Selesai', 'Completed')}</div>
                </div>
              </div>
            </Card>

            {/* Next lesson */}
            <Card style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>📖</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{t('Pelajaran 2 — DELEGATE', 'Lesson 2 — DELEGATE')}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t('Tersedia besok', 'Available tomorrow')}</div>
                </div>
                <div style={{ color: C.textLight, fontSize: 18 }}>›</div>
              </div>
            </Card>

            {/* Locked */}
            <Card style={{ padding: '16px 18px', opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18, color: C.textLight }}>🔒</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.textMuted }}>{t('Latihan Berbicara', 'Speaking Practice')}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{t('Undang 1 teman untuk membuka', 'Invite 1 friend to unlock')}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Referral banner */}
          {refCode && (
            <Card style={{ padding: '20px', marginBottom: 24, background: C.primaryLight, borderColor: C.primary }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: C.primary, marginBottom: 6 }}>
                🎁 {t('Undang Teman, Dapat Reward!', 'Invite Friends, Get Rewards!')}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
                {t('Kode referralmu: ', 'Your code: ')}<strong style={{ color: C.primary, letterSpacing: 2 }}>{refCode}</strong>
              </div>
              <a href={waLink(refCode)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13, padding: '9px 18px', borderRadius: C.radiusSm, textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('Bagikan Sekarang', 'Share Now')}
              </a>
            </Card>
          )}

          {/* Path progress */}
          <Card style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{t('Jalur', 'Path')} — {lvInfo[lang]}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t('29 pelajaran tersisa', '29 lessons remaining')}</div>
              </div>
              <span style={{ fontWeight: 800, fontSize: 16, color: C.primary }}>1/30</span>
            </div>
            <div style={{ background: C.border, borderRadius: 100, height: 8, overflow: 'hidden' }}>
              <div style={{ width: '3.3%', height: '100%', background: C.primary, borderRadius: 100 }} />
            </div>
          </Card>
        </Wrap>
      </PageWrap>
    )
  }

  // ─── Router ───────────────────────────────────────────────────────────────────

  const screens = { splash: Splash, goal: Goal, level: Level, community: Community, building: Building, lesson: Lesson, 'lesson-done': LessonDone, register: Register, success: Success, dashboard: Dashboard }
  const Screen = screens[screen] || Splash

  return (
    <>
      <Head>
        <title>FluentEdge — Professional English</title>
        <meta name="description" content={t('Kuasai bahasa Inggris profesional. Dirancang untuk para profesional di Batam.', 'Master professional English. Designed for Batam professionals.')} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0D47A1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <Screen />
    </>
  )
}
