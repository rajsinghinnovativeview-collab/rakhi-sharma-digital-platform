import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rak.Hi Arts · Rakhi Sharma",
  description: "Art by Rakhi Sharma, with independent visitor information and local experience enquiries for Orchha.",
  icons: { icon: [{ url: "https://i.ibb.co/CptKtgPr/Forest-Gold-Monogram-Art-Logo-2.png" }], shortcut: "https://i.ibb.co/CptKtgPr/Forest-Gold-Monogram-Art-Logo-2.png", apple: "https://i.ibb.co/CptKtgPr/Forest-Gold-Monogram-Art-Logo-2.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
