"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readVoteCookie, writeVoteCookie } from "./cookies";
import { getClientId } from "./ip";
import { rateLimit } from "./ratelimit";
import { countVotesByIp, getVoteById, insertVote, MAX_PER_IP, updateVoteById } from "./store";

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

  const { ipHash } = await getClientId();

  const rl = rateLimit(ipHash);
  if (!rl.allowed) {
    const seconds = Math.ceil(rl.resetIn / 1000);
    return { ok: false, error: `محاولات كثيرة — أعد المحاولة بعد ${seconds} ثانية` };
  }

  const patch: { choice: "boy" | "girl"; name: string; babyName: string | null } = {
    choice: choiceRaw,
    name: nameRaw,
    babyName: babyRaw || null,
  };

  const cookieVoteId = await readVoteCookie();
  let saved = cookieVoteId ? await getVoteById(cookieVoteId) : null;

  if (saved) {
    saved = await updateVoteById(saved.id, patch);
  } else {
    const existingFromThisIp = await countVotesByIp(ipHash);
    if (existingFromThisIp >= MAX_PER_IP)
      return {
        ok: false,
        error: `بلغ هذا المنزل الحدّ الأقصى (${MAX_PER_IP} أصوات). امسح ذاكرة المتصفّح للتعديل.`,
      };
    saved = await insertVote({ ...patch, ipHash });
    await writeVoteCookie(saved.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}
