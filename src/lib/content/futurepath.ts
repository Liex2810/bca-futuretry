import type { EligibilityRule, FaqEntry } from "@/types";

// ════════════════════════════════════════════════════════════════
//  FUTUREPATH — Learn / Ask / Check / Connect / Act
//  ⚠️ Semua teks di bawah adalah CONTOH untuk demo. Angka & syarat
//     resmi WAJIB diganti dengan sumber resmi BCA/PPBP/PPTI sebelum
//     produksi. Setiap entri punya kolom `source` untuk sitasi.
// ════════════════════════════════════════════════════════════════

export const programInfo = {
  PPBP: {
    full: "Program Pendidikan Bebas Biaya Polytechnic / Business path",
    tag: "Business & Banking",
    blurb:
      "Jalur untuk kamu yang tertarik dunia bisnis, keuangan, investasi, dan strategi. Lulus siap kerja di bidang banking & business BCA.",
    learn: [
      { title: "Bidang yang dipelajari", body: "Investasi, keuangan, akuntansi, manajemen, strategi bisnis, customer & banking.", source: "Belum diverifikasi — cek kanal resmi BCA" },
      { title: "Kehidupan program", body: "Kelas + project + OJT rotasi divisi. Banyak studi kasus nasabah nyata.", source: "Belum diverifikasi — cek kanal resmi BCA" },
      { title: "Setelah lulus", body: "Penempatan di area business & banking BCA.", source: "Belum diverifikasi — cek kanal resmi BCA" },
    ],
  },
  PPTI: {
    full: "Program Pendidikan Teknologi Informasi",
    tag: "Technology & Digital",
    blurb:
      "Jalur untuk kamu yang suka teknologi: software, data, UI/UX, jaringan, dan keamanan siber. Lulus siap kerja di bidang teknologi BCA.",
    learn: [
      { title: "Bidang yang dipelajari", body: "Application/web development, UI/UX, data, network, cyber security, systems.", source: "Belum diverifikasi — cek kanal resmi BCA" },
      { title: "Kehidupan program", body: "Kelas + lab + project nyata. Kerja tim dan presentasi teknis lebih sering dari yang kamu kira.", source: "Belum diverifikasi — cek kanal resmi BCA" },
      { title: "Setelah lulus", body: "Penempatan di area teknologi & digital BCA.", source: "Belum diverifikasi — cek kanal resmi BCA" },
    ],
  },
};

// Deterministic eligibility rules (BUKAN prediksi diterima).
export const eligibilityRules: EligibilityRule[] = [
  { id: "el-1", program: "PPBP", requirement: "SMA/SMK kelas XII atau lulusan maksimal 1 tahun terakhir", explanation: "Persyaratan pendidikan dasar untuk mendaftar.", source: "Belum diverifikasi — cek kanal resmi BCA" },
  { id: "el-2", program: "PPBP", requirement: "Sehat jasmani dan rohani", explanation: "Program menuntut ritme belajar & OJT padat.", source: "Belum diverifikasi — cek kanal resmi BCA" },
  { id: "el-3", program: "PPBP", requirement: "Bersedia ikatan dinas setelah lulus", explanation: "Beasiswa terikat komitmen kerja.", source: "Belum diverifikasi — cek kanal resmi BCA" },
  { id: "el-4", program: "PPTI", requirement: "SMA/SMK (IPA/TKJ/RPL atau setara) kelas XII atau lulusan maks 1 tahun", explanation: "Beberapa SMK teknologi relevan; bukan hanya jalur IPA.", source: "Belum diverifikasi — cek kanal resmi BCA" },
  { id: "el-5", program: "PPTI", requirement: "Menunjukkan logika & ketertarikan teknologi (bukan nilai matematika sempurna)", explanation: "Yang dicari cara berpikir, bukan sekadar angka rapor.", source: "Belum diverifikasi — cek kanal resmi BCA" },
  { id: "el-6", program: "PPTI", requirement: "Bersedia ikatan dinas setelah lulus", explanation: "Sama seperti PPBP, ada komitmen kerja.", source: "Belum diverifikasi — cek kanal resmi BCA" },
];

export const faqs: FaqEntry[] = [
  { id: "f1", question: "Apa bedanya PPBP dan PPTI?", answer: "PPBP fokus ke bisnis & banking (investasi, keuangan, strategi, customer). PPTI fokus ke teknologi & digital (software, data, UI/UX, security). Keduanya jalur beasiswa ikatan dinas BCA dengan pendidikan gratis dan penempatan kerja.", source: "Belum diverifikasi — cek kanal resmi BCA", tags: ["umum", "ppbp", "ppti"] },
  { id: "f2", question: "PPTI belajar apa saja?", answer: "Pengembangan aplikasi & web, UI/UX, data engineering, jaringan, dan keamanan siber. Belajarnya campuran kelas, lab, dan project nyata.", source: "Belum diverifikasi — cek kanal resmi BCA", tags: ["ppti"] },
  { id: "f3", question: "Aku dari IPS, bisa PPTI nggak?", answer: "Latar belakang IPS bukan otomatis menutup PPTI. Yang dilihat ketertarikan & kemampuan berpikir logis terhadap teknologi. Banyak jalur masuk yang menghargai portofolio rasa ingin tahu, bukan cuma jurusan asal. Cek persyaratan resmi terbaru.", source: "Belum diverifikasi — cek kanal resmi BCA", tags: ["ppti", "eligibility"] },
  { id: "f4", question: "Kehidupan di BLI seperti apa?", answer: "BLI (Bina Lingkungan/Asrama) adalah bagian dari program: tinggal bersama peserta lain, ritme kelas + kegiatan, dan komunitas. Suasananya seperti kampus + asrama kerja. Detail fasilitas sebaiknya cek sumber resmi.", source: "Belum diverifikasi — cek kanal resmi BCA", tags: ["kehidupan"] },
  { id: "f5", question: "Apakah FutureTry menentukan aku diterima?", answer: "Tidak. FutureTry hanya tempat mencoba & refleksi. Tidak ada skor, tidak ada prediksi diterima. Keputusan penerimaan sepenuhnya lewat proses resmi BCA.", source: "Kebijakan FutureTry", tags: ["umum", "privasi"] },
  { id: "f6", question: "Ada biaya ikut FutureTry?", answer: "Gratis, dan tidak perlu login untuk mencoba. Progresmu disimpan di perangkatmu sendiri.", source: "Kebijakan FutureTry", tags: ["umum", "privasi"] },
];

// Knowledge base utk chatbot (mock retrieval). Tiap entri punya sumber.
export const knowledgeBase = [
  { topic: "ppbp vs ppti", answer: faqs[0].answer, source: faqs[0].source },
  { topic: "ppti materi", answer: faqs[1].answer, source: faqs[1].source },
  { topic: "ips ppti", answer: faqs[2].answer, source: faqs[2].source },
  { topic: "asrama bli", answer: faqs[3].answer, source: faqs[3].source },
  { topic: "penerimaan", answer: faqs[4].answer, source: faqs[4].source },
  { topic: "biaya", answer: faqs[5].answer, source: faqs[5].source },
];
