import type { Story } from "@/types";

// Catatan: cerita di bawah adalah CONTOH/ILUSTRATIF untuk demo.
// Sebelum produksi, ganti dengan cerita awardee asli + izin publikasi.
export const stories: Story[] = [
  {
    id: "st-reza",
    name: "Reza",
    program: "PPTI",
    role: "Cybersecurity",
    title: "What I wish I knew before joining PPTI",
    excerpt: "Gue kira bakal langsung disuruh jago coding. Ternyata yang paling sering dipakai itu cara mikir dan komunikasi.",
    dayInLife: [
      { time: "08:00", activity: "Kelas & diskusi modul" },
      { time: "10:00", activity: "Project tim — simulasi incident response" },
      { time: "13:00", activity: "Mentoring sama senior engineer" },
      { time: "15:00", activity: "Lab / praktik" },
      { time: "17:00", activity: "Organisasi & istirahat" },
    ],
    expectationVsReality: {
      expectation: "Isinya coding sendirian terus, kayak di film.",
      reality: "Kerja timnya kental. Gue lebih sering presentasi alasan teknis ke orang non-teknis daripada yang gue kira.",
    },
    hardestPart: "Tiga bulan pertama: nyesuaikan ritme belajar yang cepat dan padat.",
    favoriteMoment: "Pertama kali temuan gue di lab security dianggap serius sama mentor.",
  },
  {
    id: "st-maya",
    name: "Maya",
    program: "PPBP",
    role: "Investment / Finance",
    title: "Anak IPS yang takut angka, ternyata bisa",
    excerpt: "Gue masuk PPBP karena penasaran sama dunia investasi, bukan karena jago matematika. Ternyata yang dibutuhkan ketelitian dan keberanian bertanya.",
    dayInLife: [
      { time: "08:00", activity: "Kelas analisis laporan keuangan" },
      { time: "11:00", activity: "Studi kasus nasabah" },
      { time: "13:00", activity: "Role play presentasi rekomendasi" },
      { time: "15:00", activity: "OJT rotasi cabang" },
      { time: "18:00", activity: "Belajar mandiri / komunitas" },
    ],
    expectationVsReality: {
      expectation: "Bakal kering, full angka dan rumus.",
      reality: "Justru banyak manusia: negosiasi, presentasi, memahami kebutuhan orang. Angkanya alat, bukan tujuannya.",
    },
    hardestPart: "Awal OJT — harus bicara dengan nasabah yang lebih tua dan lebih pengalaman.",
    favoriteMoment: "Nasabah kecil yang gue bantu balik bilang terima kasih ke cabang.",
  },
  {
    id: "st-bagas",
    name: "Bagas",
    program: "PPTI",
    role: "UI/UX / Product Design",
    title: "Dari SMK Desain ke tim produk digital",
    excerpt: "SMK gue nggak ada hubungan sama UX. Yang nyangkut cuma mata kuliah gambar. Tapi rasa penasaran dan mau belajar lebih penting daripada latar belakang.",
    dayInLife: [
      { time: "08:00", activity: "Daily standup tim produk" },
      { time: "09:30", activity: "Riset pengguna / wawancara" },
      { time: "13:00", activity: "Design sprint" },
      { time: "15:30", activity: "Kelas modul" },
      { time: "19:00", activity: "Portfolio review sama mentor" },
    ],
    expectationVsReality: {
      expectation: "Desain = bikin tampilan cantik.",
      reality: "Desain = memutuskan. Tiap hari ada trade-off antara user, bisnis, dan teknis.",
    },
    hardestPart: "Belanya keputusan desain di depan engineer dan PM.",
    favoriteMoment: "Lihat fitur yang gue desain dipakai orang beneran — gue cek sendiri analytics-nya diam-diam.",
  },
  {
    id: "st-sinta",
    name: "Sinta",
    program: "PPBP",
    role: "Management / Business Strategy",
    title: "Kata orang, beasiswa ikatan dinas itu aman. Benarkah?",
    excerpt: "Aman iya, tapi bukan berarti gampang. Tuntutannya nyata, dan itu yang bikin gue berkembang lebih cepat dari teman-teman gue yang kuliah reguler.",
    dayInLife: [
      { time: "07:30", activity: "Morning briefing" },
      { time: "08:30", activity: "Kelas strategi & industri" },
      { time: "12:00", activity: "Diskusi kelompok" },
      { time: "14:00", activity: "Business case competition prep" },
      { time: "16:30", activity: "Coaching session" },
    ],
    expectationVsReality: {
      expectation: "Lulus langsung duduk enak di kantor.",
      reality: "Lulus langsung DIBERI tanggung jawab. Rotasi OJT gue udah tiga divisi dalam setahun.",
    },
    hardestPart: "Menjaga konsistensi — ritmenya maraton, bukan sprint.",
    favoriteMoment: "Rekomendasi strategi gue dipakai beneran di rapat divisi.",
  },
  {
    id: "st-yoga",
    name: "Yoga",
    program: "PPTI",
    role: "Data Engineering",
    title: "Gue bukan jenius. Gue cuma konsisten.",
    excerpt: "Banyak yang ngerasa harus jago matematika dulu buat masuk PPTI data. Jujur, gue biasa aja. Yang bikin beda: gue nggak pernah bolos latihan.",
    dayInLife: [
      { time: "08:00", activity: "Kelas database & pipeline" },
      { time: "10:30", activity: "Hands-on lab" },
      { time: "13:00", activity: "Project data nyata (anonymized)" },
      { time: "16:00", activity: "Peer learning" },
      { time: "20:00", activity: "Side project pribadi" },
    ],
    expectationVsReality: {
      expectation: "Kuliahnya bakal kayak kursus online.",
      reality: "Lebih kayak kerjaan beneran yang ada dosennya. Deadline, review, dan konsekuensi itu nyata.",
    },
    hardestPart: "Minggu-minggu di mana semua deadline tumpuk jadi satu.",
    favoriteMoment: "Dashboard yang gue bangun dipakai buat keputusan manajemen puncak.",
  },
];

export const storyById = (id: string) => stories.find((s) => s.id === id);
