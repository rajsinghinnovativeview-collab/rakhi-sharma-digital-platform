import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rak.Hi Arts · Rakhi Sharma",
  description: "Art by Rakhi Sharma, with independent visitor information and local experience enquiries for Orchha.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
