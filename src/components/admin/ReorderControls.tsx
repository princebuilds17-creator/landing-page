"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

interface ReorderControlsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  itemTitle: string;
  disabled?: boolean;
}

export function ReorderControls({
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  itemTitle,
  disabled,
}: ReorderControlsProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Ubah urutan untuk ${itemTitle}`}>
      <button
        type="button"
        onClick={onMoveUp}
        disabled={isFirst || disabled}
        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
        aria-label={`Pindahkan ${itemTitle} ke atas`}
        title="Pindahkan ke atas"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onMoveDown}
        disabled={isLast || disabled}
        className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface border border-transparent hover:border-border rounded disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary min-h-[36px] min-w-[36px] flex items-center justify-center"
        aria-label={`Pindahkan ${itemTitle} ke bawah`}
        title="Pindahkan ke bawah"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
