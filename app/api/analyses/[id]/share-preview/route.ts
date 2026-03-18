import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ preview: analysis });
}
