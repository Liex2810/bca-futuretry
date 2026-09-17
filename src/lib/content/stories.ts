import type { Story } from "@/types";
import { moreStories } from "./more-stories";

// Catatan: cerita di bawah adalah CONTOH/ILUSTRATIF untuk demo.
// Sebelum produksi, ganti dengan cerita awardee asli + izin publikasi.
const primaryStories: Story[] = [
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
  {
    id: "st-nadia",
    name: "Nadia",
    program: "PPTI",
    role: "Software Engineering",
    title: "Kode pertama gue error terus—dan itu normal",
    excerpt: "Sebelum masuk, gue cuma pernah bikin HTML sederhana. Di sini gue belajar bahwa engineer bukan orang yang selalu tahu jawaban, tapi yang tahu cara mencari dan menguji solusi.",
    dayInLife: [
      { time: "08:00", activity: "Kelas algoritma dan struktur data" },
      { time: "10:30", activity: "Pair programming" },
      { time: "13:00", activity: "Sprint project aplikasi" },
      { time: "15:30", activity: "Code review bersama mentor" },
      { time: "19:00", activity: "Rapikan catatan dan latihan" },
    ],
    expectationVsReality: {
      expectation: "Programmer harus hafal semua syntax.",
      reality: "Yang lebih penting justru memecah masalah, membaca dokumentasi, dan menjelaskan keputusan kode.",
    },
    hardestPart: "Menerima komentar code review tanpa menganggapnya sebagai serangan pribadi.",
    favoriteMoment: "Pull request pertama gue disetujui setelah tiga kali revisi.",
  },
  {
    id: "st-farhan",
    name: "Farhan",
    program: "PPTI",
    role: "Cloud Engineering",
    title: "Dari rakit PC ke menjaga layanan tetap hidup",
    excerpt: "Awalnya gue mengira infrastruktur cuma soal server. Ternyata ada automation, observability, keamanan, dan banyak komunikasi saat terjadi gangguan.",
    dayInLife: [
      { time: "07:45", activity: "Cek dashboard dan status layanan" },
      { time: "09:00", activity: "Kelas jaringan dan cloud" },
      { time: "11:30", activity: "Lab deployment otomatis" },
      { time: "14:00", activity: "Simulasi incident handling" },
      { time: "16:30", activity: "Retrospective tim" },
    ],
    expectationVsReality: {
      expectation: "Kerjanya cuma setup server sekali lalu selesai.",
      reality: "Sistem terus berubah. Kami harus mengukur, mencegah, dan merespons masalah sebagai tim.",
    },
    hardestPart: "Tetap tenang saat simulasi insiden dan banyak informasi datang bersamaan.",
    favoriteMoment: "Automation kecil buatan gue memangkas proses deployment yang berulang.",
  },
  {
    id: "st-kevin",
    name: "Kevin",
    program: "PPTI",
    role: "Quality Engineering",
    title: "Menemukan bug bukan berarti mencari kesalahan orang",
    excerpt: "Gue dulu menganggap testing cuma tahap terakhir. Sekarang gue paham kualitas dimulai sejak requirement dibahas, bukan sesudah fitur selesai.",
    dayInLife: [
      { time: "08:00", activity: "Review acceptance criteria" },
      { time: "10:00", activity: "Kelas software testing" },
      { time: "13:00", activity: "Menulis automated test" },
      { time: "15:00", activity: "Bug triage bersama developer" },
      { time: "17:00", activity: "Dokumentasi hasil pengujian" },
    ],
    expectationVsReality: {
      expectation: "Tester hanya klik-klik aplikasi mencari error.",
      reality: "Kami merancang risiko, data uji, automation, dan komunikasi supaya masalah tidak lolos ke pengguna.",
    },
    hardestPart: "Menentukan prioritas ketika waktu pengujian terbatas.",
    favoriteMoment: "Skenario edge case gue mencegah bug penting masuk ke demo akhir.",
  },
  {
    id: "st-alya",
    name: "Alya",
    program: "PPBP",
    role: "Relationship Banking",
    title: "Belajar mendengar sebelum menawarkan solusi",
    excerpt: "Gue kira orang perbankan harus jago bicara. Ternyata skill paling penting yang gue latih justru mendengar dan bertanya dengan tepat.",
    dayInLife: [
      { time: "08:00", activity: "Briefing layanan dan produk" },
      { time: "09:30", activity: "Role play kebutuhan nasabah" },
      { time: "12:30", activity: "Kelas komunikasi bisnis" },
      { time: "14:30", activity: "Observasi layanan cabang" },
      { time: "17:00", activity: "Refleksi bersama mentor" },
    ],
    expectationVsReality: {
      expectation: "Yang penting bisa menjelaskan produk dengan lancar.",
      reality: "Rekomendasi baru berguna setelah kita memahami tujuan dan kekhawatiran nasabah.",
    },
    hardestPart: "Menghadapi percakapan sulit tanpa menjadi defensif.",
    favoriteMoment: "Berhasil menyederhanakan pilihan yang tadinya membuat nasabah bingung.",
  },
  {
    id: "st-dimas",
    name: "Dimas",
    program: "PPBP",
    role: "Banking Operations",
    title: "Ketelitian kecil punya dampak besar",
    excerpt: "Operasional terlihat tenang dari luar. Di baliknya ada proses, kontrol, dan koordinasi yang harus presisi agar layanan berjalan aman.",
    dayInLife: [
      { time: "07:30", activity: "Morning control checklist" },
      { time: "09:00", activity: "Kelas proses operasional" },
      { time: "11:00", activity: "Simulasi rekonsiliasi transaksi" },
      { time: "14:00", activity: "Analisis akar masalah" },
      { time: "16:00", activity: "Presentasi perbaikan proses" },
    ],
    expectationVsReality: {
      expectation: "Operasional berarti pekerjaan rutin yang sama setiap hari.",
      reality: "Rutinitasnya penting, tapi kami juga terus mencari cara membuat proses lebih cepat dan minim risiko.",
    },
    hardestPart: "Menjaga fokus ketika mengerjakan detail dalam jumlah besar.",
    favoriteMoment: "Usulan checklist tim gue mengurangi kesalahan pada simulasi berikutnya.",
  },
  {
    id: "st-citra",
    name: "Citra",
    program: "PPBP",
    role: "Digital Banking",
    title: "Bisnis dan teknologi ternyata tidak berjalan sendiri-sendiri",
    excerpt: "Gue memilih PPBP karena suka bisnis, lalu sadar hampir semua pengalaman nasabah sekarang bersentuhan dengan teknologi.",
    dayInLife: [
      { time: "08:00", activity: "Kelas model bisnis digital" },
      { time: "10:00", activity: "Analisis customer journey" },
      { time: "13:00", activity: "Diskusi kebutuhan produk" },
      { time: "15:00", activity: "Presentasi ide perbaikan" },
      { time: "17:30", activity: "Mentoring lintas program" },
    ],
    expectationVsReality: {
      expectation: "Tim bisnis cukup memberikan ide ke tim teknologi.",
      reality: "Keduanya harus memahami constraint satu sama lain dan menyepakati prioritas bersama.",
    },
    hardestPart: "Menerjemahkan kebutuhan pengguna menjadi requirement yang jelas.",
    favoriteMoment: "Ide kelompok kami berkembang menjadi prototype yang bisa diuji.",
  },
  {
    id: "st-raka",
    name: "Raka",
    program: "PPBP",
    role: "Risk Management",
    title: "Mengelola risiko bukan berarti takut mengambil keputusan",
    excerpt: "Gue dulu pikir risk selalu bilang tidak. Setelah belajar, tugasnya justru membantu tim mengambil keputusan dengan batas yang dipahami.",
    dayInLife: [
      { time: "08:00", activity: "Kelas dasar manajemen risiko" },
      { time: "10:30", activity: "Bedah studi kasus" },
      { time: "13:00", activity: "Simulasi risk assessment" },
      { time: "15:30", activity: "Debat mitigasi antarkelompok" },
      { time: "17:00", activity: "Review bersama praktisi" },
    ],
    expectationVsReality: {
      expectation: "Risk cuma memeriksa aturan dan menolak proposal.",
      reality: "Kami membandingkan dampak, peluang, kontrol, dan data agar pilihan bisa dipertanggungjawabkan.",
    },
    hardestPart: "Membuat rekomendasi ketika informasinya belum lengkap.",
    favoriteMoment: "Argumen mitigasi tim gue mengubah keputusan akhir studi kasus.",
  },
];

const illustrativeStories: Story[] = [...primaryStories, ...moreStories];

const loremShort = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const loremLong = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

// Identitas dan narasi belum bersumber. Pertahankan ID/program/role untuk
// filter dan alur demo, tetapi jangan tampilkan data seolah testimoni nyata.
export const stories: Story[] = illustrativeStories.map((story) => ({
  ...story,
  name: "(Nama Orang)",
  title: "(Judul Cerita)",
  excerpt: loremLong,
  dayInLife: story.dayInLife.map((item) => ({ ...item, activity: loremShort })),
  expectationVsReality: { expectation: loremShort, reality: loremLong },
  hardestPart: loremShort,
  favoriteMoment: loremLong,
}));

export const storyById = (id: string) => stories.find((s) => s.id === id);
