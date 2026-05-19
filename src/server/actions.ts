"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { insertVote } from "./store";

export type VoteState = { ok: boolean; error?: string };

const NAME_RE = /^[\p{L}\p{M}\s'.-]{2,40}$/u;
const BABY_RE = /^[\p{L}\p{M}\s'.-]{1,40}$/u;

export async function submitVote(_prev: VoteState, fd: FormData): Promise<VoteState> {
  const choiceRaw = String(fd.get("choice") ?? "");
  const nameRaw = String(fd.get("name") ?? "").trim();
  const babyRaw = String(fd.get("babyName") ?? "").trim();
  if (choiceRaw !== "boy" && choiceRaw !== "girl") return { ok: false, error: "اختيار غير صالح" };
  if (!NAME_RE.test(nameRaw)) return { ok: false, error: "اسم غير صالح — حرفين على الأقل" };
  if (babyRaw && !BABY_RE.test(babyRaw)) return { ok: false, error: "اسم المولود غير صالح" };

  await insertVote({ choice: choiceRaw, name: nameRaw, babyName: babyRaw || null });
  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}
