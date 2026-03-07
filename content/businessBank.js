// ─── FluentEdge Business English Pack ────────────────────────────────────────
// 10-unit Business English workbook for Bahasa Indonesia speakers.
// Based on real workplace scenarios for professionals in Batam.

export const BUSINESS_BANK = [
  {
    id: 1,
    titleEN: 'Professional Greetings & Introductions',
    titleID: 'Salam Profesional & Perkenalan',
    phrases: [
      { situation: 'First meeting',     en: "How do you do? / It's a pleasure to meet you.", id: 'Senang berkenalan dengan Anda.' },
      { situation: 'Morning',           en: "Good morning. I hope you're well.",             id: 'Selamat pagi. Semoga Anda baik.' },
      { situation: 'Afternoon',         en: "Good afternoon. Thank you for your time.",      id: 'Selamat siang. Terima kasih atas waktu Anda.' },
      { situation: 'Introducing self',  en: "Allow me to introduce myself. My name is...",   id: 'Izinkan saya memperkenalkan diri.' },
      { situation: 'Introducing others',en: "I'd like you to meet [name], our [role].",     id: 'Saya ingin memperkenalkan [nama].' },
      { situation: 'After absence',     en: "It's good to see you again after so long.",    id: 'Senang bertemu lagi setelah sekian lama.' },
    ],
    exercises: [
      {
        q: '"_____ to meet you, Mr. Lim. I\'m Sarah from the marketing team."',
        options: ["It's a pleasure", 'I am happy', 'How do you do', 'Nice to know you'],
        answer: "It's a pleasure",
        tip: '"It\'s a pleasure to meet you" is the standard professional greeting for first meetings.',
      },
      {
        q: '"Good afternoon. _____ for coming all this way for our meeting."',
        options: ['Thank you', 'I appreciate', 'Many thanks', 'How kind of'],
        answer: 'Thank you',
        tip: '"Thank you for..." requires a noun or gerund after it. "Thank you for coming" is correct.',
      },
      {
        q: '"I\'d like you _____ Ahmad, our new Head of Operations."',
        options: ['to meet', 'meeting', 'to know', 'introduce'],
        answer: 'to meet',
        tip: '"I\'d like you to meet [name]" is the standard phrase for introducing someone to another person.',
      },
      {
        q: '"_____ myself — I\'m the Regional Director for Southeast Asia."',
        options: ['Allow me to introduce', 'Let me know', 'Permit me introducing', 'I want to introduce'],
        answer: 'Allow me to introduce',
        tip: '"Allow me to introduce myself" is polished and professional. Avoid "I want to introduce myself" — it sounds too direct.',
      },
      {
        q: 'Which greeting phrase is a direct Bahasa translation error to AVOID?',
        options: [
          'I am very happy to know you.',
          "It's a pleasure to meet you.",
          'Lovely to meet you.',
          'How do you do?',
        ],
        answer: 'I am very happy to know you.',
        tip: '"I am very happy to know you" is a literal translation of "saya sangat gembira kenal Anda." Use "It\'s a pleasure to meet you" instead.',
      },
    ],
  },

  {
    id: 2,
    titleEN: 'Business Vocabulary: Meetings & Presentations',
    titleID: 'Kosakata Bisnis: Rapat & Presentasi',
    phrases: [
      { situation: 'agenda',       en: 'List of topics to be discussed',                  id: 'Daftar topik yang akan dibahas' },
      { situation: 'minutes',      en: 'Official record of a meeting',                    id: 'Catatan resmi rapat' },
      { situation: 'action items', en: 'Tasks assigned to individuals after a meeting',   id: 'Tugas yang perlu dilakukan setelah rapat' },
      { situation: 'defer',        en: 'To postpone to a later time',                     id: 'Menunda ke waktu berikutnya' },
      { situation: 'wrap up',      en: 'To bring something to a close',                   id: 'Mengakhiri / menutup sesuatu' },
      { situation: 'follow up',    en: 'To take further action after an initial step',    id: 'Tindak lanjut' },
      { situation: 'circulate',    en: 'To distribute to all members',                    id: 'Mengedarkan kepada semua anggota' },
      { situation: 'unanimous',    en: 'Agreed upon by everyone',                         id: 'Dengan suara bulat / semua setuju' },
    ],
    exercises: [
      {
        q: 'In a meeting, "agenda" means:',
        options: [
          'A list of topics to be discussed',
          'A record of what was discussed',
          'Tasks assigned after the meeting',
          'A formal vote on a decision',
        ],
        answer: 'A list of topics to be discussed',
        tip: 'Agenda = what we WILL discuss. Minutes = what we DID discuss. These are commonly confused.',
      },
      {
        q: '"Minutes" in a business meeting context means:',
        options: [
          'The official record of what was discussed',
          'A unit of time during the meeting',
          'A brief break between agenda items',
          'A summary sent before the meeting',
        ],
        answer: 'The official record of what was discussed',
        tip: '"Can someone take the minutes today?" = Who will write the official record of this meeting?',
      },
      {
        q: '"We\'ll defer that item to next week\'s meeting." — What does defer mean?',
        options: [
          'To postpone something to a later time',
          'To cancel something permanently',
          'To disagree with something politely',
          'To summarize something briefly',
        ],
        answer: 'To postpone something to a later time',
        tip: '"Defer" and "table" both mean to postpone in British/Malaysian English. In American English, "table" means to discuss now — be careful!',
      },
      {
        q: 'Best professional phrase to open a presentation:',
        options: [
          "Good morning everyone. Today I'll be presenting our Q3 results.",
          'Listen to me talk about our results.',
          'Now I want to say things about Q3.',
          'Hi, I will present now.',
        ],
        answer: "Good morning everyone. Today I'll be presenting our Q3 results.",
        tip: 'A strong opening: greet the audience, state the topic and scope. Keep it clear and confident.',
      },
      {
        q: 'Best phrase to TRANSITION between points in a presentation:',
        options: [
          "Moving on to our next point...",
          'And now, the next thing is...',
          'Okay so next...',
          'After that, I will say...',
        ],
        answer: "Moving on to our next point...",
        tip: 'Use "Moving on to...", "This brings me to...", or "Let\'s now look at..." to signal transitions professionally.',
      },
    ],
  },

  {
    id: 3,
    titleEN: 'Email Writing Essentials',
    titleID: 'Dasar-Dasar Penulisan Email',
    phrases: [
      { situation: 'Subject line',    en: 'Clear and action-oriented',               id: '"Meeting Request: Budget Review — 14 March"' },
      { situation: 'Salutation',      en: 'Dear Mr. Tan, / Hi Sarah,',               id: 'Yth. Bapak Tan, / Halo Sarah,' },
      { situation: 'Opening line',    en: 'State your purpose immediately',           id: '"I am writing regarding your inquiry..."' },
      { situation: 'Body',            en: 'Details, context, or request',             id: '"Please find the attached report..."' },
      { situation: 'Call to action',  en: 'What you want the reader to do',          id: '"Could you please confirm by Friday?"' },
      { situation: 'Closing',         en: 'Best regards, / Yours sincerely,',        id: 'Hormat saya, / Salam hangat,' },
    ],
    exercises: [
      {
        q: 'Which email subject line is the most professional?',
        options: [
          'Meeting Reschedule Request: 14 March',
          'About the meeting tomorrow',
          'Hi, meeting stuff',
          'URGENT: meeting',
        ],
        answer: 'Meeting Reschedule Request: 14 March',
        tip: 'A good subject line is specific, action-oriented, and includes relevant dates or topics. Avoid vague subjects like "About the meeting."',
      },
      {
        q: '"I very sorry for the inconvenient." — Which correction is correct?',
        options: [
          'I am very sorry for the inconvenience.',
          "I'm very sorry for the inconvenient.",
          'I very much sorry for the inconvenience.',
          'I am sorry about the inconvenient.',
        ],
        answer: 'I am very sorry for the inconvenience.',
        tip: 'Two errors: missing "am" (to be verb) and wrong noun form. "Inconvenience" is the noun — not "inconvenient" (which is an adjective).',
      },
      {
        q: '"Please reply me as soon as can." — Which is the correct rewrite?',
        options: [
          'Please reply to me as soon as possible.',
          'Please reply me as soon as possible.',
          'Please do reply me fast.',
          'Please respond as soon quick as possible.',
        ],
        answer: 'Please reply to me as soon as possible.',
        tip: '"Reply to me" — the preposition "to" is required after "reply." "ASAP" is too informal for business emails.',
      },
      {
        q: 'Most professional way to make a request in an email:',
        options: [
          'Could you please review the document and share your feedback by Thursday?',
          'I need you to review the document by Thursday.',
          'Review the document and tell me by Thursday.',
          'Please look at the document and reply Thursday.',
        ],
        answer: 'Could you please review the document and share your feedback by Thursday?',
        tip: 'Use "Could you please..." for polite requests. Include a specific deadline and what action you need.',
      },
      {
        q: 'Which email opening line is most professional?',
        options: [
          'I am writing to provide an update on the Q4 marketing campaign.',
          'I want to tell you about the Q4 marketing campaign.',
          'This email is for updating you on Q4 marketing.',
          'Hi, so Q4 marketing update below.',
        ],
        answer: 'I am writing to provide an update on the Q4 marketing campaign.',
        tip: '"I am writing to..." immediately states your purpose. This is the gold standard for professional email openings.',
      },
    ],
  },

  {
    id: 4,
    titleEN: 'Telephone & Video Call Language',
    titleID: 'Bahasa Telepon & Video Call',
    phrases: [
      { situation: 'Answering',       en: 'Good morning, [Company]. How may I help you?',          id: 'Selamat pagi, [Perusahaan]. Ada yang bisa saya bantu?' },
      { situation: 'Asking to hold',  en: 'Could you hold the line, please?',                      id: 'Bisakah Anda menunggu sebentar?' },
      { situation: 'Taking a message',en: 'May I take a message?',                                  id: 'Boleh saya catat pesannya?' },
      { situation: 'Bad connection',  en: "I'm sorry, I didn't quite catch that.",                  id: 'Maaf, saya tidak begitu jelas mendengarnya.' },
      { situation: 'Asking to repeat',en: 'Could you please repeat that more slowly?',             id: 'Bisakah Anda mengulangi lebih perlahan?' },
      { situation: 'Confirming',      en: "Let me just confirm — you said [X], is that correct?",  id: 'Izinkan saya konfirmasi — Anda bilang [X], benar?' },
      { situation: 'Ending call',     en: 'Thank you for calling. Have a good day.',               id: 'Terima kasih sudah menghubungi. Selamat beraktivitas.' },
    ],
    exercises: [
      {
        q: 'A receptionist answers a business call. Best first response:',
        options: [
          'Good morning, Nexus Corporation. How may I direct your call?',
          'Hello, who is this?',
          'Yes, what do you want?',
          'Nexus Corporation, speak please.',
        ],
        answer: 'Good morning, Nexus Corporation. How may I direct your call?',
        tip: 'A professional phone greeting: time of day + company name + offer to help. "How may I direct your call?" is ideal for a receptionist.',
      },
      {
        q: 'The person called is in a meeting. How do you ask the caller to wait?',
        options: [
          'Could you hold the line, please?',
          'Wait a moment.',
          "Don't go, they're busy.",
          'Please stay on the phone.',
        ],
        answer: 'Could you hold the line, please?',
        tip: '"Could you hold the line?" is the professional phrase. Always ask permission before placing someone on hold.',
      },
      {
        q: 'The caller wants to leave a message. What do you say?',
        options: [
          'May I take a message?',
          'Do you want to leave message?',
          'Can I note something for her?',
          'Should I tell her you called?',
        ],
        answer: 'May I take a message?',
        tip: '"May I take a message?" is standard. Note: "Do you want to leave message?" is missing the article "a" — a common Bahasa speaker error.',
      },
      {
        q: 'You cannot hear the caller clearly. What do you say?',
        options: [
          "I'm sorry, I didn't quite catch that. Could you repeat that?",
          'I cannot hear you good.',
          'The line is broken, speak louder.',
          'Your voice is not clear to me.',
        ],
        answer: "I'm sorry, I didn't quite catch that. Could you repeat that?",
        tip: '"I didn\'t quite catch that" is polite and professional. Avoid blaming the caller or saying the line is broken.',
      },
      {
        q: 'Best way to end a professional phone call:',
        options: [
          "Thank you for calling. Have a good day!",
          'Okay, bye.',
          'That is all, thanks.',
          'We are done, goodbye.',
        ],
        answer: "Thank you for calling. Have a good day!",
        tip: 'Always thank the caller and wish them well. It leaves a professional and positive impression.',
      },
    ],
  },

  {
    id: 5,
    titleEN: 'Making Requests & Giving Instructions',
    titleID: 'Membuat Permintaan & Memberikan Instruksi',
    phrases: [
      { situation: 'Direct (avoid)',  en: 'Send me the report.',                                         id: 'Kirim laporannya ke saya.' },
      { situation: 'Better',          en: 'Can you send me the report?',                                 id: 'Bisakah Anda mengirim laporannya?' },
      { situation: 'Most polite',     en: 'Could you please send me the report when you have a moment?', id: 'Bisakah tolong kirimkan laporan saat Anda ada waktu?' },
      { situation: 'Direct (avoid)',  en: 'I need you to attend.',                                       id: 'Saya butuh Anda hadir.' },
      { situation: 'Better',          en: 'Will you be able to attend?',                                 id: 'Apakah Anda bisa hadir?' },
      { situation: 'Most polite',     en: 'I would appreciate it if you could attend.',                  id: 'Saya akan sangat menghargai jika Anda bisa hadir.' },
    ],
    exercises: [
      {
        q: '"Give me the budget figures now." — Choose the most polite professional version:',
        options: [
          'Could you please provide me with the budget figures at your earliest convenience?',
          'Can you give me the budget figures?',
          'Please send the budget figures right now.',
          'I need budget figures immediately.',
        ],
        answer: 'Could you please provide me with the budget figures at your earliest convenience?',
        tip: 'Use "Could you please..." + "at your earliest convenience" to sound polished without being aggressive.',
      },
      {
        q: '"You must finish the proposal today." — Most professional version:',
        options: [
          'Would it be possible to have the proposal ready by end of today?',
          'Can you finish the proposal today?',
          'You need to complete the proposal today.',
          'Please make sure proposal is done today.',
        ],
        answer: 'Would it be possible to have the proposal ready by end of today?',
        tip: '"Would it be possible to have [task] ready by [time]?" is the gold standard for professional deadline requests.',
      },
      {
        q: '"I want you to explain your decision." — Most polite version:',
        options: [
          "I'd appreciate it if you could walk me through the reasoning behind your decision.",
          'Can you explain your decision to me?',
          'Tell me why you decided this.',
          'I need an explanation of your decision.',
        ],
        answer: "I'd appreciate it if you could walk me through the reasoning behind your decision.",
        tip: '"I\'d appreciate it if you could..." signals respect. "Walk me through" is a natural business English phrase that\'s less confrontational than "explain."',
      },
      {
        q: 'Which is the most professional way to ask for information?',
        options: [
          'Could you please let me know when the client is expected to arrive?',
          'Tell me when the client will arrive.',
          'When will client come?',
          'I want to know about the client arrival.',
        ],
        answer: 'Could you please let me know when the client is expected to arrive?',
        tip: '"Let me know when [X] is expected" is indirect and polite. Avoid "Tell me" which can sound like a command.',
      },
    ],
  },

  {
    id: 6,
    titleEN: 'Negotiation & Agreement Phrases',
    titleID: 'Frasa Negosiasi & Persetujuan',
    phrases: [
      { situation: 'Agreeing',            en: "That sounds reasonable. / We're aligned on that.",              id: 'Itu terdengar masuk akal. / Kita sepakat.' },
      { situation: 'Partially agreeing',  en: "I see your point, however... / That's a fair point, but...",   id: 'Saya mengerti maksud Anda, namun... / Poin yang adil, tapi...' },
      { situation: 'Disagreeing politely',en: "I'm afraid that won't be feasible. / I'd have to reconsider.", id: 'Saya khawatir itu tidak memungkinkan. / Perlu saya pertimbangkan ulang.' },
      { situation: 'Softening a refusal', en: 'With respect, I\'d suggest an alternative approach.',          id: 'Dengan hormat, saya ingin menyarankan pendekatan alternatif.' },
      { situation: 'Moving forward',      en: "We're aligned on that. Shall we proceed?",                     id: 'Kita sepakat. Haruskah kita lanjutkan?' },
    ],
    exercises: [
      {
        q: 'A client requests a 30% discount but your limit is 15%. Best response:',
        options: [
          "I understand your position. While a 30% discount isn't possible, I'd be happy to discuss a 15% discount with revised terms.",
          "No, we can only do 15%.",
          "That's too much, we cannot give 30%.",
          '30% is impossible for us to agree to.',
        ],
        answer: "I understand your position. While a 30% discount isn't possible, I'd be happy to discuss a 15% discount with revised terms.",
        tip: 'In negotiation: acknowledge their position first, then redirect to what IS possible. Never start with a flat "no."',
      },
      {
        q: 'A partner proposes a deadline your team cannot meet. Diplomatic response:',
        options: [
          "That's a fair point, but I'm afraid the timeline may be challenging. Could we explore a phased approach?",
          "We cannot meet that deadline.",
          "That's too fast for my team.",
          'Why do you want it so soon?',
        ],
        answer: "That's a fair point, but I'm afraid the timeline may be challenging. Could we explore a phased approach?",
        tip: 'Use "That\'s a fair point, but..." to validate then redirect. Proposing an alternative (phased approach) shows problem-solving, not just resistance.',
      },
      {
        q: 'Which phrase expresses PARTIAL agreement professionally?',
        options: [
          "While I agree in principle, I'd like to explore the budget implications further.",
          'Yes but that is wrong.',
          'Maybe, but it will not work.',
          'I agree but no.',
        ],
        answer: "While I agree in principle, I'd like to explore the budget implications further.",
        tip: '"While I agree in principle..." signals you support the idea but have concerns. This keeps the conversation constructive.',
      },
      {
        q: 'Most diplomatic way to disagree in a negotiation:',
        options: [
          "I'm afraid that won't be feasible given our current constraints.",
          "That won't work at all.",
          'No, we cannot do that.',
          "That's a bad idea.",
        ],
        answer: "I'm afraid that won't be feasible given our current constraints.",
        tip: '"I\'m afraid that won\'t be feasible" uses indirect language to soften a refusal. Adding a reason ("given our current constraints") makes it more credible.',
      },
    ],
  },

  {
    id: 7,
    titleEN: 'Reporting & Describing Trends',
    titleID: 'Melaporkan & Mendeskripsikan Tren',
    phrases: [
      { situation: 'Increase',  en: 'rise / grow / climb / surge — sharply, gradually, steadily', id: 'naik / tumbuh / meningkat — tajam, perlahan, stabil' },
      { situation: 'Decrease',  en: 'fall / drop / decline / dip — slightly, dramatically',       id: 'turun / jatuh / menurun — sedikit, drastis' },
      { situation: 'Stable',    en: 'remain stable / plateau / level off — consistently',         id: 'tetap stabil / mendatar — secara konsisten' },
      { situation: 'Pattern 1', en: '[Subject] + [verb] + [adverb] + by + [amount]',              id: 'Contoh: "Sales rose sharply by 23% in Q3."' },
      { situation: 'Pattern 2', en: 'There was a [adj] [noun] in [subject]',                     id: 'Contoh: "There was a significant decline in customer satisfaction."' },
      { situation: 'Pattern 3', en: '[Subject] experienced / saw / recorded a [noun]',           id: 'Contoh: "The company recorded a 10% increase in revenue."' },
    ],
    exercises: [
      {
        q: 'Q1 revenue: RM2.1M → Q2 revenue: RM2.8M. Best sentence:',
        options: [
          'Revenue rose sharply from RM 2.1 million to RM 2.8 million between Q1 and Q2.',
          'Revenue was more in Q2 than Q1.',
          'There was revenue increase to RM 2.8M in Q2.',
          'Q2 has RM 2.8M revenue which is higher.',
        ],
        answer: 'Revenue rose sharply from RM 2.1 million to RM 2.8 million between Q1 and Q2.',
        tip: 'Use Pattern 1: Subject + verb + adverb + from [X] to [Y]. "Rose sharply" shows both direction and degree.',
      },
      {
        q: 'Q2 RM2.8M → Q3 RM2.6M. Best sentence:',
        options: [
          'There was a moderate decline in revenue from Q2 to Q3.',
          'Revenue fall in Q3 compared to Q2.',
          'Q3 revenue was lower than Q2.',
          'Revenue decreased to Q3 from Q2.',
        ],
        answer: 'There was a moderate decline in revenue from Q2 to Q3.',
        tip: 'Use Pattern 2: "There was a [degree] [noun] in [subject]." Small drop = moderate decline. Big drop = sharp/dramatic fall.',
      },
      {
        q: 'Q3 and Q4 are both RM2.6M. Best sentence:',
        options: [
          'Revenue remained stable at RM 2.6 million throughout Q3 and Q4.',
          'Q3 and Q4 had same revenue.',
          'Revenue was flat in Q3 and also in Q4.',
          'No change happened from Q3 to Q4 in revenue.',
        ],
        answer: 'Revenue remained stable at RM 2.6 million throughout Q3 and Q4.',
        tip: '"Remained stable at [value]" is cleaner than "was flat" or "had same." Use "throughout" to cover the full period.',
      },
      {
        q: '"Sales _____ by 23% in Q3." — Choose the correct verb phrase:',
        options: [
          'rose sharply',
          'was risen',
          'increased sharply by',
          'did rise sharply',
        ],
        answer: 'rose sharply',
        tip: '"Rose sharply by 23%" is correct. Avoid "increased sharply by" — "by" already appears in the sentence. "Was risen" is grammatically wrong (rise is intransitive).',
      },
      {
        q: '"The company _____ a 10% increase in revenue." — Best verb:',
        options: [
          'recorded',
          'had recorded',
          'saw the',
          'experienced an',
        ],
        answer: 'recorded',
        tip: 'Pattern 3 verbs: "recorded," "saw," "experienced," "posted." Each takes a noun: "recorded a 10% increase" — not "recorded an increase of 10% by."',
      },
    ],
  },

  {
    id: 8,
    titleEN: 'Problem-Solving & Decision-Making',
    titleID: 'Pemecahan Masalah & Pengambilan Keputusan',
    phrases: [
      { situation: 'Identifying',  en: 'It appears that there is an issue with...',          id: 'Nampaknya terdapat masalah dengan...' },
      { situation: 'Analyzing',    en: 'This seems to be due to / caused by...',             id: 'Ini tampaknya disebabkan oleh...' },
      { situation: 'Proposing',    en: 'One possible approach would be to...',               id: 'Satu pendekatan yang mungkin adalah...' },
      { situation: 'Evaluating',   en: 'The most cost-effective solution would be...',       id: 'Solusi yang paling efisien biaya adalah...' },
      { situation: 'Agreeing',     en: "Let's move forward with [option].",                  id: 'Mari kita lanjutkan dengan [pilihan].' },
      { situation: 'Following up', en: "I'll keep you updated on the progress.",             id: 'Saya akan memberitahu Anda perkembangannya.' },
    ],
    exercises: [
      {
        q: 'Your team missed a delivery deadline. Best way to open the update to your manager:',
        options: [
          'It appears there is an issue with our delivery timeline, which I would like to address immediately.',
          'We have a problem with delivery.',
          'Something went wrong with the delivery.',
          'The delivery has failed and I am sorry.',
        ],
        answer: 'It appears there is an issue with our delivery timeline, which I would like to address immediately.',
        tip: '"It appears there is an issue" is professional and factual without being alarmist. Adding "which I would like to address immediately" shows initiative.',
      },
      {
        q: 'Best way to explain the cause of a supply chain delay:',
        options: [
          'This appears to be caused by unexpected disruptions affecting our key suppliers.',
          'The supplier is at fault for this delay.',
          'Our supplier caused many problems for us.',
          'Because of supplier, there are problems.',
        ],
        answer: 'This appears to be caused by unexpected disruptions affecting our key suppliers.',
        tip: '"This appears to be caused by..." is objective. Avoid assigning blame directly — focus on the situation, not the person.',
      },
      {
        q: 'How do you propose a solution professionally?',
        options: [
          'One possible approach would be to source alternative suppliers while keeping the client informed.',
          'We should just find new suppliers.',
          "Let's solve the supplier problem somehow.",
          'Talk to the client about the supplier issue.',
        ],
        answer: 'One possible approach would be to source alternative suppliers while keeping the client informed.',
        tip: '"One possible approach would be to..." signals you\'ve thought it through and are presenting options, not commands.',
      },
      {
        q: 'Best closing statement in a client update during a problem:',
        options: [
          "I'll keep you updated on the progress and aim to have this resolved within the week.",
          "We'll fix it soon, don't worry.",
          "Don't worry, we will handle it.",
          'The problem will be solved.',
        ],
        answer: "I'll keep you updated on the progress and aim to have this resolved within the week.",
        tip: 'Give a specific timeframe + commit to communication. "I\'ll keep you updated" shows accountability.',
      },
    ],
  },

  {
    id: 9,
    titleEN: 'Small Talk & Networking',
    titleID: 'Percakapan Ringan & Networking',
    phrases: [
      { situation: 'Opening',          en: "I don't think we've been introduced — I'm [name].",             id: 'Saya rasa kita belum berkenalan — saya [nama].' },
      { situation: 'Asking role',      en: 'What is it that you do exactly?',                               id: 'Apa sebenarnya bidang pekerjaan Anda?' },
      { situation: 'Showing interest', en: "That sounds fascinating — how long have you been in that field?",id: 'Menarik sekali — sudah berapa lama Anda di bidang itu?' },
      { situation: 'Exchanging cards', en: "Here is my card. It was a pleasure speaking with you.",         id: 'Ini kartu saya. Senang berbincang dengan Anda.' },
      { situation: 'Follow-up',        en: "I'll connect with you on LinkedIn after today.",                id: 'Saya akan terhubung dengan Anda di LinkedIn setelah ini.' },
    ],
    exercises: [
      {
        q: 'Best way to introduce yourself at a networking event:',
        options: [
          "I don't think we've been introduced — I'm Sarah from ABC Corp.",
          'Hi, who are you?',
          'I want to introduce myself to you.',
          "My name is Sarah, nice to know you.",
        ],
        answer: "I don't think we've been introduced — I'm Sarah from ABC Corp.",
        tip: '"I don\'t think we\'ve been introduced" is a smooth, confident opener. It\'s indirect — you\'re giving the other person a chance to introduce themselves too.',
      },
      {
        q: 'Which is a SAFE small talk topic in international business settings?',
        options: [
          'Recent travel or upcoming trips',
          'Salary and personal finances',
          'Political views or elections',
          'Health problems or family issues',
        ],
        answer: 'Recent travel or upcoming trips',
        tip: 'Safe topics: travel, local food, professional background, industry events, weather. Avoid: salary, religion, politics, health.',
      },
      {
        q: '"That sounds fascinating — how long have you been in that field?" — What does this show?',
        options: [
          'Genuine interest in the other person',
          "Doubt about the person's experience",
          'A request for their resume',
          'Polite disagreement',
        ],
        answer: 'Genuine interest in the other person',
        tip: 'Showing interest with follow-up questions is the key to great networking. People remember how you made them feel, not what you said.',
      },
      {
        q: 'Which topic should you AVOID in international business small talk?',
        options: [
          'Salary, religion, and politics',
          'Recent travel experiences',
          'Local food recommendations',
          "The other person's professional background",
        ],
        answer: 'Salary, religion, and politics',
        tip: 'These topics can create awkwardness or offend across cultures. Stick to professional and neutral topics until you know the person well.',
      },
      {
        q: 'Professional way to end a networking conversation:',
        options: [
          "Here is my card. It was a pleasure speaking with you — I'll connect with you on LinkedIn.",
          'Okay, I have to go now, bye.',
          'Nice talking. See you next time.',
          'I am done, thank you, goodbye.',
        ],
        answer: "Here is my card. It was a pleasure speaking with you — I'll connect with you on LinkedIn.",
        tip: 'Always close with a next step (card exchange, LinkedIn connection) and a warm compliment on the conversation.',
      },
    ],
  },

  {
    id: 10,
    titleEN: 'Common Grammar Errors for Bahasa Speakers',
    titleID: 'Kesalahan Grammar Umum bagi Penutur Bahasa',
    phrases: [
      { situation: 'Missing "to be"',    en: '✗ "The meeting tomorrow at 3pm."',               id: '✓ "The meeting is tomorrow at 3pm."' },
      { situation: 'Redundant subject',  en: '✗ "The manager he will attend."',                id: '✓ "The manager will attend."' },
      { situation: 'Direct translation', en: '✗ "I very happy to inform you..."',              id: '✓ "I am very pleased to inform you..."' },
      { situation: 'Wrong preposition',  en: '✗ "interested about this."',                     id: '✓ "interested in this."' },
      { situation: 'Question word order',en: '✗ "When he will arrive?"',                       id: '✓ "When will he arrive?"' },
      { situation: 'Wrong tense',        en: '✗ "I am working here since 2020."',              id: '✓ "I have been working here since 2020."' },
      { situation: 'Double negative',    en: '✗ "We don\'t have no stock left."',              id: '✓ "We don\'t have any stock left."' },
    ],
    exercises: [
      {
        q: '"I am working in this company since five years." — Correct version:',
        options: [
          'I have been working in this company for five years.',
          'I am working in this company for five years.',
          'I have worked in this company since five years.',
          'I was working in this company for five years.',
        ],
        answer: 'I have been working in this company for five years.',
        tip: 'Two errors: (1) Use Present Perfect Continuous "have been working" for an ongoing action. (2) Use "for" with a duration (5 years), "since" with a point in time (2020).',
      },
      {
        q: '"The director he has approve the budget yesterday." — Correct version:',
        options: [
          'The director approved the budget yesterday.',
          'The director has approve the budget yesterday.',
          'The director he approved the budget yesterday.',
          'The director had approved the budget.',
        ],
        answer: 'The director approved the budget yesterday.',
        tip: 'Three errors: (1) Remove redundant subject "he." (2) Use Simple Past "approved" (not "has approve"). (3) "Yesterday" signals Simple Past, not Present Perfect.',
      },
      {
        q: '"We very interested to invest in your product." — Correct version:',
        options: [
          'We are very interested in investing in your product.',
          'We very interested in investing in your product.',
          'We are very interested to invest in your product.',
          'We are very interested about investing in your product.',
        ],
        answer: 'We are very interested in investing in your product.',
        tip: 'Three errors: (1) Missing "are." (2) "Interested in" — not "interested to" or "interested about." (3) After preposition "in," use gerund "investing."',
      },
      {
        q: '"When the CEO will make the announcement?" — Correct version:',
        options: [
          'When will the CEO make the announcement?',
          'When the CEO will make announcement?',
          'When does the CEO will make the announcement?',
          'When is CEO making the announcement?',
        ],
        answer: 'When will the CEO make the announcement?',
        tip: 'In English questions with "when/where/what," invert subject and auxiliary: "When WILL the CEO make..." — not "When the CEO will make..."',
      },
      {
        q: '"We don\'t have no available slot for this week." — Correct version:',
        options: [
          "We don't have any available slots this week.",
          "We don't have no available slots this week.",
          "We haven't no available slots this week.",
          "We don't not have available slots this week.",
        ],
        answer: "We don't have any available slots this week.",
        tip: 'Double negatives are wrong in English. "Don\'t have no" = two negatives. Use "don\'t have any" instead. Also: "slots" (plural) and drop "for."',
      },
      {
        q: '"Please reply me as soon as possible about the meeting." — Correct version:',
        options: [
          'Please reply to me as soon as possible regarding the meeting.',
          'Please reply me as soon as possible regarding the meeting.',
          'Please do reply me fast about the meeting.',
          'Please respond me quickly about the meeting.',
        ],
        answer: 'Please reply to me as soon as possible regarding the meeting.',
        tip: '"Reply to me" — "reply" is intransitive, it needs "to." Also use "regarding" instead of "about" for a more professional tone.',
      },
    ],
  },
]
