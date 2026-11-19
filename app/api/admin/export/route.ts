import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cell(value: unknown) {
  let s = value == null ? "" : String(value).replace(/\r?\n/g, " ");
  // Prevent spreadsheet formula injection from user-supplied values.
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return /[",]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const rows = await prisma.submission.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });
  const head = ["Date", "Source", "Name", "Phone", "Email", "Age", "Gender", "Score", "Band", "Concern", "TeleCRM", "URL"];
  const lines = rows.map((r) =>
    [r.createdAt.toISOString(), r.source, r.name, r.phone, r.email, r.age, r.gender, r.score, r.band, r.concern, r.telecrmStatus, r.pageUrl]
      .map(cell)
      .join(","),
  );
  return new NextResponse([head.join(","), ...lines].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads_${Date.now()}.csv"`,
    },
  });
}
