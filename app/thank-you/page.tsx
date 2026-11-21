import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ThankYouPage } from "@/components/consultation/thank-you-page";

export const metadata: Metadata = {
  title: "Thank You | Adglow Rajaji",
  robots: { index: false },
};

export default function Page() {
  return (
    <Suspense fallback={<p className="mt-24 text-center">Loading...</p>}>
      <ThankYou />
    </Suspense>
  );
}

async function ThankYou() {
  // Set by /api/submissions when a consultation request is saved.
  const id = (await cookies()).get("thank_you_id")?.value;
  const row = id
    ? await prisma.submission.findUnique({ where: { id } })
    : null;
  if (!row) redirect("/");
  return <ThankYouPage name={row.name} />;
}
