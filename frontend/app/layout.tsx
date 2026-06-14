import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sango",
  description: "Your companion that speaks Cameroonian Pidgin.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-sango-900">{children}</body>
    </html>
  );
}
