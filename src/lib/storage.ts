import fs from "fs";
import path from "path";
import { Project, ContentCard, AnalyticsEvent } from "@/types";

interface DatabaseSchema {
  projects: Project[];
  cards: ContentCard[];
  analytics: AnalyticsEvent[];
  lastUpdated: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "prince_lab_data.json");

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "MotoCheck (Placeholder Contoh)",
    slug: "motocheck-placeholder",
    summary: "Platform diagnostik dan catatan servis kendaraan berbasis web untuk membantu pemula memahami arsitektur aplikasi CRUD modern.",
    description: `### Ringkasan Proyek
**Catatan Penting:** Proyek ini merupakan data contoh/placeholder untuk demonstrasi struktur katalog PRINCE LAB. Detail spesifikasi, repositori, dan link resmi akan diverifikasi oleh pemilik brand sebelum peluncuran produksi.

### Tujuan Belajar
1. Memahami arsitektur Clean Architecture pada aplikasi web.
2. Manajemen state, form validation, dan caching lokal.
3. Desain antarmuka responsif dark mode yang nyaman bagi pengguna montir dan pemilik kendaraan.

### Teknologi & Modul
- Frontend: Next.js & Tailwind CSS
- Data Persistence: PostgreSQL / Local Storage Fallback
- Monitoring: System Health & Service History Ledger`,
    image: "/images/teaser/1.png",
    imageAlt: "Tampilan mockup kartu preview proyek MotoCheck",
    category: "Web Development",
    externalUrl: "https://www.instagram.com/princee.lab/",
    status: "published",
    sortOrder: 1,
    seoTitle: "MotoCheck — Dokumentasi Proyek | PRINCE LAB",
    seoDescription: "Studi kasus arsitektur web diagnostik kendaraan oleh PRINCE LAB.",
    createdAt: "2026-10-20T08:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-20T08:00:00.000Z",
  },
  {
    id: "proj-2",
    title: "Portfolio Website Studio (Placeholder Contoh)",
    slug: "portfolio-website-placeholder",
    summary: "Desain sistem personal tech brand dan hub konten multi-publisher yang cepat, minimalis, dan aksesibel bagi pelajar IT.",
    description: `### Ringkasan Proyek
Dokumentasi pengembangan platform PRINCE LAB sebagai personal tech brand sekaligus digital project studio. Mengutamakan performa Core Web Vitals, kontras tinggi, dan aksesibilitas keyboard lengkap.

### Sorotan Utama
- Pemuatan statis secepat kilat dengan SSG & Server Components.
- Navigasi keyboard penuh untuk modal dialog, form, dan pengurutan list.
- Integrasi card tautan Instagram spesifik per publisher.`,
    image: "/images/teaser/2.png",
    imageAlt: "Pratinjau antarmuka portfolio studio PRINCE LAB",
    category: "Design System",
    externalUrl: "https://www.instagram.com/princee.lab/",
    status: "published",
    sortOrder: 2,
    seoTitle: "Portfolio Studio — PRINCE LAB",
    seoDescription: "Desain sistem dan arsitektur web studio PRINCE LAB.",
    createdAt: "2026-10-22T09:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-22T09:00:00.000Z",
  },
  {
    id: "proj-3",
    title: "PHP Native Apps Collection (Placeholder Contoh)",
    slug: "php-native-apps-placeholder",
    summary: "Serangkaian modul pembelajaran konsep dasar logika backend, routing HTTP, dan query database tanpa framework.",
    description: `### Ringkasan Proyek
Modul edukasi untuk siswa IT yang baru memulai pemrograman backend. Membongkar konsep dasar HTTP request-response, sesi pengguna, dan sanitasi input database sebelum beralih ke framework modern.`,
    image: "/images/teaser/3.png",
    imageAlt: "Diagram alur eksekusi PHP Native untuk pemula IT",
    category: "Backend Fundamentals",
    externalUrl: "https://www.instagram.com/princee.lab/",
    status: "published",
    sortOrder: 3,
    seoTitle: "PHP Native Fundamentals — PRINCE LAB",
    seoDescription: "Koleksi modul dasar backend untuk pemula IT.",
    createdAt: "2026-10-24T10:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-24T10:00:00.000Z",
  },
  {
    id: "proj-4",
    title: "Eksperimen AI & Agentic Workflow (Draft Contoh)",
    slug: "eksperimen-ai-draft",
    summary: "Riset internal integrasi LLM dan tools otomatisasi koding untuk akselerasi alur kerja pengembang pemula.",
    description: "Proyek ini masih berstatus draft internal dan tidak boleh muncul pada katalog publik.",
    image: "/images/teaser/1.png",
    imageAlt: "Konsep eksperimen AI lab internal",
    category: "AI Research",
    status: "draft",
    sortOrder: 4,
    createdAt: "2026-10-26T11:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: null,
  },
];

const INITIAL_CARDS: ContentCard[] = [
  {
    id: "card-1",
    title: "Teaser Peluncuran PRINCE LAB — Learn. Build. Share.",
    summary: "Pengumuman perdana hadirnya PRINCE LAB sebagai ruang eksplorasi karya digital dan wadah belajar teknologi untuk pemula.",
    publisherName: "@princee.lab",
    instagramUrl: "https://www.instagram.com/princee.lab/",
    projectId: "proj-2",
    thumbnail: "/images/teaser/1.png",
    thumbnailAlt: "Poster teaser peluncuran resmi PRINCE LAB",
    contentDate: "2026-10-25",
    category: "Announcement",
    status: "published",
    sortOrder: 1,
    isFeatured: true,
    createdAt: "2026-10-25T12:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-25T12:00:00.000Z",
  },
  {
    id: "card-2",
    title: "Bedah Arsitektur MotoCheck: Dari Ide ke Kode",
    summary: "Kupas tuntas diagram ERD, skema database, dan tantangan performa saat membangun antarmuka web responsif.",
    publisherName: "@princee.lab",
    instagramUrl: "https://www.instagram.com/princee.lab/",
    projectId: "proj-1",
    thumbnail: "/images/teaser/2.png",
    thumbnailAlt: "Infografis arsitektur teknis sistem MotoCheck",
    contentDate: "2026-10-26",
    category: "Architecture",
    status: "published",
    sortOrder: 2,
    isFeatured: true,
    createdAt: "2026-10-26T14:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-26T14:00:00.000Z",
  },
  {
    id: "card-3",
    title: "5 Tips Memulai Proyek IT Pertama Tanpa Overwhelmed",
    summary: "Panduan praktis memilih lingkup proyek yang realistis, fokus menyelesaikan MVP, dan mendokumentasikan prosesnya.",
    publisherName: "@prince.builds",
    instagramUrl: "https://instagram.com/prince.builds",
    projectId: null,
    thumbnail: "/images/teaser/3.png",
    thumbnailAlt: "Tips praktis untuk pemula membangun proyek perangkat lunak pertama",
    contentDate: "2026-10-27",
    category: "Career & Learning",
    status: "published",
    sortOrder: 3,
    isFeatured: true,
    createdAt: "2026-10-27T09:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: "2026-10-27T09:00:00.000Z",
  },
  {
    id: "card-4",
    title: "Riset Prompting & Agentic Workflow untuk Mahasiswa IT (Draft)",
    summary: "Catatan eksperimen awal memanfaatkan AI tooling untuk mempercepat debugging dan unit testing.",
    publisherName: "@princee.lab",
    instagramUrl: "https://www.instagram.com/princee.lab/",
    projectId: "proj-4",
    thumbnail: "/images/teaser/1.png",
    thumbnailAlt: "Draft catatan riset AI PRINCE LAB",
    contentDate: "2026-10-28",
    category: "AI Research",
    status: "draft",
    sortOrder: 4,
    isFeatured: false,
    createdAt: "2026-10-28T08:00:00.000Z",
    updatedAt: "2026-10-28T10:00:00.000Z",
    publishedAt: null,
  },
];

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: DatabaseSchema = {
        projects: INITIAL_PROJECTS,
        cards: INITIAL_CARDS,
        analytics: [],
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw) as DatabaseSchema;
    return data;
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
    return {
      projects: INITIAL_PROJECTS,
      cards: INITIAL_CARDS,
      analytics: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error("Error writing database file:", err);
    throw new Error("Gagal menyimpan data ke sistem penyimpanan");
  }
}

export const storage = {
  // PROJECTS
  getProjects(options: { includeDrafts?: boolean } = {}): Project[] {
    const db = readDb();
    let list = [...db.projects];
    if (!options.includeDrafts) {
      list = list.filter((p) => p.status === "published");
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt));
  },

  getProjectBySlug(slug: string, options: { includeDrafts?: boolean } = {}): Project | null {
    const db = readDb();
    const project = db.projects.find((p) => p.slug === slug);
    if (!project) return null;
    if (!options.includeDrafts && project.status !== "published") {
      return null;
    }
    return project;
  },

  getProjectById(id: string): Project | null {
    const db = readDb();
    return db.projects.find((p) => p.id === id) || null;
  },

  createProject(input: Omit<Project, "id" | "createdAt" | "updatedAt">): Project {
    const db = readDb();
    // Check slug uniqueness
    if (db.projects.some((p) => p.slug === input.slug)) {
      throw new Error(`Slug "${input.slug}" sudah digunakan oleh proyek lain. Gunakan slug yang unik.`);
    }

    const maxSort = db.projects.reduce((max, p) => Math.max(max, p.sortOrder || 0), 0);
    const now = new Date().toISOString();

    const newProject: Project = {
      ...input,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sortOrder: input.sortOrder !== undefined ? input.sortOrder : maxSort + 1,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === "published" ? now : null,
    };

    db.projects.push(newProject);
    writeDb(db);
    return newProject;
  },

  updateProject(id: string, input: Partial<Project>): Project {
    const db = readDb();
    const index = db.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Proyek tidak ditemukan");
    }

    const current = db.projects[index];

    // Check slug uniqueness if changed
    if (input.slug && input.slug !== current.slug) {
      if (db.projects.some((p) => p.slug === input.slug && p.id !== id)) {
        throw new Error(`Slug "${input.slug}" sudah digunakan oleh proyek lain`);
      }
    }

    const now = new Date().toISOString();
    const isNowPublished = input.status === "published" && current.status !== "published";

    const updated: Project = {
      ...current,
      ...input,
      id: current.id, // Immutable
      updatedAt: now,
      publishedAt: isNowPublished ? now : current.publishedAt,
    };

    db.projects[index] = updated;
    writeDb(db);
    return updated;
  },

  deleteProject(
    id: string,
    options: { detachCards?: boolean } = {}
  ): { success: boolean; linkedCardsCount: number; cardTitles: string[]; detachedCount?: number } {
    const db = readDb();
    const project = db.projects.find((p) => p.id === id);
    if (!project) {
      throw new Error("Proyek tidak ditemukan");
    }

    // Check relations - PRD strictly forbids silent deletion of relations!
    const linkedCards = db.cards.filter((c) => c.projectId === id);
    if (linkedCards.length > 0) {
      if (!options.detachCards) {
        return {
          success: false,
          linkedCardsCount: linkedCards.length,
          cardTitles: linkedCards.map((c) => c.title),
        };
      }

      // Explicitly detach relations upon admin confirmation (cards preserved as standalone)
      db.cards.forEach((c) => {
        if (c.projectId === id) {
          c.projectId = null;
          c.updatedAt = new Date().toISOString();
        }
      });
    }

    db.projects = db.projects.filter((p) => p.id !== id);
    writeDb(db);
    return {
      success: true,
      linkedCardsCount: 0,
      cardTitles: [],
      detachedCount: linkedCards.length,
    };
  },

  reorderProjects(orderedIds: string[]): Project[] {
    const db = readDb();
    orderedIds.forEach((id, index) => {
      const p = db.projects.find((item) => item.id === id);
      if (p) {
        p.sortOrder = index + 1;
        p.updatedAt = new Date().toISOString();
      }
    });
    writeDb(db);
    return this.getProjects({ includeDrafts: true });
  },

  // CONTENT CARDS
  getContentCards(options: { includeDrafts?: boolean; projectId?: string } = {}): ContentCard[] {
    const db = readDb();
    let list = [...db.cards];

    if (!options.includeDrafts) {
      // PRD rule: Card that belongs to an unpublished/draft project must NOT appear publicly!
      const publishedProjectIds = new Set(
        db.projects.filter((p) => p.status === "published").map((p) => p.id)
      );

      list = list.filter((card) => {
        if (card.status !== "published") return false;
        if (card.projectId && !publishedProjectIds.has(card.projectId)) return false;
        return true;
      });
    }

    if (options.projectId) {
      list = list.filter((c) => c.projectId === options.projectId);
    }

    return list.sort((a, b) => a.sortOrder - b.sortOrder || b.updatedAt.localeCompare(a.updatedAt));
  },

  getContentCardById(id: string): ContentCard | null {
    const db = readDb();
    return db.cards.find((c) => c.id === id) || null;
  },

  createContentCard(input: Omit<ContentCard, "id" | "createdAt" | "updatedAt">): ContentCard {
    const db = readDb();
    const maxSort = db.cards.reduce((max, c) => Math.max(max, c.sortOrder || 0), 0);
    const now = new Date().toISOString();

    const newCard: ContentCard = {
      ...input,
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sortOrder: input.sortOrder !== undefined ? input.sortOrder : maxSort + 1,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === "published" ? now : null,
    };

    db.cards.push(newCard);
    writeDb(db);
    return newCard;
  },

  updateContentCard(id: string, input: Partial<ContentCard>): ContentCard {
    const db = readDb();
    const index = db.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Content card tidak ditemukan");
    }

    const current = db.cards[index];
    const now = new Date().toISOString();
    const isNowPublished = input.status === "published" && current.status !== "published";

    const updated: ContentCard = {
      ...current,
      ...input,
      id: current.id,
      updatedAt: now,
      publishedAt: isNowPublished ? now : current.publishedAt,
    };

    db.cards[index] = updated;
    writeDb(db);
    return updated;
  },

  deleteContentCard(id: string): boolean {
    const db = readDb();
    const index = db.cards.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Content card tidak ditemukan");
    }
    db.cards.splice(index, 1);
    writeDb(db);
    return true;
  },

  reorderContentCards(orderedIds: string[]): ContentCard[] {
    const db = readDb();
    orderedIds.forEach((id, index) => {
      const c = db.cards.find((item) => item.id === id);
      if (c) {
        c.sortOrder = index + 1;
        c.updatedAt = new Date().toISOString();
      }
    });
    writeDb(db);
    return this.getContentCards({ includeDrafts: true });
  },

  // ANALYTICS
  recordAnalytics(event: Omit<AnalyticsEvent, "id" | "timestamp">): void {
    try {
      const db = readDb();
      const newEvent: AnalyticsEvent = {
        ...event,
        id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
      };
      // Keep last 1000 events
      db.analytics.unshift(newEvent);
      if (db.analytics.length > 1000) {
        db.analytics = db.analytics.slice(0, 1000);
      }
      writeDb(db);
    } catch (err) {
      console.error("Failed to record analytics event:", err);
    }
  },

  getAnalyticsSummary() {
    const db = readDb();
    const pageViews = db.analytics.filter((e) => e.eventType === "page_view").length;
    const projectViews = db.analytics.filter((e) => e.eventType === "project_view").length;
    const outboundClicks = db.analytics.filter((e) => e.eventType === "instagram_outbound_click").length;
    return {
      pageViews,
      projectViews,
      outboundClicks,
      totalEvents: db.analytics.length,
      recentEvents: db.analytics.slice(0, 10),
    };
  },
};
