import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ verified: false });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });

  return NextResponse.json({ verified: user?.emailVerified ?? false });
}
