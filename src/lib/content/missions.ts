import type { Mission } from "@/types";

// ════════════════════════════════════════════════════════════════
//  MISSIONS — simulasi role singkat (±5 menit).
//  BUKAN tes. Tidak ada jawaban benar/salah — setiap pilihan
//  memberi konsekuensi naratif + skill yang dirasakan.
// ════════════════════════════════════════════════════════════════

export const missions: Mission[] = [
  // ─────────────────────────── PPTI ───────────────────────────
  {
    id: "m-anomaly",
    title: "Something Doesn't Look Right",
    program: "PPTI",
    district: "technology",
    role: "Security Analyst",
    duration: "±5 menit",
    summary: "Sepuluh ribu transaksi masuk tiap hari. Satu di antaranya janggal. Kamu yang menemukannya.",
    intro:
      "Kamu baru saja mulai shift pagi di tim Security Operations. Layarmu menampilkan ringkasan transaksi semalam. Semuanya terlihat normal — dan justru itu yang harus kamu curigai.",
    steps: [
      {
        id: "s1",
        narration: "Sistem menampilkan empat transaksi mencurigakan dari jutaan baris log.",
        prompt: "Transaksi mana yang kamu periksa lebih dulu?",
        choices: [
          {
            id: "c1",
            label: "#003 — 02:14, Rp8,5 M",
            detail: "Pukul 2 pagi, nominal 30x lipat dari rata-rata akun itu",
            consequence:
              "Kamu membuka detail #003. Jam tidak wajar + nominal anomali: pola klasik akun yang dikompromikan. Kamu membekukan sementara transaksi berikutnya.",
            skills: ["Pattern recognition", "Prioritization"],
          },
          {
            id: "c2",
            label: "Semua yang di atas Rp5 M",
            detail: "Pakai threshold nominal saja",
            consequence:
              "Threshold nominal menangkap banyak hal — tapi juga banyak false positive. Kamu belajar bahwa anomali waktu sering lebih penting daripada besar nominal.",
            skills: ["Rule thinking", "System logic"],
          },
          {
            id: "c3",
            label: "#001–#004, urut dari teratas",
            detail: "Periksa sistematis satu-satu",
            consequence:
              "Teliti, tapi waktu shift-mu terbatas. Di dunia keamanan, urutan memeriksa sama pentingnya dengan cara memeriksa.",
            skills: ["Verification", "Workflow design"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Transaksi #003 ternyata datang dari perangkat yang belum pernah login di akun itu.",
        prompt: "Apa langkahmu berikutnya?",
        choices: [
          {
            id: "c1",
            label: "Verifikasi ke pemilik akun",
            detail: "Hubungi langsung, konfirmasi apakah ini mereka",
            consequence:
              "Ternyata benar: pemilik akun sedang tidur. Kamu mencegah kerugian besar. Verifikasi manusia sering jadi senjata terbaik melawan sistem otomatis.",
            skills: ["Verification", "Communication"],
          },
          {
            id: "c2",
            label: "Cek riwayat IP & perangkat lain",
            detail: "Kumpulkan bukti dulu sebelum bertindak",
            consequence:
              "Kamu menemukan 3 percobaan login gagal sebelum #003 berhasil — pola brute force. Bukti yang kamu kumpulkan jadi dasar penutupan celah.",
            skills: ["Investigation", "Data interpretation"],
          },
          {
            id: "c3",
            label: "Langsung blokir akun permanen",
            detail: "Amankan dulu, selidiki belakangan",
            consequence:
              "Akun aman, tapi pemiliknya panik karena tidak bisa akses. Kamu belajar: tindakan keamanan juga perlu komunikasi dan proporsi.",
            skills: ["Decision making", "Risk awareness"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Insiden tertangani. Tim meminta satu rekomendasi perbaikan sistem.",
        prompt: "Rekomendasi mana yang kamu bawa ke rapat?",
        choices: [
          {
            id: "c1",
            label: "Waspada anomali jam + perangkat baru",
            detail: "Perketat deteksi otomatis",
            consequence:
              "Aturan deteksi baru menangkap 2 pola serupa minggu berikutnya. Kamu melihat langsung bagaimana satu ide berubah jadi perlindungan nyata.",
            skills: ["System logic", "Impact"],
          },
          {
            id: "c2",
            label: "Wajibkan 2FA untuk nominal besar",
            detail: "Tambah lapisan verifikasi",
            consequence:
              "Gesekan bertambah bagi pengguna, tapi kerugian turun. Trade-off keamanan vs kenyamanan adalah makanan sehari-hari role ini.",
            skills: ["Risk thinking", "Product sense"],
          },
          {
            id: "c3",
            label: "Edukasi pengguna soal phishing",
            detail: "Perbaiki dari sisi manusia",
            consequence:
              "Akar masalahnya ternyata phishing. Teknologi penting, tapi memahami perilaku orang sama krusialnya.",
            skills: ["Human-centered thinking", "Analysis"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Mencari pola janggal", "Menyelidiki sampai ketemu", "Melindungi orang dari kerugian", "Berpikir seperti penyerang"],
      challenge: ["Memilih prioritas saat data banyak", "Bertindak dengan informasi belum lengkap", "Menyeimbangkan aman vs nyaman"],
    },
  },
  {
    id: "m-dashboard",
    title: "The Data Tells a Story",
    program: "PPTI",
    district: "technology",
    role: "Data Engineer",
    duration: "±5 menit",
    summary: "Laporan manual timmu butuh 3 hari. Manajer minta jawaban dalam 3 jam. Saatnya merapikan datanya.",
    intro:
      "Kamu data engineer di tim produk. Setiap minggu tim menghabiskan 3 hari menyusun laporan manual dari 4 sumber data yang berantakan. Senin pagi, manajer bertanya: 'Berapa user aktif di kota B minggu ini?' — dan tidak ada yang bisa menjawab cepat.",
    steps: [
      {
        id: "s1",
        narration: "Empat sumber data: database transaksi, log aplikasi, spreadsheet marketing, dan CSV dari tim lapangan. Formatnya beda-beda, namanya beda-beda, bahkan tanggalnya beda format.",
        prompt: "Dari mana kamu mulai?",
        choices: [
          {
            id: "c1",
            label: "Samakan definisi dulu",
            detail: "'User aktif' versi tiap tim ternyata beda",
            consequence:
              "Ternyata marketing menghitung 'buka aplikasi', produk menghitung 'ada transaksi'. Sebelum soal teknis apa pun, menyamakan bahasa adalah pekerjaan data paling penting.",
            skills: ["Data interpretation", "Communication"],
          },
          {
            id: "c2",
            label: "Otomatisasi pipeline dulu",
            detail: "Gabungkan semua sumber secara terjadwal",
            consequence:
              "Pipeline-mu jalan, tapi hasilnya dipertanyakan tim karena definisinya belum sama. Otomasi tanpa kesepakatan = salah lebih cepat.",
            skills: ["System logic", "Tooling"],
          },
          {
            id: "c3",
            label: "Rapikan kualitas data dulu",
            detail: "Cek duplikat, null, dan format",
            consequence:
              "Kamu menemukan 12% baris transaksi ganda. Angka apa pun yang dihitung sebelumnya ternyata salah. Membersihkan data adalah fondasi.",
            skills: ["Verification", "Attention to detail"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Definisi sudah sama. Sekarang pertanyaan manajer harus bisa dijawab kapan saja, bukan 3 hari lagi.",
        prompt: "Apa yang kamu bangun?",
        choices: [
          {
            id: "c1",
            label: "Dashboard real-time sederhana",
            detail: "Semua tim lihat angka yang sama, kapan saja",
            consequence:
              "Rapat mingguan berubah total: orang berdiskusi soal keputusan, bukan berdebat soal angka. Satu dashboard memangkas 3 hari kerja.",
            skills: ["Product sense", "Impact"],
          },
          {
            id: "c2",
            label: "Query library yang bisa dipakai semua tim",
            detail: "Kode SQL teruji, tinggal ganti parameter",
            consequence:
              "Tim analitik jadi mandiri. Kamu belajar bahwa membuat alat untuk orang lain sama pentingnya dengan menjawab pertanyaannya sendiri.",
            skills: ["Scalability", "Collaboration"],
          },
          {
            id: "c3",
            label: "Jawab manual cepat untuk minggu ini",
            detail: "Nanti dirapikan",
            consequence:
              "Manajer senang minggu ini. Minggu depan pertanyaannya datang lagi — dan laporan 3 hari itu masih ada. Kamu merasakan sendiri kenapa 'cepat tapi berutang' itu melelahkan.",
            skills: ["Prioritization", "Honesty"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Sistem jalan. Tapi log aplikasi kota B tiba-tiba kosong sejak kemarin.",
        prompt: "Reaksimu?",
        choices: [
          {
            id: "c1",
            label: "Cek pipeline & alerting",
            detail: "Data hilang = ada yang rusak, cari di mana",
            consequence:
              "Ternyata update aplikasi menghapus satu event tracking. Berkat pipeline-mu, kamu menemukannya dalam 20 menit — bukan 2 hari.",
            skills: ["Investigation", "System logic"],
          },
          {
            id: "c2",
            label: "Tandai dashboard 'data tidak lengkap'",
            detail: "Jujur ke pengguna dulu, perbaiki belakangan",
            consequence:
              "Kepercayaan tim justru naik karena dashboard tidak pernah berbohong. Integritas data adalah fitur, bukan formalitas.",
            skills: ["Trust design", "Communication"],
          },
          {
            id: "c3",
            label: "Estimasi dengan data kota serupa",
            detail: "Isi kekosongan sementara",
            consequence:
              "Angkanya masuk akal — sampai ada keputusan bisnis besar berdasarkan estimasi itu. Kamu belajar batas antara membantu dan menyesatkan.",
            skills: ["Judgment", "Risk awareness"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Merapikan yang berantakan", "Melihat angka jadi keputusan", "Membangun sistem yang dipakai orang", "Berburu sumber masalah data"],
      challenge: ["Menyamakan definisi antar tim", "Memutihkan data kotor", "Menjelaskan ketidakpastian angka"],
    },
  },
  {
    id: "m-uxfix",
    title: "Nobody Finishes the Form",
    program: "PPTI",
    district: "technology",
    role: "UI/UX Designer",
    duration: "±5 menit",
    summary: "78% pengguna berhenti di tengah form pendaftaran. Tugasmu: cari tahu kenapa — dan perbaiki.",
    intro:
      "Kamu UI/UX designer di tim digital. Fitur pendaftaran akun baru sudah live sebulan, tapi 78% orang menyerah sebelum selesai. Tim-mu mengundangmu ke ruang diskusi. Di layar: rekaman sesi pengguna yang mencoba mendaftar.",
    steps: [
      {
        id: "s1",
        narration: "Kamu menonton 5 rekaman sesi. Tiga orang berhenti di layar yang sama: verifikasi identitas dengan 7 kolom.",
        prompt: "Kesimpulan pertamamu?",
        choices: [
          {
            id: "c1",
            label: "Formnya terlalu panjang",
            detail: "Kurangi kolom, tunda yang tidak wajib",
            consequence:
              "Kamu memetakan tiap kolom ke pertanyaan: 'apakah ini benar-benar dibutuhkan SEKARANG?' Ternyata 4 dari 7 kolom bisa ditunda. Versi 3 kolom diuji minggu depan.",
            skills: ["Simplification", "User empathy"],
          },
          {
            id: "c2",
            label: "Orang bingung kolom tertentu",
            detail: "Lihat lagi: mereka berhenti setelah kolom 'jenis rekening'",
            consequence:
              "Bukan panjangnya — satu istilah membingungkan. Kamu mengganti label jadi pertanyaan sehari-hari. Completion rate naik bahkan sebelum form diperpendek.",
            skills: ["Observation", "Language design"],
          },
          {
            id: "c3",
            label: "Error message-nya menakutkan",
            detail: "Muncul 'Data ditolak' tanpa penjelasan",
            consequence:
              "Pengguna tidak tahu salah di mana, jadi mereka menyerah. Kamu merancang pesan error yang menunjukkan jalan keluar, bukan jalan buntu.",
            skills: ["Empathy", "Microcopy"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Tim setuju ada perubahan. Tapi business unit menolak mengurangi kolom: 'semua data itu wajib untuk compliance'.",
        prompt: "Apa yang kamu lakukan?",
        choices: [
          {
            id: "c1",
            label: "Pecah jadi beberapa langkah kecil",
            detail: "Semua kolom tetap ada, tapi tidak sekaligus",
            consequence:
              "Progress bar + langkah pendek membuat 7 kolom terasa ringan. Compliance puas, pengguna pun. Desain sering soal mengatur waktu, bukan menghapus hal.",
            skills: ["Progressive disclosure", "Negotiation"],
          },
          {
            id: "c2",
            label: "Isi otomatis dari dokumen",
            detail: "Upload KTP → kolom terisi sendiri",
            consequence:
              "Ide besar yang butuh tim lain. Kamu belajar bahwa perbaikan UX terbaik kadang bukan di layar, tapi di sistem di baliknya.",
            skills: ["Systems thinking", "Ambition"],
          },
          {
            id: "c3",
            label: "Jelaskan ke pengguna kenapa data diminta",
            detail: "Tambah keterangan singkat per kolom",
            consequence:
              "Ternyata sebagian orang berhenti karena curiga, karena malas mengisi. Kepercayaan adalah bagian dari user experience.",
            skills: ["Trust design", "Communication"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Versi baru live. Seminggu kemudian: completion rate naik dari 22% jadi 61%. Manajer minta satu langkah berikutnya.",
        prompt: "Kamu arahkan tim ke mana?",
        choices: [
          {
            id: "c1",
            label: "Wawancara 5 orang yang masih gagal",
            detail: "Sisa 39% itu cerita yang belum kamu dengar",
            consequence:
              "Dari 5 wawancara, muncul tema baru: pengguna mobile lanjut usia. Perbaikan berikutnya jadi lebih manusiawi karena kamu mendengar, bukan menebak.",
            skills: ["Research", "Humility"],
          },
          {
            id: "c2",
            label: "A/B test dua versi tombol terakhir",
            detail: "Kejar angka sisanya dengan eksperimen",
            consequence:
              "Eksperimen kecil memberi jawaban besar: orang ragu di langkah konfirmasi. Data mengarahkan keputusan dengan rapi.",
            skills: ["Experimentation", "Data literacy"],
          },
          {
            id: "c3",
            label: "Rapikan seluruh alur onboarding",
            detail: "Form selesai — tapi pengalaman setelahnya?",
            consequence:
              "Kamu melihat gambaran lebih besar: pendaftaran hanya langkah pertama. UX yang baik tidak berhenti di satu layar.",
            skills: ["Journey thinking", "Vision"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Mendengar kebingungan orang", "Melihat angka bergerak setelah perbaikan", "Menyederhanakan yang rumit", "Menyeimbangkan kebutuhan bisnis & user"],
      challenge: ["Berdebat dengan tim bisnis", "Memilih masalah yang paling penting", "Puas dengan perbaikan bertahap"],
    },
  },

  // ─────────────────────────── PPBP ───────────────────────────
  {
    id: "m-customer",
    title: "A Customer Needs Your Help",
    program: "PPBP",
    district: "business",
    role: "Banking / Customer Solution",
    duration: "±5 menit",
    summary: "Seorang pedagang online butuh modal, tapi tawaran produkmu bisa salah untuk dia. Dengarkan dulu.",
    intro:
      "Kamu officer di cabang. Bu Ratna, pelanggan sejak dua tahun lalu, datang gelisah. Usahanya (makanan beku, 3 karyawan) kebanjiran pesanan menjelang Lebaran, tapi ia tidak punya uang untuk beli stok. Ia mendengar soal KUR dari temannya dan ingin 'yang paling cepat cair'.",
    steps: [
      {
        id: "s1",
        narration: "Bu Ratna buru-buru. Ia menyebut angka Rp150 juta — besar, dan ia ingin hari ini juga.",
        prompt: "Apa yang kamu lakukan pertama?",
        choices: [
          {
            id: "c1",
            label: "Pahami dulu alur kasnya",
            detail: "Berapa yang masuk & keluar tiap bulan, sebenarnya",
            consequence:
              "Ternyata masalahnya bukan kekurangan modal permanen, tapi jeda 30 hari antara bayar supplier dan terima uang pelanggan. Ini mengubah seluruh solusinya.",
            skills: ["Customer understanding", "Analysis"],
          },
          {
            id: "c2",
            label: "Langsung tawarkan KUR",
            detail: "Itu yang dia minta, kan?",
            consequence:
              "Formulir sudah di tangan, tapi kamu ragu: suku bunga tetap 6% setahun untuk pinjaman yang sebenarnya hanya dibutuhkan 30 hari? Memberi yang diminta ≠ memberi yang dibutuhkan.",
            skills: ["Listening", "Critical thinking"],
          },
          {
            id: "c3",
            label: "Cek riwayat transaksinya",
            detail: "Data rekeningmu sendiri sudah bercerita",
            consequence:
              "Mutasi menunjukkan pola pesanan yang naik-turun musiman + satu pembayaran supplier besar tiap awal bulan. Kamu sudah punya separuh jawaban sebelum bertanya.",
            skills: ["Data interpretation", "Preparation"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Gambaran jelas: ia butuh Rp40 juta, hanya ±45 hari, berulang tiap musim. Ada tiga opsi di mejamu.",
        prompt: "Mana yang kamu rekomendasikan?",
        choices: [
          {
            id: "c1",
            label: "Fasilitas modal kerja musiman (Rp40 jt)",
            detail: "Pinjaman sesuai siklus, lunas setelah musim ramai",
            consequence:
              "Cocok dengan pola kasnya. Angsuran terasa ringan karena dibayar dari omzet Lebaran yang memang melonjak. Rekomendasi yang baik adalah yang pas waktu, bukan cuma pas nominal.",
            skills: ["Solution design", "Risk awareness"],
          },
          {
            id: "c2",
            label: "KUR Rp150 jt (permintaan awal)",
            detail: "Bunga lebih ringan, tapi besar & panjang",
            consequence:
              "Secara bunga lebih murah — tapi ia akan membayar bunga untuk uang yang tidak dibutuhkannya selama setahun. Kamu belajar melihat total biaya, bukan cuma suku bunga.",
            skills: ["Financial analysis", "Honesty"],
          },
          {
            id: "c3",
            label: "Giro cair + negosiasi tempo supplier",
            detail: "Sebagian uangnya sudah ada, cuma salah waktu",
            consequence:
              "Kamu menghubungkan Bu Ratna dengan supplier langganannya untuk tempo 30 hari. Solusi terbaik hari itu justru bukan produk bank sama sekali.",
            skills: ["Creative problem solving", "Relationship"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Bu Ratna setuju dengan rencana musiman. Tapi sistem menolak: dokumen NPWP usahanya atas nama almarhum suaminya, belum dibalik nama.",
        prompt: "Siklus pesanan tinggal 6 minggu. Apa langkahmu?",
        choices: [
          {
            id: "c1",
            label: "Dampingi proses balik nama",
            detail: "Jelaskan langkahnya, kawal sampai beres",
            consequence:
              "Butuh 3 minggu — sempit, tapi bisa. Bu Ratna datang dua kali dan kamu sediakan checklist. Pelayanan bukan cuma soal produk, tapi menemani prosesnya.",
            skills: ["Persistence", "Service excellence"],
          },
          {
            id: "c2",
            label: "Konsultasi ke tim kredit soal alternatif",
            detail: "Aturan penting, tapi jangan jadi tembok",
            consequence:
              "Kamu menemukan jalur: pengajuan bisa jalan paralel dengan syarat balik nama menyusul. Menaati aturan dan membantu pelanggan ternyata bisa sekaligus.",
            skills: ["Navigating policy", "Collaboration"],
          },
          {
            id: "c3",
            label: "Jujur: tunda ke musim berikutnya",
            detail: "Lebih aman daripada memaksakan",
            consequence:
              "Keputusan yang tidak nyaman. Tapi kamu juga belajar: menolak dengan penjelasan yang jujur adalah bagian dari kepercayaan jangka panjang.",
            skills: ["Integrity", "Long-term thinking"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Membantu orang dengan masalah nyata", "Mencari solusi yang pas, bukan yang cepat", "Membaca cerita di balik angka", "Mendampingi sampai beres"],
      challenge: ["Menolak permintaan yang salah", "Bekerja dengan aturan ketat", "Menyeimbangkan kepentingan bank & nasabah"],
    },
  },
  {
    id: "m-bizcase",
    title: "The Failing Branch",
    program: "PPBP",
    district: "business",
    role: "Business Strategy",
    duration: "±6 menit",
    summary: "Satu cabang rugi 8 bulan berturut-turut. Atasanmu: 'Besok pagi, bawa rekomendasi.'",
    intro:
      "Kamu analis strategi di kantor pusat. Cabang Cikarang — dibuka 3 tahun lalu untuk kawasan industri — rugi 8 bulan berturut-turut. Rapat besok memutuskan: tutup, pertahankan, atau ubah total. Kamu diberi akses data dan waktu semalam.",
    steps: [
      {
        id: "s1",
        narration: "Data mentah ada di depanmu: laporan keuangan, survei pelanggan, data kawasan, dan laporan tim cabang.",
        prompt: "Apa yang kamu gali lebih dulu?",
        choices: [
          {
            id: "c1",
            label: "Kenapa rugi — biaya atau pendapatan?",
            detail: "Bedakan masalah struktur dari masalah pasar",
            consequence:
              "Pendapatan turun 40%, biaya tetap. Masalahnya pasar, bukan operasional. Rekomendasimu otomatis berbeda: bukan potong listrik kantor, tapi ubah proposisi bisnis.",
            skills: ["Root cause analysis", "Financial literacy"],
          },
          {
            id: "c2",
            label: "Apa kata pelanggan yang pergi",
            detail: "Angka tidak bicara; orang bicara",
            consequence:
              "Kamu telepon 6 nasabah yang hijrah. Satu kalimat berulang: 'Pabrik saya pindah, rekening jalan tetap di Jakarta.' Kawasan industrinya yang berubah, bukan layanannya yang buruk.",
            skills: ["Customer insight", "Initiative"],
          },
          {
            id: "c3",
            label: "Apa kata tim cabang sendiri",
            detail: "Orang di lapangan biasanya paling tahu",
            consequence:
              "Kepala cabang sudah mengusulkan transformasi ke layanan korporat 6 bulan lalu — tidak pernah ditindaklanjuti. Analisis bagus tidak cukup; kamu belajar pentingnya mendengar ke atas.",
            skills: ["Empathy", "Organizational awareness"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Pola jelas: nasabah ritel kecil pergi, tapi 40 perusahaan baru masuk kawasan — dan mereka dilayani cabang Jakarta yang berjarak 60 km.",
        prompt: "Rekomendasimu untuk rapat besok?",
        choices: [
          {
            id: "c1",
            label: "Ubah jadi cabang khusus korporat",
            detail: "Pindahkan sumber daya ke segmen yang tumbuh",
            consequence:
              "Berani dan berbasis data. Tapi kamu sadar risikonya: butuh orang dengan keahlian berbeda. Rekomendasi strategi selalu menyisakan pertanyaan 'siapa yang mengerjakan?'.",
            skills: ["Strategic thinking", "Decisiveness"],
          },
          {
            id: "c2",
            label: "Kecilkan cabang, jadi service point",
            detail: "Tekan biaya, biarkan digital ambil alih ritel",
            consequence:
              "Pilihan aman dengan downside kecil. Kamu belajar bahwa dalam bisnis, 'setengah mati' kadang keputusan paling rasional — meski kurang glamor di slide.",
            skills: ["Risk management", "Pragmatism"],
          },
          {
            id: "c3",
            label: "Tutup, pindahkan nasabah ke Jakarta",
            detail: "Cabang rugi tidak layak dipertahankan",
            consequence:
              "Secara angka masuk akal — tapi 40 prospek korporat tetap tidak terlayani. Kamu merasakan sendiri bahwa keputusan termudah belum tentu yang terbaik.",
            skills: ["Hard calls", "Trade-off awareness"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Di rapat, CFO mempertanyakan: 'Berapa lama balik modal kalau kita ubah ke korporat?' Kamu tidak punya angka itu.",
        prompt: "Apa jawabanmu?",
        choices: [
          {
            id: "c1",
            label: "Akui, dan janjikan dalam 3 hari",
            detail: "Jujur lebih murah daripada nebak",
            consequence:
              "Ruang rapat menghargai kejujuranmu. Tiga hari kemudian angkanya solid, dan rekomendasimu disetujui. Kepercayaan dibangun dari kata-kata yang ditepati.",
            skills: ["Integrity", "Ownership"],
          },
          {
            id: "c2",
            label: "Estimasi cepat dari cabang serupa",
            detail: "Pakai benchmark, tandai sebagai sementara",
            consequence:
              "Estimasimu meleset 15% — tapi arah keputusannya benar. Kamu belajar kapan angka cukup untuk memutuskan, dan kapan harus menunggu.",
            skills: ["Benchmarking", "Judgment"],
          },
          {
            id: "c3",
            label: "Balik: mana yang Bapak/Ibu paling ragukan?",
            detail: "Ubah tekanan jadi diskusi",
            consequence:
              "Ternyata CFO ragu pada asumsi sewa, bukan pada strateginya. Kamu memperbaiki bagian yang tepat. Bertanya adalah cara menjawab yang sering diremehkan.",
            skills: ["Communication", "Stakeholder management"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Memecahkan masalah besar dari data", "Rekomendasi yang mengubah keputusan", "Berdebat dengan angka", "Melihat gambaran bisnis utuh"],
      challenge: ["Memutuskan dengan waktu sempit", "Menyampaikan kabar buruk", "Diuji di depan pimpinan"],
    },
  },
  {
    id: "m-invest",
    title: "Two Portfolios, One Question",
    program: "PPBP",
    district: "business",
    role: "Investment / Finance",
    duration: "±5 menit",
    summary: "Dua nasabah, dua profil, satu pasar yang sedang bergejolak. Mana yang kamu prioritaskan — dan kenapa?",
    intro:
      "Kamu junior di tim wealth management. Pagi ini pasar regional jatuh 4% karena berita kebijakan. Dua pesan masuk bersamaan: Pak Hartono (62, pensiunan, dana pendidikan cucu) panik ingin menarik semuanya. Dinda (27, first jobber) ingin menambah besar karena 'diskon'.",
    steps: [
      {
        id: "s1",
        narration: "Keduanya butuh jawaban hari ini. Kamu hanya punya waktu menyiapkan analisis mendalam untuk satu orang dulu.",
        prompt: "Siapa yang kamu tangani lebih dulu?",
        choices: [
          {
            id: "c1",
            label: "Pak Hartono — risiko keputusan panik",
            detail: "Menjual di titik terendah mengunci kerugian",
            consequence:
              "Kamu benar: keputusan terburuk dalam keuangan sering dibuat saat takut. Satu jam menenangkannya menyelamatkan rencana pendidikan cucunya.",
            skills: ["Risk prioritization", "Empathy"],
          },
          {
            id: "c2",
            label: "Dinda — uangnya bisa salah tempat",
            detail: "Nekat 'beli diskon' tanpa dana darurat",
            consequence:
              "Ternyata ia ingin pakai 80% tabungannya. Mencegah keputusan buruk saat serakah sama pentingnya dengan saat takut.",
            skills: ["Prudence", "Education"],
          },
          {
            id: "c3",
            label: "Keduanya — jawaban singkat dulu, analisis menyusul",
            detail: "Stabilkan, baru rawat",
            consequence:
              "Kamu kirim pesan penahan ke keduanya, lalu kerjakan analisis berurutan. Manajemen waktu adalah bagian dari profesi ini.",
            skills: ["Triage", "Communication"],
          },
        ],
      },
      {
        id: "s2",
        narration: "Untuk Pak Hartono: portofolionya 60% obligasi, 40% saham. Ia ingin 100% tunai 'sampai aman'.",
        prompt: "Apa yang kamu sampaikan?",
        choices: [
          {
            id: "c1",
            label: "Jelaskan apa yang berubah & tidak berubah",
            detail: "Berita kebijakan apa, dampaknya ke posisinya apa",
            consequence:
              "Ternyata yang jatuh adalah pos saham 12% dari totalnya; obligasinya naik. Setelah melihat gambaran utuh, tangannya turun dari tombol 'jual semua'. Data menenangkan.",
            skills: ["Analysis", "Simplifying complexity"],
          },
          {
            id: "c2",
            label: "Ingatkan tujuan & horizon dananya",
            detail: "Uang cucu dipakai 6 tahun lagi, bukan bulan depan",
            consequence:
              "Kamu menariknya dari fluktuasi hari ini ke rencana 6 tahun. Perspektif waktu adalah alat manajemen risiko yang gratis.",
            skills: ["Goal-based thinking", "Trust building"],
          },
          {
            id: "c3",
            label: "Tawarkan jalan tengah: kurangi sebagian",
            detail: "Kurangi saham ke batas yang membuatnya tidur nyenyak",
            consequence:
              "Optimal secara angka bukan berarti optimal secara manusia. Portofolio yang bisa dipertahankan lebih baik dari yang sempurna tapi ditinggalkan.",
            skills: ["Behavioral finance", "Negotiation"],
          },
        ],
      },
      {
        id: "s3",
        narration: "Sorenya Dinda bertanya: 'Kalau Pak Hartono saja dilindungi, kenapa saya tidak boleh all-in saat murah?'",
        prompt: "Jawabanmu?",
        choices: [
          {
            id: "c1",
            label: "Beda profil, beda jawaban — dan itu adil",
            detail: "Usia, horizon, dan dana darurat kalian berbeda",
            consequence:
              "Ia mengerti. Kamu membuatkan rencana bertahap: dana darurat dulu, baru cicil beli rutin. Nasihat yang baik menjelaskan 'kenapa', bukan cuma 'apa'.",
            skills: ["Personalization", "Education"],
          },
          {
            id: "c2",
            label: "Setuju sebagian: mulai, tapi bertahap",
            detail: "Dollar cost averaging, bukan all-in",
            consequence:
              "Kamu menyalurkan energinya ke strategi yang tahan banting. Menyetujui semangat, memperbaiki caranya.",
            skills: ["Strategy design", "Balance"],
          },
          {
            id: "c3",
            label: "Tunjukkan simulasi terburuk",
            detail: "Kalau besok jatuh lagi, uangmu tinggal segini",
            consequence:
              "Angka bicara lebih keras daripada nasihat. Dinda akhirnya memilih 30%. Kamu belajar bahwa orang perlu 'merasakan' risiko sebelum memahaminya.",
            skills: ["Scenario analysis", "Persuasion"],
          },
        ],
      },
    ],
    reflectionHints: {
      enjoy: ["Menenangkan orang di saat panik", "Merubah angka rumit jadi keputusan", "Melindungi rencana jangka panjang", "Belajar perilaku manusia & uang"],
      challenge: ["Menolak keinginan nasabah", "Menjelaskan ketidakpastian", "Menyeimbangkan hati & hitungan"],
    },
  },
];

export const missionById = (id: string) => missions.find((m) => m.id === id);
