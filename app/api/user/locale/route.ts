import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ locale: null });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { locale: true },
  });

  return NextResponse.json({ locale: user?.locale ?? "en" });
}
