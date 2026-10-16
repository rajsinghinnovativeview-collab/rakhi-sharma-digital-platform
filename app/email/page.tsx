import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Staff Email Login | Rak.Hi Arts",
  description: "Staff email access for Rak.Hi Arts.",
  robots: { index: false, follow: false },
};

export default function StaffEmailPage() {
  return (
    <main className="mail-page">
      <header className="mail-header">
        <Link className="mail-brand" href="/" aria-label="Rak.Hi Arts home">
          <img src="https://i.ibb.co/CptKtgPr/Forest-Gold-Monogram-Art-Logo-2.png" alt="" width={50} height={50} />
          <span><strong>Rak.Hi Arts</strong><small>Staff email workspace</small></span>
        </Link>
        <Link href="/" className="mail-back">← Back to website</Link>
      </header>
      <section className="mail-content" aria-label="Staff email sign in">
        <div className="mail-heading">
          <span>AUTHORIZED STAFF ACCESS</span>
          <h1>Email login</h1>
          <p>Access your Rak.Hi Arts team mailbox through our secure mail provider.</p>
        </div>
        <div className="mail-frame-shell">
          <iframe title="Rak.Hi Arts staff webmail sign in" src="/email/preview" className="mail-iframe" referrerPolicy="strict-origin-when-cross-origin" allow="clipboard-read; clipboard-write" />
        </div>
        <p className="mail-note">This is a non-functional visual test of the supplied NevTan login HTML. Do not enter your email password here. For real email access, use the official NevTan login.</p>
      </section>
      <footer className="mail-footer">© {new Date().getFullYear()} Rak.Hi Arts · Staff workspace</footer>
    </main>
  );
}
