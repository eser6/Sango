import type { Metadata, Viewport } from "next";
import { Varela_Round, Nunito_Sans } from "next/font/google";
import "./globals.css";

const heading = Varela_Round({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const body = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sango",
  description: "Your warm companion that speaks Cameroonian Pidgin, English and French.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF4EC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body text-sango-900 antialiased">{children}</body>
    </html>
  );
}
