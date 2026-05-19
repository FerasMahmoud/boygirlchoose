"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getIpHash } from "./ip";
import { upsertVote } from "./store";

export type VoteState = { ok: boolean; error?: string };

const NAME_RE = /^[\p{L}\p{M}\s'.-]{2,40}$/u;

export async function submitVote(_prev: VoteState, fd: FormData): Promise<VoteState> {
  const choiceRaw = String(fd.get("choice") ?? "");
  const nameRaw = String(fd.get("name") ?? "").trim();
  if (choiceRaw !== "boy" && choiceRaw !== "girl") return { ok: false, error: "اختيار غير صالح" };
  if (!NAME_RE.test(nameRaw)) return { ok: false, error: "اسم غير صالح — حرفين على الأقل" };

  const ipHash = await getIpHash();
  await upsertVote({ choice: choiceRaw, name: nameRaw, ipHash });
  revalidatePath("/dashboard");
  revalidatePath("/");
  redirect("/dashboard");
}
