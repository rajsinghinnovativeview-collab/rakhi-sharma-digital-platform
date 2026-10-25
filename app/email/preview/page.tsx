import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Login Preview | Rak.Hi Arts",
  description: "Non-functional preview of the Rak.Hi Arts staff email login.",
  robots: { index: false, follow: false },
};

export default function EmailLoginPreview() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f8f6ef", color: "#29362f", fontFamily: "Arial, sans-serif" }}>
      <section aria-label="Email login visual preview" style={{ width: "100%", maxWidth: 420, background: "#fffefa", border: "1px solid #deddd3", padding: "36px 28px", boxShadow: "0 12px 30px #162c2010" }}>
        <img src="/email-assets/rakhi-email-logo.jpg" alt="Rak.Hi Arts" width={76} height={76} style={{ display: "block", objectFit: "contain", margin: "0 auto 18px" }} />
        <p style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#a78956" }}>Staff email workspace</p>
        <h1 style={{ textAlign: "center", fontFamily: "Georgia, serif", fontSize: 30, fontWeight: 400, margin: "8px 0 12px" }}>Email sign in</h1>
        <p style={{ textAlign: "center", fontSize: 13, lineHeight: 1.6, color: "#707970", marginBottom: 24 }}>Visual preview only. This page does not accept credentials or send sign-in requests.</p>
        <div style={{ display: "grid", gap: 15 }}>
          <label style={{ display: "grid", gap: 5, fontSize: 12 }}>Email address<input type="email" disabled placeholder="name@rakhiart.in" style={{ padding: 12, border: "1px solid #deddd3", background: "#f6f4ee" }} /></label>
          <label style={{ display: "grid", gap: 5, fontSize: 12 }}>Password<input type="password" disabled placeholder="••••••••" style={{ padding: 12, border: "1px solid #deddd3", background: "#f6f4ee" }} /></label>
          <button type="button" disabled style={{ background: "#24483c", color: "white", padding: 13, border: "none", opacity: 0.65 }}>Sign in (preview only)</button>
        </div>
        <p style={{ fontSize: 11, color: "#707970", marginTop: 20, textAlign: "center" }}>For real email access, use your verified mail provider's official login page.</p>
      </section>
    </main>
  );
}
