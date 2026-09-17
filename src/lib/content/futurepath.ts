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
  { id: "f1", question: "Apa bedanya PPBP dan PPTI?", answer: loremLong, source: placeholderSource, tags: ["umum", "ppbp", "ppti"] },
  { id: "f2", question: "PPTI belajar apa saja?", answer: loremLong, source: placeholderSource, tags: ["ppti"] },
  { id: "f3", question: "Aku dari IPS, bisa PPTI nggak?", answer: loremLong, source: placeholderSource, tags: ["ppti", "eligibility"] },
  { id: "f4", question: "Kehidupan di BLI seperti apa?", answer: loremLong, source: placeholderSource, tags: ["kehidupan"] },
  { id: "f5", question: "Apakah FutureTry menentukan aku diterima?", answer: "Tidak. FutureTry hanya tempat mencoba dan berefleksi. Tidak ada skor atau prediksi penerimaan.", source: "Kebijakan demo FutureTry", tags: ["umum", "privasi"] },
  { id: "f6", question: "Bagaimana progres demo disimpan?", answer: "Progres simulasi disimpan secara lokal di browser perangkat ini selama penyimpanan browser tersedia.", source: "Implementasi aplikasi FutureTry", tags: ["umum", "privasi"] },
];

export const knowledgeBase = [
  { topic: "ppbp vs ppti", answer: faqs[0].answer, source: faqs[0].source },
  { topic: "ppti materi", answer: faqs[1].answer, source: faqs[1].source },
  { topic: "ips ppti", answer: faqs[2].answer, source: faqs[2].source },
  { topic: "asrama bli", answer: faqs[3].answer, source: faqs[3].source },
  { topic: "penerimaan", answer: faqs[4].answer, source: faqs[4].source },
  { topic: "progres penyimpanan", answer: faqs[5].answer, source: faqs[5].source },
];
