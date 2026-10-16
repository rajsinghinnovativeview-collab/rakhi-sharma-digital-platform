import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Mail Access | Rak.Hi Arts",
  description: "Staff webmail access page.",
  robots: { index: false, follow: false },
};

const officialLogin = "https://mail.nevtan.com/login";
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1px solid #cbd5e1", borderRadius: 8,
  background: "#f8fafc", padding: "16px 14px", fontSize: 15,
};

export default function MailLoginPreview() {
  return (
    <main className="nevtan-preview">
      <aside className="nevtan-intro">
        <div>
          <a href={officialLogin} target="_blank" rel="noopener noreferrer" className="brand">NevTan Mail</a>
          <div className="intro-text">
            <p className="eyebrow">Business email operations</p>
            <h1>Secure mail access for teams that move fast.</h1>
            <p>NevTan Mail brings inboxes, custom domains, and admin workflows into a focused workspace for growing businesses.</p>
          </div>
        </div>
        <div className="mail-demo">
          <div className="demo-side"><b>Team mailbox</b><strong>✉ Inbox</strong><span>✉ Priority</span><span>✉ Domains</span><span>✉ Sent</span></div>
          <div className="demo-messages"><b>NC &nbsp; Nina Carter</b><small>Q2 launch approvals · 2m</small><b>Billing</b><small>Subscription receipt · 18m</small><b>IT Admin</b><small>DNS verification complete · 41m</small></div>
        </div>
        <div className="feature-row">
          <div><b>♧ Protected access</b><p>Role-based sign-in for inbox, domain, and admin users.</p></div>
          <div><b>▦ Company domains</b><p>Built for teams managing branded business mailboxes.</p></div>
          <div><b>⚙ Admin workflows</b><p>Manage your business mail access in one place.</p></div>
        </div>
      </aside>
      <section className="login-side">
        <div className="login-panel">
          <div className="login-card">
            <div className="mobile-logo">NevTan Mail</div>
            <h2>Welcome back</h2>
            <p className="subtext">Sign in to your business email workspace.</p>
            <p className="notice">This is a visual reproduction of the provided HTML. Authentication is available on the official NevTan site.</p>
            <div className="fields">
              <label>Email address<input disabled type="email" placeholder="name@yourdomain.com" style={inputStyle}/></label>
              <label>Password<input disabled type="password" placeholder="Enter your password" style={inputStyle}/></label>
              <div className="options"><label><input disabled type="checkbox"/> Remember this device</label><a href="https://mail.nevtan.com/forgot-password" target="_blank" rel="noopener noreferrer">Forgot password?</a></div>
              <p className="verify">Didn&apos;t receive a verification email? <a href={officialLogin} target="_blank" rel="noopener noreferrer">Resend</a></p>
              <a className="sign-in" href={officialLogin} target="_blank" rel="noopener noreferrer">Sign in at NevTan ↗</a>
            </div>
            <hr/>
            <p className="signup">New to NevTan Mail? <a href="https://mail.nevtan.com/signup" target="_blank" rel="noopener noreferrer">Create an account</a></p>
          </div>
          <p className="footnote">NevTan Mail is built for business users, admins, and company domain mailboxes.</p>
        </div>
      </section>
      <style>{`
        .nevtan-preview{min-height:100vh;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(420px,.95fr);background:linear-gradient(180deg,#f7f9fc,#eef3f8 48%,#f8fafc);font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a}
        .nevtan-intro{background:linear-gradient(145deg,#09233f,#123b5f 46%,#17636c);color:white;padding:clamp(32px,4vw,82px);display:flex;flex-direction:column;justify-content:space-between;gap:24px}
        .brand{display:inline-block;color:white;font-weight:800;font-size:28px;text-decoration:none}
        .intro-text{margin-top:6vh;max-width:620px}.eyebrow{color:#7ee3d2;font-size:13px;font-weight:700}.intro-text h1{font-size:clamp(38px,3vw,54px);line-height:1.08;margin:12px 0}.intro-text>p:last-child{color:#d2e1e8;font-size:17px;line-height:1.55}
        .mail-demo{display:grid;grid-template-columns:170px 1fr;border-radius:10px;background:#fff;color:#1f2937;overflow:hidden;padding:8px;max-width:670px;gap:10px}.demo-side{display:flex;flex-direction:column;gap:8px;border-right:1px solid #e5e7eb;padding:10px}.demo-side>*{font-size:13px}.demo-side strong{color:#0f766e;background:#ccfbf1;border-radius:5px;padding:5px}.demo-messages{display:flex;flex-direction:column;gap:7px;padding:8px}.demo-messages b{font-size:13px}.demo-messages small{color:#64748b;font-size:12px}.feature-row{display:flex;gap:14px}.feature-row>div{flex:1;border:1px solid #ffffff33;border-radius:8px;background:#ffffff14;padding:14px}.feature-row b{font-size:13px}.feature-row p{font-size:12px;color:#d2e1e8}
        .login-side{display:flex;align-items:center;justify-content:center;padding:20px 30px}.login-panel{width:100%;max-width:470px}.login-card{padding:clamp(20px,3vw,32px);background:#fff;border:1px solid #dbe3ec;border-radius:10px;box-shadow:0 24px 70px #0f172a1f}.login-card h2{font-size:32px;line-height:1.2;margin:0 0 8px}.subtext{color:#64748b;margin:0 0 22px}.mobile-logo{display:none}.notice{background:#fffbeb;border:1px solid #fde68a;color:#92400e;border-radius:6px;padding:10px;font-size:12px}.fields{display:flex;flex-direction:column;gap:18px}.fields>label{display:flex;flex-direction:column;gap:7px;font-size:14px;font-weight:600}.fields input:disabled{opacity:.75}.options{display:flex;justify-content:space-between;gap:10px;font-size:13px;color:#475569}.options a,.verify a,.signup a{color:#0f766e;text-decoration:none;font-weight:700}.verify,.signup{text-align:center;font-size:13px;color:#64748b}.sign-in{display:block;text-align:center;background:#0f766e;color:#fff;padding:13px;border-radius:7px;font-weight:700;text-decoration:none;box-shadow:0 14px 28px #0f766e39}.login-card hr{border:0;border-top:1px solid #dbe3ec;margin:22px 0}.footnote{text-align:center;font-size:12px;color:#64748b;margin:14px}
        @media(max-width:1199px){.nevtan-preview{display:block}.nevtan-intro{display:none}.login-side{min-height:100vh}.mobile-logo{display:inline-block;background:#09233f;color:#fff;padding:9px 16px;margin-bottom:22px;border-radius:5px;font-weight:700}}
        @media(max-width:550px){.login-side{padding:16px}.login-card{padding:20px}}
      `}</style>
    </main>
  );
}
