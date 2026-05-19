"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitVote, type VoteState } from "@/server/actions";

const initial: VoteState = { ok: false };

export function VoteSheet({
  open,
  choice,
  initialName = "",
  onClose,
  accent,
  label,
}: {
  open: boolean;
  choice: "boy" | "girl" | null;
  initialName?: string;
  onClose: () => void;
  accent: string;
  label: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(submitVote, initial);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (state.ok) {
      const t = setTimeout(onClose, 700);
      return () => clearTimeout(t);
    }
  }, [state.ok, onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(420px,92vw)] rounded-2xl border-0 bg-paper p-0 text-ink shadow-[0_24px_60px_-24px_rgba(20,18,15,0.45)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      <form action={action} className="flex flex-col gap-5 p-7">
        <input type="hidden" name="choice" value={choice ?? ""} />
        <header className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold tracking-tight">اخترت {label}</h2>
          <span className="h-3 w-3 rounded-full" style={{ background: accent }} aria-hidden />
        </header>
        <p className="text-[13.5px] leading-6 text-ink/70">
          اكتب اسمك أنت — حتى نعرف مَن من العائلة اختار {label}. صوت واحد لكل جهاز، ويمكنك تعديل
          اختيارك لاحقاً.
        </p>
        <label className="flex flex-col gap-2 text-[13px] font-medium">
          اسمك
          <input
            ref={inputRef}
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={40}
            autoComplete="name"
            placeholder="مثال: محمد، فاطمة، خالتي سارة"
            className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[15px] outline-none transition-colors focus:border-ink"
          />
        </label>
        {state.error ? (
          <p className="text-[12.5px] text-[oklch(46%_0.18_25)]" role="alert">
            {state.error}
          </p>
        ) : null}
        {state.ok ? (
          <p className="text-[12.5px] text-sage" role="status">
            تم تسجيل اختيارك. شكراً لك.
          </p>
        ) : null}
        <div className="mt-1 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full px-4 text-[13px] text-ink/70 hover:bg-black/5"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={pending}
            className="h-10 rounded-full bg-ink px-5 text-[13.5px] font-semibold text-paper disabled:opacity-60"
          >
            {pending ? "جاري الإرسال…" : "أرسل"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
