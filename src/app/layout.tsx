import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "LocalTrust — Find local professionals you can trust", description: "Discover, compare and book trusted service professionals in your neighbourhood." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
