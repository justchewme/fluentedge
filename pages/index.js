import { useState, useEffect, useRef, useCallback } from 'react'
import Head from 'next/head'

// ─── Questions ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    text: "Apa arti kata 'postponed'?",
    opts: ['Dibatalkan', 'Ditunda', 'Dijadwalkan', 'Disetujui'],
    ans: 1,
  },
  {
    text: "The meeting has been _____ to Friday.",
    opts: ['moved', 'said', 'talked', 'spoken'],
    ans: 0,
  },
  {
    text: "Which sentence is correct?",
    opts: [
      'I have work here since 2020',
      'I have been working here since 2020',
      'I am work here since 2020',
      'I working here since 2020',
    ],
    ans: 1,
  },
  {
    text: "We need to _____ the terms before signing.",
    opts: ['negotiate', 'say', 'tell', 'speak'],
    ans: 0,
  },
  {
    text: "The decision was contingent _____ board approval.",
    opts: ['on', 'of', 'to', 'with'],
    ans: 0,
  },
]

// ─── Vocabulary Data ──────────────────────────────────────────────────────────
const VOCAB = [
  {
    word: 'NEGOTIATE',
    phonetic: '/nɪˈɡoʊʃieɪt/',
    id: 'Bernegosiasi',
    exEn: '"We need to negotiate the contract terms."',
    exId: '"Kita perlu bernegosiasi soal syarat kontrak."',
    chips: ['Negotiation', 'Negotiator', 'Negotiable'],
  },
  {
    word: 'LEVERAGE',
    phonetic: '/ˈlɛv.ər.ɪdʒ/',
    id: 'Memanfaatkan / Keunggulan',
    exEn: '"Use your skills as leverage in the interview."',
    exId: '"Gunakan keahlianmu sebagai keunggulan di wawancara."',
    chips: ['Leveraged', 'Over-leveraged', 'Leverage ratio'],
  },
  {
    word: 'AGENDA',
    phonetic: '/əˈdʒɛn.də/',
    id: 'Agenda / Rencana rapat',
    exEn: '"The agenda for today\'s meeting is attached."',
    exId: '"Agenda rapat hari ini sudah dilampirkan."',
    chips: ['Set the agenda', 'Hidden agenda', 'Agenda item'],
  },
  {
    word: 'DEADLINE',
    phonetic: '/ˈdɛd.laɪn/',
    id: 'Batas waktu',
    exEn: '"The project deadline is next Monday."',
    exId: '"Batas waktu proyek adalah Senin depan."',
    chips: ['Meet the deadline', 'Miss the deadline', 'Tight deadline'],
  },
  {
    word: 'PROPOSAL',
    phonetic: '/prəˈpoʊ.zəl/',
    id: 'Proposal / Usulan',
    exEn: '"Please review the proposal before the meeting."',
    exId: '"Tolong tinjau proposal sebelum rapat."',
    chips: ['Submit a proposal', 'Business proposal', 'Counter-proposal'],
  },
  {
    word: 'STAKEHOLDER',
    phonetic: '/ˈsteɪk.hoʊl.dər/',
    id: 'Pemangku kepentingan',
    exEn: '"All stakeholders must be informed of the decision."',
    exId: '"Semua pemangku kepentingan harus diberitahu keputusan ini."',
    chips: ['Key stakeholder', 'Stakeholder meeting', 'Stakeholder analysis'],
  },
  {
    word: 'MILESTONE',
    phonetic: '/ˈmaɪl.stoʊn/',
    id: 'Pencapaian / Tonggak',
    exEn: '"We reached a major milestone this quarter."',
    exId: '"Kami mencapai tonggak besar di kuartal ini."',
    chips: ['Key milestone', 'Hit a milestone', 'Project milestone'],
  },
  {
    word: 'DELEGATE',
    phonetic: '/ˈdɛl.ɪ.ɡeɪt/',
    id: 'Mendelegasikan',
    exEn: '"A good manager knows when to delegate tasks."',
    exId: '"Manajer yang baik tahu kapan mendelegasikan tugas."',
    chips: ['Delegation', 'Delegate to', 'Over-delegate'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateRef = () => 'FLNT-' + Math.random().toString(36).substring(2, 6).toUpperCase()

const scoreToLevel = (score) => {
  if (score <= 1) return 'Lower (A2)'
  if (score <= 3) return 'Medium (B1)'
  return 'High (B2)'
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FluentEdge() {
  const [screen, setScreen] = useState('splash')
  const [lang, setLang] = useState('id')
  const [testScore, setTestScore] = useState(0)
  const [testQ, setTestQ] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [timer, setTimer] = useState(30)
  const [userName, setUserName] = useState('')
  const [userLevel, setUserLevel] = useState('')
  const [userRef, setUserRef] = useState('')
  const [referralFrom, setReferralFrom] = useState('')

  // register form
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formCity, setFormCity] = useState('')
  const [formRefCode, setFormRefCode] = useState('')
  const [showRefInput, setShowRefInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // lesson
  const [vocabIdx, setVocabIdx] = useState(0)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [srsTaps, setSrsTaps] = useState(0)
  const [showXpFloat, setShowXpFloat] = useState(false)

  // toast
  const [toast, setToast] = useState(null)
  const [toastHiding, setToastHiding] = useState(false)
  const toastTimer = useRef(null)

  // confetti
  const [showConfetti, setShowConfetti] = useState(false)

  // analyzing
  const [analyzeProgress, setAnalyzeProgress] = useState(0)

  const t = (id, en) => lang === 'id' ? id : en

  // ─── Read ?ref= from URL on mount ───
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')
      if (ref) setReferralFrom(ref)

      // restore session
      const savedName = localStorage.getItem('fe_name')
      const savedLevel = localStorage.getItem('fe_level')
      const savedRef = localStorage.getItem('fe_ref')
      if (savedName && savedLevel && savedRef) {
        setUserName(savedName)
        setUserLevel(savedLevel)
        setUserRef(savedRef)
      }
    }
  }, [])

  // ─── Toast ───
  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(msg)
    setToastHiding(false)
    toastTimer.current = setTimeout(() => {
      setToastHiding(true)
      setTimeout(() => setToast(null), 250)
    }, 2000)
  }, [])

  // ─── Copy to clipboard ───
  const copyToClipboard = (text, msg) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast(msg || '✓ Copied!'))
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showToast(msg || '✓ Copied!')
    }
  }

  // ─── Share to WA ───
  const shareToWA = (ref, level) => {
    const refCode = ref || userRef
    const lvl = level || userLevel
    const text = lang === 'id'
      ? `Hei! Aku baru tes level bahasa Inggrisku di FluentEdge dan dapat ${lvl}. Coba juga yuk, gratis! 👇 https://fluentedge-three.vercel.app?ref=${refCode}`
      : `Hey! I tested my English at FluentEdge and got ${lvl}. Try it free! 👇 https://fluentedge-three.vercel.app?ref=${refCode}`
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank')
  }

  // ─── Splash auto-advance ───
  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('welcome'), 2500)
      return () => clearTimeout(t)
    }
  }, [screen])

  // ─── Test timer ───
  useEffect(() => {
    if (screen !== 'test') return
    setTimer(30)
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) return 30 // loop
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [screen, testQ])

  // ─── Analyzing auto-advance ───
  useEffect(() => {
    if (screen !== 'analyzing') return
    const level = scoreToLevel(testScore)
    setUserLevel(level)
    const t = setTimeout(() => {
      setScreen('results-teaser')
    }, 2400)
    return () => clearTimeout(t)
  }, [screen, testScore])

  // ─── Results confetti ───
  useEffect(() => {
    if (screen === 'results') {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3500)
      return () => clearTimeout(t)
    }
  }, [screen])

  // ─── navigate to new screen ───
  const goTo = (s) => {
    setScreen(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ─── Test: select answer ───
  const handleAnswer = (idx) => {
    if (answered) return
    setSelectedAnswer(idx)
    setAnswered(true)
    if (idx === QUESTIONS[testQ].ans) {
      setTestScore((s) => s + 1)
    }
  }

  // ─── Test: next question ───
  const handleNextQ = () => {
    const nextQ = testQ + 1
    if (nextQ >= QUESTIONS.length) {
      setSelectedAnswer(null)
      setAnswered(false)
      goTo('analyzing')
    } else {
      setTestQ(nextQ)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  // ─── Register submit ───
  const handleRegister = async () => {
    setFormError('')
    if (!formName.trim()) { setFormError(t('Nama wajib diisi', 'Name is required')); return }
    if (!formPhone.trim()) { setFormError(t('WhatsApp wajib diisi', 'WhatsApp is required')); return }
    if (!formCity) { setFormError(t('Pilih kota kamu', 'Please select your city')); return }

    setSubmitting(true)
    const refCode = generateRef()
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          whatsapp: '+62' + formPhone.trim(),
          city: formCity,
          level: userLevel,
          score: testScore,
          referralCode: refCode,
          referralFrom: referralFrom || formRefCode.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        const name = formName.trim()
        const level = data.level || userLevel
        const ref = data.referralCode || refCode
        setUserName(name)
        setUserLevel(level)
        setUserRef(ref)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('fe_name', name)
          localStorage.setItem('fe_level', level)
          localStorage.setItem('fe_ref', ref)
        }
        goTo('results')
      } else {
        setFormError(data.error || t('Terjadi kesalahan, coba lagi', 'Something went wrong, try again'))
      }
    } catch (e) {
      setFormError(t('Gagal terhubung ke server', 'Failed to connect to server'))
    }
    setSubmitting(false)
  }

  // ─── Lesson SRS ───
  const handleSRS = () => {
    const newTaps = srsTaps + 1
    setSrsTaps(newTaps)
    if (newTaps === 3) {
      setShowXpFloat(true)
      setTimeout(() => setShowXpFloat(false), 1500)
    }
    if (vocabIdx < VOCAB.length - 1) {
      setVocabIdx((i) => i + 1)
    } else {
      setVocabIdx(0)
      setSrsTaps(0)
      showToast(t('🎉 Lesson selesai! +30 XP', '🎉 Lesson done! +30 XP'))
    }
  }

  // ─── WA share message ───
  const waMsg = `${t('Hei! Aku baru tes level bahasa Inggrisku di FluentEdge dan dapat', "Hey! I tested my English at FluentEdge and got")} ${userLevel}. ${t('Coba juga yuk, gratis!', 'Try it free!')} 👇 https://fluentedge-three.vercel.app?ref=${userRef}`

  const BOTTOM_NAV_SCREENS = ['dashboard', 'lesson', 'speaking', 'referral']
  const showBottomNav = BOTTOM_NAV_SCREENS.includes(screen)

  // ─── Level display helper ───
  const levelColor = userLevel.includes('High') ? '#FFD700' : userLevel.includes('Medium') ? '#00BFFF' : '#9B59B6'
  const levelEmoji = userLevel.includes('High') ? '🏆' : userLevel.includes('Medium') ? '⭐' : '🌱'

  // ──────────────────────────────────────────────────────────────────────────
  // ─── RENDER ───────────────────────────────────────────────────────────────
  // ──────────────────────────────────────────────────────────────────────────

  const renderScreen = () => {
    // ─────────────── SPLASH ───────────────────────────────────────────────
    if (screen === 'splash') {
      const letters = 'FluentEdge'.split('')
      return (
        <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            {'FluentEdge'.split('').map((ch, i) => (
              <span
                key={i}
                className="logo-letter"
                style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  background: ch === 'F' || ch === 'E' ? 'linear-gradient(135deg, #00BFFF, #9B59B6)' : 'linear-gradient(135deg, #ffffff, rgba(255,255,255,0.7))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                {ch}
              </span>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', textAlign: 'center', marginBottom: '48px' }}>
            {t('Kuasai Bahasa Inggris Bisnis', 'Master Business English')}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div className="dot-pulse" />
            <div className="dot-pulse" />
            <div className="dot-pulse" />
          </div>
        </div>
      )
    }

    // ─────────────── WELCOME ──────────────────────────────────────────────
    if (screen === 'welcome') {
      return (
        <div className="screen-enter" style={{ padding: '24px', paddingTop: '64px', paddingBottom: '40px' }}>
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1.2, marginBottom: '12px' }}>
              {t(
                <>Raih Kariermu dengan<br /><span style={{ color: '#00BFFF' }}>Bahasa Inggris</span></>,
                <>Advance Your Career<br /><span style={{ color: '#00BFFF' }}>with English</span></>
              )}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px', lineHeight: 1.5 }}>
              {t(
                'Program belajar 6 bulan yang dirancang untuk profesional Batam',
                '6-month learning program designed for professionals'
              )}
            </p>
          </div>

          {/* Value props */}
          <div style={{ marginBottom: '28px' }}>
            {[
              { icon: '🧪', title: t('Tes Level Sekarang', 'Test Your Level Now'), desc: t('Ketahui level bahasa Inggrismu dalam 5 menit', 'Know your English level in 5 minutes') },
              { icon: '📚', title: t('Kurikulum Bisnis', 'Business Curriculum'), desc: t('Vocabulary, grammar, dan speaking khusus untuk kerja', 'Vocabulary, grammar & speaking for work') },
              { icon: '🎁', title: t('Belajar + Dapat Hadiah', 'Learn + Earn Rewards'), desc: t('Ajak teman dan unlock konten eksklusif gratis', 'Invite friends to unlock exclusive content free') },
            ].map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-desc">{v.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="avatar-row">
              {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'].map((c, i) => (
                <div key={i} className="avatar-circle" style={{ background: c, fontSize: '12px' }}>
                  {['😊','👨','👩','🧑','😄'][i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>12,847</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{t('orang sudah bergabung', 'people joined')}</div>
            </div>
          </div>

          {/* CTA */}
          <button className="btn-primary" onClick={() => { setTestScore(0); setTestQ(0); setSelectedAnswer(null); setAnswered(false); goTo('test-intro') }} style={{ marginBottom: '12px' }}>
            {t('Mulai Tes Gratis →', 'Start Free Test →')}
          </button>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            {t('Gratis selamanya • Tanpa kartu kredit', 'Forever free • No credit card')}
          </p>
        </div>
      )
    }

    // ─────────────── TEST INTRO ───────────────────────────────────────────
    if (screen === 'test-intro') {
      return (
        <div className="screen-enter" style={{ padding: '24px', paddingTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '72px', marginBottom: '20px' }}>⏱️</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>
              {t('Tes 5 Menit', '5-Minute Test')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '24px' }}>
              {t('Ukur kemampuan bahasa Inggris bisnis kamu', 'Measure your business English level')}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                t('5 pertanyaan', '5 questions'),
                t('30 detik/soal', '30 sec/question'),
                t('Hasil instan', 'Instant results'),
              ].map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '340px' }}>
            <button
              className="btn-primary"
              onClick={() => { setTestScore(0); setTestQ(0); setSelectedAnswer(null); setAnswered(false); goTo('test') }}
              style={{ fontSize: '18px', padding: '18px', letterSpacing: '0.5px' }}
            >
              {t('MULAI TES', 'START TEST')}
            </button>
          </div>

          <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            {t('100% gratis, tanpa daftar dulu', '100% free, no sign-up required yet')}
          </p>
        </div>
      )
    }

    // ─────────────── TEST ─────────────────────────────────────────────────
    if (screen === 'test') {
      const q = QUESTIONS[testQ]
      const optLetters = ['A', 'B', 'C', 'D']
      return (
        <div className="screen-enter" style={{ padding: '20px', paddingTop: '60px', paddingBottom: '40px', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="test-progress-dots">
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`progress-dot ${i < testQ ? 'done' : i === testQ ? 'active' : ''}`} />
              ))}
            </div>
            <div className="timer-circle">{timer}s</div>
          </div>

          {/* Question */}
          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', color: '#00BFFF', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
              {t('Pertanyaan', 'Question')} {testQ + 1} / {QUESTIONS.length}
            </div>
            <p style={{ fontSize: '17px', fontWeight: '600', lineHeight: 1.4 }}>{q.text}</p>
          </div>

          {/* Options */}
          <div style={{ marginBottom: '20px' }}>
            {q.opts.map((opt, i) => {
              let cls = 'answer-option'
              if (answered) {
                if (i === q.ans) cls += ' correct'
                else if (i === selectedAnswer) cls += ' wrong'
              } else if (i === selectedAnswer) {
                cls += ' selected'
              }
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                  <span className="answer-letter" style={answered && i === q.ans ? { background: 'rgba(37,211,102,0.3)', color: '#25D366' } : answered && i === selectedAnswer ? { background: 'rgba(255,71,87,0.3)', color: '#FF4757' } : {}}>
                    {optLetters[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Next button */}
          {answered && (
            <div className="screen-enter">
              <button className="btn-primary" onClick={handleNextQ}>
                {testQ < QUESTIONS.length - 1 ? t('Lanjut →', 'Next →') : t('Lihat Hasilku →', 'See My Results →')}
              </button>
            </div>
          )}
        </div>
      )
    }

    // ─────────────── ANALYZING ───────────────────────────────────────────
    if (screen === 'analyzing') {
      return (
        <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>🧠</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
            {t('Menganalisis hasil...', 'Analyzing results...')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '36px' }}>
            {t('Menghitung level bahasa Inggrismu', 'Calculating your English level')}
          </p>
          <div style={{ width: '100%', maxWidth: '280px' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden', height: '6px' }}>
              <div className="analyzing-bar" />
            </div>
          </div>
          <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            {t(`Skor: ${testScore}/${QUESTIONS.length}`, `Score: ${testScore}/${QUESTIONS.length}`)}
          </p>
        </div>
      )
    }

    // ─────────────── RESULTS TEASER ──────────────────────────────────────
    if (screen === 'results-teaser') {
      return (
        <div className="screen-enter" style={{ padding: '24px', paddingTop: '72px', paddingBottom: '40px', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
              {t('Hasilmu Sudah Siap!', 'Your Results Are Ready!')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {t('Daftar gratis untuk melihat hasil lengkapmu', 'Register free to see your full results')}
            </p>
          </div>

          {/* Blurred result card */}
          <div style={{ padding: '24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(8px)', userSelect: 'none', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'inline-block', padding: '8px 24px', background: 'rgba(0,191,255,0.15)', border: '2px solid #00BFFF', borderRadius: '99px', fontSize: '18px', fontWeight: '800', color: '#00BFFF', marginBottom: '10px' }}>
                  ⭐ Medium (B1)
                </div>
                <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)' }}>
                  {t(`Skor: ${testScore}/5`, `Score: ${testScore}/5`)}
                </div>
              </div>
              <div>
                {[
                  t('Kamu bisa memahami percakapan bisnis sehari-hari', 'You can understand everyday business conversations'),
                  t('Kemampuanmu di atas 67% peserta tes', 'Your level is above 67% of test takers'),
                  t('Rekomendasi: Business Speaking Module', 'Recommendation: Business Speaking Module'),
                ].map((item, i) => (
                  <div key={i} className="locked-bullet">
                    <span style={{ fontSize: '16px' }}>🔒</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Lock overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5, background: 'rgba(10,15,30,0.3)', backdropFilter: 'blur(2px)' }}>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔒</div>
              <p style={{ fontSize: '14px', fontWeight: '700', color: '#fff', textAlign: 'center' }}>
                {t('Daftar untuk unlock hasil lengkap', 'Register to unlock full results')}
              </p>
            </div>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              {t('245 orang dari Batam bergabung minggu ini', '245 people joined this week')}
            </p>
          </div>

          {/* CTAs */}
          <button className="btn-primary" onClick={() => goTo('register')} style={{ marginBottom: '14px', fontSize: '16px' }}>
            {t('Lihat Hasil Lengkapku →', 'See My Full Results →')}
          </button>

          <div className="divider" style={{ marginBottom: '14px' }}>{t('atau', 'or')}</div>

          <button className="btn-outline" onClick={() => goTo('register')}>
            {t('🔗 Share ke 1 teman untuk unlock', '🔗 Share to 1 friend to unlock')}
          </button>
        </div>
      )
    }

    // ─────────────── REGISTER ────────────────────────────────────────────
    if (screen === 'register') {
      return (
        <div className="screen-enter" style={{ padding: '24px', paddingTop: '64px', paddingBottom: '48px', minHeight: '100vh' }}>
          <button onClick={() => goTo('results-teaser')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '24px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
            ←
          </button>

          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
              {t('Daftar untuk lihat hasil', 'Register to See Results')}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
              {t('Gratis selamanya. Kami tidak akan spam.', 'Forever free. We will not spam you.')}
            </p>
          </div>

          {/* Form */}
          <div className="form-group">
            <label className="form-label">{t('Nama Lengkap', 'Full Name')}</label>
            <input
              className="form-input"
              type="text"
              placeholder={t('Masukkan namamu', 'Enter your name')}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp</label>
            <div className="phone-input-wrap">
              <div className="phone-prefix">🇮🇩 +62</div>
              <input
                className="form-input"
                type="tel"
                placeholder="8xxxxxxxxx"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value.replace(/\D/g, ''))}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('Kota', 'City')}</label>
            <select
              className="form-input"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
            >
              <option value="">{t('-- Pilih Kota --', '-- Select City --')}</option>
              <option value="Batam">Batam</option>
              <option value="Tanjung Pinang">Tanjung Pinang</option>
              <option value="Bintan">Bintan</option>
              <option value="Karimun">Karimun</option>
              <option value="Kota lain">{t('Kota lain', 'Other City')}</option>
            </select>
          </div>

          {/* Referral code (collapsible) */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setShowRefInput(!showRefInput)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
            >
              {showRefInput ? '▼' : '▶'} {t('Punya kode referral?', 'Have a referral code?')}
            </button>
            {showRefInput && (
              <div className="screen-enter" style={{ marginTop: '10px' }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="FLNT-XXXX"
                  value={formRefCode}
                  onChange={(e) => setFormRefCode(e.target.value.toUpperCase())}
                />
              </div>
            )}
          </div>

          {formError && (
            <div style={{ padding: '10px 14px', background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '10px', color: '#FF4757', fontSize: '14px', marginBottom: '16px' }}>
              {formError}
            </div>
          )}

          <button
            className="btn-green"
            onClick={handleRegister}
            disabled={submitting}
            style={{ opacity: submitting ? 0.7 : 1 }}
          >
            {submitting
              ? t('Mendaftar...', 'Registering...')
              : t('Lihat Hasilku 🔓', 'See My Results 🔓')}
          </button>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '16px', lineHeight: 1.5 }}>
            {t(
              'Dengan mendaftar, kamu setuju untuk dihubungi via WhatsApp.',
              'By registering, you agree to be contacted via WhatsApp.'
            )}
          </p>
        </div>
      )
    }

    // ─────────────── RESULTS ─────────────────────────────────────────────
    if (screen === 'results') {
      return (
        <div className="screen-enter" style={{ padding: '24px', paddingTop: '60px', paddingBottom: '40px', minHeight: '100vh' }}>
          {/* Confetti */}
          {showConfetti && (
            <>
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 20}%`,
                    background: ['#00BFFF','#FFD700','#25D366','#9B59B6','#FF6B35'][i % 5],
                    '--dur': `${2 + Math.random() * 2}s`,
                    '--delay': `${Math.random() * 0.8}s`,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    width: `${6 + Math.random() * 6}px`,
                    height: `${6 + Math.random() * 6}px`,
                  }}
                />
              ))}
            </>
          )}

          {/* Level badge */}
          <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative' }}>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              {t('Hasil Tesmu', 'Your Test Result')}
            </div>
            <div
              className="badge-animate"
              style={{
                display: 'inline-block',
                padding: '16px 32px',
                background: `linear-gradient(135deg, ${levelColor}22, ${levelColor}11)`,
                border: `2px solid ${levelColor}`,
                borderRadius: '16px',
                marginBottom: '16px',
                boxShadow: `0 0 40px ${levelColor}40`,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '6px' }}>{levelEmoji}</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: levelColor }}>
                {userLevel}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                {t(`Skor ${testScore}/5`, `Score ${testScore}/5`)}
              </div>
            </div>

            {/* XP float */}
            {showConfetti && (
              <div className="xp-float" style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', color: '#FFD700', fontWeight: '800', fontSize: '20px', whiteSpace: 'nowrap' }}>
                +50 XP ⚡
              </div>
            )}
          </div>

          {/* 6-month roadmap */}
          <div style={{ marginBottom: '24px' }}>
            <div className="section-title">{t('ROADMAP 6 BULAN', '6-MONTH ROADMAP')}</div>
            {[
              { month: t('Bulan 1-2', 'Month 1-2'), title: t('Fondasi Bisnis', 'Business Foundation'), desc: t('Vocabulary & Grammar dasar', 'Core Vocabulary & Grammar'), done: true },
              { month: t('Bulan 3-4', 'Month 3-4'), title: t('Komunikasi Aktif', 'Active Communication'), desc: t('Speaking & Email writing', 'Speaking & Email Writing'), done: false },
              { month: t('Bulan 5-6', 'Month 5-6'), title: t('Level Profesional', 'Professional Level'), desc: t('Presentation & Negotiation', 'Presentation & Negotiation'), done: false },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.done ? 'linear-gradient(135deg, #00BFFF, #0080FF)' : 'rgba(255,255,255,0.1)', border: m.done ? '2px solid #00BFFF' : '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: m.done ? '#fff' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  {i < 2 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.08)', marginTop: '4px', minHeight: '20px' }} />}
                </div>
                <div style={{ padding: '10px 14px', flex: 1, background: m.done ? 'rgba(0,191,255,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${m.done ? 'rgba(0,191,255,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '12px', marginBottom: i < 2 ? '4px' : 0 }}>
                  <div style={{ fontSize: '11px', color: m.done ? '#00BFFF' : 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '2px' }}>{m.month}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{m.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Share box */}
          <div style={{ padding: '18px', border: '1.5px solid rgba(37,211,102,0.35)', borderRadius: '16px', background: 'rgba(37,211,102,0.06)', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
              🎁 {t('Bagikan hasilmu & unlock bonus lessons!', 'Share your result & unlock bonus lessons!')}
            </div>

            {/* WA message preview */}
            <div className="wa-preview" style={{ marginBottom: '14px', fontSize: '12px' }}>
              {waMsg}
            </div>

            {/* Referral code */}
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('Kode Referralmu', 'Your Referral Code')}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '4px', color: '#00BFFF', marginBottom: '8px' }}>
                {userRef}
              </div>
              <button className="copy-btn" onClick={() => copyToClipboard(userRef, t('✓ Kode tersalin!', '✓ Code copied!'))}>
                📋 {t('Salin Kode', 'Copy Code')}
              </button>
            </div>

            {/* WA share button */}
            <button className="wa-share-btn" onClick={() => shareToWA()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {t('Share ke WhatsApp', 'Share to WhatsApp')}
            </button>
          </div>

          <button className="btn-primary" onClick={() => goTo('dashboard')}>
            {t('Mulai Belajar Sekarang →', 'Start Learning Now →')}
          </button>
        </div>
      )
    }

    // ─────────────── DASHBOARD ───────────────────────────────────────────
    if (screen === 'dashboard') {
      return (
        <div className="screen-enter" style={{ padding: '20px', paddingTop: '60px', paddingBottom: '100px', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginBottom: '4px' }}>
                {t('Selamat datang! 👋', 'Welcome back! 👋')}
              </p>
              <h2 style={{ fontSize: '22px', fontWeight: '800' }}>
                Halo, {userName || 'Pelajar'}!
              </h2>
            </div>
            <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', cursor: 'pointer', color: '#fff' }}>
              🔔
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">1 {t('Hari', 'Day')}</div>
              <div className="stat-label">Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">50 XP</div>
              <div className="stat-label">{t('Total XP', 'Total XP')}</div>
            </div>
            <div className="stat-card" style={{ background: `linear-gradient(135deg, rgba(0,191,255,0.12), rgba(0,191,255,0.06))`, borderColor: 'rgba(0,191,255,0.25)' }}>
              <div className="stat-icon">📊</div>
              <div className="stat-value" style={{ color: levelColor, fontSize: '14px' }}>{userLevel.split(' ')[0]}</div>
              <div className="stat-label">{t('Level', 'Level')}</div>
            </div>
          </div>

          {/* Referral banner */}
          <div className="gold-banner" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>
                  🎁 {t('Unlock Konten Bonus', 'Unlock Bonus Content')}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  0/1 referral
                </div>
              </div>
              <button
                className="btn-green"
                onClick={() => goTo('referral')}
                style={{ width: 'auto', padding: '8px 16px', fontSize: '13px' }}
              >
                {t('Invite', 'Invite')}
              </button>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill gold" style={{ width: '0%' }} />
            </div>
          </div>

          {/* Today's plan */}
          <div className="section-title">{t("RENCANA HARI INI", "TODAY'S PLAN")}</div>

          <div
            className="plan-item"
            onClick={() => goTo('lesson')}
          >
            <div className="plan-icon">📚</div>
            <div className="plan-info">
              <div className="plan-title">{t('Vocab Lesson 1', 'Vocab Lesson 1')}</div>
              <div className="plan-sub">{t('8 kata baru · 10 menit', '8 new words · 10 min')}</div>
            </div>
            <span className="plan-badge badge-new">{t('Mulai', 'Start')}</span>
          </div>

          <div className="plan-item locked">
            <div className="plan-icon">🎤</div>
            <div className="plan-info">
              <div className="plan-title">{t('Speaking Practice', 'Speaking Practice')}</div>
              <div className="plan-sub">🔒 {t('Butuh streak 7 hari', 'Need 7-day streak')}</div>
            </div>
            <span className="plan-badge badge-lock">🔒</span>
          </div>

          <div className="plan-item locked">
            <div className="plan-icon">💼</div>
            <div className="plan-info">
              <div className="plan-title">{t('Business Module', 'Business Module')}</div>
              <div className="plan-sub">🔒 {t('Butuh 1 referral', 'Need 1 referral')}</div>
            </div>
            <span className="plan-badge badge-lock">🔒</span>
          </div>
        </div>
      )
    }

    // ─────────────── LESSON ──────────────────────────────────────────────
    if (screen === 'lesson') {
      const vocab = VOCAB[vocabIdx]
      return (
        <div className="screen-enter" style={{ padding: '20px', paddingTop: '16px', paddingBottom: '110px', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingTop: '8px' }}>
            <button onClick={() => goTo('dashboard')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '18px' }}>
              ←
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>Vocabulary · Lesson 1</div>
              <div style={{ fontSize: '14px', fontWeight: '700' }}>{t(`Kata ${vocabIdx + 1} dari ${VOCAB.length}`, `Word ${vocabIdx + 1} of ${VOCAB.length}`)}</div>
            </div>
            <div style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '99px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#FFD700' }}>
              +10 XP
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-track" style={{ marginBottom: '24px' }}>
            <div className="progress-bar-fill" style={{ width: `${((vocabIdx) / VOCAB.length) * 100}%` }} />
          </div>

          {/* Word card */}
          <div className="word-card" style={{ marginBottom: '20px', position: 'relative' }}>
            {showXpFloat && (
              <div className="xp-float" style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', color: '#FFD700', fontWeight: '800', fontSize: '18px', whiteSpace: 'nowrap', zIndex: 10 }}>
                +30 XP earned ⚡
              </div>
            )}
            <div className="word-english">{vocab.word}</div>
            <div className="word-phonetic">{vocab.phonetic}</div>
            <div className="word-id">{vocab.id}</div>

            <button
              className={`audio-btn ${audioPlaying ? 'playing' : ''}`}
              onClick={() => { setAudioPlaying(true); setTimeout(() => setAudioPlaying(false), 2000) }}
              title={t('Putar audio', 'Play audio')}
            >
              {audioPlaying ? '🔊' : '🔈'}
            </button>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 0 16px' }} />

            <div className="example-en">{vocab.exEn}</div>
            <div className="example-id" style={{ marginBottom: '16px' }}>{vocab.exId}</div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {vocab.chips.map((c) => (
                <span key={c} className="chip" style={{ fontSize: '11px' }}>{c}</span>
              ))}
            </div>
          </div>

          {/* SRS buttons */}
          <div className="srs-btns">
            <button className="srs-dontknow" onClick={handleSRS}>
              ✗ {t('Belum', "Don't Know")}
            </button>
            <button className="srs-know" onClick={handleSRS}>
              ✓ {t('Tahu', 'Know It')}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            {t('Ketuk untuk lanjut ke kata berikutnya', 'Tap to go to the next word')}
          </p>
        </div>
      )
    }

    // ─────────────── SPEAKING ─────────────────────────────────────────────
    if (screen === 'speaking') {
      return (
        <div className="screen-enter" style={{ padding: '20px', paddingTop: '60px', paddingBottom: '110px', minHeight: '100vh' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
              🎤 {t('Speaking Practice', 'Speaking Practice')}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
              {t('Latih kemampuan bicara bahasa Inggrismu', 'Practice your English speaking skills')}
            </p>
          </div>

          {/* Lock overlay */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎙️</div>
                <div style={{ fontSize: '16px', fontWeight: '700' }}>Pronunciation Coach</div>
              </div>
              {['Record yourself speaking', 'Get AI pronunciation score', 'Practice with native phrases'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span>✓</span>
                  <span style={{ fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Lock panel */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,15,30,0.6)', backdropFilter: 'blur(6px)', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '14px' }}>🔒</div>
              <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
                {t('Butuh Streak 7 Hari', 'Need 7-Day Streak')}
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', lineHeight: 1.5 }}>
                {t('Belajar setiap hari selama 7 hari untuk unlock speaking practice', 'Learn every day for 7 days to unlock speaking practice')}
              </p>

              {/* Streak dots */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: i < 1 ? 'linear-gradient(135deg, #FF6B35, #FF4757)' : 'rgba(255,255,255,0.08)', border: '2px solid', borderColor: i < 1 ? '#FF6B35' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    {i < 1 ? '🔥' : ''}
                  </div>
                ))}
              </div>

              <div className="divider" style={{ width: '100%', marginBottom: '16px' }}>{t('atau', 'or')}</div>

              <button className="wa-share-btn" onClick={() => shareToWA()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('Share & Skip Streak', 'Share & Skip Streak')}
              </button>
            </div>
          </div>
        </div>
      )
    }

    // ─────────────── REFERRAL ─────────────────────────────────────────────
    if (screen === 'referral') {
      const tiers = [
        { refs: 1, reward: t('Speaking Practice', 'Speaking Practice'), icon: '🎤', count: 0 },
        { refs: 3, reward: t('Week 2 Early Access', 'Week 2 Early Access'), icon: '⚡', count: 0 },
        { refs: 5, reward: t('Business Module', 'Business Module'), icon: '💼', count: 0 },
        { refs: 10, reward: t('Premium Badge', 'Premium Badge'), icon: '🏆', count: 0 },
      ]
      const shareLink = `https://fluentedge-three.vercel.app?ref=${userRef}`
      return (
        <div className="screen-enter" style={{ padding: '20px', paddingTop: '60px', paddingBottom: '110px', minHeight: '100vh' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '6px' }}>
              🔗 {t('Bagikan & Dapatkan Hadiah', 'Share & Earn Rewards')}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>
              {t('Semakin banyak teman, semakin banyak konten', 'More friends, more content unlocked')}
            </p>
          </div>

          {/* Referral code box */}
          <div className="referral-code-box" style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t('Kode Referralmu', 'Your Referral Code')}
            </div>
            <div className="referral-code-text">{userRef || 'FLNT-????'}</div>
            <button className="copy-btn" onClick={() => copyToClipboard(userRef, t('✓ Kode tersalin!', '✓ Code copied!'))}>
              📋 {t('Salin Kode', 'Copy Code')}
            </button>
          </div>

          {/* Share buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            <button className="wa-share-btn" onClick={() => shareToWA()} style={{ fontSize: '14px', padding: '12px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </button>
            <button className="btn-outline" onClick={() => copyToClipboard(shareLink, t('✓ Link tersalin!', '✓ Link copied!'))} style={{ fontSize: '14px', padding: '12px' }}>
              🔗 {t('Salin Link', 'Copy Link')}
            </button>
          </div>

          {/* WA preview */}
          <div className="wa-preview" style={{ marginBottom: '24px' }}>
            {waMsg}
          </div>

          {/* Reward tiers */}
          <div className="section-title">{t('HADIAH REFERRAL', 'REFERRAL REWARDS')}</div>
          {tiers.map((tier) => (
            <div key={tier.refs} className="reward-tier">
              <div className="tier-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '22px' }}>{tier.icon}</span>
                  <div>
                    <div className="tier-name">{tier.reward}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {tier.refs} {t('referral', 'referrals')}
                    </div>
                  </div>
                </div>
                <div className="tier-count">{tier.count}/{tier.refs}</div>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${(tier.count / tier.refs) * 100}%` }} />
              </div>
            </div>
          ))}

          {/* Leaderboard teaser */}
          <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
            <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>
              {t('Leaderboard Referral', 'Referral Leaderboard')}
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
              {t('Top referrer bulan ini dapat hadiah spesial', 'Top referrer this month gets a special prize')}
            </p>
          </div>
        </div>
      )
    }

    return null
  }

  // ─── Orbs ─────────────────────────────────────────────────────────────────
  const Orbs = () => (
    <>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="orb orb-4" />
    </>
  )

  // ─── Particles ────────────────────────────────────────────────────────────
  const Particles = () => (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 20}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            background: ['rgba(0,191,255,0.5)', 'rgba(155,89,182,0.5)', 'rgba(255,215,0,0.4)'][i % 3],
            '--dur': `${6 + Math.random() * 10}s`,
            '--delay': `${Math.random() * 8}s`,
            '--drift': `${(Math.random() - 0.5) * 60}px`,
          }}
        />
      ))}
    </>
  )

  // ─── Bottom Nav ───────────────────────────────────────────────────────────
  const BottomNav = () => (
    <nav className="bottom-nav">
      {[
        { id: 'dashboard', icon: '🏠', label: t('Beranda', 'Home') },
        { id: 'lesson', icon: '📚', label: t('Pelajaran', 'Lessons') },
        { id: 'speaking', icon: '🎤', label: t('Bicara', 'Speak') },
        { id: 'referral', icon: '🔗', label: t('Bagikan', 'Share') },
      ].map((item) => (
        <button
          key={item.id}
          className={`nav-item ${screen === item.id ? 'active' : ''}`}
          onClick={() => goTo(item.id)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )

  return (
    <>
      <Head>
        <title>FluentEdge — Master Business English</title>
        <meta name="description" content="Kuasai Bahasa Inggris Bisnis dalam 6 bulan. Tes level gratis, curriculum terstruktur, dan komunitas belajar." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0A0F1E" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Orbs />
      <Particles />

      {/* Language toggle — hidden on splash */}
      {screen !== 'splash' && (
        <div className="lang-toggle">
          <button className={`lang-btn ${lang === 'id' ? 'active' : ''}`} onClick={() => setLang('id')}>
            🇮🇩 ID
          </button>
          <button className={`lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>
            🇬🇧 EN
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toastHiding ? 'hiding' : ''}`}>{toast}</div>
      )}

      {/* Main app container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '430px',
        margin: '0 auto',
        minHeight: '100vh',
      }}>
        {renderScreen()}
        {showBottomNav && <BottomNav />}
      </div>
    </>
  )
}
