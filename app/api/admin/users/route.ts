import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { db } from "@/lib/db";
import type { Role } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.$queryRaw<Array<{ role: string | null }>>`
    SELECT "role"::text AS "role"
    FROM "users"
    WHERE "id" = ${session.user.id}
    LIMIT 1
  `;
  const role = (rows[0]?.role as Role | undefined) ?? "USER";

  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      locale: true,
      plan: true,
      credits: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
