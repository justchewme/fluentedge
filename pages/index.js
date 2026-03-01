import { useState, useEffect } from 'react'
import Head from 'next/head'
import { VOCAB_BANK, GRAMMAR_BANK, READING_BANK, SPEAKING_BANK, CURRICULUM_WEEKS } from '../content'

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:           '#0A0A0F',
  card:         '#131318',
  elevated:     '#1C1C24',
  border:       '#2A2A38',
  accent:       '#6366F1',
  accentHov:    '#818CF8',
  accentGlow:   'rgba(99,102,241,0.15)',
  accentBorder: 'rgba(99,102,241,0.35)',
  gold:         '#F59E0B',
  goldGlow:     'rgba(245,158,11,0.15)',
  success:      '#10B981',
  successBg:    'rgba(16,185,129,0.08)',
  error:        '#F43F5E',
  errorBg:      'rgba(244,63,94,0.08)',
  text:         '#F1F0EE',
  textSec:      '#94A3B8',
  textMuted:    '#64748B',
}
const FR = "'Fraunces', Georgia, serif"
const PJ = "'Plus Jakarta Sans', -apple-system, sans-serif"

/* ═══════════════════════════════════════════════════════════════════════════════
   CONTENT HELPERS
═══════════════════════════════════════════════════════════════════════════════ */
function getVocabList(level) {
  if (level === 'advanced') return VOCAB_BANK.high || VOCAB_BANK.lower
  if (level === 'intermediate') return VOCAB_BANK.medium || VOCAB_BANK.lower
  return VOCAB_BANK.lower
}

function getLessonContent(day, level) {
  const week = Math.min(Math.ceil(day / 7), 26)
  const vList = getVocabList(level)

  // 5 vocab flashcards for today
  const vStart = ((day - 1) * 5) % vList.length
  const vocabCards = Array.from({ length: 5 }, (_, i) => vList[(vStart + i) % vList.length])

  // Grammar lesson
  const gIdx = (week - 1) % GRAMMAR_BANK.length
  const grammar = GRAMMAR_BANK[gIdx]

  // Reading passage
  const reading = READING_BANK[(day - 1) % READING_BANK.length]

  // Speaking prompts
  const speakingEntry = SPEAKING_BANK.find(s => s.week === week) || SPEAKING_BANK[0]

  // Quiz: 5 vocab MCQ with stable deterministic distractors
  const qStart = ((day - 1) * 3) % vList.length
  const quizWords = Array.from({ length: 5 }, (_, i) => vList[(qStart + i) % vList.length])
  const quizQuestions = quizWords.map((w, i) => {
    const distractors = [2, 5, 11].map(offset =>
      vList[(qStart + i + offset) % vList.length]?.meaningEN || 'A formal business arrangement'
    )
    const opts = [w.meaningEN, ...distractors]
    // Deterministic sort using day + position as seed
    opts.sort((a, b) => ((a.charCodeAt(0) * (day + i)) % 4) - ((b.charCodeAt(0) * (day + i)) % 4))
    return { word: w.word, phonetic: w.phonetic, answer: w.meaningEN, options: opts }
  })

  const curriculumWeek = CURRICULUM_WEEKS.find(c => c.week === week) || CURRICULUM_WEEKS[0]
  return { vocabCards, grammar, reading, speakingEntry, quizQuestions, week, curriculumWeek }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════════ */
export default function FluentEdge() {
  // ── Core ─────────────────────────────────────────────────────────────────────
  const [screen, setScreen]   = useState('splash')
  const [lang,   setLang]     = useState('id')

  // ── Survey ────────────────────────────────────────────────────────────────────
  const [goal,     setGoal]     = useState(null)
  const [level,    setLevel]    = useState(null)
  const [industry, setIndustry] = useState(null)
  const [faith,    setFaith]    = useState(null)

  // ── Registration ──────────────────────────────────────────────────────────────
  const [regName,  setRegName]  = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [profile,  setProfile]  = useState(null)

  // ── Progress ──────────────────────────────────────────────────────────────────
  const [xp,            setXp]            = useState(0)
  const [streak,        setStreak]        = useState(0)
  const [day,           setDay]           = useState(1)
  const [completedDays, setCompletedDays] = useState([])

  // ── Lesson ────────────────────────────────────────────────────────────────────
  const [lessonData, setLessonData] = useState(null)
  const [actIdx,     setActIdx]     = useState(0)   // 0=vocab 1=grammar 2=reading 3=quiz 4=speaking
  const [cardIdx,    setCardIdx]    = useState(0)   // vocab card index
  const [flipped,    setFlipped]    = useState(false)
  const [qIdx,       setQIdx]       = useState(0)   // question index
  const [selected,   setSelected]   = useState(null)
  const [feedback,   setFeedback]   = useState(null) // 'correct' | 'wrong'
  const [lessonXp,   setLessonXp]   = useState(0)

  // ── Plan loading ──────────────────────────────────────────────────────────────
  const [loadStep, setLoadStep] = useState(0)

  // ── Init from localStorage ───────────────────────────────────────────────────
  useEffect(() => {
    try {
      const sl = localStorage.getItem('fe_lang')
      if (sl) setLang(sl)

      const sp = localStorage.getItem('fe_profile')
      if (sp) {
        const p = JSON.parse(sp)
        setProfile(p)
        setGoal(p.goal); setLevel(p.level); setIndustry(p.industry); setFaith(p.faith)
      }

      const prog = localStorage.getItem('fe_progress')
      if (prog) {
        const pr = JSON.parse(prog)
        setXp(pr.xp || 0); setStreak(pr.streak || 0)
        setDay(pr.day || 1); setCompletedDays(pr.completedDays || [])
      }

      if (sp) setScreen('dashboard')
    } catch {}
  }, [])

  useEffect(() => { localStorage.setItem('fe_lang', lang) }, [lang])

  // Plan loading animation
  useEffect(() => {
    if (screen !== 'plan-loading') return
    const timers = [500, 1200, 2100, 2900].map((delay, i) =>
      setTimeout(() => setLoadStep(i + 1), delay)
    )
    const done = setTimeout(() => setScreen('plan-reveal'), 3600)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [screen])

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const t = (en, id) => lang === 'en' ? en : id

  function speak(text) {
    try {
      window.speechSynthesis?.cancel()
      const utt = new SpeechSynthesisUtterance(text)
      utt.lang = 'en-US'; utt.rate = 0.82; utt.pitch = 1.0
      window.speechSynthesis?.speak(utt)
    } catch {}
  }

  function startLesson() {
    const data = getLessonContent(day, level || 'beginner')
    setLessonData(data)
    setActIdx(0); setCardIdx(0); setFlipped(false)
    setQIdx(0); setSelected(null); setFeedback(null); setLessonXp(0)
    setScreen('lesson')
  }

  function awardXp(pts) { setLessonXp(p => p + pts) }

  function nextAct() {
    if (actIdx < 4) {
      setActIdx(a => a + 1)
      setQIdx(0); setSelected(null); setFeedback(null); setFlipped(false); setCardIdx(0)
    } else {
      finishLesson()
    }
  }

  function finishLesson() {
    const newXp       = xp + lessonXp
    const newStreak   = streak + 1
    const newCompleted = completedDays.includes(day) ? completedDays : [...completedDays, day]
    const newDay      = completedDays.includes(day) ? day : day + 1
    setXp(newXp); setStreak(newStreak); setCompletedDays(newCompleted); setDay(newDay)
    localStorage.setItem('fe_progress', JSON.stringify({
      xp: newXp, streak: newStreak, day: newDay, completedDays: newCompleted,
    }))
    setScreen('lesson-done')
  }

  async function submitReg(e) {
    e.preventDefault()
    const p = {
      name: regName, phone: regPhone, goal, level, industry, faith,
      religion: faith === 'faith' ? 'faith' : null,
      joinedAt: new Date().toISOString(),
    }
    setProfile(p)
    localStorage.setItem('fe_profile', JSON.stringify(p))
    localStorage.setItem('fe_progress', JSON.stringify({ xp: 0, streak: 0, day: 1, completedDays: [] }))
    try {
      await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p),
      })
    } catch {}
    setScreen('dashboard')
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SPLASH
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'splash') return (
    <Shell lang={lang} setLang={setLang}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: `linear-gradient(135deg, ${C.accent} 0%, #818CF8 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: `0 0 56px ${C.accentGlow}, 0 0 120px rgba(99,102,241,0.06)` }}>
          <span style={{ fontSize: 34 }}>⚡</span>
        </div>

        <p style={{ fontFamily: PJ, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', color: C.accent, textTransform: 'uppercase', marginBottom: 18 }}>FluentEdge</p>

        <h1 style={{ fontFamily: FR, fontSize: 42, fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 20, maxWidth: 340 }}>
          {t('Speak English like the elite do.', 'Bicara Inggris seperti orang sukses.')}
        </h1>

        <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, lineHeight: 1.65, maxWidth: 300, marginBottom: 44 }}>
          {t(
            'A structured 6-month program for professionals in Batam — 60 minutes a day, every day.',
            'Program 6 bulan terstruktur untuk profesional Batam — 60 menit sehari, setiap hari.'
          )}
        </p>

        <div style={{ display: 'flex', gap: 28, marginBottom: 44 }}>
          {[['180', t('Lessons', 'Pelajaran')], ['26', t('Weeks', 'Minggu')], ['6k+', t('Learners', 'Pelajar')]].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: FR, fontSize: 30, fontWeight: 800, color: C.accent }}>{n}</div>
              <div style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen('survey-goal')}
          style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px 40px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', width: '100%', maxWidth: 360, boxShadow: `0 0 40px ${C.accentGlow}`, letterSpacing: '0.02em' }}>
          {t('Start My Free Assessment →', 'Mulai Asesmen Gratis →')}
        </button>

        <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, marginTop: 14 }}>
          {t('No payment · No credit card · 100% free', 'Tanpa bayaran · Tanpa kartu kredit · 100% gratis')}
        </p>
      </div>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     SURVEY — GOAL
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'survey-goal') return (
    <Shell lang={lang} setLang={setLang}>
      <SurveyLayout step={1} total={4}
        headline={t('Why do you want to master English?', 'Kenapa kamu ingin mahir bahasa Inggris?')}
        sub={t("We'll tailor your plan to your specific goal.", 'Kami sesuaikan programmu dengan tujuanmu.')}>
        {[
          { id: 'career',    icon: '💼', en: 'Career Growth',        id_: 'Karir & Promosi',         desc: t('Get promoted, earn more, impress leadership',           'Naik jabatan, gaji lebih tinggi, impress atasan') },
          { id: 'business',  icon: '🤝', en: 'Business & Trade',     id_: 'Bisnis & Perdagangan',    desc: t('Deal with Singapore clients and partners',             'Deal dengan klien dan mitra Singapura') },
          { id: 'travel',    icon: '✈️', en: 'Global Mobility',      id_: 'Mobilitas Global',        desc: t('Travel, study, and work abroad with confidence',       'Bepergian dan bekerja di luar negeri') },
          { id: 'education', icon: '📚', en: 'Academic Excellence',  id_: 'Pendidikan Lebih Tinggi', desc: t('Scholarships, exams, overseas study',                  'Beasiswa, ujian, kuliah ke luar negeri') },
        ].map(opt => (
          <SurveyCard key={opt.id} icon={opt.icon} title={t(opt.en, opt.id_)} desc={opt.desc}
            selected={goal === opt.id}
            onClick={() => { setGoal(opt.id); setTimeout(() => setScreen('survey-level'), 280) }} />
        ))}
      </SurveyLayout>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     SURVEY — LEVEL
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'survey-level') return (
    <Shell lang={lang} setLang={setLang}>
      <SurveyLayout step={2} total={4}
        headline={t('How is your English right now?', 'Seberapa bagus Bahasa Inggris kamu sekarang?')}
        sub={t("Be honest — we'll meet you exactly where you are.", 'Jawab jujur — kami mulai dari levelmu.')}>
        {[
          { id: 'beginner',     icon: '🌱', en: 'Beginner',     id_: 'Pemula',   desc: t('I know basic words but struggle with full sentences', 'Tahu kata-kata dasar tapi susah buat kalimat') },
          { id: 'intermediate', icon: '⚡', en: 'Intermediate', id_: 'Menengah', desc: t('I can communicate but make mistakes often',           'Bisa berkomunikasi tapi masih sering salah') },
          { id: 'advanced',     icon: '🏆', en: 'Advanced',     id_: 'Mahir',    desc: t("I'm fairly fluent but want to sound more professional", 'Cukup lancar tapi mau lebih profesional') },
        ].map(opt => (
          <SurveyCard key={opt.id} icon={opt.icon} title={t(opt.en, opt.id_)} desc={opt.desc}
            selected={level === opt.id}
            onClick={() => { setLevel(opt.id); setTimeout(() => setScreen('survey-industry'), 280) }} />
        ))}
      </SurveyLayout>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     SURVEY — INDUSTRY
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'survey-industry') return (
    <Shell lang={lang} setLang={setLang}>
      <SurveyLayout step={3} total={4}
        headline={t("What's your field?", 'Apa bidang pekerjaanmu?')}
        sub={t('Your lessons will use real scenarios from your industry.', 'Pelajaranmu disesuaikan dengan industri dan situasimu.')}>
        {[
          { id: 'manufacturing', icon: '🏭', en: 'Manufacturing',       id_: 'Manufaktur & Pabrik' },
          { id: 'trading',       icon: '📦', en: 'Trading & Logistics', id_: 'Trading & Logistik' },
          { id: 'finance',       icon: '💳', en: 'Finance & Banking',   id_: 'Keuangan & Perbankan' },
          { id: 'technology',    icon: '💻', en: 'Technology',          id_: 'Teknologi & IT' },
          { id: 'hospitality',   icon: '🏨', en: 'Hospitality',         id_: 'Perhotelan & Pariwisata' },
          { id: 'other',         icon: '🌐', en: 'Other',               id_: 'Lainnya' },
        ].map(opt => (
          <SurveyCard key={opt.id} icon={opt.icon} title={t(opt.en, opt.id_)} compact
            selected={industry === opt.id}
            onClick={() => { setIndustry(opt.id); setTimeout(() => setScreen('survey-faith'), 280) }} />
        ))}
      </SurveyLayout>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     SURVEY — FAITH
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'survey-faith') return (
    <Shell lang={lang} setLang={setLang}>
      <SurveyLayout step={4} total={4}
        headline={t('One last thing…', 'Satu hal lagi…')}
        sub={t('Are you part of a spiritual community? (Optional)', 'Apakah kamu bagian dari komunitas iman? (Opsional)')}>
        {[
          { id: 'faith', icon: '✝️', en: "Yes, I'm part of a faith community",  id_: 'Ya, saya bagian dari komunitas iman' },
          { id: 'other', icon: '🤲', en: 'I practice a different faith',         id_: 'Saya memeluk kepercayaan lain' },
          { id: 'none',  icon: '🙅', en: "I'd rather not say",                   id_: 'Saya tidak ingin berbagi' },
        ].map(opt => (
          <SurveyCard key={opt.id} icon={opt.icon} title={t(opt.en, opt.id_)} compact
            selected={faith === opt.id}
            onClick={() => { setFaith(opt.id); setTimeout(() => setScreen('plan-loading'), 280) }} />
        ))}
      </SurveyLayout>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     PLAN LOADING
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'plan-loading') {
    const steps = [
      t('Analysing your English level…', 'Menganalisa level Bahasa Inggrismu…'),
      t('Mapping your industry vocabulary…', 'Memetakan kosakata industrimu…'),
      t('Designing your 6-month curriculum…', 'Merancang kurikulum 6 bulanmu…'),
      t('Building your daily schedule…', 'Membangun jadwal harianmu…'),
    ]
    return (
      <Shell lang={lang} setLang={setLang}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: `3px solid ${C.border}`, borderTop: `3px solid ${C.accent}`, animation: 'spin 1s linear infinite', marginBottom: 36 }} />
          <h2 style={{ fontFamily: FR, fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 8 }}>
            {t('Building your plan…', 'Membuat rencanamu…')}
          </h2>
          <p style={{ fontFamily: PJ, fontSize: 14, color: C.textMuted, marginBottom: 40 }}>
            {t('Personalised for your level and goals.', 'Dipersonalisasi untuk level dan tujuanmu.')}
          </p>
          <div style={{ width: '100%', maxWidth: 300 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', opacity: i < loadStep ? 1 : 0.22, transition: 'opacity 0.5s ease' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < loadStep ? C.success : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.4s' }}>
                  {i < loadStep && <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ fontFamily: PJ, fontSize: 14, color: i < loadStep ? C.text : C.textMuted, textAlign: 'left' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PLAN REVEAL
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'plan-reveal') {
    const lvlLabel  = { beginner: t('Beginner A1–A2', 'Pemula A1–A2'), intermediate: t('Intermediate B1–B2', 'Menengah B1–B2'), advanced: t('Advanced C1', 'Mahir C1') }
    const goalLabel = { career: t('Career Growth', 'Karir & Promosi'), business: t('Business & Trade', 'Bisnis & Perdagangan'), travel: t('Global Mobility', 'Mobilitas Global'), education: t('Academic Excellence', 'Pendidikan Tinggi') }
    const targetLevel = level === 'beginner' ? 'B2' : level === 'intermediate' ? 'C1' : 'C2'

    return (
      <Shell lang={lang} setLang={setLang}>
        <div style={{ padding: '48px 24px 40px', maxWidth: 420, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 52, marginBottom: 18 }}>🎯</div>
            <h1 style={{ fontFamily: FR, fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 12 }}>
              {t('Your Plan is Ready', 'Rencanamu Sudah Siap')}
            </h1>
            <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, lineHeight: 1.6 }}>
              {t('A personalised 6-month English mastery program — built just for you.', 'Program penguasaan Bahasa Inggris 6 bulan — dibuat khusus untukmu.')}
            </p>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('YOUR LEVEL', 'LEVELMU')}</p>
                <p style={{ fontFamily: PJ, fontSize: 15, fontWeight: 700, color: C.text }}>{lvlLabel[level] || t('Beginner', 'Pemula')}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('YOUR GOAL', 'TUJUANMU')}</p>
                <p style={{ fontFamily: PJ, fontSize: 15, fontWeight: 700, color: C.text }}>{goalLabel[goal] || t('Career', 'Karir')}</p>
              </div>
            </div>
            {[
              { icon: '⏱️', label: t('Daily practice', 'Latihan harian'),   value: '60 min' },
              { icon: '📖', label: t('Total lessons', 'Total pelajaran'),    value: '180' },
              { icon: '💬', label: t('Vocabulary words', 'Kosakata baru'),   value: '1,200+' },
              { icon: '📅', label: t('Program duration', 'Durasi program'),  value: t('26 weeks', '26 minggu') },
              { icon: '🏁', label: t('Target level', 'Target level'),        value: targetLevel },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <span style={{ fontFamily: PJ, fontSize: 14, color: C.textSec }}>{s.label}</span>
                </div>
                <span style={{ fontFamily: FR, fontSize: 18, fontWeight: 700, color: C.accent }}>{s.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setScreen('register')}
            style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 40px ${C.accentGlow}` }}>
            {t('Claim My Plan →', 'Ambil Rencanaku →')}
          </button>
        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     REGISTER
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'register') return (
    <Shell lang={lang} setLang={setLang}>
      <div style={{ padding: '60px 24px 40px', maxWidth: 420, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: FR, fontSize: 32, fontWeight: 900, color: C.text, marginBottom: 12 }}>
            {t('Lock In Your Spot', 'Simpan Posisimu')}
          </h1>
          <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, lineHeight: 1.6 }}>
            {t('Your plan is reserved for 24 hours. Enter your details to start.', 'Rencanamu disimpan 24 jam. Masukkan detailmu untuk memulai.')}
          </p>
        </div>

        <form onSubmit={submitReg} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: t('Full Name', 'Nama Lengkap'), type: 'text', val: regName, set: setRegName, ph: t('e.g. Budi Santoso', 'mis. Budi Santoso') },
            { label: t('WhatsApp Number', 'Nomor WhatsApp'), type: 'tel', val: regPhone, set: setRegPhone, ph: '08xx xxxx xxxx' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily: PJ, fontSize: 13, fontWeight: 600, color: C.textSec, display: 'block', marginBottom: 8 }}>{f.label}</label>
              <input
                required type={f.type} value={f.val} placeholder={f.ph}
                onChange={e => f.set(e.target.value)}
                style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', fontSize: 16, color: C.text, fontFamily: PJ, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <button
            type="submit"
            style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', marginTop: 8, boxShadow: `0 0 40px ${C.accentGlow}` }}>
            {t('Start Learning Free →', 'Mulai Belajar Gratis →')}
          </button>
        </form>

        <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, textAlign: 'center', marginTop: 16 }}>
          {t('No spam. No payment. Just English.', 'Tidak ada spam. Tidak ada bayaran. Hanya Bahasa Inggris.')}
        </p>
      </div>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     DASHBOARD
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'dashboard') {
    const week       = Math.min(Math.ceil(day / 7), 26)
    const currWeek   = CURRICULUM_WEEKS.find(c => c.week === week) || CURRICULUM_WEEKS[0]
    const todayDone  = completedDays.includes(day)
    const totalDays  = 180
    const overallPct = Math.round((completedDays.length / totalDays) * 100)
    const firstName  = profile?.name?.split(' ')[0] || t('Learner', 'Pelajar')

    return (
      <Shell lang={lang} setLang={setLang}>
        <div style={{ padding: '28px 20px 80px', maxWidth: 420, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: PJ, fontSize: 13, color: C.textMuted, marginBottom: 3 }}>{t('Good morning,', 'Selamat pagi,')}</p>
              <h1 style={{ fontFamily: FR, fontSize: 30, fontWeight: 800, color: C.text }}>{firstName} 👋</h1>
            </div>
            <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontSize: 22 }}>🔥</div>
              <div style={{ fontFamily: FR, fontSize: 20, fontWeight: 800, color: C.gold, lineHeight: 1 }}>{streak}</div>
              <div style={{ fontFamily: PJ, fontSize: 10, color: C.textMuted, marginTop: 2 }}>{t('streak', 'berturut')}</div>
            </div>
          </div>

          {/* XP + Overall progress */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: PJ, fontSize: 13, fontWeight: 600, color: C.textSec }}>{t('Overall Progress', 'Progres Keseluruhan')}</span>
              <span style={{ fontFamily: FR, fontSize: 16, fontWeight: 800, color: C.gold }}>⚡ {xp.toLocaleString()} XP</span>
            </div>
            <div style={{ background: C.elevated, borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(overallPct, 0)}%`, height: '100%', background: `linear-gradient(90deg, ${C.accent}, ${C.accentHov})`, borderRadius: 6, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)', minWidth: overallPct > 0 ? 8 : 0 }} />
            </div>
            <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginTop: 6 }}>
              {t(`Day ${day} of ${totalDays} · Week ${week} of 26`, `Hari ${day} dari ${totalDays} · Minggu ${week} dari 26`)}
            </div>
          </div>

          {/* Today's lesson */}
          <div style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0.04) 100%)`, border: `1px solid ${C.accentBorder}`, borderRadius: 22, padding: 24, marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {t(`Week ${week} · Day ${day}`, `Minggu ${week} · Hari ${day}`)}
              </p>
              {todayDone && <span style={{ fontFamily: PJ, fontSize: 12, color: C.success, fontWeight: 700 }}>✓ {t('Done', 'Selesai')}</span>}
            </div>
            <h2 style={{ fontFamily: FR, fontSize: 22, fontWeight: 800, color: C.text, marginBottom: 6 }}>
              {t(currWeek?.themeEN, currWeek?.themeID)}
            </h2>
            <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, marginBottom: 20, lineHeight: 1.55 }}>
              {t(currWeek?.descEN, currWeek?.descID)}
            </p>

            {/* Activity icons */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
              {[
                { icon: '📖', label: t('Vocab', 'Kosakata') },
                { icon: '📝', label: t('Grammar', 'Grammar') },
                { icon: '📄', label: t('Reading', 'Baca') },
                { icon: '❓', label: t('Quiz', 'Kuis') },
                { icon: '🎙️', label: t('Speaking', 'Bicara') },
              ].map((a, i) => (
                <div key={i} style={{ flex: 1, background: C.card, borderRadius: 10, padding: '8px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 14 }}>{a.icon}</div>
                  <div style={{ fontFamily: PJ, fontSize: 9, color: C.textMuted, marginTop: 3 }}>{a.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={startLesson}
              style={{ width: '100%', background: todayDone ? C.elevated : C.accent, color: todayDone ? C.textSec : '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: todayDone ? 'none' : `0 0 28px ${C.accentGlow}`, transition: 'all 0.2s' }}>
              {todayDone ? t('Review Again', 'Ulang Lagi') : t("Start Today's Lesson →", 'Mulai Pelajaran Hari Ini →')}
            </button>
          </div>

          {/* Journey map */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20 }}>
            <h3 style={{ fontFamily: PJ, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 14 }}>
              {t('Your Journey', 'Perjalananmu')}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {Array.from({ length: Math.min(day + 6, 30) }, (_, i) => {
                const d = i + 1
                const done    = completedDays.includes(d)
                const current = d === day
                return (
                  <div key={d} style={{ width: 36, height: 36, borderRadius: 10, background: done ? C.success : current ? C.accent : C.elevated, border: current ? `2px solid ${C.accentHov}` : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: PJ, fontSize: 11, fontWeight: 700, color: (done || current) ? '#fff' : C.textMuted }}>
                    {done ? '✓' : d}
                  </div>
                )
              })}
              {day + 6 < 30 && (
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.textMuted }}>…</div>
              )}
            </div>
          </div>

          {/* Reset */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => { localStorage.clear(); window.location.reload() }}
              style={{ background: 'none', border: 'none', fontFamily: PJ, fontSize: 11, color: C.textMuted, cursor: 'pointer' }}>
              {t('Reset progress', 'Reset progres')}
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     LESSON
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'lesson' && lessonData) {
    const ACT_ICONS  = ['📖', '📝', '📄', '❓', '🎙️']
    const ACT_LABELS = [t('Vocabulary', 'Kosakata'), t('Grammar', 'Tata Bahasa'), t('Reading', 'Membaca'), t('Quiz', 'Kuis'), t('Speaking', 'Berbicara')]

    /* ── Vocab ─────────────────────────────────────────────────────────────── */
    function renderVocab() {
      const card = lessonData.vocabCards[cardIdx]
      if (!card) return (
        <CenteredCompletion icon="✅" msg={t('All vocab cards done!', 'Semua kartu kosakata selesai!')}
          btnLabel={t('Next Activity →', 'Aktivitas Berikutnya →')}
          onNext={() => { awardXp(25); nextAct() }} />
      )
      return (
        <div>
          <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, textAlign: 'center', marginBottom: 20 }}>
            {t(`Card ${cardIdx + 1} of ${lessonData.vocabCards.length}`, `Kartu ${cardIdx + 1} dari ${lessonData.vocabCards.length}`)}
          </p>

          {/* 3D Flip Card */}
          <div style={{ perspective: '1000px', marginBottom: 22, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
            <div style={{ position: 'relative', height: 240, transformStyle: 'preserve-3d', transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)' }}>
              {/* Front */}
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28 }}>
                <div style={{ fontFamily: FR, fontSize: 38, fontWeight: 900, color: C.text, marginBottom: 10, letterSpacing: '0.04em' }}>{card.word}</div>
                <div style={{ fontFamily: PJ, fontSize: 16, color: C.textMuted }}>{card.phonetic}</div>
                <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, marginTop: 28 }}>{t('Tap to reveal meaning', 'Ketuk untuk lihat arti')}</p>
                <button onClick={e => { e.stopPropagation(); speak(card.word) }}
                  style={{ position: 'absolute', top: 16, right: 16, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 10px', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>
                  🔊
                </button>
              </div>
              {/* Back */}
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: C.elevated, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: 24, overflow: 'auto' }}>
                <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{t('MEANING', 'ARTI')}</p>
                <p style={{ fontFamily: PJ, fontSize: 15, color: C.text, marginBottom: 4 }}>{card.meaningEN}</p>
                <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, marginBottom: 18 }}>{card.meaningID}</p>
                <div style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 14 }}>
                  <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{t(card.sentenceEN, card.sentenceID)}"
                  </p>
                </div>
                {card.tipEN && (
                  <div style={{ background: C.card, borderRadius: 10, padding: '10px 14px', marginTop: 14 }}>
                    <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>💡 {t(card.tipEN, card.tipID)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!flipped ? (
            <button onClick={() => { speak(card.word); setFlipped(true) }}
              style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 24px ${C.accentGlow}` }}>
              {t('Reveal Meaning', 'Lihat Artinya')}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setFlipped(false)
                  if (cardIdx + 1 >= lessonData.vocabCards.length) { awardXp(25); nextAct() }
                  else setCardIdx(c => c + 1)
                }}
                style={{ flex: 2, background: C.success, color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, fontFamily: PJ, cursor: 'pointer' }}>
                {cardIdx + 1 >= lessonData.vocabCards.length ? t('Finish →', 'Selesai →') : t('Got it! →', 'Paham! →')}
              </button>
              <button onClick={() => setFlipped(false)}
                style={{ flex: 1, background: C.elevated, color: C.textSec, border: `1px solid ${C.border}`, borderRadius: 14, padding: '15px', fontSize: 14, fontFamily: PJ, cursor: 'pointer', fontWeight: 600 }}>
                {t('Review', 'Ulangi')}
              </button>
            </div>
          )}
        </div>
      )
    }

    /* ── Grammar ───────────────────────────────────────────────────────────── */
    function renderGrammar() {
      const g = lessonData.grammar
      if (!g) return <CenteredCompletion icon="📝" msg={t('No grammar today!', 'Tidak ada grammar hari ini!')} btnLabel={t('Next →', 'Lanjut →')} onNext={() => { awardXp(30); nextAct() }} />

      // Grammar intro (qIdx === 0)
      if (qIdx === 0) {
        return (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 18 }}>
              <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>{t("TODAY'S GRAMMAR", 'TATA BAHASA HARI INI')}</p>
              <h3 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 18 }}>{t(g.titleEN, g.titleID)}</h3>
              <div style={{ background: C.elevated, borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('STRUCTURE', 'STRUKTUR')}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 14, color: C.accent }}>{t(g.structureEN, g.structureID)}</p>
              </div>
              <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, lineHeight: 1.7, marginBottom: 16 }}>{t(g.ruleEN, g.ruleID)}</p>
              {g.examplesEN?.slice(0, 2).map((ex, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 14, marginBottom: 10 }}>
                  <p style={{ fontFamily: PJ, fontSize: 14, color: C.text, fontStyle: 'italic' }}>"{t(ex, g.examplesID?.[i])}"</p>
                </div>
              ))}
            </div>
            <button onClick={() => setQIdx(1)}
              style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 28px ${C.accentGlow}` }}>
              {t('Practice Now →', 'Latihan Sekarang →')}
            </button>
          </div>
        )
      }

      const exercises = g.exercises || []
      const exIdx = qIdx - 1

      if (exIdx >= Math.min(exercises.length, 3)) {
        return <CenteredCompletion icon="✅" msg={t('Grammar exercises done!', 'Latihan grammar selesai!')} btnLabel={t('Next Activity →', 'Aktivitas Berikutnya →')} onNext={() => { awardXp(30); nextAct() }} />
      }

      const ex   = exercises[exIdx]
      const opts = lang === 'en' ? ex.optionsEN : (ex.optionsID || ex.optionsEN)
      return (
        <MCQQuestion
          progress={t(`Exercise ${exIdx + 1}/${Math.min(exercises.length, 3)}`, `Latihan ${exIdx + 1}/${Math.min(exercises.length, 3)}`)}
          question={t(ex.questionEN, ex.questionID)}
          options={opts} answer={ex.answer}
          selected={selected} feedback={feedback} lang={lang}
          onSelect={opt => { setSelected(opt); setFeedback(opt === ex.answer ? 'correct' : 'wrong'); if (opt === ex.answer) awardXp(10) }}
          onNext={() => { setSelected(null); setFeedback(null); setQIdx(q => q + 1) }}
        />
      )
    }

    /* ── Reading ───────────────────────────────────────────────────────────── */
    function renderReading() {
      const r = lessonData.reading
      if (!r) return <CenteredCompletion icon="📄" msg={t('No reading today!', 'Tidak ada bacaan hari ini!')} btnLabel={t('Next →', 'Lanjut →')} onNext={() => { awardXp(30); nextAct() }} />

      // Passage (qIdx === 0)
      if (qIdx === 0) {
        return (
          <div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 24, marginBottom: 18 }}>
              <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>{t('READING PASSAGE', 'TEKS BACAAN')}</p>
              <h3 style={{ fontFamily: FR, fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16 }}>{t(r.titleEN, r.titleID)}</h3>
              <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, lineHeight: 1.85, whiteSpace: 'pre-line' }}>{t(r.textEN, r.textID)}</p>
            </div>
            <button onClick={() => setQIdx(1)}
              style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 28px ${C.accentGlow}` }}>
              {t('Answer Questions →', 'Jawab Pertanyaan →')}
            </button>
          </div>
        )
      }

      const questions = r.questionsEN || []
      const qNum = qIdx - 1

      if (qNum >= Math.min(questions.length, 3)) {
        return <CenteredCompletion icon="✅" msg={t('Reading complete!', 'Bacaan selesai!')} btnLabel={t('Next Activity →', 'Aktivitas Berikutnya →')} onNext={() => { awardXp(30); nextAct() }} />
      }

      const q = questions[qNum]
      const correctAnswer = q.options[q.ans] // ans is an index
      return (
        <MCQQuestion
          progress={t(`Question ${qNum + 1}/${Math.min(questions.length, 3)}`, `Pertanyaan ${qNum + 1}/${Math.min(questions.length, 3)}`)}
          question={q.q} options={q.options} answer={correctAnswer}
          selected={selected} feedback={feedback} lang={lang}
          onSelect={opt => { setSelected(opt); setFeedback(opt === correctAnswer ? 'correct' : 'wrong'); if (opt === correctAnswer) awardXp(10) }}
          onNext={() => { setSelected(null); setFeedback(null); setQIdx(qi => qi + 1) }}
        />
      )
    }

    /* ── Quiz ──────────────────────────────────────────────────────────────── */
    function renderQuiz() {
      const questions = lessonData.quizQuestions

      if (qIdx >= questions.length) {
        return <CenteredCompletion icon="🏆" msg={t('Quiz complete!', 'Kuis selesai!')} btnLabel={t('Final Activity →', 'Aktivitas Terakhir →')} onNext={() => { awardXp(30); nextAct() }} />
      }

      const q = questions[qIdx]
      return (
        <MCQQuestion
          progress={t(`Question ${qIdx + 1}/${questions.length}`, `Soal ${qIdx + 1}/${questions.length}`)}
          question={t(`What does "${q.word}" mean?`, `Apa arti dari "${q.word}"?`)}
          subtext={q.phonetic} options={q.options} answer={q.answer}
          selected={selected} feedback={feedback} lang={lang}
          onSelect={opt => { setSelected(opt); setFeedback(opt === q.answer ? 'correct' : 'wrong'); if (opt === q.answer) awardXp(10) }}
          onNext={() => { setSelected(null); setFeedback(null); setQIdx(i => i + 1) }}
        />
      )
    }

    /* ── Speaking ──────────────────────────────────────────────────────────── */
    function renderSpeaking() {
      const entry   = lessonData.speakingEntry
      const prompts = lang === 'en' ? (entry?.promptsEN || []) : (entry?.promptsID || entry?.promptsEN || [])

      if (qIdx >= 2 || !prompts[qIdx]) {
        return (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12 }}>{t("You're done!", 'Kamu selesai!')}</h3>
            <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, marginBottom: 28, lineHeight: 1.6 }}>{t('Speaking practice complete. Amazing work today.', 'Latihan berbicara selesai. Kerja keras yang luar biasa!')}</p>
            <button onClick={() => { awardXp(20); finishLesson() }}
              style={{ background: C.gold, color: '#0A0A0F', border: 'none', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 800, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 28px ${C.goldGlow}` }}>
              {t('Complete Lesson →', 'Selesaikan Pelajaran →')}
            </button>
          </div>
        )
      }

      const prompt    = prompts[qIdx]
      const enPrompt  = entry?.promptsEN?.[qIdx] || prompt

      return (
        <div>
          <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, textAlign: 'center', marginBottom: 20 }}>
            {t(`Prompt ${qIdx + 1} of 2`, `Prompt ${qIdx + 1} dari 2`)}
          </p>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎙️</div>
            <p style={{ fontFamily: FR, fontSize: 19, fontWeight: 700, color: C.text, lineHeight: 1.55 }}>"{prompt}"</p>
          </div>
          <div style={{ background: C.elevated, borderRadius: 14, padding: '14px 18px', marginBottom: 20 }}>
            <p style={{ fontFamily: PJ, fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 4 }}>💡 {t('Tip', 'Tips')}</p>
            <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
              {t('Say it out loud with confidence. Repeat 3× for best results.', 'Ucapkan dengan percaya diri. Ulangi 3× untuk hasil terbaik.')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => speak(enPrompt)}
              style={{ flex: 1, background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 600, fontFamily: PJ, cursor: 'pointer' }}>
              🔊 {t('Listen', 'Dengar')}
            </button>
            <button onClick={() => { awardXp(10); setQIdx(i => i + 1) }}
              style={{ flex: 2, background: C.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 20px ${C.accentGlow}` }}>
              ✓ {t("I said it!", 'Sudah diucapkan!')}
            </button>
          </div>
        </div>
      )
    }

    function renderActivity() {
      switch (actIdx) {
        case 0: return renderVocab()
        case 1: return renderGrammar()
        case 2: return renderReading()
        case 3: return renderQuiz()
        case 4: return renderSpeaking()
        default: return null
      }
    }

    return (
      <Shell lang={lang} setLang={setLang} noLangToggle>
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 20px 60px' }}>
          {/* Lesson header */}
          <div style={{ padding: '18px 0 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setScreen('dashboard')}
              style={{ background: 'none', border: 'none', color: C.textMuted, fontSize: 24, cursor: 'pointer', padding: 0, lineHeight: 1 }}>
              ←
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 7 }}>
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= actIdx ? C.accent : C.border, transition: 'background 0.4s' }} />
                ))}
              </div>
              <div style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>
                {ACT_ICONS[actIdx]} {ACT_LABELS[actIdx]}
              </div>
            </div>
            <div style={{ fontFamily: FR, fontSize: 15, fontWeight: 800, color: C.gold }}>
              ⚡ +{lessonXp}
            </div>
          </div>

          {renderActivity()}
        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     LESSON DONE
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'lesson-done') return (
    <Shell lang={lang} setLang={setLang}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>🎉</div>
        <h1 style={{ fontFamily: FR, fontSize: 38, fontWeight: 900, color: C.text, marginBottom: 12 }}>
          {t('Lesson Complete!', 'Pelajaran Selesai!')}
        </h1>
        <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, marginBottom: 44, maxWidth: 280, lineHeight: 1.6 }}>
          {t("You're building something real. Keep the streak alive.", 'Kamu sedang membangun sesuatu yang nyata. Pertahankan streakmu.')}
        </p>

        <div style={{ display: 'flex', gap: 14, marginBottom: 44, width: '100%', maxWidth: 360 }}>
          {[
            { icon: '⚡', val: `+${lessonXp}`, label: 'XP' },
            { icon: '🔥', val: streak,          label: t('Day Streak', 'Hari Berturut') },
            { icon: '📅', val: completedDays.length, label: t('Days Done', 'Hari Selesai') },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 26 }}>{s.icon}</div>
              <div style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.gold, marginTop: 6 }}>{s.val}</div>
              <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setScreen('dashboard')}
          style={{ width: '100%', maxWidth: 360, background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 40px ${C.accentGlow}` }}>
          {t('Back to Dashboard →', 'Kembali ke Dashboard →')}
        </button>
      </div>
    </Shell>
  )

  return null
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

function Shell({ children, lang, setLang, noLangToggle }) {
  return (
    <>
      <Head>
        <title>FluentEdge — English for Professionals</title>
        <meta name="description" content="Master Business English in 6 months — 60 minutes a day. Built for professionals in Batam." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800;9..144,900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #0A0A0F; color: #F1F0EE; -webkit-font-smoothing: antialiased; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          input:focus { border-color: #6366F1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
          button:active { transform: scale(0.96) !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #0A0A0F; }
          ::-webkit-scrollbar-thumb { background: #2A2A38; border-radius: 2px; }
        `}</style>
      </Head>
      <div style={{ background: '#0A0A0F', minHeight: '100vh' }}>
        {!noLangToggle && (
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }}>
            <button
              onClick={() => setLang(l => l === 'en' ? 'id' : 'en')}
              style={{ background: '#1C1C24', border: '1px solid #2A2A38', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#94A3B8', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
          </div>
        )}
        {children}
      </div>
    </>
  )
}

function SurveyLayout({ step, total, headline, sub, children }) {
  return (
    <div style={{ padding: '64px 24px 48px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 36, justifyContent: 'center' }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ width: i + 1 === step ? 28 : 8, height: 8, borderRadius: 4, background: i + 1 <= step ? '#6366F1' : '#2A2A38', transition: 'all 0.35s ease' }} />
        ))}
      </div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: '#F1F0EE', marginBottom: 10, textAlign: 'center', lineHeight: 1.25 }}>{headline}</h1>
      {sub && <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>{sub}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>
    </div>
  )
}

function SurveyCard({ icon, title, desc, selected, onClick, compact }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'rgba(99,102,241,0.1)' : '#131318',
        border: `1px solid ${selected ? '#6366F1' : '#2A2A38'}`,
        borderRadius: 16,
        padding: compact ? '14px 18px' : '18px 20px',
        display: 'flex', alignItems: compact ? 'center' : 'flex-start', gap: 14,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'all 0.18s ease',
        boxShadow: selected ? '0 0 20px rgba(99,102,241,0.15)' : 'none',
      }}>
      <span style={{ fontSize: compact ? 22 : 28, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: compact ? 15 : 16, fontWeight: 700, color: '#F1F0EE' }}>{title}</div>
        {desc && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#94A3B8', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      {selected && <span style={{ color: '#6366F1', fontSize: 20, flexShrink: 0 }}>✓</span>}
    </button>
  )
}

function MCQQuestion({ question, subtext, options, answer, selected, feedback, lang, onSelect, onNext, progress }) {
  const C2 = {
    card: '#131318', elevated: '#1C1C24', border: '#2A2A38',
    accent: '#6366F1', accentGlow: 'rgba(99,102,241,0.15)',
    success: '#10B981', successBg: 'rgba(16,185,129,0.08)',
    error: '#F43F5E',   errorBg:   'rgba(244,63,94,0.08)',
    text: '#F1F0EE', textSec: '#94A3B8', textMuted: '#64748B',
  }
  return (
    <div>
      {progress && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: C2.textMuted, marginBottom: 16, textAlign: 'center' }}>{progress}</p>
      )}
      <div style={{ background: C2.card, border: `1px solid ${C2.border}`, borderRadius: 20, padding: 24, marginBottom: 18 }}>
        {subtext && <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: C2.textMuted, marginBottom: 8 }}>{subtext}</p>}
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: C2.text, lineHeight: 1.45 }}>{question}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(options || []).map((opt, i) => {
          const isSel     = selected === opt
          const isCorrect = opt === answer
          let bg = C2.elevated, border = C2.border, color = C2.text
          if (feedback) {
            if (isSel && isCorrect)    { bg = C2.successBg; border = C2.success; color = C2.success }
            else if (isSel && !isCorrect) { bg = C2.errorBg;   border = C2.error;   color = C2.error }
            else if (!isSel && isCorrect) { bg = C2.successBg; border = C2.success; color = C2.success }
          }
          return (
            <button key={i} disabled={!!feedback} onClick={() => !feedback && onSelect(opt)}
              style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 18px', fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", color, cursor: feedback ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s', fontWeight: isSel ? 600 : 400 }}>
              {opt}
            </button>
          )
        })}
      </div>
      {feedback && (
        <div style={{ marginTop: 16 }}>
          <div style={{ background: feedback === 'correct' ? C2.successBg : C2.errorBg, border: `1px solid ${feedback === 'correct' ? C2.success : C2.error}`, borderRadius: 14, padding: '14px 18px', marginBottom: 12 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: feedback === 'correct' ? C2.success : C2.error, margin: 0 }}>
              {feedback === 'correct' ? `✓ ${lang === 'en' ? 'Correct!' : 'Benar!'}` : `✗ ${lang === 'en' ? 'Not quite.' : 'Kurang tepat.'}`}
            </p>
            {feedback === 'wrong' && (
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: C2.text, margin: '6px 0 0' }}>
                {lang === 'en' ? 'Correct answer: ' : 'Jawaban benar: '}<strong>{answer}</strong>
              </p>
            )}
          </div>
          <button onClick={onNext}
            style={{ width: '100%', background: C2.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: `0 0 28px ${C2.accentGlow}` }}>
            {lang === 'en' ? 'Next →' : 'Lanjut →'}
          </button>
        </div>
      )}
    </div>
  )
}

function CenteredCompletion({ icon, msg, btnLabel, onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: '#94A3B8', marginBottom: 28, lineHeight: 1.6 }}>{msg}</p>
      <button onClick={onNext}
        style={{ background: '#6366F1', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 0 28px rgba(99,102,241,0.15)' }}>
        {btnLabel}
      </button>
    </div>
  )
}
