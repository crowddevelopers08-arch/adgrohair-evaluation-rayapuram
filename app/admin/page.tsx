import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { readableAnswers } from "@/lib/answers";
import { BrandLogo } from "@/components/evaluation/brand-logo";
import { LeadDetails, type LeadView } from "./lead-details";

export const metadata: Metadata = {
  title: "Admin | Leads",
  robots: { index: false },
};

type Params = Promise<{ q?: string; page?: string }>;

const PAGE_SIZE = 25;
const bandLabel: Record<string, string> = {
  "needs-attention": "Needs attention",
  "some-concerns": "Some concerns",
  "fewer-concerns": "Fewer concerns",
};
const bandColor: Record<string, string> = {
  "needs-attention": "bg-red-100 text-red-800",
  "some-concerns": "bg-amber-100 text-amber-800",
  "fewer-concerns": "bg-green-100 text-green-800",
};

export default function AdminPage({ searchParams }: { searchParams: Params }) {
  return (
    <div className="min-h-screen bg-[#faf7f6]">
      <header className="border-b border-brand-border bg-[#fffaf9]">
        <div className="mx-auto flex max-w-[1350px] items-center justify-between gap-4 px-4 py-2">
          <Link href="/" aria-label="Adglow Rajaji home">
            <BrandLogo />
          </Link>
          <div className="text-right">
            <div className="text-lg font-bold text-brand">Leads Dashboard</div>
            <div className="text-xs">Hair Evaluation Test</div>
          </div>
        </div>
      </header>
      <main className="px-4 py-6">
        <Suspense fallback={<p className="mt-24 text-center">Loading...</p>}>
          <Dashboard searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

// Start of "today" in IST, independent of the server's timezone.
function startOfTodayIST() {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const DAY = 24 * 60 * 60 * 1000;
  return new Date(Math.floor((Date.now() + IST_OFFSET) / DAY) * DAY - IST_OFFSET);
}

function buildView(
  r: {
    name: string;
    phone: string;
    email: string | null;
    age: string | null;
    gender: string | null;
    score: number | null;
    band: string | null;
    source: string;
    pageUrl: string | null;
    telecrmStatus: string | null;
    createdAt: Date;
    answers: unknown;
    medicalDetail: string | null;
  },
  date: string,
): LeadView {
  const qa = readableAnswers(r.gender, r.answers);
  return {
    name: r.name,
    date,
    fields: [
      { label: "Name", value: r.name },
      { label: "Mobile", value: r.phone },
      { label: "Email", value: r.email || "-" },
      { label: "Age", value: r.age || "-" },
      { label: "Gender", value: r.gender ? r.gender[0].toUpperCase() + r.gender.slice(1) : "-" },
      {
        label: "Hair score",
        value:
          r.score != null
            ? `${r.score}/100${r.band ? ` (${bandLabel[r.band] ?? r.band})` : ""}`
            : "-",
      },
      { label: "Form", value: r.source },
      { label: "TeleCRM", value: r.telecrmStatus || "-" },
      { label: "Page URL", value: r.pageUrl || "-" },
    ],
    qa,
    medicalDetail: r.medicalDetail || undefined,
  };
}

async function Dashboard({ searchParams }: { searchParams: Params }) {
  await connection(); // render at request time (uses the current time + live DB data)
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { phone: { contains: query } },
          { email: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};
  const startOfDay = startOfTodayIST();

  const [rows, filtered, total, today, avg, needs] = await Promise.all([
    prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.submission.count({ where }),
    prisma.submission.count(),
    prisma.submission.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.submission.aggregate({ _avg: { score: true } }),
    prisma.submission.count({ where: { band: "needs-attention" } }),
  ]);
  const pages = Math.max(1, Math.ceil(filtered / PAGE_SIZE));
  const link = (p: number) => {
    const params = new URLSearchParams({ page: String(p) });
    if (query) params.set("q", query);
    return `/admin?${params}`;
  };
  const fmt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const stats: [string, string | number][] = [
    ["Total leads", total],
    ["Today", today],
    ["Avg. score", avg._avg.score != null ? Math.round(avg._avg.score) : "-"],
    ["Needs attention", needs],
  ];

  return (
    <div className="mx-auto max-w-[1350px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-semibold tracking-wide uppercase">{label}</div>
            <div className="mt-1 text-3xl font-bold text-brand">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <form className="flex min-w-[260px] flex-1 gap-2" action="/admin">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, phone or email"
            className="h-10 flex-1 rounded-full border border-[#c9c9c9] bg-white px-4 text-sm"
          />
          <button className="rounded-full bg-brand px-5 text-sm font-semibold text-white">
            Search
          </button>
        </form>
        <a
          href={`/api/admin/export${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          className="rounded-full border border-brand px-4 py-2 text-sm font-semibold text-brand"
        >
          Export CSV
        </a>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-brand-gradient text-xs tracking-wide text-white uppercase">
            <tr>
              {["#", "Date (IST)", "Name", "Mobile", "Email", "Age", "Gender", "Score", "Details"].map(
                (h) => (
                  <th key={h} className="px-3 py-3 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-12 text-center">
                  No leads found.
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const date = fmt.format(r.createdAt);
              return (
                <tr
                  key={r.id}
                  className="border-t border-brand-border even:bg-[#fffaf9] hover:bg-brand-soft"
                >
                  <td className="px-3 py-3 text-[#768394]">
                    {filtered - (page - 1) * PAGE_SIZE - i}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">{date}</td>
                  <td className="px-3 py-3 font-semibold text-brand-dark">{r.name}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <a href={`tel:${r.phone}`} className="text-brand">
                      {r.phone}
                    </a>
                  </td>
                  <td className="px-3 py-3">{r.email || "-"}</td>
                  <td className="px-3 py-3">{r.age || "-"}</td>
                  <td className="px-3 py-3 capitalize">{r.gender || "-"}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-bold text-brand-dark">{r.score ?? "-"}</span>
                    {r.band && (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${bandColor[r.band] ?? ""}`}
                      >
                        {bandLabel[r.band] ?? r.band}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <LeadDetails lead={buildView(r, date)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>
          {filtered} result{filtered === 1 ? "" : "s"} · Page {page} of {pages}
        </span>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={link(page - 1)} className="rounded-full border border-brand px-4 py-1.5 text-brand">
              Previous
            </a>
          )}
          {page < pages && (
            <a href={link(page + 1)} className="rounded-full border border-brand px-4 py-1.5 text-brand">
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
