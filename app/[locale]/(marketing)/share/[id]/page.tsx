import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { buildSeoMetadata } from "@/lib/seo";
import { SharePreviewClient } from "./share-preview-client";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

async function getShareData(id: string) {
  const analysis = await db.analysis.findUnique({
    where: { id, status: "completed" },
    select: {
      id: true,
      topic: true,
      query: true,
      summary: true,
      opportunityScore: true,
      demandScore: true,
      urgencyScore: true,
      competitionScore: true,
      monetizationScore: true,
      createdAt: true,
      painPoints: {
        select: {
          id: true,
          text: true,
          severityScore: true,
          sentiment: true,
          tags: true,
        },
        orderBy: { severityScore: "desc" },
        take: 3,
      },
      _count: {
        select: {
          painPoints: true,
          productIdeas: true,
          keywordIdeas: true,
          acquisitionChannels: true,
        },
      },
    },
  });

  return analysis;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const analysis = await getShareData(id);

  if (!analysis) {
    return { title: "Analysis not found" };
  }

  return buildSeoMetadata({
    path: `/share/${id}`,
    locale,
    title: `${analysis.topic} — PainRadar Analysis`,
    description: `Opportunity score: ${analysis.opportunityScore}/100. ${analysis._count.painPoints} pain points identified. ${analysis.summary.slice(0, 120)}...`,
  });
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("analysis");

  const analysis = await getShareData(id);

  if (!analysis) {
    notFound();
  }

  return (
    <SharePreviewClient
      analysis={{
        id: analysis.id,
        topic: analysis.topic,
        query: analysis.query,
        summary: analysis.summary,
        opportunityScore: analysis.opportunityScore,
        demandScore: analysis.demandScore,
        urgencyScore: analysis.urgencyScore,
        competitionScore: analysis.competitionScore,
        monetizationScore: analysis.monetizationScore,
        createdAt: analysis.createdAt.toISOString(),
        painPoints: analysis.painPoints,
        totalPainPoints: analysis._count.painPoints,
        totalProductIdeas: analysis._count.productIdeas,
        totalKeywords: analysis._count.keywordIdeas,
        totalChannels: analysis._count.acquisitionChannels,
      }}
    />
  );
}
