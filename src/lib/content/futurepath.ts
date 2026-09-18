import type { EligibilityRule, FaqEntry } from "@/types";

const loremShort = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const loremLong = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const placeholderSource = "(Sumber Resmi)";

// Data program eksternal belum diverifikasi. Judul/struktur dipertahankan
// sebagai rancangan UI, sedangkan detailnya sengaja memakai placeholder.
export const programInfo = {
  PPBP: {
    full: "(Nama Lengkap Program)",
    tag: "Business & Banking",
    blurb: loremLong,
    learn: [
      { title: "Bidang yang dipelajari", body: loremLong, source: placeholderSource },
      { title: "Kehidupan program", body: loremLong, source: placeholderSource },
      { title: "Setelah lulus", body: loremLong, source: placeholderSource },
    ],
  },
  PPTI: {
    full: "(Nama Lengkap Program)",
    tag: "Technology & Digital",
    blurb: loremLong,
    learn: [
      { title: "Bidang yang dipelajari", body: loremLong, source: placeholderSource },
      { title: "Kehidupan program", body: loremLong, source: placeholderSource },
      { title: "Setelah lulus", body: loremLong, source: placeholderSource },
    ],
  },
};

export const eligibilityRules: EligibilityRule[] = [
  { id: "el-1", program: "PPBP", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
  { id: "el-2", program: "PPBP", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
  { id: "el-3", program: "PPBP", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
  { id: "el-4", program: "PPTI", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
  { id: "el-5", program: "PPTI", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
  { id: "el-6", program: "PPTI", requirement: "(Syarat Program)", explanation: loremShort, source: placeholderSource },
];

export const faqs: FaqEntry[] = [
  {
    id: "f1",
    question: "Apa bedanya PPBP dan PPTI?",
    answer: "PPBP (Program Pendidikan Bisnis dan Perbankan) fokus pada operasional bisnis, analisa keuangan, kredit, dan layanan perbankan. Sedangkan PPTI (Program Pendidikan Teknik Informatika) fokus pada software engineering, arsitektur IT, sistem perbankan digital, dan data. Keduanya adalah beasiswa non-gelar 2,5 tahun di BCA Learning Institute (BLI) Sentul dengan uang saku, asrama, dan penempatan kerja di BCA.",
    source: "BCA Career (karir.bca.co.id)",
    tags: ["umum", "ppbp", "ppti"]
  },
  {
    id: "f2",
    question: "PPTI belajar apa saja?",
    answer: "Peserta PPTI mempelajari full-stack application development, database, cloud infrastructure, keamanan informasi perbankan, hingga AI & data engineering. Pembelajaran memadukan kelas intensif, lab coding, dan project nyata bersama praktisi IT BCA.",
    source: "BCA Career (karir.bca.co.id)",
    tags: ["ppti", "kurikulum"]
  },
  {
    id: "f3",
    question: "Aku dari IPS, bisa PPTI nggak?",
    answer: "Persyaratan resmi PPTI umumnya ditujukan bagi lulusan SMA jurusan IPA atau SMK bidang Teknologi/Komputer. Bagi kamu dari jurusan IPS yang tertarik dengan dunia perbankan dan transformasi digital, program PPBP sangat terbuka lebar dan memiliki prospek karir yang luas di BCA.",
    source: "BCA Career (karir.bca.co.id)",
    tags: ["ppti", "eligibility", "ips"]
  },
  {
    id: "f4",
    question: "Kehidupan di BLI seperti apa?",
    answer: "Kehidupan di BCA Learning Institute (BLI) Sentul mengusung sistem asrama dengan fasilitas lengkap (kamar, konsumsi, sarana olahraga, lab komputer). Selain materi teknis yang padat, peserta juga ditempa dalam kepemimpinan, soft skills, kedisiplinan, dan kekeluargaan yang erat.",
    source: "BCA Learning Institute",
    tags: ["kehidupan", "asrama", "bli"]
  },
  {
    id: "f5",
    question: "Apakah FutureTry menentukan aku diterima?",
    answer: "Tidak sama sekali. FutureTry adalah platform simulasi edukatif untuk berefleksi dan mengenal peran perbankan/IT. Tidak ada skor, ranking, atau prediksi kelulusan resmi. Pendaftaran resmi seleksi BCA hanya melalui karir.bca.co.id.",
    source: "Kebijakan FutureTry",
    tags: ["umum", "privasi", "kebijakan"]
  },
  {
    id: "f6",
    question: "Bagaimana progres demo disimpan?",
    answer: "Progres simulasi kamu tersimpan secara lokal di browser perangkat ini (localStorage), tanpa mengumpulkan data pribadi atau memungut biaya apa pun.",
    source: "Implementasi FutureTry",
    tags: ["umum", "privasi"]
  },
];

export const knowledgeBase = [
  { topic: "ppbp vs ppti beda perbedaan", answer: faqs[0].answer, source: faqs[0].source },
  { topic: "ppti materi kurikulum belajar", answer: faqs[1].answer, source: faqs[1].source },
  { topic: "ips ppti syarat jurusan asal", answer: faqs[2].answer, source: faqs[2].source },
  { topic: "asrama bli kehidupan sentul fasilitas", answer: faqs[3].answer, source: faqs[3].source },
  { topic: "penerimaan seleksi skor peluang lolos", answer: faqs[4].answer, source: faqs[4].source },
  { topic: "progres penyimpanan data privasi", answer: faqs[5].answer, source: faqs[5].source },
  { topic: "fasilitas beasiswa tunjangan uang saku", answer: "Peserta PPBP & PPTI mendapatkan pembebasan biaya pendidikan penuh 100%, uang saku bulanan, akomodasi asrama & makan di BLI Sentul, laptop kerja, buku/materi, perlindungan kesehatan, dan peluang karir ikatan dinas di BCA.", source: "BCA Career (karir.bca.co.id)" },
  { topic: "tahapan seleksi cara daftar", answer: "Pendaftaran resmi dilakukan secara online di karir.bca.co.id. Tahapan umum meliputi seleksi administrasi, tes kemampuan dasar & kepribadian online, psikotes, wawancara, dan medical check-up.", source: "BCA Career (karir.bca.co.id)" },
];
