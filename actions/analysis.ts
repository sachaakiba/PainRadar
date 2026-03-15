"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-server";
import { analysisSchema } from "@/lib/validations";
import {
  checkCredits,
  getPlanLimitError,
  type PlanLimitErrorType,
} from "@/lib/plan-guard";
import { revalidatePath } from "next/cache";

type Locale = "en" | "fr";

const analysisInclude = {
  painPoints: true,
  productIdeas: true,
  keywordIdeas: true,
  objections: true,
  acquisitionChannels: true,
  recurringPhrases: true,
} as const;

type AnalysisWithRelations = Awaited<
  ReturnType<
    typeof db.analysis.findMany<{ include: typeof analysisInclude }>
  >
>[number];

export async function createAnalysis(formData: {
  query: string;
  topic: string;
  audience?: string;
}): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const parsed = analysisSchema.safeParse(formData);
    if (!parsed.success) {
      const message = parsed.error.errors.map((e) => e.message).join(", ");
      return { success: false, error: message };
    }

    const { query, topic, audience } = parsed.data;
    const session = await requireSession();

    const creditCheck = await checkCredits(session.user.id);
    if (!creditCheck.allowed) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { locale: true },
      });
      const locale = (user?.locale as Locale) || "en";
      return {
        success: false,
        error: getPlanLimitError(creditCheck.error as PlanLimitErrorType, locale),
      };
    }

    const analysis = await db.analysis.create({
      data: {
        userId: session.user.id,
        query,
        topic,
        audience: audience ?? null,
        status: "generating",
        summary: "",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");

    return { success: true, id: analysis.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create analysis";
    return { success: false, error: message };
  }
}

export async function getAnalyses(): Promise<AnalysisWithRelations[]> {
  const session = await requireSession();
  const analyses = await db.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: analysisInclude,
  });
  return analyses;
}

export async function getAnalysis(id: string): Promise<AnalysisWithRelations> {
  const session = await requireSession();
  const analysis = await db.analysis.findUnique({
    where: { id },
    include: analysisInclude,
  });
  if (!analysis || analysis.userId !== session.user.id) {
    throw new Error("Analysis not found");
  }
  return analysis;
}

export async function getSavedAnalyses(): Promise<AnalysisWithRelations[]> {
  const session = await requireSession();
  const analyses = await db.analysis.findMany({
    where: { userId: session.user.id, saved: true },
    orderBy: { createdAt: "desc" },
    include: analysisInclude,
  });
  return analyses;
}

export async function toggleSaveAnalysis(
  id: string
): Promise<AnalysisWithRelations | { success: false; error: string }> {
  const session = await requireSession();
  const analysis = await db.analysis.findUnique({
    where: { id },
  });
  if (!analysis || analysis.userId !== session.user.id) {
    throw new Error("Analysis not found");
  }
  const updated = await db.analysis.update({
    where: { id },
    data: { saved: !analysis.saved },
    include: analysisInclude,
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/saved");
  return updated;
}

export async function deleteAnalysis(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await requireSession();
    const analysis = await db.analysis.findUnique({
      where: { id },
    });
    if (!analysis || analysis.userId !== session.user.id) {
      return { success: false, error: "Analysis not found" };
    }
    await db.analysis.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/saved");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete analysis";
    return { success: false, error: message };
  }
}
