import "./globals.css";
import React from "react";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { OpsConsoleShell } from "../components/OpsConsoleShell";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "DEGO Operations Console — Mobility Command Center",
  description:
    "Authoritative operations console for DEGO fleet, driver onboarding, trips, dispatch, and monitoring",
  favicon:
    "https://res.cloudinary.com/le0ehnzr/image/upload/v1794987054/icon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${hankenGrotesk.variable} ${spaceGrotesk.variable} bg-slate-950 text-slate-100 min-h-screen`}
      >
        <AuthProvider>
          <OpsConsoleShell>{children}</OpsConsoleShell>
        </AuthProvider>
      </body>
    </html>
  );
}
