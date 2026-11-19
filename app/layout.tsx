import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { asset } from "@/lib/assets";

const nunito = localFont({
  src: "./fonts/nunito-variable.ttf",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Hair Evaluation Test | Adglow Rajaji",
  description:
    "Take the hair evaluation test to understand your hair and scalp concerns.",

  icons: {
    icon: [
      {
        url: asset("adglow-rajaji.png"),
        sizes: "any",
        type: "image/png",
      },
      {
        url: asset("adglow-rajaji.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: asset("adglow-rajaji.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body
        className={`${nunito.className} m-0 bg-white text-[16px] leading-[1.6] text-[#52525b] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
