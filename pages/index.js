import { useState, useEffect } from 'react'
import Head from 'next/head'
import { VOCAB_BANK, GRAMMAR_BANK, READING_BANK, SPEAKING_BANK, CURRICULUM_WEEKS, BUSINESS_BANK } from '../content'

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:           '#F7F4EF',  // warm linen parchment
  card:         '#FFFFFF',  // pure white
  elevated:     '#EDE9E3',  // warm stone
  border:       '#D8D2C8',  // warm taupe
  accent:       '#2D5016',  // deep forest green
  accentHov:    '#1E3A0F',  // darker forest green
  accentGlow:   'rgba(45,80,22,0.1)',
  accentBorder: 'rgba(45,80,22,0.22)',
  gold:         '#C4973A',  // muted antique gold
  goldGlow:     'rgba(196,151,58,0.12)',
  success:      '#2D5016',
  successBg:    'rgba(45,80,22,0.07)',
  error:        '#8B3030',  // deep burgundy
  errorBg:      'rgba(139,48,48,0.07)',
  text:         '#1A1816',  // warm near-black
  textSec:      '#6B6560',  // warm mid-gray
  textMuted:    '#9E9890',  // light warm gray
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

  // ── FAQ ───────────────────────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState(null)

  // ── PWA install prompt ────────────────────────────────────────────────────────
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showInstall,   setShowInstall]   = useState(false)
  const [isOffline,     setIsOffline]     = useState(false)

  // ── Business Module ───────────────────────────────────────────────────────────
  const [bizUnit,     setBizUnit]     = useState(0)
  const [bizStep,     setBizStep]     = useState(0)   // 0=phrases, 1+=exercise index
  const [bizSelected, setBizSelected] = useState(null)
  const [bizFeedback, setBizFeedback] = useState(null)
  const [bizXp,       setBizXp]       = useState(0)
  const [bizProgress, setBizProgress] = useState([])  // completed unit IDs

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

      const bizProg = localStorage.getItem('fe_biz_progress')
      if (bizProg) setBizProgress(JSON.parse(bizProg))

      if (sp) setScreen('dashboard')
    } catch {}
  }, [])

  useEffect(() => { localStorage.setItem('fe_lang', lang) }, [lang])

  // PWA install prompt capture
  useEffect(() => {
    const handler = e => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Show install banner after first lesson complete (only once, 7-day dismissal)
  useEffect(() => {
    if (completedDays.length === 1 && installPrompt) {
      const dismissed = localStorage.getItem('fe_install_dismissed')
      if (!dismissed || Date.now() - Number(dismissed) > 7 * 86400000) {
        setShowInstall(true)
      }
    }
  }, [completedDays.length, installPrompt])

  // Offline detection
  useEffect(() => {
    setIsOffline(!navigator.onLine)
    const on  = () => setIsOffline(false)
    const off = () => setIsOffline(true)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

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

  function finishLesson(extraXp = 0) {
    const totalXp     = lessonXp + extraXp
    const newXp       = xp + totalXp
    const alreadyDone = completedDays.includes(day)
    const newStreak   = alreadyDone ? streak : streak + 1
    const newCompleted = alreadyDone ? completedDays : [...completedDays, day]
    const newDay      = alreadyDone ? day : day + 1
    setXp(newXp); setStreak(newStreak); setCompletedDays(newCompleted); setDay(newDay)
    localStorage.setItem('fe_progress', JSON.stringify({
      xp: newXp, streak: newStreak, day: newDay, completedDays: newCompleted,
    }))
    setScreen('lesson-done')
  }

  function handleInstall() {
    if (!installPrompt) return
    installPrompt.prompt()
    installPrompt.userChoice.then(() => { setShowInstall(false); setInstallPrompt(null) })
  }

  function dismissInstall() {
    setShowInstall(false)
    localStorage.setItem('fe_install_dismissed', String(Date.now()))
  }

  function shareLesson() {
    const text = `🔥 Pelajaran selesai di FluentEdge!\n+${lessonXp} XP · ${streak} hari streak\n\nProgram English 6 bulan untuk profesional Batam.\nTes gratis: https://fluentedge-three.vercel.app`
    if (navigator.share) {
      navigator.share({ title: 'FluentEdge', text }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  function shareBizUnit(unitTitle) {
    const text = `📚 Selesai unit "${unitTitle}" di FluentEdge Business English!\n+${bizXp} XP earned\n\nBelajar Business English untuk profesional Batam.\nGratis: https://fluentedge-three.vercel.app`
    if (navigator.share) {
      navigator.share({ title: 'FluentEdge', text }).catch(() => {})
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
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
  if (screen === 'splash') {
    const CURRICULUM_PREVIEW = [
      { week: 1,  en: 'Professional Introductions',    id: 'Perkenalan Profesional' },
      { week: 3,  en: 'Meetings & Agendas',            id: 'Rapat & Agenda' },
      { week: 6,  en: 'Presentations & Pitching',      id: 'Presentasi & Pitching' },
      { week: 7,  en: 'Negotiations',                  id: 'Negosiasi' },
      { week: 13, en: 'Advanced Business Writing',     id: 'Penulisan Bisnis Lanjutan' },
      { week: 20, en: 'Leadership Communication',      id: 'Komunikasi Kepemimpinan' },
      { week: 26, en: 'Professional Mastery',          id: 'Penguasaan Profesional' },
    ]
    const TESTIMONIALS = [
      { name: 'Rina W.', role: t('Admin Staff, Batam', 'Staff Admin, Batam'),    stars: 5, quote: t('"From dreading Singapore client calls to leading international meetings myself."', '"Dari takut angkat telepon klien Singapura — sekarang saya yang pimpin meetingnya."') },
      { name: 'Ahmad F.', role: t('Production Supervisor', 'Supervisor Produksi'), stars: 5, quote: t('"Got promoted after presenting in English to Japanese management."', '"Dapat promosi setelah presentasi bahasa Inggris di depan manajemen Jepang."') },
      { name: 'Dewi A.', role: t('Fresh Graduate, 22', 'Fresh Graduate, 22'),    stars: 5, quote: t('"Landed a job at a multinational company. My English score jumped in just 3 months."', '"Diterima kerja di perusahaan multinasional. Nilai English saya naik drastis dalam 3 bulan."') },
    ]
    const FAQS = [
      { q: t('What level is this for?', 'Untuk level apa?'), a: t('Beginner to intermediate. A placement test at the start puts you in the right track.', 'Pemula hingga menengah. Placement test di awal menentukan track yang tepat untukmu.') },
      { q: t('Speaking or writing?', 'Untuk speaking atau writing?'), a: t('Both — daily lessons cover vocabulary, grammar, reading comprehension, and speaking prompts with TTS audio.', 'Keduanya — pelajaran harian mencakup kosakata, grammar, membaca, dan latihan berbicara dengan audio TTS.') },
      { q: t('How long until I see results?', 'Berapa lama sampai terasa hasilnya?'), a: t('Most learners feel a real difference by week 4. Consistent 60-min daily practice is the key.', 'Kebanyakan pelajar merasakan perbedaan nyata di minggu ke-4. Konsisten 60 menit sehari adalah kuncinya.') },
      { q: t('Is it really free?', 'Apakah benar-benar gratis?'), a: t('100% free. No credit card. No hidden payments. No catch.', '100% gratis. Tanpa kartu kredit. Tanpa biaya tersembunyi. Tidak ada jebakan.') },
    ]

    return (
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ maxWidth: 440, margin: '0 auto', padding: '0 20px 80px' }}>

          {/* ── HERO (above fold) ───────────────────────────────────── */}
          <div style={{ textAlign: 'center', paddingTop: 52, paddingBottom: 44 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: C.accent, textTransform: 'uppercase', marginBottom: 16 }}>FluentEdge</p>
            <h1 style={{ fontFamily: FR, fontSize: 40, fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 16 }}>
              {t('Speak English like the elite do.', 'Bicara Inggris seperti orang sukses.')}
            </h1>
            {lang === 'id' && (
              <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, marginBottom: 6, fontStyle: 'italic' }}>
                "Speak English like the elite do."
              </p>
            )}
            <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, lineHeight: 1.65, marginBottom: 32 }}>
              {t(
                'A structured 6-month program for Batam professionals — 60 minutes a day.',
                'Program 6 bulan terstruktur untuk profesional Batam — 60 menit sehari.'
              )}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 36 }}>
              {[['180', t('Lessons', 'Pelajaran'), 'lessons'], ['26', t('Weeks', 'Minggu'), 'weeks'], ['6k+', t('Learners', 'Pelajar'), 'learners']].map(([n, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: FR, fontSize: 28, fontWeight: 800, color: C.accent }}>{n}</div>
                  <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setScreen('survey-goal')}
              style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', width: '100%', boxShadow: `0 0 40px ${C.accentGlow}`, letterSpacing: '0.02em', marginBottom: 12 }}>
              {t('Start My Free Assessment →', 'Mulai Asesmen Gratis →')}
            </button>
            <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>
              {t('No payment · No credit card · 100% free', 'Tanpa bayaran · Tanpa kartu kredit · 100% gratis')}
            </p>
          </div>

          {/* ── WHO IT'S FOR ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{t('WHO IT\'S FOR', 'UNTUK SIAPA')}</p>
            <h2 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 16, lineHeight: 1.2 }}>
              {t('Made for Batam professionals.', 'Dibuat khusus untuk profesional Batam.')}
            </h2>
            {[
              { icon: 'briefcase', en: 'Staff & managers wanting promotion', id: 'Staff & manajer yang ingin naik jabatan', desc: t('Impress leadership, handle cross-border meetings, get promoted.', 'Impress atasan, handle rapat lintas negara, dan raih promosi.') },
              { icon: 'exchange',  en: 'Business owners dealing internationally', id: 'Pemilik bisnis yang deal dengan luar negeri', desc: t('Close deals with Singapore and international clients confidently.', 'Deal dengan klien Singapura dan internasional dengan percaya diri.') },
              { icon: 'academic',  en: 'Fresh graduates entering the workforce', id: 'Fresh graduate yang ingin bersaing', desc: t('Stand out in interviews. Qualify for multinational roles.', 'Unggul di interview. Lolos seleksi perusahaan multinasional.') },
            ].map((p, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', marginBottom: 10, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Icon name={p.icon} size={17} color={C.accent} />
                </div>
                <div>
                  <div style={{ fontFamily: PJ, fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 3 }}>{t(p.en, p.id)}</div>
                  {lang === 'id' && <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, fontStyle: 'italic', marginBottom: 4 }}>{p.en}</div>}
                  <div style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── CURRICULUM PREVIEW ───────────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{t('CURRICULUM', 'KURIKULUM')}</p>
            <h2 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6, lineHeight: 1.2 }}>
              {t('26 weeks. 180 lessons. One transformation.', '26 minggu. 180 pelajaran. Satu perubahan nyata.')}
            </h2>
            <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, marginBottom: 16, lineHeight: 1.55 }}>
              {t('Every week builds on the last — from your first professional greeting to leading international negotiations.', 'Setiap minggu membangun dari yang sebelumnya — dari sapaan profesional pertama hingga memimpin negosiasi internasional.')}
            </p>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              {CURRICULUM_PREVIEW.map((w, i) => (
                <div key={w.week} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px', borderBottom: i < CURRICULUM_PREVIEW.length - 1 ? `1px solid ${C.elevated}` : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: FR, fontSize: 12, fontWeight: 800, color: C.accent }}>{String(w.week).padStart(2,'0')}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: PJ, fontSize: 14, fontWeight: 600, color: C.text }}>{t(w.en, w.id)}</div>
                    {lang === 'id' && <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>{w.en}</div>}
                  </div>
                </div>
              ))}
              <div style={{ padding: '12px 18px', background: C.elevated }}>
                <span style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>
                  {t('+ 19 more weeks of structured learning', '+ 19 minggu pembelajaran terstruktur lainnya')}
                </span>
              </div>
            </div>
          </div>

          {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{t('LEARNER STORIES', 'KISAH PELAJAR')}</p>
            <h2 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 16, lineHeight: 1.2 }}>
              {t('Real results from Batam.', 'Hasil nyata dari Batam.')}
            </h2>
            {TESTIMONIALS.map((tm, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: C.gold, fontSize: 14 }}>{s}</span>)}
                </div>
                <p style={{ fontFamily: PJ, fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 14, fontStyle: 'italic' }}>{tm.quote}</p>
                <div>
                  <span style={{ fontFamily: PJ, fontSize: 13, fontWeight: 700, color: C.text }}>{tm.name}</span>
                  <span style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted, marginLeft: 8 }}>{tm.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── FAQ ──────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{t('FAQ', 'PERTANYAAN UMUM')}</p>
            <h2 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 16, lineHeight: 1.2 }}>
              {t('Common questions.', 'Pertanyaan yang sering ditanya.')}
            </h2>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${openFaq === i ? C.accentBorder : C.border}`, borderRadius: 14, marginBottom: 8, overflow: 'hidden', transition: 'border 0.2s' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: 12 }}>
                  <span style={{ fontFamily: PJ, fontSize: 14, fontWeight: 600, color: C.text, textAlign: 'left' }}>{faq.q}</span>
                  <Icon name={openFaq === i ? 'chevron-up' : 'chevron-down'} size={14} color={C.textMuted} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 18px 16px' }}>
                    <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── FINAL CTA ────────────────────────────────────────────── */}
          <div style={{ textAlign: 'center', background: `linear-gradient(135deg, rgba(45,80,22,0.06) 0%, rgba(45,80,22,0.02) 100%)`, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '32px 24px' }}>
            <h2 style={{ fontFamily: FR, fontSize: 26, fontWeight: 900, color: C.text, marginBottom: 10, lineHeight: 1.2 }}>
              {t('Your 6-month English transformation starts today.', 'Transformasi bahasa Inggris 6 bulanmu dimulai hari ini.')}
            </h2>
            <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, marginBottom: 24, lineHeight: 1.6 }}>
              {t('Free placement test · Personalised plan · 60 min/day', 'Tes placement gratis · Rencana personal · 60 menit/hari')}
            </p>
            <button
              onClick={() => setScreen('survey-goal')}
              style={{ background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', width: '100%', boxShadow: `0 0 40px ${C.accentGlow}`, marginBottom: 10 }}>
              {t('Start My Free Assessment →', 'Mulai Asesmen Gratis →')}
            </button>
            <p style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>
              {t('No payment · No credit card · 100% free', 'Tanpa bayaran · Tanpa kartu kredit · 100% gratis')}
            </p>
          </div>

        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SURVEY — GOAL
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'survey-goal') return (
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <SurveyLayout step={1} total={4}
        headline={t('Why do you want to master English?', 'Kenapa kamu ingin mahir bahasa Inggris?')}
        sub={t("We'll tailor your plan to your specific goal.", 'Kami sesuaikan programmu dengan tujuanmu.')}>
        {[
          { id: 'career',    icon: 'briefcase', en: 'Career Growth',        id_: 'Karir & Promosi',         desc: t('Get promoted, earn more, impress leadership',           'Naik jabatan, gaji lebih tinggi, impress atasan') },
          { id: 'business',  icon: 'exchange',  en: 'Business & Trade',     id_: 'Bisnis & Perdagangan',    desc: t('Deal with Singapore clients and partners',             'Deal dengan klien dan mitra Singapura') },
          { id: 'travel',    icon: 'globe',     en: 'Global Mobility',      id_: 'Mobilitas Global',        desc: t('Travel, study, and work abroad with confidence',       'Bepergian dan bekerja di luar negeri') },
          { id: 'education', icon: 'book-open', en: 'Academic Excellence',  id_: 'Pendidikan Lebih Tinggi', desc: t('Scholarships, exams, overseas study',                  'Beasiswa, ujian, kuliah ke luar negeri') },
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
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <SurveyLayout step={2} total={4} onBack={() => setScreen('survey-goal')}
        headline={t('How is your English right now?', 'Seberapa bagus Bahasa Inggris kamu sekarang?')}
        sub={t("Be honest — we'll meet you exactly where you are.", 'Jawab jujur — kami mulai dari levelmu.')}>
        {[
          { id: 'beginner',     icon: 'chart-start', en: 'Beginner',     id_: 'Pemula',   desc: t('I know basic words but struggle with full sentences', 'Tahu kata-kata dasar tapi susah buat kalimat') },
          { id: 'intermediate', icon: 'chart-mid',   en: 'Intermediate', id_: 'Menengah', desc: t('I can communicate but make mistakes often',           'Bisa berkomunikasi tapi masih sering salah') },
          { id: 'advanced',     icon: 'chart-top',   en: 'Advanced',     id_: 'Mahir',    desc: t("I'm fairly fluent but want to sound more professional", 'Cukup lancar tapi mau lebih profesional') },
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
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <SurveyLayout step={3} total={4} onBack={() => setScreen('survey-level')}
        headline={t("What's your field?", 'Apa bidang pekerjaanmu?')}
        sub={t('Your lessons will use real scenarios from your industry.', 'Pelajaranmu disesuaikan dengan industri dan situasimu.')}>
        {[
          { id: 'manufacturing', icon: 'building',   en: 'Manufacturing',       id_: 'Manufaktur & Pabrik' },
          { id: 'trading',       icon: 'cube',       en: 'Trading & Logistics', id_: 'Trading & Logistik' },
          { id: 'finance',       icon: 'chart-bar',  en: 'Finance & Banking',   id_: 'Keuangan & Perbankan' },
          { id: 'technology',    icon: 'cpu',        en: 'Technology',          id_: 'Teknologi & IT' },
          { id: 'hospitality',   icon: 'star',       en: 'Hospitality',         id_: 'Perhotelan & Pariwisata' },
          { id: 'other',         icon: 'globe',      en: 'Other',               id_: 'Lainnya' },
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
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <SurveyLayout step={4} total={4} onBack={() => setScreen('survey-industry')}
        headline={t('One last thing…', 'Satu hal lagi…')}
        sub={t('Are you part of a spiritual community? (Optional)', 'Apakah kamu bagian dari komunitas iman? (Opsional)')}>
        {[
          { id: 'faith', icon: 'cross',      en: "Yes, I'm part of a faith community",  id_: 'Ya, saya bagian dari komunitas iman' },
          { id: 'other', icon: 'hand',       en: 'I practice a different faith',         id_: 'Saya memeluk kepercayaan lain' },
          { id: 'none',  icon: 'no-symbol',  en: "I'd rather not say",                   id_: 'Saya tidak ingin berbagi' },
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
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
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
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ padding: '28px 24px 40px', maxWidth: 420, margin: '0 auto' }}>
          <button onClick={() => setScreen('survey-faith')}
            style={{ background: 'none', border: 'none', fontFamily: PJ, fontSize: 14, color: C.textSec, cursor: 'pointer', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="arrow-left" size={14} color={C.textSec} strokeWidth={2} />
            {t('Back', 'Kembali')}
          </button>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Icon name="flag" size={26} color={C.accent} />
            </div>
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
              { icon: 'timer',    label: t('Daily practice', 'Latihan harian'),   value: '60 min' },
              { icon: 'book-open',label: t('Total lessons', 'Total pelajaran'),    value: '180' },
              { icon: 'chat',     label: t('Vocabulary words', 'Kosakata baru'),   value: '1,200+' },
              { icon: 'calendar', label: t('Program duration', 'Durasi program'),  value: t('26 weeks', '26 minggu') },
              { icon: 'flag',     label: t('Target level', 'Target level'),        value: targetLevel },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={s.icon} size={16} color={C.textMuted} />
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
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <div style={{ padding: '28px 24px 40px', maxWidth: 420, margin: '0 auto' }}>
        <button onClick={() => setScreen('plan-reveal')}
          style={{ background: 'none', border: 'none', fontFamily: PJ, fontSize: 14, color: C.textSec, cursor: 'pointer', padding: '0 0 24px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="arrow-left" size={14} color={C.textSec} strokeWidth={2} />
          {t('Back', 'Kembali')}
        </button>
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
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ padding: '28px 20px 80px', maxWidth: 420, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: PJ, fontSize: 13, color: C.textMuted, marginBottom: 3 }}>{t('Good morning,', 'Selamat pagi,')}</p>
              <h1 style={{ fontFamily: FR, fontSize: 30, fontWeight: 800, color: C.text }}>{firstName}</h1>
            </div>
            <div style={{ background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 64 }}>
              <div style={{ fontFamily: FR, fontSize: 22, fontWeight: 800, color: C.accent, lineHeight: 1 }}>{streak}</div>
              <div style={{ fontFamily: PJ, fontSize: 10, fontWeight: 600, color: C.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('Streak', 'Streak')}</div>
            </div>
          </div>

          {/* XP + Overall progress */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: PJ, fontSize: 13, fontWeight: 600, color: C.textSec }}>{t('Overall Progress', 'Progres Keseluruhan')}</span>
              <span style={{ fontFamily: FR, fontSize: 16, fontWeight: 800, color: C.accent }}>{xp.toLocaleString()} <span style={{ fontFamily: PJ, fontSize: 12, fontWeight: 600 }}>XP</span></span>
            </div>
            <div style={{ background: C.elevated, borderRadius: 6, height: 6, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(overallPct, 0)}%`, height: '100%', background: `linear-gradient(90deg, ${C.accent}, ${C.accentHov})`, borderRadius: 6, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)', minWidth: overallPct > 0 ? 8 : 0 }} />
            </div>
            <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginTop: 6 }}>
              {t(`Day ${day} of ${totalDays} · Week ${week} of 26`, `Hari ${day} dari ${totalDays} · Minggu ${week} dari 26`)}
            </div>
          </div>

          {/* Today's lesson */}
          <div style={{ background: `linear-gradient(135deg, rgba(45,80,22,0.06) 0%, rgba(45,80,22,0.02) 100%)`, border: `1px solid ${C.accentBorder}`, borderRadius: 22, padding: 24, marginBottom: 18 }}>
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
                { icon: 'book-open', label: t('Vocab', 'Kosakata') },
                { icon: 'pencil',    label: t('Grammar', 'Grammar') },
                { icon: 'document',  label: t('Reading', 'Baca') },
                { icon: 'question',  label: t('Quiz', 'Kuis') },
                { icon: 'microphone',label: t('Speaking', 'Bicara') },
              ].map((a, i) => (
                <div key={i} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 4px', textAlign: 'center' }}>
                  <Icon name={a.icon} size={14} color={C.textMuted} />
                  <div style={{ fontFamily: PJ, fontSize: 9, color: C.textMuted, marginTop: 4, letterSpacing: '0.04em' }}>{a.label}</div>
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

          {/* Business English Pack */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: C.goldGlow, border: `1px solid rgba(196,151,58,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="briefcase" size={20} color={C.gold} />
              </div>
              <div>
                <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>{t('BONUS MODULE', 'MODUL BONUS')}</p>
                <h3 style={{ fontFamily: FR, fontSize: 18, fontWeight: 800, color: C.text, lineHeight: 1 }}>{t('Business English Pack', 'Paket Business English')}</h3>
              </div>
            </div>
            <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, marginBottom: 12, lineHeight: 1.55 }}>
              {t('10 units · Workplace phrases, email, negotiation & more', '10 unit · Frasa kerja, email, negosiasi & lebih banyak lagi')}
            </p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              {BUSINESS_BANK.map(u => (
                <div key={u.id} style={{ flex: 1, height: 4, borderRadius: 2, background: bizProgress.includes(u.id) ? C.gold : C.elevated }} />
              ))}
            </div>
            <button
              onClick={() => setScreen('business-home')}
              style={{ width: '100%', background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, fontFamily: PJ, cursor: 'pointer' }}>
              {bizProgress.length === 0 ? t('Start Business Pack →', 'Mulai Business Pack →') : t(`Continue Pack (${bizProgress.length}/10 done)`, `Lanjutkan (${bizProgress.length}/10 selesai)`)}
            </button>
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
     BUSINESS HOME
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'business-home') return (
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <div style={{ padding: '28px 20px 80px', maxWidth: 420, margin: '0 auto' }}>
        <button onClick={() => setScreen('dashboard')}
          style={{ background: 'none', border: 'none', fontFamily: PJ, fontSize: 14, color: C.textSec, cursor: 'pointer', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="arrow-left" size={14} color={C.textSec} strokeWidth={2} />
          {t('Back', 'Kembali')}
        </button>
        <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{t('BONUS MODULE', 'MODUL BONUS')}</p>
        <h1 style={{ fontFamily: FR, fontSize: 32, fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 10 }}>{t('Business English Pack', 'Paket Business English')}</h1>
        <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, lineHeight: 1.65, marginBottom: 24 }}>
          {t('10 essential workplace English units for professionals. Master the language of business from Batam to Singapore.', '10 unit bahasa Inggris bisnis esensial untuk profesional. Kuasai bahasa bisnis dari Batam hingga Singapura.')}
        </p>
        {BUSINESS_BANK.map((unit, i) => {
          const done = bizProgress.includes(unit.id)
          return (
            <div key={unit.id}
              onClick={() => { setBizUnit(i); setBizStep(0); setBizSelected(null); setBizFeedback(null); setBizXp(0); setScreen('business-lesson') }}
              style={{ background: C.card, border: `1px solid ${done ? C.accentBorder : C.border}`, borderRadius: 16, padding: '16px 18px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: done ? C.successBg : C.elevated, border: `1px solid ${done ? C.accentBorder : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {done
                  ? <Icon name="check" size={18} color={C.success} strokeWidth={2.5} />
                  : <span style={{ fontFamily: FR, fontSize: 15, fontWeight: 800, color: C.textMuted }}>{String(unit.id).padStart(2, '0')}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: PJ, fontSize: 14, fontWeight: 600, color: C.text }}>{lang === 'en' ? unit.titleEN : unit.titleID}</div>
                <div style={{ fontFamily: PJ, fontSize: 11, color: C.textMuted, marginTop: 2 }}>{unit.exercises.length} {t('exercises', 'latihan')} · {unit.phrases.length} {t('phrases', 'frasa')}</div>
              </div>
              <Icon name="arrow-right" size={15} color={done ? C.accentBorder : C.border} />
            </div>
          )
        })}
      </div>
    </Shell>
  )

  /* ═══════════════════════════════════════════════════════════════════════════
     BUSINESS LESSON
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'business-lesson') {
    const unit   = BUSINESS_BANK[bizUnit]
    const exIdx  = bizStep - 1
    const isDone = bizStep > unit.exercises.length

    function finishBizUnit() {
      const newProgress = bizProgress.includes(unit.id) ? bizProgress : [...bizProgress, unit.id]
      setBizProgress(newProgress)
      localStorage.setItem('fe_biz_progress', JSON.stringify(newProgress))
      const earned = bizXp
      const newXpVal = xp + earned
      setXp(newXpVal)
      localStorage.setItem('fe_progress', JSON.stringify({ xp: newXpVal, streak, day, completedDays }))
      setScreen('business-home')
    }

    // ── Completion screen ──────────────────────────────────────────────────
    if (isDone) return (
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.goldGlow, border: `2px solid rgba(196,151,58,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon name="star" size={32} color={C.gold} strokeWidth={1.5} />
          </div>
          <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>{t('UNIT COMPLETE', 'UNIT SELESAI')}</p>
          <h2 style={{ fontFamily: FR, fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 8, lineHeight: 1.1 }}>{lang === 'en' ? unit.titleEN : unit.titleID}</h2>
          <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, marginBottom: 24, lineHeight: 1.6 }}>
            {t(`You earned ${bizXp} XP from this unit.`, `Kamu mendapatkan ${bizXp} XP dari unit ini.`)}
          </p>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 24px', marginBottom: 24, width: '100%', maxWidth: 320 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: PJ, fontSize: 13, color: C.textSec }}>{t('Units completed', 'Unit selesai')}</span>
              <span style={{ fontFamily: FR, fontSize: 16, fontWeight: 800, color: C.accent }}>{(bizProgress.includes(unit.id) ? bizProgress.length : bizProgress.length + 1)} / 10</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
            <button onClick={finishBizUnit}
              style={{ background: C.gold, color: '#1A1816', border: 'none', borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 800, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 2px 24px ${C.goldGlow}` }}>
              {t('Back to Business Pack →', 'Kembali ke Business Pack →')}
            </button>
            <button onClick={() => shareBizUnit(lang === 'en' ? unit.titleEN : unit.titleID)}
              style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t('Share to WhatsApp', 'Bagikan ke WhatsApp')}
            </button>
          </div>
        </div>
      </Shell>
    )

    // ── Phrase reference card ──────────────────────────────────────────────
    if (bizStep === 0) return (
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ padding: '28px 20px 80px', maxWidth: 420, margin: '0 auto' }}>
          <button onClick={() => setScreen('business-home')}
            style={{ background: 'none', border: 'none', fontFamily: PJ, fontSize: 14, color: C.textSec, cursor: 'pointer', padding: '0 0 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="arrow-right" size={14} color={C.textSec} strokeWidth={2} />
            {t('Back', 'Kembali')}
          </button>
          <p style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>
            {t(`UNIT ${unit.id} OF 10`, `UNIT ${unit.id} DARI 10`)}
          </p>
          <h1 style={{ fontFamily: FR, fontSize: 26, fontWeight: 900, color: C.text, lineHeight: 1.1, marginBottom: 20 }}>
            {lang === 'en' ? unit.titleEN : unit.titleID}
          </h1>
          <p style={{ fontFamily: PJ, fontSize: 13, color: C.textSec, marginBottom: 16 }}>
            {t('Study these key phrases, then complete the exercises.', 'Pelajari frasa-frasa kunci ini, lalu selesaikan latihan.')}
          </p>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
            {unit.phrases.map((ph, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: i < unit.phrases.length - 1 ? `1px solid ${C.elevated}` : 'none' }}>
                <div style={{ fontFamily: PJ, fontSize: 10, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{ph.situation}</div>
                <div style={{ fontFamily: PJ, fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{ph.en}</div>
                <div style={{ fontFamily: PJ, fontSize: 13, color: C.textSec }}>{ph.id}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setBizStep(1)}
            style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 28px ${C.accentGlow}` }}>
            {t(`Start ${unit.exercises.length} Exercises →`, `Mulai ${unit.exercises.length} Latihan →`)}
          </button>
        </div>
      </Shell>
    )

    // ── Exercise MCQ ───────────────────────────────────────────────────────
    const ex = unit.exercises[exIdx]
    return (
      <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
        <div style={{ padding: '28px 20px 80px', maxWidth: 420, margin: '0 auto' }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
            {unit.exercises.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < exIdx ? C.accent : i === exIdx ? C.accentGlow : C.elevated, transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontFamily: PJ, fontSize: 11, fontWeight: 700, color: C.textMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {lang === 'en' ? unit.titleEN : unit.titleID}
            </p>
            <span style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>{exIdx + 1} / {unit.exercises.length}</span>
          </div>
          <MCQQuestion
            question={ex.q}
            options={ex.options}
            answer={ex.answer}
            selected={bizSelected}
            feedback={bizFeedback}
            lang={lang}
            tip={bizFeedback ? ex.tip : null}
            onSelect={opt => {
              setBizSelected(opt)
              setBizFeedback(opt === ex.answer ? 'correct' : 'wrong')
              if (opt === ex.answer) setBizXp(x => x + 20)
            }}
            onNext={() => { setBizStep(s => s + 1); setBizSelected(null); setBizFeedback(null) }}
          />
        </div>
      </Shell>
    )
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     LESSON
  ═══════════════════════════════════════════════════════════════════════════ */
  if (screen === 'lesson' && lessonData) {
    const ACT_ICONS  = ['book-open', 'pencil', 'document', 'question', 'microphone']
    const ACT_LABELS = [t('Vocabulary', 'Kosakata'), t('Grammar', 'Tata Bahasa'), t('Reading', 'Membaca'), t('Quiz', 'Kuis'), t('Speaking', 'Berbicara')]

    /* ── Vocab ─────────────────────────────────────────────────────────────── */
    function renderVocab() {
      const card = lessonData.vocabCards[cardIdx]
      if (!card) return (
        <CenteredCompletion icon="check" msg={t('All vocab cards done!', 'Semua kartu kosakata selesai!')}
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
                  style={{ position: 'absolute', top: 16, right: 16, background: C.elevated, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="speaker" size={16} color={C.textMuted} />
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
      if (!g) return <CenteredCompletion icon="pencil" msg={t('No grammar today!', 'Tidak ada grammar hari ini!')} btnLabel={t('Next →', 'Lanjut →')} onNext={() => { awardXp(30); nextAct() }} />

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
        return <CenteredCompletion icon="check" msg={t('Grammar exercises done!', 'Latihan grammar selesai!')} btnLabel={t('Next Activity →', 'Aktivitas Berikutnya →')} onNext={() => { awardXp(30); nextAct() }} />
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
      if (!r) return <CenteredCompletion icon="document" msg={t('No reading today!', 'Tidak ada bacaan hari ini!')} btnLabel={t('Next →', 'Lanjut →')} onNext={() => { awardXp(30); nextAct() }} />

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
        return <CenteredCompletion icon="check" msg={t('Reading complete!', 'Bacaan selesai!')} btnLabel={t('Next Activity →', 'Aktivitas Berikutnya →')} onNext={() => { awardXp(30); nextAct() }} />
      }

      const q = questions[qNum]
      const correctAnswer = q.options?.[q.ans] ?? q.options?.[0] // ans is an index
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
        return <CenteredCompletion icon="star" msg={t('Quiz complete!', 'Kuis selesai!')} btnLabel={t('Final Activity →', 'Aktivitas Terakhir →')} onNext={() => { awardXp(30); nextAct() }} />
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
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.successBg, border: `2px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="check" size={28} color={C.accent} strokeWidth={2} />
            </div>
            <h3 style={{ fontFamily: FR, fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 12 }}>{t("You're done!", 'Kamu selesai!')}</h3>
            <p style={{ fontFamily: PJ, fontSize: 14, color: C.textSec, marginBottom: 28, lineHeight: 1.6 }}>{t('Speaking practice complete. Amazing work today.', 'Latihan berbicara selesai. Kerja keras yang luar biasa!')}</p>
            <button onClick={() => finishLesson(20)}
              style={{ background: C.gold, color: '#1A1816', border: 'none', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 800, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 2px 16px ${C.goldGlow}` }}>
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
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, marginBottom: 20, textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Icon name="microphone" size={20} color={C.accent} />
            </div>
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
              style={{ flex: 1, background: C.elevated, color: C.text, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 600, fontFamily: PJ, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="speaker" size={15} color={C.textSec} /> {t('Listen', 'Dengar')}
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
      <Shell lang={lang} setLang={setLang} noLangToggle isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name={ACT_ICONS[actIdx]} size={13} color={C.textMuted} />
                <span style={{ fontFamily: PJ, fontSize: 12, color: C.textMuted }}>{ACT_LABELS[actIdx]}</span>
              </div>
            </div>
            <div style={{ fontFamily: FR, fontSize: 15, fontWeight: 800, color: C.gold }}>
              +{lessonXp} XP
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
    <Shell lang={lang} setLang={setLang} isOffline={isOffline} showInstall={showInstall} onInstall={handleInstall} onDismissInstall={dismissInstall}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: C.elevated, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Icon name="check" size={28} color={C.accent} strokeWidth={2} />
        </div>
        <h1 style={{ fontFamily: FR, fontSize: 38, fontWeight: 900, color: C.text, marginBottom: 12 }}>
          {t('Lesson Complete', 'Pelajaran Selesai')}
        </h1>
        <p style={{ fontFamily: PJ, fontSize: 15, color: C.textSec, marginBottom: 44, maxWidth: 280, lineHeight: 1.6 }}>
          {t("You're building something real. Keep the streak alive.", 'Kamu sedang membangun sesuatu yang nyata. Pertahankan streakmu.')}
        </p>

        <div style={{ display: 'flex', gap: 14, marginBottom: 44, width: '100%', maxWidth: 360 }}>
          {[
            { val: `+${lessonXp}`, label: 'XP earned' },
            { val: streak,          label: t('Day streak', 'Hari berturut') },
            { val: completedDays.length, label: t('Days done', 'Hari selesai') },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: FR, fontSize: 26, fontWeight: 800, color: C.accent }}>{s.val}</div>
              <div style={{ fontFamily: PJ, fontSize: 10, fontWeight: 600, color: C.textMuted, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360 }}>
          <button
            onClick={() => setScreen('dashboard')}
            style={{ width: '100%', background: C.accent, color: '#fff', border: 'none', borderRadius: 16, padding: '18px', fontSize: 17, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', boxShadow: `0 0 40px ${C.accentGlow}` }}>
            {t('Back to Dashboard →', 'Kembali ke Dashboard →')}
          </button>
          <button
            onClick={shareLesson}
            style={{ width: '100%', background: '#25D366', color: '#fff', border: 'none', borderRadius: 16, padding: '15px', fontSize: 15, fontWeight: 700, fontFamily: PJ, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t('Share to WhatsApp', 'Bagikan ke WhatsApp')}
          </button>
        </div>
      </div>
    </Shell>
  )

  return null
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SHARED SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════════ */

function Shell({ children, lang, setLang, noLangToggle, isOffline, showInstall, onInstall, onDismissInstall }) {
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
          body { background: #F7F4EF; color: #1A1816; -webkit-font-smoothing: antialiased; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          input:focus { border-color: #2D5016 !important; box-shadow: 0 0 0 3px rgba(45,80,22,0.1) !important; }
          button:active { transform: scale(0.96) !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: #F7F4EF; }
          ::-webkit-scrollbar-thumb { background: #D8D2C8; border-radius: 2px; }
        `}</style>
      </Head>
      <div style={{ background: '#F7F4EF', minHeight: '100vh' }}>
        {/* Offline banner */}
        {isOffline && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, background: '#6B6560', color: '#fff', textAlign: 'center', padding: '10px 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
            Mode Offline — Pelajaran tersimpan tetap bisa diakses
          </div>
        )}
        {/* PWA install banner */}
        {showInstall && onInstall && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 300, background: '#FFFFFF', borderTop: '1px solid #D8D2C8', padding: '16px 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1816', marginBottom: 4 }}>Pasang FluentEdge di HP kamu</p>
            <p style={{ fontSize: 12, color: '#6B6560', marginBottom: 12 }}>Akses cepat & belajar offline kapan saja</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onInstall}
                style={{ flex: 1, background: '#2D5016', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Pasang Sekarang
              </button>
              <button onClick={onDismissInstall}
                style={{ flex: 1, background: '#EDE9E3', color: '#6B6560', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Nanti Saja
              </button>
            </div>
          </div>
        )}
        {!noLangToggle && (
          <div style={{ position: 'fixed', top: isOffline ? 44 : 16, right: 16, zIndex: 200, transition: 'top 0.3s' }}>
            <button
              onClick={() => setLang(l => l === 'en' ? 'id' : 'en')}
              style={{ background: '#EDE9E3', border: '1px solid #D8D2C8', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#6B6560', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {lang === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
          </div>
        )}
        {children}
      </div>
    </>
  )
}

function SurveyLayout({ step, total, headline, sub, children, onBack }) {
  return (
    <div style={{ padding: '28px 24px 48px', maxWidth: 420, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 12 }}>
        {onBack ? (
          <button onClick={onBack}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#9E9890', flexShrink: 0 }}>
            <Icon name="arrow-left" size={13} color="#9E9890" strokeWidth={2} />
          </button>
        ) : <div style={{ width: 17 }} />}
        <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
          {Array.from({ length: total }, (_, i) => (
            <div key={i} style={{ width: i + 1 === step ? 28 : 8, height: 8, borderRadius: 4, background: i + 1 <= step ? '#2D5016' : '#D8D2C8', transition: 'all 0.35s ease' }} />
          ))}
        </div>
        <div style={{ width: 17 }} />
      </div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 900, color: '#1A1816', marginBottom: 10, textAlign: 'center', lineHeight: 1.25 }}>{headline}</h1>
      {sub && <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: '#6B6560', textAlign: 'center', marginBottom: 32, lineHeight: 1.6 }}>{sub}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>{children}</div>
    </div>
  )
}

function SurveyCard({ icon, title, desc, selected, onClick, compact }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'rgba(45,80,22,0.05)' : '#FFFFFF',
        border: `1px solid ${selected ? '#2D5016' : '#D8D2C8'}`,
        borderRadius: 12,
        padding: compact ? '14px 18px' : '18px 20px',
        display: 'flex', alignItems: 'center', gap: 16,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        transition: 'all 0.18s ease',
        boxShadow: selected ? '0 1px 8px rgba(45,80,22,0.1)' : 'none',
      }}>
      <div style={{ width: 38, height: 38, borderRadius: 8, background: selected ? 'rgba(45,80,22,0.1)' : '#EDE9E3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
        <Icon name={icon} size={17} color={selected ? '#2D5016' : '#6B6560'} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: compact ? 14 : 15, fontWeight: 600, color: '#1A1816', letterSpacing: '-0.01em' }}>{title}</div>
        {desc && <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#9E9890', marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <Icon name={selected ? 'check' : 'arrow-right'} size={15} color={selected ? '#2D5016' : '#D8D2C8'} />
    </button>
  )
}

function MCQQuestion({ question, subtext, options, answer, selected, feedback, lang, onSelect, onNext, progress, tip }) {
  const C2 = {
    card: '#FFFFFF', elevated: '#EDE9E3', border: '#D8D2C8',
    accent: '#2D5016', accentGlow: 'rgba(45,80,22,0.1)',
    success: '#2D5016', successBg: 'rgba(45,80,22,0.07)',
    error: '#8B3030',   errorBg:   'rgba(139,48,48,0.07)',
    text: '#1A1816', textSec: '#6B6560', textMuted: '#9E9890',
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
          {tip && (
            <div style={{ background: '#F7F4EF', border: '1px solid #D8D2C8', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: '#6B6560', margin: 0, lineHeight: 1.55 }}>
                <strong style={{ color: '#1A1816' }}>{lang === 'en' ? 'Tip: ' : 'Tips: '}</strong>{tip}
              </p>
            </div>
          )}
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
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(45,80,22,0.07)', border: '2px solid rgba(45,80,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon name={icon} size={28} color="#2D5016" strokeWidth={1.5} />
      </div>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: '#6B6560', marginBottom: 28, lineHeight: 1.6 }}>{msg}</p>
      <button onClick={onNext}
        style={{ background: '#2D5016', color: '#fff', border: 'none', borderRadius: 14, padding: '16px 32px', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 2px 16px rgba(45,80,22,0.2)' }}>
        {btnLabel}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   ICON COMPONENT — Heroicons 2.0 Outline
═══════════════════════════════════════════════════════════════════════════════ */
function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.5, style: extraStyle }) {
  const paths = {
    'briefcase':   'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z',
    'exchange':    'M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
    'globe':       'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
    'book-open':   'M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25',
    'chart-start': 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
    'chart-mid':   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Z',
    'chart-top':   'M4.5 12.75l7.5-7.5 7.5 7.5m-15 6 7.5-7.5 7.5 7.5',
    'building':    'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z',
    'cube':        'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    'chart-bar':   'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
    'cpu':         'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
    'star':        'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
    'cross':       'M12 3v18m9-9H3',
    'hand':        'M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002',
    'no-symbol':   'M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636',
    'check':       'M4.5 12.75l6 6 9-13.5',
    'arrow-right': 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
    'pencil':      'm16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10',
    'document':    'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
    'question':    'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z',
    'microphone':  'M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z',
    'speaker':     'M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z',
    'timer':       'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    'academic':    'M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5',
    'calendar':    'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
    'chat':        'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z',
    'flag':         'M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5',
    'chevron-down': 'M19.5 8.25l-7.5 7.5-7.5-7.5',
    'chevron-up':   'M4.5 15.75l7.5-7.5 7.5 7.5',
    'arrow-left':   'M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18',
  }
  const d = paths[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'inline-block', flexShrink: 0, ...extraStyle }}>
      <path d={d} />
    </svg>
  )
}
