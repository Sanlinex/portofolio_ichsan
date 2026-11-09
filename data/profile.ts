export interface ProjectItem {
  id: string;
  slug: string;
  index: string;
  title: string;
  tagline: string;
  role: string;
  period: string;
  client: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  summary: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  image: string;
}

export interface ExperienceItem {
  id: string;
  index: string;
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  stack: string[];
}

export interface AchievementItem {
  id: string;
  rank: string;
  rankNumeric: string;
  title: string;
  category: string;
  issuer: string;
  year: string;
  description: string;
  certificatePlaceholder: string;
}

export interface PosterSubItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  image: string;
  dimensions: string;
  concept: string;
  notes: string;
}

export interface PosterItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  aspectRatio: "portrait" | "square";
  description: string;
  palette: string[];
  image: string;
  coverImage: string;
  tools: string[];
  gallery: PosterSubItem[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  status: string;
  description: string;
  courses: string[];
}

export interface ProfileData {
  personal: {
    name: string;
    firstName: string;
    lastName: string;
    pronouns: string;
    role: string;
    experienceYears: string;
    location: string;
    timezone: string;
    utcOffset: string;
    availability: string;
    availableForWork: boolean;
    avatar?: string;
    issueNumber: string;
    bioEditorial: string;
    bioParagraphs: string[];
    manifesto: string;
    stats: {
      value: number;
      suffix: string;
      label: string;
      description: string;
    }[];
  };
  education: EducationItem;
  experiences: ExperienceItem[];
  achievements: AchievementItem[];
  skills: {
    core: {
      name: string;
      level: string;
      years: string;
      summary: string;
    }[];
    also: {
      name: string;
      level: string;
      years: string;
      summary: string;
    }[];
    secondary: string[];
    marqueeRow1: string[];
    marqueeRow2: string[];
  };
  projects: ProjectItem[];
  posters: PosterItem[];
  contact: {
    email: string;
    city: string;
    country: string;
    github: { label: string; url: string };
    linkedin: { label: string; url: string };
    instagram: { label: string; url: string };
  };
}

export const PROFILE_DATA: ProfileData = {
  personal: {
    name: "Muh. Rafli Ichsan",
    firstName: "MUH. RAFLI",
    lastName: "ICHSAN",
    pronouns: "He / Him",
    role: "Fullstack Web Developer",
    experienceYears: "±3 Tahun",
    location: "Tangerang, Banten — Indonesia",
    timezone: "Asia/Jakarta",
    utcOffset: "UTC+07:00",
    availability: "Available for Full-time & Selected Contracts",
    availableForWork: true,
    issueNumber: "ISSUE NO. 01 — 2026",
    bioEditorial:
      "Merakit sistem digital performan tinggi dengan presisi tipografi editorial, arsitektur backend Laravel yang disiplin, dan interaktivitas frontend modern berbasis React & Next.js.",
    bioParagraphs: [
      "Saya adalah Fullstack Web Developer dengan pengalaman sekitar 3 tahun dalam merancang dan mengembangkan sistem web end-to-end. Memiliki fondasi disiplin kejuruan Rekayasa Perangkat Lunak (RPL), saya memprioritaskan arsitektur kode yang bersih, efisiensi skema basis data, dan performa antarmuka yang bebas latensi.",
      "Melalui pengalaman magang di industri media digital (Transisi Media) dan sistem kasir ritel (Pake-POS), saya terbiasa membangun modul manajemen konten skala redaksi, integrasi REST API, hingga sistem transaksi kasir yang responsif.",
      "Bagi saya, web bukan sekadar tempat menampilkan informasi, melainkan medium editorial di mana kode yang kokoh, ritme tipografi yang tegas, dan kehalusan animasi scroll berpadu memberikan pengalaman pengguna yang berkesan.",
    ],
    manifesto:
      "Good software is an editorial craft: structured with rigor, stripped of excess, and engineered to feel alive under your fingers.",
    stats: [
      {
        value: 3,
        suffix: "+",
        label: "Years of Experience",
        description: "Pengalaman rekayasa web komersial & arsitektur fullstack",
      },
      {
        value: 3,
        suffix: "",
        label: "Competitive Honors",
        description: "Juara Web Developer Tangerang, Banten, dan UMKM Digital",
      },
      {
        value: 2,
        suffix: "",
        label: "Production Internships",
        description: "Magang industri di Transisi Media & Pake-POS",
      },
    ],
  },

  education: {
    institution: "SMK Rekayasa Perangkat Lunak (RPL) [ISI: Nama Sekolah & Tahun Lulus]",
    degree: "SMK Jurusan Rekayasa Perangkat Lunak (RPL)",
    period: "[ISI: 2021 — 2024]",
    location: "Kabupaten Tangerang, Banten",
    status: "Lulus Kompetensi Kejuruan",
    description:
      "Memperoleh pemahaman fundamental mendalam dalam rekayasa perangkat lunak: Object-Oriented Programming (OOP), pemodelan basis data relasional (MySQL / PostgreSQL), perancangan sistem terdistribusi (UML/ERD), dan standar clean code industri.",
    courses: [
      "Pemrograman Berorientasi Objek (OOP)",
      "Arsitektur Basis Data Relasional & Normalisasi",
      "Rekayasa Web Berbasis Framework (MVC & RESTful)",
      "Version Control System (Git) & Kolaborasi Tim",
    ],
  },

  experiences: [
    {
      id: "exp-current",
      index: "01",
      company: "[ISI: Perusahaan / Freelance Saat Ini]",
      role: "Fullstack Web Developer",
      period: "[ISI: 2023 — Sekarang, ±3 Tahun]",
      location: "Tangerang / Remote",
      type: "Full-time / Selected Contracts",
      description:
        "Memimpin perancangan dan implementasi solusi aplikasi web fullstack, merancang RESTful API performan tinggi dengan Laravel, serta membangun antarmuka web interaktif berbasis Next.js dan Tailwind CSS.",
      highlights: [
        "Mengembangkan platform web kustom dari perancangan arsitektur database hingga deployment di cloud/VPS.",
        "Mengoptimalkan performa Core Web Vitals dan kecepatan respon server dengan teknik caching bertingkat.",
        "Membangun reusable UI component library yang konsisten dengan standar aksesibilitas WCAG.",
      ],
      stack: ["Next.js", "React JS", "Laravel", "TypeScript", "Tailwind CSS", "MySQL"],
    },
    {
      id: "exp-transisi",
      index: "02",
      company: "Transisi Media",
      role: "Web Developer Intern [ISI: Posisi Detail]",
      period: "[ISI: 2023, Periode Magang]",
      location: "Indonesia",
      type: "Internship",
      description:
        "Berkontribusi pada tim teknologi media digital, fokus pada pembuatan modul dashboard manajemen artikel (CMS) dan optimasi alur kerja redaksi portal berita.",
      highlights: [
        "Mengembangkan dashboard dan sistem manajemen konten (CMS) artikel dengan fitur penjadwalan dan upload aset dinamis.",
        "Mengintegrasikan endpoint REST API Laravel dengan frontend untuk rendering berita secara real-time.",
        "Mengurangi waktu loading halaman artikel berita melalui optimasi image loading dan lazy-loading komponen.",
      ],
      stack: ["Laravel", "REST API", "Tailwind CSS", "MySQL", "Article / CMS Dashboard"],
    },
    {
      id: "exp-pakepos",
      index: "03",
      company: "Pake-Pos",
      role: "Web Developer Intern [ISI: Posisi Detail]",
      period: "[ISI: 2022 — 2023, Periode Magang]",
      location: "Indonesia",
      type: "Internship",
      description:
        "Mengembangkan modul antarmuka kasir (Point-of-Sale) berbasis web yang responsif, cepat, dan terhubung dengan sistem sinkronisasi transaksi offline-first.",
      highlights: [
        "Merancang antarmuka POS yang ringan dengan React JS dan Tailwind CSS untuk operasional kasir cepat.",
        "Mengimplementasikan validasi input realtime untuk scan barcode produk dan perhitungan transaksi otomatis.",
        "Menyusun prototipe alur transaksi kasir guna meminimalkan hambatan navigasi pengguna.",
      ],
      stack: ["React JS", "Tailwind CSS", "JavaScript", "RESTful API", "POS UI/UX"],
    },
  ],

  achievements: [
    {
      id: "ach-1",
      rank: "1st",
      rankNumeric: "01",
      title: "Juara 1 Web Developer",
      category: "Lomba Kompetensi Siswa (LKS) Tingkat Wilayah",
      issuer: "Pemerintah Daerah Kabupaten Tangerang",
      year: "2023",
      description:
        "Meraih peringkat pertama dalam kompetisi rekayasa web cepat. Menguji ketelitian perancangan fullstack dari basis data relasional, keamanan autentikasi API, hingga antarmuka responsif di bawah batas waktu ketat.",
      certificatePlaceholder: "/images/certificates/cert-1st-tangerang.svg",
    },
    {
      id: "ach-2",
      rank: "3rd",
      rankNumeric: "03",
      title: "Juara 3 Web Developer",
      category: "Lomba Kompetensi Siswa (LKS) Tingkat Provinsi",
      issuer: "Dinas Pendidikan dan Kebudayaan Provinsi Banten",
      year: "2023",
      description:
        "Meraih podium ke-3 pada kompetisi rekayasa web skala provinsi Banten, bersaing dengan delegasi terbaik se-Banten dalam implementasi arsitektur sistem berbasis REST API dan interaktivitas frontend.",
      certificatePlaceholder: "/images/certificates/cert-3rd-banten.svg",
    },
    {
      id: "ach-3",
      rank: "3rd",
      rankNumeric: "03",
      title: "Juara 3 Olimpiade Digital UMKM",
      category: "Kompetisi Solusi Digital & Inovasi Teknologi UMKM",
      issuer: "Kementerian Koperasi dan UKM / Penyelenggara Nasional",
      year: "2023",
      description:
        "Merancang dan mempresentasikan platform digital terintegrasi untuk akselerasi UMKM: modul katalog produk digital, dashboard pencatatan kasbon otomatis, dan sistem transaksi kasir berbasis web.",
      certificatePlaceholder: "/images/certificates/cert-3rd-umkm.svg",
    },
  ],

  skills: {
    core: [
      {
        name: "Laravel",
        level: "Core Backend Engine",
        years: "3 Tahun",
        summary: "Eloquent ORM, Authentication, RESTful APIs, Queues, Service Providers, & MVC Architecture",
      },
      {
        name: "React JS",
        level: "Core Frontend Library",
        years: "3 Tahun",
        summary: "Custom Hooks, Component Lifecycle, State Management, High-performance UI rendering",
      },
      {
        name: "Next.js",
        level: "Core Production Framework",
        years: "2+ Tahun",
        summary: "App Router, Server Components (RSC), SSR/SSG, Route Handlers, SEO Optimization",
      },
    ],
    also: [
      {
        name: "Desain Poster",
        level: "Visual Direction & Typography",
        years: "3 Tahun",
        summary: "Grid Swiss International Style, tipografi kontras tinggi, visual hierarchy, poster digital & cetak",
      },
      {
        name: "Article Dashboard & CMS Management",
        level: "Editorial Content Systems",
        years: "2+ Tahun",
        summary: "Perancangan workflow redaksi berita, WYSIWYG editor, manajemen aset digital, role-based access control",
      },
    ],
    secondary: [
      "TypeScript",
      "Tailwind CSS",
      "RESTful API Design",
      "MySQL & PostgreSQL",
      "GSAP & Motion Animation",
      "Git & GitHub Workflow",
      "Responsive Layout Architecture",
      "Figma UI Prototyping",
    ],
    marqueeRow1: [
      "LARAVEL BACKEND ARCHITECTURE",
      "REACT JS & NEXT.JS APP ROUTER",
      "EDITORIAL TYPOGRAPHY",
      "RESTFUL API SPECIALIST",
      "TAILWIND CSS PRECISION",
      "FULLSTACK PERFORMANCE",
    ],
    marqueeRow2: [
      "ARTICLE DASHBOARD MANAGEMENT",
      "SWISS POSTER DESIGN",
      "SMK RPL SOLID ROOTS",
      "1ST PLACE WEB DEV TANGERANG",
      "3RD PLACE BANTEN PROVINCE",
      "3RD PLACE DIGITAL UMKM",
    ],
  },

  projects: [
    {
      id: "project-1",
      slug: "transisi-article-dashboard",
      index: "01",
      title: "Editorial Article Publishing & CMS Dashboard",
      tagline: "High-Performance Editorial News Engine for Redaction Teams",
      role: "Lead Fullstack Developer [ISI: Peran Detail]",
      period: "2023",
      client: "Transisi Media [ISI: Klien / Instansi]",
      stack: ["Laravel", "RESTful API", "React JS", "Tailwind CSS", "MySQL"],
      liveUrl: "https://example.com/project-1 [ISI: Link Demo]",
      githubUrl: "https://github.com/Sanlinex/article-dashboard [ISI: Repo Link]",
      summary:
        "Sistem manajemen konten dan publikasi berita skala redaksi yang dirancang untuk mempercepat penerbitan berita harian, dilengkapi modul WYSIWYG editor dinamis, penjadwalan terotomasi, dan pengelompokan rubrik berita.",
      challenge:
        "Menggantikan sistem lama yang lambat saat menangani ribuan draf berita dan upload gambar beresolusi tinggi tanpa membebani memori server saat jam sibuk berita breaking news.",
      solution:
        "Membangun arsitektur backend Laravel yang modular dengan queue processing untuk kompresi gambar asinkron serta RESTful API efisien yang dihubungkan ke dashboard manajemen responsif.",
      deliverables: [
        "Dashboard admin berbasis peran (Role-Based Access Control) untuk jurnalis, editor, dan direksi.",
        "Modul upload aset gambar otomatis dengan generator format WebP dan thumbnail multi-ukuran.",
        "Sistem live draft auto-save dan penjadwalan publikasi otomatis via cron runner.",
        "Statistik pembaca artikel real-time dengan visualisasi data editorial.",
      ],
      metrics: [
        { label: "Publish Latency", value: "<150ms" },
        { label: "Image Payload Saved", value: "68%" },
        { label: "Daily Draft Capacity", value: "5,000+" },
      ],
      image: "/images/projects/project-dashboard.svg",
    },
    {
      id: "project-2",
      slug: "pakepos-omnichannel",
      index: "02",
      title: "Pake-POS Realtime Transaction & Cashier Core",
      tagline: "Sub-Second Point of Sale Interface with Barcode Scan Synchronization",
      role: "Frontend & API Integration Engineer [ISI: Peran Detail]",
      period: "2023",
      client: "Pake-POS [ISI: Klien / Instansi]",
      stack: ["React JS", "Tailwind CSS", "RESTful API", "JavaScript", "IndexedDB"],
      liveUrl: "https://example.com/project-2 [ISI: Link Demo]",
      githubUrl: "https://github.com/Sanlinex/pakepos-interface [ISI: Repo Link]",
      summary:
        "Antarmuka kasir web modern yang dioptimalkan untuk kasir ritel berkecepatan tinggi, mendukung barcode scanning kilat, cetak struk thermal instan, dan toleransi koneksi offline.",
      challenge:
        "Menghilangkan delay input pada perangkat komputer kasir spesifikasi rendah saat ribuan transaksi dilakukan secara berkelanjutan dalam shift kerja.",
      solution:
        "Mengembangkan komponen UI React yang sangat ramping dengan memorization ketat, rendering virtualized list untuk katalog puluhan ribu barang, dan sinkronisasi data lokal via IndexedDB.",
      deliverables: [
        "Antarmuka transaksi kasir layar sentuh dan keyboard shortcut untuk efisiensi checkout kasir.",
        "Integrasi barcode scanner tanpa delay dan kalkulasi kembalian tunai / non-tunai otomatis.",
        "Modul riwayat penjualan per kasir dan tutup buku shift harian.",
        "Arsitektur offline-first yang mensinkronkan transaksi saat internet tersambung kembali.",
      ],
      metrics: [
        { label: "Scan Checkout Speed", value: "0.2s" },
        { label: "Memory Usage", value: "<45MB" },
        { label: "Offline Resilience", value: "100%" },
      ],
      image: "/images/projects/project-pos.svg",
    },
    {
      id: "project-3",
      slug: "umkm-digital-commerce",
      index: "03",
      title: "UMKM Digital Commerce & Bookkeeping Engine",
      tagline: "Integrated B2B Commerce Platform & Ledger for MSME Ecosystems",
      role: "Solo Fullstack Architect [ISI: Peran Detail]",
      period: "2023",
      client: "Olimpiade Digital UMKM National [ISI: Klien / Kompetisi]",
      stack: ["Next.js", "Laravel API", "Tailwind CSS", "PostgreSQL", "TypeScript"],
      liveUrl: "https://example.com/project-3 [ISI: Link Demo]",
      githubUrl: "https://github.com/Sanlinex/umkm-digital-engine [ISI: Repo Link]",
      summary:
        "Platform digital inovasi UMKM yang memenangkan Juara 3 Olimpiade Digital UMKM, menggabungkan katalog produk digital, pencatatan kasbon otomatis, dan integrasi WhatsApp payment notification.",
      challenge:
        "Pelaku usaha mikro sering kesulitan mencatat utang piutang (kasbon) dan memperbarui stok barang secara terpisah antara toko fisik dan toko online.",
      solution:
        "Membangun platform terpadu dengan arsitektur headless: Next.js App Router untuk frontend etalase dan Laravel REST API untuk sistem pembukuan double-entry ledger yang akurat.",
      deliverables: [
        "Etalase belanja mobile-first dengan sistem checkout cepat tanpa perlu registrasi rumit.",
        "Buku kasbon digital dengan tombol notifikasi pengingat pembayaran ke WhatsApp pelanggan.",
        "Manajemen multi-gudang dan rekap laba kotor per hari secara otomatis.",
        "Laporan keuangan format standar akuntansi yang dapat diunduh dalam PDF editorial.",
      ],
      metrics: [
        { label: "Award Rank", value: "Juara 3" },
        { label: "Lighthouse Score", value: "98/100" },
        { label: "Bookkeeping Time Cut", value: "75%" },
      ],
      image: "/images/projects/project-umkm.svg",
    },
    {
      id: "project-4",
      slug: "tangerang-lks-portal",
      index: "04",
      title: "Municipal Competition & Technical Evaluation Portal",
      tagline: "Ultra-Fast Evaluator Scoring Platform (Juara 1 LKS Tangerang)",
      role: "Lead Fullstack Developer [ISI: Peran Detail]",
      period: "2023",
      client: "LKS Web Technology Tangerang & Banten [ISI: Klien / Lembaga]",
      stack: ["Laravel", "Blade / Vue Components", "Tailwind CSS", "MySQL", "WebSockets"],
      liveUrl: "https://example.com/project-4 [ISI: Link Demo]",
      githubUrl: "https://github.com/Sanlinex/lks-competition-system [ISI: Repo Link]",
      summary:
        "Sistem penilaian dan eksekusi kompetisi rekayasa web yang mengantarkan gelar Juara 1 Web Developer Kab. Tangerang dan Juara 3 Provinsi Banten. Dirancang dengan proteksi data ketat dan live leaderboard.",
      challenge:
        "Memastikan penilaian multi-juri berjalan serentak secara real-time tanpa resiko race condition atau kebocoran nilai sebelum sesi penjurian selesai.",
      solution:
        "Menerapkan event-driven architecture dengan WebSocket broadcasting, enkripsi nilai juri berlapis, serta audit trail logging untuk setiap perubahan data skor peserta.",
      deliverables: [
        "Live leaderboard layar proyektor dengan animasi reveal nilai yang dramatis dan akurat.",
        "Panel juri dengan rubrik penilaian modular sesuai standar WorldSkills.",
        "Sistem pengumpulan berkas kode peserta dengan checksum SHA-256 verifikasi orisinalitas.",
        "Ekspor rekap berita acara resmi otomatis dalam format PDF siap cetak.",
      ],
      metrics: [
        { label: "County Champion", value: "Juara 1" },
        { label: "Provincial Rank", value: "Juara 3" },
        { label: "Sync Latency", value: "<50ms" },
      ],
      image: "/images/projects/project-lks.svg",
    },
  ],

  posters: [
    {
      id: "poster-series-1",
      index: "01",
      title: "SWISS INTERNATIONAL TYPOGRAPHIC STYLE",
      subtitle: "Asymmetrical 12-Column Grid & Extreme Contrast Studies",
      year: "2023 — 2024",
      category: "Typographic Series [ISI: Kategori Detail]",
      aspectRatio: "portrait",
      description:
        "Eksplorasi tipografi Swiss International Style dengan disiplin grid modular ketat, hierarki skala dinamis antara serif italic dan sans bold, serta pemanfaatan ruang negatif sebagai elemen struktural aktif.",
      palette: ["#0E0E0E", "#F2EFE9", "#FF4D1C"],
      image: "/images/posters/poster-swiss-01.svg",
      coverImage: "/images/posters/poster-swiss-01.svg",
      tools: ["Adobe Illustrator", "Figma", "Modular Grid System", "Typography"],
      gallery: [
        {
          id: "swiss-01",
          index: "01",
          title: "The Asymmetric Grid",
          subtitle: "Modular Ratio & Mathematical Proportions",
          image: "/images/posters/poster-swiss-01.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Eksplorasi kontras ukuran font raksasa dengan garis hairline 1px dan barcode presisi tinggi.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-swiss-01.svg]",
        },
        {
          id: "swiss-02",
          index: "02",
          title: "Negative Space & White Silence",
          subtitle: "The Silence Between Typographic Glyphs",
          image: "/images/posters/poster-swiss-02.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Komposisi ruang bernapas hangat (#F2EFE9) yang memberi ruang bagi tipografi judul untuk bernapas.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-swiss-02.svg]",
        },
        {
          id: "swiss-03",
          index: "03",
          title: "Rhythm & Extreme Scale",
          subtitle: "Instrument Serif × JetBrains Mono Construct",
          image: "/images/posters/poster-swiss-03.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Eksplorasi kontras tekstur antara serif elegan bernuansa humanis dan angka monospaced kaku.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-swiss-03.svg]",
        },
        {
          id: "swiss-04",
          index: "04",
          title: "Systematic Order & Form Follows Function",
          subtitle: "Rational Communication in Visual Space",
          image: "/images/posters/poster-swiss-04.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Manifesto fungsionalisme modern: menata informasi kompleks menjadi tatanan visual yang jernih.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-swiss-04.svg]",
        },
      ],
    },
    {
      id: "poster-series-2",
      index: "02",
      title: "ARTICLE & EDITORIAL PUBLISHING MANIFESTO",
      subtitle: "Digital Magazine, Literary Layouts & Masthead Typography",
      year: "2023",
      category: "Editorial Design [ISI: Kategori Detail]",
      aspectRatio: "portrait",
      description:
        "Seri poster yang merayakan persimpangan jurnalisme editorial dan arsitektur kode web, menampilkan masthead majalah independen, nomor edisi, dan struktur teks berbobot intelektual tinggi.",
      palette: ["#F5F2EB", "#0E0E0E", "#FF4D1C"],
      image: "/images/posters/poster-editorial-01.svg",
      coverImage: "/images/posters/poster-editorial-01.svg",
      tools: ["Adobe InDesign", "Photoshop", "Editorial Design", "Typefoundry"],
      gallery: [
        {
          id: "edit-01",
          index: "01",
          title: "The Editorial Manifesto",
          subtitle: "Digital Publishing & Architectural Typography",
          image: "/images/posters/poster-editorial-01.svg",
          dimensions: "500 × 700 MM (B2)",
          concept: "Eksplorasi masthead majalah cetak dengan drop cap, metadata marginalia, dan teks editorial.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-editorial-01.svg]",
        },
        {
          id: "edit-02",
          index: "02",
          title: "Code As Literature",
          subtitle: "Structured Poetry of Fullstack Engineering",
          image: "/images/posters/poster-editorial-02.svg",
          dimensions: "500 × 700 MM (B2)",
          concept: "Visualisasi kode sumber dan alur CMS sebagai naskah sastra yang ditata dengan tipografi prestisius.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-editorial-02.svg]",
        },
        {
          id: "edit-03",
          index: "03",
          title: "Typographic Discipline",
          subtitle: "Drop Caps, Marginalia & Rigid 12-Column Grids",
          image: "/images/posters/poster-editorial-03.svg",
          dimensions: "500 × 700 MM (B2)",
          concept: "Studi mendalam perlakuan teks mikro dan makro untuk meningkatkan keterbacaan artikel panjang.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-editorial-03.svg]",
        },
      ],
    },
    {
      id: "poster-series-3",
      index: "03",
      title: "TECHNICAL BRUTALISM & DEV CULTURE",
      subtitle: "POS Logistics, Regional Honor & Competitive Records",
      year: "2023 — 2024",
      category: "Technical / Brutalist [ISI: Kategori Detail]",
      aspectRatio: "portrait",
      description:
        "Eksplorasi poster teknis berestetika industrial terinspirasi dari arsitektur POS berkecepatan tinggi, barcode optik, serta kejuaraan rekayasa web kompetitif LKS di tingkat wilayah.",
      palette: ["#0A0A0C", "#FF4D1C", "#F2EFE9"],
      image: "/images/posters/poster-tech-01.svg",
      coverImage: "/images/posters/poster-tech-01.svg",
      tools: ["Vector Drafting", "JetBrains Mono", "Technical Schematics"],
      gallery: [
        {
          id: "tech-01",
          index: "01",
          title: "Zero Latency POS Core",
          subtitle: "Circuitry & Realtime Point-of-Sale Systems",
          image: "/images/posters/poster-tech-01.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Poster bertema latensi rendah dalam sistem kasir ritel offline-first dan transmisi data instan.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-tech-01.svg]",
        },
        {
          id: "tech-02",
          index: "02",
          title: "Regional Podium Record",
          subtitle: "LKS Competitive Web Engineering",
          image: "/images/posters/poster-tech-02.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Penghormatan atas torehan podium Juara 1 Kab. Tangerang dan Juara 3 Banten dalam rekayasa web.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-tech-02.svg]",
        },
        {
          id: "tech-03",
          index: "03",
          title: "Fullstack Engineering Methodology",
          subtitle: "Laravel Core × Next.js Reactivity",
          image: "/images/posters/poster-tech-03.svg",
          dimensions: "700 × 1000 MM (B1)",
          concept: "Komposisi diagram alur data, komponen modular, dan filosofi rekayasa kode bersih berstandar industri.",
          notes: "[ISI: Ganti file poster dengan scan/desain asli di public/images/posters/poster-tech-03.svg]",
        },
      ],
    },
  ],

  contact: {
    email: "supergamingtop@gmail.com", // [ISI: email resmi]
    city: "Tangerang",
    country: "Indonesia",
    github: {
      label: "github.com/Sanlinex",
      url: "https://github.com/Sanlinex",
    },
    linkedin: {
      label: "linkedin.com/in/muh-rafli-ichsan",
      url: "https://linkedin.com/in/muh-rafli-ichsan",
    },
    instagram: {
      label: "@ichsan.projects",
      url: "https://instagram.com/ichsan.projects",
    },
  },
};

export default PROFILE_DATA;
