import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resultForScore } from "@/lib/hair-score";
import { ScorePage } from "@/components/evaluation/score-page";

export const metadata: Metadata = {
  title: "Your Hair Score | Adglow Rajaji",
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={<p className="mt-24 text-center">Loading your score...</p>}
    >
      <Score />
    </Suspense>
  );
}

async function Score() {
  // The lead id lives in a cookie set when the evaluation was submitted,
  // so the address stays a clean /score.
  const id = (await cookies()).get("score_id")?.value;
  const row = id
    ? await prisma.submission.findUnique({ where: { id } })
    : null;
  if (
    !row ||
    row.score == null ||
    (row.gender !== "male" && row.gender !== "female")
  )
    redirect("/");

  return (
    <ScorePage
      profile={{
        name: row.name,
        mobile: row.phone,
        email: row.email ?? "",
        age: row.age ?? "",
        gender: row.gender,
      }}
      result={resultForScore(row.score)}
    />
  );
}
