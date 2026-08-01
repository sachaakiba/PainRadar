import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totalAnalyses, savedCount, scoreAgg, thisMonthCount] = await Promise.all([
    db.analysis.count({ where: { userId } }),
    db.analysis.count({ where: { userId, saved: true } }),
    db.analysis.aggregate({
      where: { userId },
      _avg: { opportunityScore: true },
      _max: { opportunityScore: true },
    }),
    db.analysis.count({
      where: { userId, createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
    }),
  ]);

  return NextResponse.json({
    totalAnalyses,
    savedCount,
    avgScore: Math.round(scoreAgg._avg.opportunityScore ?? 0),
    bestScore: scoreAgg._max.opportunityScore ?? 0,
    thisMonthCount,
  });
}
