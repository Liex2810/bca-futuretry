import type { Character } from "@/types";

// Lima karakter FESEA — narrative entry points, BUKAN personality test.
export const characters: Character[] = [
  {
    id: "fino",
    name: "Fino",
    fesea: "Functional",
    program: "PPTI",
    field: "Application / Software Development",
    message: "Gue suka ketika sesuatu yang awalnya rumit bisa dibuat jadi sistem yang simpel.",
    answers: "Aku sebenarnya bakal belajar dan melakukan apa?",
    accent: "#08BBD4",
    emojiSeed: "FN",
  },
  {
    id: "elia",
    name: "Elia",
    fesea: "Emotional",
    program: "PPBP",
    field: "Investment / Finance",
    message: "Kadang yang paling penting bukan seberapa cepat kamu memilih, tapi seberapa baik kamu memahami pilihanmu.",
    answers: "Aku bisa nggak? Aku bakal suka nggak?",
    accent: "#F467B0",
    emojiSeed: "EL",
  },
  {
    id: "seno",
    name: "Seno",
    fesea: "Social",
    program: "PPBP",
    field: "Management / Business Strategy",
    message: "Masalah bisnis jarang bisa diselesaikan sendirian.",
    answers: "Siapa yang bisa aku temui dan tanyai?",
    accent: "#0D70B4",
    emojiSeed: "SN",
  },
  {
    id: "esha",
    name: "Esha",
    fesea: "Experiential",
    program: "PPTI",
    field: "UI/UX / Product Design",
    message: "Teknologi bukan cuma soal bagaimana sesuatu bekerja. Tapi juga bagaimana orang menggunakannya.",
    answers: "Sehari-harinya bakal seperti apa?",
    accent: "#2CC7DD",
    emojiSeed: "ES",
  },
  {
    id: "adit",
    name: "Adit",
    fesea: "Action",
    program: "PPTI",
    field: "Cybersecurity / Network Security",
    message: "Kalau semuanya terlihat normal, bukan berarti semuanya aman.",
    answers: "Kalau aku tertarik, langkah selanjutnya apa?",
    accent: "#8CDDE7",
    emojiSeed: "AD",
  },
];

export const characterById = (id: string) => characters.find((c) => c.id === id);
