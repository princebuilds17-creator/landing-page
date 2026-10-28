"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ReorderControls } from "@/components/admin/ReorderControls";
import { ContentCard, Project } from "@/types";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderGit2,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";

export default function AdminContentCardsListPage() {
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [savingReorder, setSavingReorder] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<ContentCard | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cardsRes, projectsRes] = await Promise.all([
        fetch("/api/admin/cards"),
        fetch("/api/admin/projects"),
      ]);

      if (cardsRes.ok && projectsRes.ok) {
        const cardsData = await cardsRes.json();
        const projectsData = await projectsRes.json();
        setCards(cardsData.cards || []);
        setProjects(projectsData.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Reorder Handler (Keyboard Accessible Up / Down)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredCards.length) return;

    const newCards = [...cards];
    const itemA = filteredCards[index];
    const itemB = filteredCards[targetIndex];
    const originalIndexA = newCards.findIndex((c) => c.id === itemA.id);
    const originalIndexB = newCards.findIndex((c) => c.id === itemB.id);

    newCards[originalIndexA] = itemB;
    newCards[originalIndexB] = itemA;

    setCards(newCards);
    setSavingReorder(true);

    try {
      const res = await fetch("/api/admin/cards/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newCards.map((c) => c.id) }),
      });

      if (res.ok) {
        showToast("Urutan content card berhasil diperbarui");
      }
    } catch {
      showToast("Gagal menyimpan urutan ke server");
      fetchData();
    } finally {
      setSavingReorder(false);
    }
  };

  const openDeleteModal = (card: ContentCard) => {
    setCardToDelete(card);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/cards/${cardToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDeleteModalOpen(false);
        setCardToDelete(null);
        showToast(`Content card "${cardToDelete.title}" berhasil dihapus.`);
        fetchData();
      }
    } catch {
      alert("Gagal menghapus card");
    } finally {
      setIsDeleting(false);
    }
  };

  const getProjectTitle = (projId?: string | null) => {
    if (!projId) return "Tidak tertaut";
    const found = projects.find((p) => p.id === projId);
    return found ? found.title : "Proyek tidak ditemukan";
  };

  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.publisherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <AdminNavbar />

      <main className="flex-grow py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Toast Notification */}
          {successToast && (
            <div
              role="status"
              className="p-3 bg-secondary/15 border border-secondary/40 text-secondary text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2.5">
                <InstagramIcon className="w-6 h-6 text-primary" />
                <span>Manajemen Content Cards</span>
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary">
                Kelola kartu konten, nama publisher terpisah, dan tautan Instagram yang spesifik
              </p>
            </div>

            <Link
              href="/admin/content/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-colors shadow-md shadow-primary/20 min-h-[42px] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Content Card Baru</span>
            </Link>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-surface border border-border rounded-xl p-3.5">
            <div className="sm:col-span-7 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul atau nama publisher..."
                className="w-full pl-9 pr-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="sm:col-span-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="all">Semua Status ({cards.length})</option>
                <option value="published">
                  Published ({cards.filter((c) => c.status === "published").length})
                </option>
                <option value="draft">
                  Draft ({cards.filter((c) => c.status === "draft").length})
                </option>
              </select>
            </div>
          </div>

          {/* List Container */}
          {loading ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-muted font-mono text-xs">
              Memuat content cards dari database...
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-text-muted mx-auto opacity-50" />
              <h3 className="text-sm font-semibold text-text-primary">
                Tidak Ada Content Card yang Sesuai
              </h3>
              <p className="text-xs text-text-secondary">
                {searchQuery || statusFilter !== "all"
                  ? "Coba sesuaikan kata kunci pencarian atau ubah filter status."
                  : "Belum ada content card yang dibuat. Buat card pertama sekarang."}
              </p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-text-secondary">
                  <thead className="bg-surface-elevated border-b border-border text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="py-3.5 px-4 w-20 text-center">Urutan</th>
                      <th className="py-3.5 px-4">Judul Konten</th>
                      <th className="py-3.5 px-4">Publisher &amp; URL Instagram</th>
                      <th className="py-3.5 px-4">Proyek Tertaut</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredCards.map((card, index) => (
                      <tr
                        key={card.id}
                        className="hover:bg-surface-elevated/60 transition-colors"
                      >
                        {/* Sort Order */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-mono text-text-muted text-[11px] w-4 text-center">
                              {card.sortOrder}
                            </span>
                            <ReorderControls
                              onMoveUp={() => handleMove(index, "up")}
                              onMoveDown={() => handleMove(index, "down")}
                              isFirst={index === 0}
                              isLast={index === filteredCards.length - 1}
                              itemTitle={card.title}
                              disabled={savingReorder || searchQuery !== "" || statusFilter !== "all"}
                            />
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-text-primary text-sm line-clamp-1 block">
                              {card.title}
                            </span>
                            <span className="text-[11px] text-text-muted line-clamp-1">
                              {card.summary}
                            </span>
                          </div>
                        </td>

                        {/* Publisher & Instagram URL */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-mono font-medium text-text-primary flex items-center gap-1.5">
                              <InstagramIcon className="w-3.5 h-3.5 text-primary" />
                              {card.publisherName}
                            </span>
                            <a
                              href={card.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <span>{card.instagramUrl}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        </td>

                        {/* Linked Project */}
                        <td className="py-3.5 px-4">
                          {card.projectId ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated border border-border text-text-secondary text-[11px] font-mono">
                              <FolderGit2 className="w-3 h-3 text-primary" />
                              <span className="truncate max-w-[150px]">
                                {getProjectTitle(card.projectId)}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-text-muted font-mono italic">
                              Mandiri (Standalone)
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                              card.status === "published"
                                ? "bg-secondary/10 text-secondary border border-secondary/20"
                                : "bg-warning/10 text-warning border border-warning/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                card.status === "published" ? "bg-secondary" : "bg-warning"
                              }`}
                            />
                            {card.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={card.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
                              title="Buka Instagram Publisher"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            <Link
                              href={`/admin/content/${card.id}/edit`}
                              className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-elevated rounded transition-colors"
                              title="Edit Content Card"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(card)}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-surface-elevated rounded transition-colors"
                              title="Hapus Content Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-border/60">
                {filteredCards.map((card, index) => (
                  <div key={card.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="font-semibold text-text-primary text-sm block">
                          {card.title}
                        </span>
                        <span className="text-xs font-mono text-primary flex items-center gap-1">
                          <InstagramIcon className="w-3.5 h-3.5" />
                          {card.publisherName}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          card.status === "published"
                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        {card.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/40">
                      <span className="font-mono text-[11px]">Order #{card.sortOrder}</span>

                      <div className="flex items-center gap-2">
                        <ReorderControls
                          onMoveUp={() => handleMove(index, "up")}
                          onMoveDown={() => handleMove(index, "down")}
                          isFirst={index === 0}
                          isLast={index === filteredCards.length - 1}
                          itemTitle={card.title}
                          disabled={savingReorder}
                        />

                        <Link
                          href={`/admin/content/${card.id}/edit`}
                          className="px-2.5 py-1 text-xs font-mono text-primary bg-primary/10 rounded"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(card)}
                          className="p-1.5 text-danger hover:bg-danger/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        itemType="Content Card"
        itemTitle={cardToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCardToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
