import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const nunito = localFont({
  src: "../public/assets/nunito-variable.ttf",
  variable: "--font-nunito",
  weight: "200 1000",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Hair Evaluation Test | Adglow Rajaji",
  description:
    "Take the hair evaluation test to understand your hair and scalp concerns.",
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
