import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const analysis = await db.analysis.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      painPoints: true,
      productIdeas: true,
      keywordIdeas: true,
      objections: true,
      acquisitionChannels: true,
      recurringPhrases: true,
    },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const analysis = await db.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!analysis) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.analysis.update({
    where: { id },
    data: { saved: body.saved ?? analysis.saved },
  });

  return NextResponse.json({ analysis: updated });
}
