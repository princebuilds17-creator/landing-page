"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { ReorderControls } from "@/components/admin/ReorderControls";
import { Project } from "@/types";
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ArrowUpDown,
} from "lucide-react";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [savingReorder, setSavingReorder] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blockingMessage, setBlockingMessage] = useState<string | null>(null);
  const [canDetach, setCanDetach] = useState(false);
  const [cardTitles, setCardTitles] = useState<string[]>([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Reorder Handler (Keyboard Accessible Up / Down)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;

    const newProjects = [...projects];
    // Find original indices in main array
    const itemA = filteredProjects[index];
    const itemB = filteredProjects[targetIndex];
    const originalIndexA = newProjects.findIndex((p) => p.id === itemA.id);
    const originalIndexB = newProjects.findIndex((p) => p.id === itemB.id);

    // Swap
    newProjects[originalIndexA] = itemB;
    newProjects[originalIndexB] = itemA;

    setProjects(newProjects);
    setSavingReorder(true);

    try {
      const res = await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newProjects.map((p) => p.id) }),
      });

      if (res.ok) {
        showToast("Urutan proyek berhasil diperbarui");
      }
    } catch {
      showToast("Gagal menyimpan urutan ke server");
      fetchProjects();
    } finally {
      setSavingReorder(false);
    }
  };

  // Delete Handlers
  const openDeleteModal = (project: Project) => {
    setProjectToDelete(project);
    setBlockingMessage(null);
    setCanDetach(false);
    setCardTitles([]);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    setBlockingMessage(null);

    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        // Blocked because of relations!
        setBlockingMessage(data.error || "Gagal menghapus proyek");
        setCanDetach(Boolean(data.canDetach));
        setCardTitles(data.cardTitles || []);
        setIsDeleting(false);
        return;
      }

      setDeleteModalOpen(false);
      setProjectToDelete(null);
      showToast(`Proyek "${projectToDelete.title}" berhasil dihapus.`);
      fetchProjects();
    } catch (err: any) {
      setBlockingMessage("Terjadi kesalahan koneksi saat menghapus proyek.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmDeleteWithDetach = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/projects/${projectToDelete.id}?detach=true`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setBlockingMessage(data.error || "Gagal melepaskan relasi dan menghapus proyek");
        setIsDeleting(false);
        return;
      }

      setDeleteModalOpen(false);
      setProjectToDelete(null);
      showToast(
        `Proyek "${projectToDelete.title}" berhasil dihapus dan relasi card telah dilepaskan.`
      );
      fetchProjects();
    } catch {
      setBlockingMessage("Terjadi gangguan jaringan saat memproses.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;

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
                <FolderGit2 className="w-6 h-6 text-primary" />
                <span>Manajemen Katalog Proyek</span>
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary">
                Buat, sunting, atur urutan publikasi, atau arsipkan proyek studio
              </p>
            </div>

            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-text-inverted bg-primary hover:bg-primary-hover rounded-xl transition-colors shadow-md shadow-primary/20 min-h-[42px] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </Link>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-surface border border-border rounded-xl p-3.5">
            {/* Search */}
            <div className="sm:col-span-7 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan judul, slug, atau kategori..."
                className="w-full pl-9 pr-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-text-muted flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full py-2 px-3 bg-surface-elevated border border-border rounded-lg text-xs text-text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="all">Semua Status ({projects.length})</option>
                <option value="published">
                  Published ({projects.filter((p) => p.status === "published").length})
                </option>
                <option value="draft">
                  Draft ({projects.filter((p) => p.status === "draft").length})
                </option>
              </select>
            </div>
          </div>

          {/* Table / List Container */}
          {loading ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center text-text-muted font-mono text-xs">
              Memuat katalog proyek dari database...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-text-muted mx-auto opacity-50" />
              <h3 className="text-sm font-semibold text-text-primary">
                Tidak Ada Proyek yang Sesuai
              </h3>
              <p className="text-xs text-text-secondary">
                {searchQuery || statusFilter !== "all"
                  ? "Coba sesuaikan kata kunci pencarian atau ubah filter status."
                  : "Belum ada proyek yang ditambahkan. Buat proyek pertama sekarang."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="text-xs text-primary underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-lg">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-text-secondary">
                  <thead className="bg-surface-elevated border-b border-border text-[11px] font-mono uppercase tracking-wider text-text-muted">
                    <tr>
                      <th className="py-3.5 px-4 w-20 text-center">Urutan</th>
                      <th className="py-3.5 px-4">Proyek &amp; Slug</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Pembaruan</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredProjects.map((project, index) => (
                      <tr
                        key={project.id}
                        className="hover:bg-surface-elevated/60 transition-colors"
                      >
                        {/* Sort Order Controls */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-mono text-text-muted text-[11px] w-4 text-center">
                              {project.sortOrder}
                            </span>
                            <ReorderControls
                              onMoveUp={() => handleMove(index, "up")}
                              onMoveDown={() => handleMove(index, "down")}
                              isFirst={index === 0}
                              isLast={index === filteredProjects.length - 1}
                              itemTitle={project.title}
                              disabled={savingReorder || searchQuery !== "" || statusFilter !== "all"}
                            />
                          </div>
                        </td>

                        {/* Title and Slug */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-text-primary text-sm block">
                              {project.title}
                            </span>
                            <span className="text-[11px] font-mono text-text-muted">
                              /{project.slug}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded bg-surface-elevated border border-border text-text-secondary font-mono text-[11px]">
                            {project.category || "Umum"}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                              project.status === "published"
                                ? "bg-secondary/10 text-secondary border border-secondary/20"
                                : "bg-warning/10 text-warning border border-warning/20"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                project.status === "published" ? "bg-secondary" : "bg-warning"
                              }`}
                            />
                            {project.status}
                          </span>
                        </td>

                        {/* Updated At */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-text-muted">
                          {new Date(project.updatedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {project.status === "published" ? (
                              <Link
                                href={`/projects/${project.slug}`}
                                target="_blank"
                                className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded transition-colors"
                                title="Lihat di Halaman Publik"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            ) : (
                              <Link
                                href={`/admin/preview`}
                                className="p-1.5 text-warning hover:text-warning hover:bg-surface-elevated rounded transition-colors"
                                title="Pratinjau Draft"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}

                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-elevated rounded transition-colors"
                              title="Edit Proyek"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => openDeleteModal(project)}
                              className="p-1.5 text-text-muted hover:text-danger hover:bg-surface-elevated rounded transition-colors"
                              title="Hapus Proyek"
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

              {/* Mobile Card View (< 768px) */}
              <div className="md:hidden divide-y divide-border/60">
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="font-semibold text-text-primary text-sm block">
                          {project.title}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted block">
                          /{project.slug}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          project.status === "published"
                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-border/40">
                      <span className="font-mono text-[11px]">
                        Order #{project.sortOrder} • {project.category || "Umum"}
                      </span>

                      <div className="flex items-center gap-2">
                        <ReorderControls
                          onMoveUp={() => handleMove(index, "up")}
                          onMoveDown={() => handleMove(index, "down")}
                          isFirst={index === 0}
                          isLast={index === filteredProjects.length - 1}
                          itemTitle={project.title}
                          disabled={savingReorder}
                        />

                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="px-2.5 py-1 text-xs font-mono text-primary bg-primary/10 rounded"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(project)}
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

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        itemType="Proyek"
        itemTitle={projectToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onConfirmWithDetach={handleConfirmDeleteWithDetach}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
          setBlockingMessage(null);
          setCanDetach(false);
          setCardTitles([]);
        }}
        isDeleting={isDeleting}
        blockingMessage={blockingMessage}
        canDetach={canDetach}
        cardTitles={cardTitles}
      />
    </div>
  );
}
