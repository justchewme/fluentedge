// ─── READING BANK ─────────────────────────────────────────────────────────────
// 6 passages, bilingual, Batam business context, 150-200 words each

export const READING_BANK = [
  {
    id: 'r1',
    week: 1,
    titleEN: 'A Typical Day at the Office',
    titleID: 'Hari Biasa di Kantor',
    textEN: `Maria arrives at the Batam industrial park at 7:45 AM every day — fifteen minutes before the official start time. She works as an operations coordinator at a joint-venture electronics company. Her morning begins with a review of overnight emails from the Singapore headquarters.

At 9:00 AM, her team holds a daily stand-up meeting. Each person gives a quick update: what they completed yesterday, what they plan to do today, and any problems they need help with. The meeting rarely lasts more than fifteen minutes.

After the meeting, Maria responds to supplier enquiries, updates the production tracking sheet, and prepares reports for the afternoon management review. She communicates in both English and Indonesian throughout the day, depending on who she is speaking with.

At 3:00 PM, she joins a video call with the Singapore procurement team to discuss the following week's material requirements. At 5:30 PM, she sends a short end-of-day summary to her manager before leaving the office.

Maria believes that clear communication — in any language — is the most important skill in her role.`,
    textID: `Maria tiba di kawasan industri Batam setiap hari pukul 7.45 pagi — lima belas menit sebelum waktu mulai resmi. Dia bekerja sebagai koordinator operasional di perusahaan elektronik joint venture. Paginya dimulai dengan meninjau email semalam dari kantor pusat Singapura.

Pukul 9.00 pagi, timnya mengadakan rapat harian singkat. Setiap orang memberikan pembaruan cepat: apa yang mereka selesaikan kemarin, apa yang mereka rencanakan hari ini, dan masalah apa yang membutuhkan bantuan. Rapat jarang berlangsung lebih dari lima belas menit.

Setelah rapat, Maria merespons pertanyaan pemasok, memperbarui lembar pelacakan produksi, dan menyiapkan laporan untuk tinjauan manajemen sore. Dia berkomunikasi dalam bahasa Inggris dan Indonesia sepanjang hari, tergantung dengan siapa dia berbicara.

Pukul 3.00 sore, dia bergabung dalam video call dengan tim pengadaan Singapura untuk mendiskusikan kebutuhan material minggu berikutnya. Pukul 5.30 sore, dia mengirim ringkasan singkat akhir hari kepada manajernya sebelum meninggalkan kantor.

Maria percaya bahwa komunikasi yang jelas — dalam bahasa apa pun — adalah keterampilan terpenting dalam perannya.`,
    questionsEN: [
      {
        q: 'What time does Maria arrive at work?',
        options: ['7:30 AM', '7:45 AM', '8:00 AM', '9:00 AM'],
        ans: 1,
      },
      {
        q: 'What does each person share during the daily stand-up meeting?',
        options: [
          'Only their problems',
          'Their completed work, daily plan, and any problems',
          'Only their plan for the day',
          'A full written report',
        ],
        ans: 1,
      },
      {
        q: 'At what time does Maria join the video call with Singapore?',
        options: ['9:00 AM', '12:00 PM', '3:00 PM', '5:30 PM'],
        ans: 2,
      },
      {
        q: 'According to Maria, what is the most important skill in her role?',
        options: ['Technical knowledge', 'Speed', 'Clear communication', 'Being bilingual only'],
        ans: 2,
      },
    ],
  },
  {
    id: 'r2',
    week: 2,
    titleEN: 'Writing a Professional Email',
    titleID: 'Menulis Email Profesional',
    textEN: `Email is one of the most common tools in business communication, especially between companies in Batam and their partners in Singapore. A well-written email creates a professional impression and gets faster responses.

Every professional email should have a clear structure. Start with a polite greeting, such as "Dear Mr. Lim" or "Hi Sarah,". Then write a short opening sentence that explains the purpose of your email — for example, "I am writing to follow up on our meeting last Tuesday."

Keep your body paragraphs short and focused. Use one paragraph per topic. Avoid writing very long emails — if an issue is complex, consider a phone call or video meeting instead.

Close your email with a polite call to action: "Please let me know if you have any questions" or "I look forward to your response." End with a professional sign-off such as "Best regards" or "Kind regards," followed by your full name, job title, and contact number.

Remember: in professional English, it is important to sound confident but polite. Avoid informal phrases like "Hey" or "ASAP" unless you have a very close working relationship with the recipient.`,
    textID: `Email adalah salah satu alat paling umum dalam komunikasi bisnis, terutama antara perusahaan di Batam dan mitra mereka di Singapura. Email yang ditulis dengan baik menciptakan kesan profesional dan mendapatkan respons lebih cepat.

Setiap email profesional harus memiliki struktur yang jelas. Mulai dengan sapaan sopan, seperti "Dear Mr. Lim" atau "Hi Sarah,". Kemudian tulis kalimat pembuka singkat yang menjelaskan tujuan email Anda — misalnya, "I am writing to follow up on our meeting last Tuesday."

Jaga paragraf utama tetap singkat dan terfokus. Gunakan satu paragraf per topik. Hindari menulis email yang sangat panjang — jika masalahnya kompleks, pertimbangkan panggilan telepon atau rapat video.

Tutup email Anda dengan ajakan bertindak yang sopan: "Please let me know if you have any questions" atau "I look forward to your response." Akhiri dengan penutup profesional seperti "Best regards" atau "Kind regards," diikuti nama lengkap, jabatan, dan nomor kontak Anda.

Ingat: dalam bahasa Inggris profesional, penting untuk terdengar percaya diri namun sopan. Hindari frasa informal seperti "Hey" atau "ASAP" kecuali Anda memiliki hubungan kerja yang sangat dekat dengan penerima.`,
    questionsEN: [
      {
        q: 'What should you write in the opening sentence of a professional email?',
        options: [
          'Your name and job title',
          'The purpose of your email',
          'A long background story',
          'A casual greeting',
        ],
        ans: 1,
      },
      {
        q: 'How many topics should each body paragraph cover?',
        options: ['As many as possible', 'Two to three', 'One', 'None — keep it in the subject line'],
        ans: 2,
      },
      {
        q: 'Which is an appropriate email sign-off according to the passage?',
        options: ['"See ya"', '"ASAP"', '"Best regards"', '"Hey"'],
        ans: 2,
      },
      {
        q: 'When should you consider a phone call or video meeting instead of a long email?',
        options: [
          'When you are too busy to write',
          'When the issue is complex',
          'When the recipient is in Singapore',
          'When you do not know the person',
        ],
        ans: 1,
      },
    ],
  },
  {
    id: 'r3',
    week: 7,
    titleEN: 'A Negotiation Meeting',
    titleID: 'Rapat Negosiasi',
    textEN: `The conference room on the fourth floor of the Batam Trade Centre was full. On one side of the table sat the procurement team from a Singapore electronics company. On the other side sat the management team from a Batam component manufacturer.

The Singapore team had requested a 12% reduction in the price per unit, citing increased competition from Vietnamese suppliers. The Batam team listened carefully and then responded professionally.

"We understand your concerns about cost," said the Batam operations director. "However, our quality certification and our 48-hour delivery commitment to your Singapore warehouse are significant advantages that Vietnamese suppliers cannot currently match."

The two teams discussed the issue for forty minutes. In the end, they agreed on a 5% price reduction in exchange for a two-year exclusive supply agreement. Both sides left the meeting satisfied.

The key to successful negotiation, the Batam director later told his team, is to listen first, acknowledge the other side's position, and then present your value clearly and without emotion. "In English or any language," he said, "respect and preparation win every negotiation."`,
    textID: `Ruang konferensi di lantai empat Batam Trade Centre penuh. Di satu sisi meja duduk tim pengadaan dari perusahaan elektronik Singapura. Di sisi lain duduk tim manajemen dari produsen komponen Batam.

Tim Singapura meminta pengurangan harga per unit sebesar 12%, dengan alasan persaingan yang meningkat dari pemasok Vietnam. Tim Batam mendengarkan dengan seksama dan kemudian merespons secara profesional.

"Kami memahami kekhawatiran Anda tentang biaya," kata direktur operasional Batam. "Namun, sertifikasi kualitas kami dan komitmen pengiriman 48 jam ke gudang Singapura Anda adalah keunggulan signifikan yang saat ini tidak dapat ditandingi pemasok Vietnam."

Kedua tim mendiskusikan masalah ini selama empat puluh menit. Akhirnya, mereka menyepakati pengurangan harga 5% sebagai ganti perjanjian pasokan eksklusif dua tahun. Kedua belah pihak meninggalkan rapat dengan puas.

Kunci negosiasi yang sukses, kata direktur Batam kemudian kepada timnya, adalah mendengarkan terlebih dahulu, mengakui posisi pihak lain, dan kemudian menyajikan nilai Anda dengan jelas dan tanpa emosi. "Dalam bahasa Inggris atau bahasa apa pun," katanya, "rasa hormat dan persiapan memenangkan setiap negosiasi."`,
    questionsEN: [
      {
        q: 'What did the Singapore team request at the start of the meeting?',
        options: [
          'A longer delivery window',
          'A 12% price reduction',
          'A new supply contract',
          'A factory tour',
        ],
        ans: 1,
      },
      {
        q: 'What advantages did the Batam team highlight?',
        options: [
          'Lower wages and large factory',
          'Quality certification and 48-hour delivery',
          'Government subsidies and free shipping',
          'Cheaper materials from Vietnam',
        ],
        ans: 1,
      },
      {
        q: 'What was the final agreement?',
        options: [
          '12% price reduction, one-year contract',
          '5% price reduction, two-year exclusive agreement',
          '10% price reduction, no contract',
          'No change in price, shorter delivery time',
        ],
        ans: 1,
      },
      {
        q: 'According to the Batam director, what wins every negotiation?',
        options: [
          'Offering the lowest price',
          'Talking the most',
          'Respect and preparation',
          'Bringing a large team',
        ],
        ans: 2,
      },
    ],
  },
  {
    id: 'r4',
    week: 6,
    titleEN: 'The Team Presentation',
    titleID: 'Presentasi Tim',
    textEN: `Reza had been preparing for three weeks. As the project manager of the new logistics hub proposal, he was responsible for presenting to the board of directors — which included two executives from the Singapore parent company.

He started with a strong opening: "Good afternoon. Today, I will present our proposal for a new regional logistics hub in Batam that will reduce delivery times to Singapore by forty percent and cut operational costs by fifteen percent over three years."

He spoke clearly, used a simple slide deck with visual data, and paused to invite questions after each section. When one Singapore director asked about the infrastructure risk, Reza calmly walked through the risk mitigation plan his team had prepared.

At the end, he closed with a clear call to action: "We are requesting approval to proceed to Phase One planning, with an initial budget of SGD 200,000. We are confident this investment will deliver measurable returns within 18 months."

The board approved the proposal. After the meeting, his manager pulled him aside and said, "Your English was excellent, but more than that — your preparation was outstanding. That is what convinced them."`,
    textID: `Reza telah mempersiapkan diri selama tiga minggu. Sebagai manajer proyek untuk proposal hub logistik baru, dia bertanggung jawab untuk mempresentasikan kepada dewan direksi — yang mencakup dua eksekutif dari perusahaan induk Singapura.

Dia memulai dengan pembukaan yang kuat: "Good afternoon. Today, I will present our proposal for a new regional logistics hub in Batam that will reduce delivery times to Singapore by forty percent and cut operational costs by fifteen percent over three years."

Dia berbicara dengan jelas, menggunakan slide deck sederhana dengan data visual, dan berhenti sejenak untuk mengundang pertanyaan setelah setiap bagian. Ketika seorang direktur Singapura bertanya tentang risiko infrastruktur, Reza dengan tenang menjelaskan rencana mitigasi risiko yang telah disiapkan timnya.

Di akhir, dia menutup dengan ajakan bertindak yang jelas: "We are requesting approval to proceed to Phase One planning, with an initial budget of SGD 200,000. We are confident this investment will deliver measurable returns within 18 months."

Dewan menyetujui proposal tersebut. Setelah rapat, manajernya menariknya ke samping dan berkata, "Bahasa Inggrismu sangat baik, tetapi lebih dari itu — persiapanmu luar biasa. Itulah yang meyakinkan mereka."`,
    questionsEN: [
      {
        q: 'How long had Reza been preparing his presentation?',
        options: ['One week', 'Two weeks', 'Three weeks', 'One month'],
        ans: 2,
      },
      {
        q: 'What percentage reduction in delivery times did the proposal promise?',
        options: ['15%', '25%', '40%', '50%'],
        ans: 2,
      },
      {
        q: 'How did Reza handle the question about infrastructure risk?',
        options: [
          'He said he would answer later',
          'He calmly walked through the risk mitigation plan',
          'He asked another team member to answer',
          'He admitted the team had not prepared for that',
        ],
        ans: 1,
      },
      {
        q: 'What did Reza\'s manager say convinced the board?',
        options: [
          'His English accent',
          'The large budget requested',
          'His preparation',
          'The number of slides',
        ],
        ans: 2,
      },
    ],
  },
  {
    id: 'r5',
    week: 9,
    titleEN: 'Handling a Customer Service Call',
    titleID: 'Menangani Panggilan Layanan Pelanggan',
    textEN: `"Good afternoon, thank you for calling Bintang Components. This is Sari speaking. How may I help you today?"

The caller, a purchasing manager from a Singapore electronics firm, explained that three pallets from last week's delivery were missing from the manifest. His tone was firm but professional.

Sari listened without interrupting. When the caller finished, she said, "Thank you for bringing this to my attention, Mr. Chen. I sincerely apologise for the inconvenience. Let me pull up your account and verify the shipment details right away."

She put the call on a brief hold, confirmed the discrepancy in the system, and returned within two minutes. "Mr. Chen, I can confirm that the three pallets were dispatched on Tuesday. It appears there was an error in the manifest documentation. I will escalate this to our logistics team immediately and provide you with a full update within four hours."

Mr. Chen appreciated the quick response and professional tone. "That is fine, Sari. I look forward to your update."

After the call, Sari filed a formal complaint report and cc'd her manager. The issue was resolved the same day. She later reflected that staying calm, apologising sincerely, and acting quickly are the three pillars of excellent customer service.`,
    textID: `"Good afternoon, thank you for calling Bintang Components. This is Sari speaking. How may I help you today?"

Penelepon, seorang manajer pembelian dari perusahaan elektronik Singapura, menjelaskan bahwa tiga palet dari pengiriman minggu lalu hilang dari manifest. Nada suaranya tegas namun profesional.

Sari mendengarkan tanpa memotong. Ketika penelepon selesai, dia berkata, "Terima kasih telah memberitahu saya, Mr. Chen. Saya benar-benar minta maaf atas ketidaknyamanannya. Izinkan saya membuka akun Anda dan memverifikasi detail pengiriman sekarang juga."

Dia menempatkan panggilan pada tahan singkat, mengonfirmasi perbedaan dalam sistem, dan kembali dalam dua menit. "Mr. Chen, saya dapat mengonfirmasi bahwa tiga palet tersebut dikirim pada hari Selasa. Tampaknya ada kesalahan dalam dokumentasi manifest. Saya akan segera mengeskalasi ini ke tim logistik kami dan memberikan pembaruan lengkap dalam empat jam."

Mr. Chen menghargai respons cepat dan nada profesional. "That is fine, Sari. I look forward to your update."

Setelah panggilan, Sari mengajukan laporan keluhan resmi dan cc'd manajernya. Masalah diselesaikan pada hari yang sama. Dia kemudian merefleksikan bahwa tetap tenang, meminta maaf dengan tulus, dan bertindak cepat adalah tiga pilar layanan pelanggan yang sangat baik.`,
    questionsEN: [
      {
        q: 'What was the customer\'s problem?',
        options: [
          'Wrong items were delivered',
          'Three pallets were missing from the manifest',
          'The invoice was incorrect',
          'The delivery was late by a week',
        ],
        ans: 1,
      },
      {
        q: 'What did Sari do before responding to the customer\'s complaint?',
        options: [
          'She transferred the call to her manager',
          'She argued with the customer',
          'She listened without interrupting',
          'She asked the customer to call back',
        ],
        ans: 2,
      },
      {
        q: 'How long did Sari tell Mr. Chen to wait for a full update?',
        options: ['One hour', 'Two hours', 'Four hours', 'The next day'],
        ans: 2,
      },
      {
        q: 'According to Sari, what are the three pillars of excellent customer service?',
        options: [
          'Speed, cost, and quality',
          'Staying calm, apologising sincerely, and acting quickly',
          'English fluency, politeness, and documents',
          'Listening, escalating, and reporting',
        ],
        ans: 1,
      },
    ],
  },
  {
    id: 'r6',
    week: 19,
    titleEN: 'Building an International Partnership',
    titleID: 'Membangun Kemitraan Internasional',
    textEN: `When Dharma Precision Engineering first approached a German industrial components firm at the Singapore Airshow trade exhibition, they did not expect much. The German company had never worked with an Indonesian manufacturer before.

But the Batam-based firm had done their homework. Their business development manager, Hendra, had researched the German company's product requirements, their quality standards, and their existing supply chain challenges. He approached the booth with a confident handshake, a bilingual company profile, and a clear value proposition.

"We are not just offering lower cost," Hendra told the German procurement director. "We offer ISO-certified quality, a strategic location between Singapore and Indonesia, and a management team that understands both Asian and European business culture."

The conversation lasted ninety minutes. Over the following three months, both teams exchanged factory visits, technical audits, and detailed proposals. Trust was built slowly and carefully — exactly the way it should be in international business.

By Q2 of the following year, Dharma Precision had signed a three-year supply agreement with the German firm, their largest international contract to date. Hendra later attributed the success to one thing: preparation. "Know your partner before you meet them," he said. "In international business, preparation is your best translator."`,
    textID: `Ketika Dharma Precision Engineering pertama kali mendekati perusahaan komponen industri Jerman di pameran dagang Singapore Airshow, mereka tidak mengharapkan banyak. Perusahaan Jerman tersebut belum pernah bekerja sama dengan produsen Indonesia sebelumnya.

Namun perusahaan berbasis Batam itu telah melakukan pekerjaan rumah mereka. Manajer pengembangan bisnis mereka, Hendra, telah meneliti persyaratan produk perusahaan Jerman, standar kualitas mereka, dan tantangan rantai pasokan mereka yang ada. Dia mendekati booth dengan jabat tangan yang percaya diri, profil perusahaan bilingual, dan proposisi nilai yang jelas.

"Kami tidak hanya menawarkan biaya lebih rendah," kata Hendra kepada direktur pengadaan Jerman. "Kami menawarkan kualitas bersertifikat ISO, lokasi strategis antara Singapura dan Indonesia, dan tim manajemen yang memahami budaya bisnis Asia dan Eropa."

Percakapan berlangsung sembilan puluh menit. Selama tiga bulan berikutnya, kedua tim bertukar kunjungan pabrik, audit teknis, dan proposal terperinci. Kepercayaan dibangun perlahan dan hati-hati — persis seperti yang seharusnya dalam bisnis internasional.

Pada Q2 tahun berikutnya, Dharma Precision telah menandatangani perjanjian pasokan tiga tahun dengan perusahaan Jerman tersebut, kontrak internasional terbesar mereka hingga saat ini. Hendra kemudian mengaitkan keberhasilan tersebut dengan satu hal: persiapan. "Kenali mitra Anda sebelum bertemu," katanya. "Dalam bisnis internasional, persiapan adalah penerjemah terbaik Anda."`,
    questionsEN: [
      {
        q: 'Where did Hendra first meet the German procurement director?',
        options: [
          'At the Batam factory',
          'At the Singapore Airshow trade exhibition',
          'At a conference in Germany',
          'On a video call',
        ],
        ans: 1,
      },
      {
        q: 'What three things did Hendra research before the meeting?',
        options: [
          'Company size, profits, and employees',
          'Product requirements, quality standards, and supply chain challenges',
          'Location, pricing, and delivery history',
          'Language, culture, and food preferences',
        ],
        ans: 1,
      },
      {
        q: 'What did Hendra say differentiated Dharma Precision beyond lower cost?',
        options: [
          'Faster delivery and free samples',
          'ISO certification, strategic location, and cultural understanding',
          'Government subsidies and FTZ tax benefits only',
          'Experienced German-speaking staff',
        ],
        ans: 1,
      },
      {
        q: 'What did Hendra credit as the key to their success?',
        options: ['English fluency', 'Lower pricing', 'Preparation', 'The company\'s size'],
        ans: 2,
      },
    ],
  },
]
