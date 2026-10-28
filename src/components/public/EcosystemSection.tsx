import { Laptop, Sparkles, BookOpen, Layers } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export function EcosystemSection() {
  const ecosystemItems = [
    {
      title: "PRINCE LAB (Digital Project Studio)",
      role: "Studio Inti & Laboratorium Rekayasa",
      description:
        "Rumah eksplorasi teknologi tempat kami merancang arsitektur sistem, membedah implementasi kode, dan merilis studi kasus proyek digital yang terukur.",
      badge: "Core Platform",
      icon: Laptop,
      tag: "Studio",
    },
    {
      title: "Official Publisher (@princee.lab)",
      role: "Kanal Publikasi Proyek & Lab Note",
      description:
        "Akun Instagram resmi untuk mengulas detail fitur produk, release changelog, arsitektur teknis, dan visual breakdown proyek studio.",
      badge: "@princee.lab",
      icon: InstagramIcon,
      tag: "Instagram Publisher",
    },
    {
      title: "Personal Tech Journey (@prince.builds)",
      role: "Catatan Pembelajaran & Refleksi",
      description:
        "Akun Instagram personal yang membagikan pola pikir engineering, tips konsistensi belajar untuk pemula IT, dan behind-the-scenes proses problem solving.",
      badge: "@prince.builds",
      icon: BookOpen,
      tag: "Personal Publisher",
    },
    {
      title: "Eksplorasi Proyek Digital (Katalog Terbuka)",
      role: "Implementasi & Kode Sumber Nyata",
      description:
        "Proyek-proyek terverifikasi (dari web apps, modul backend native, hingga eksperimen UI) yang dijadikan studi pembelajaran langsung.",
      badge: "Open Catalog",
      icon: Layers,
      tag: "Projects",
    },
  ];

  return (
    <section id="ekosistem" className="py-16 sm:py-24 border-t border-border/60 bg-canvas relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Struktur Ekosistem Brand</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
            Sinergi Brand, Studio & Kanal Konten
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            PRINCE LAB menghubungkan studio rekayasa perangkat lunak dengan kanal sosial terdistribusi.
            Setiap konten merujuk langsung ke entitas publisher spesifik yang relevan dengan topik bahasan.
          </p>
        </div>

        {/* Ecosystem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ecosystemItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative bg-surface border border-border rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-5 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface-elevated border border-border text-text-muted">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-primary font-semibold uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <h3 className="text-lg font-bold text-text-primary mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted font-mono mt-0.5">
                      {item.role}
                    </p>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
