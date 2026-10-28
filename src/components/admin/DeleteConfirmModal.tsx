"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AlertTriangle, X, ShieldAlert, Unlink, ExternalLink } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemType: "Proyek" | "Content Card";
  itemTitle: string;
  onConfirm: () => void;
  onConfirmWithDetach?: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  blockingMessage?: string | null;
  canDetach?: boolean;
  cardTitles?: string[];
}

export function DeleteConfirmModal({
  isOpen,
  itemType,
  itemTitle,
  onConfirm,
  onConfirmWithDetach,
  onCancel,
  isDeleting,
  blockingMessage,
  canDetach = false,
  cardTitles = [],
}: DeleteConfirmModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-lg bg-surface-elevated border border-border rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Tutup dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              blockingMessage
                ? "bg-warning/10 text-warning border border-warning/30"
                : "bg-danger/10 text-danger border border-danger/30"
            }`}
          >
            {blockingMessage ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <h2 id="delete-dialog-title" className="text-lg font-bold text-text-primary">
              {blockingMessage
                ? canDetach
                  ? "Proyek Masih Memiliki Relasi Konten"
                  : "Penghapusan Ditolak"
                : `Konfirmasi Hapus ${itemType}`}
            </h2>
            <p id="delete-dialog-desc" className="text-xs text-text-muted font-mono">
              {blockingMessage
                ? "Tindakan pengamanan integritas data sesuai PRD"
                : "Operasi ini bersifat permanen dan tidak dapat dibatalkan."}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        {blockingMessage ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-warning/5 border border-warning/20 space-y-2.5">
              <p className="text-xs text-text-secondary leading-relaxed">
                {blockingMessage}
              </p>
              {cardTitles && cardTitles.length > 0 && (
                <div className="pt-2 border-t border-warning/20">
                  <span className="text-[11px] font-mono text-warning font-semibold block mb-1.5">
                    Kartu Konten yang Masih Menempel:
                  </span>
                  <ul className="list-disc list-inside text-xs font-mono text-text-primary space-y-1 pl-1">
                    {cardTitles.map((title, i) => (
                      <li key={i} className="truncate">
                        {title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {canDetach && (
              <p className="text-xs text-text-muted leading-relaxed">
                * Jika memilih <strong>Lepaskan Relasi &amp; Hapus Proyek</strong>, kartu konten di atas
                akan tetap aman tersimpan sebagai <em>konten mandiri (standalone)</em> dan tidak akan ikut terhapus.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary leading-relaxed">
              Apakah Anda yakin ingin menghapus {itemType.toLowerCase()}:
            </p>
            <div className="p-3.5 rounded-lg bg-surface border border-border font-medium text-sm text-text-primary break-words">
              {itemTitle}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors min-h-[40px]"
          >
            {blockingMessage && !canDetach ? "Tutup" : "Batalkan"}
          </button>

          {blockingMessage && canDetach && (
            <>
              <Link
                href="/admin/content"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-hover border border-border rounded-lg min-h-[40px]"
              >
                <span>Kelola Cards</span>
                <ExternalLink className="w-3.5 h-3.5 text-primary" />
              </Link>

              {onConfirmWithDetach && (
                <button
                  type="button"
                  onClick={onConfirmWithDetach}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-primary bg-danger hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 min-h-[40px]"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>{isDeleting ? "Memproses..." : "Lepaskan Relasi & Hapus Proyek"}</span>
                </button>
              )}
            </>
          )}

          {!blockingMessage && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-text-primary bg-danger hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 min-h-[40px]"
            >
              {isDeleting ? "Menghapus..." : `Ya, Hapus ${itemType}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
