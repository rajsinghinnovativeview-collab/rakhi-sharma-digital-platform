import type { Metadata } from "next";

export const metadata: Metadata = { title: "NevTan Login Visual Test | Rak.Hi Arts", robots: { index: false, follow: false } };

export default function Preview() {
  return <main style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(300px,1fr)",background:"#f5f7fb",fontFamily:"Arial, sans-serif",color:"#0f172a"}}>
    <aside style={{background:"linear-gradient(145deg,#09233f,#123b5f 46%,#17636c)",color:"#fff",padding:"clamp(24px,5vw,80px)",display:"flex",flexDirection:"column",justifyContent:"center",gap:28}}>
      <div style={{fontSize:27,fontWeight:800}}>NevTan Mail</div>
      <div><div style={{color:"#7ee3d2",fontSize:14,fontWeight:700}}>Business email operations</div><h1 style={{fontSize:"clamp(28px,3.7vw,48px)",lineHeight:1.12,margin:"14px 0"}}>Secure mail access for teams that move fast.</h1><p style={{lineHeight:1.6,color:"#cddfe7"}}>NevTan Mail brings inboxes, custom domains, and admin workflows into a focused workspace.</p></div>
      <div style={{padding:20,border:"1px solid #ffffff33",background:"#ffffff14",borderRadius:12}}>✉ Team mailbox &nbsp; • &nbsp; Inbox &nbsp; • &nbsp; Priority &nbsp; • &nbsp; Sent</div>
    </aside>
    <section style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"28px 16px"}}>
      <div style={{width:"100%",maxWidth:440,background:"white",padding:"clamp(20px,4vw,36px)",borderRadius:12,boxShadow:"0 22px 60px #0f172a1f"}}>
        <div role="status" style={{background:"#fffbeb",border:"1px solid #fcd34d",padding:12,borderRadius:8,color:"#92400e",fontSize:13,marginBottom:24}}><strong>Visual test only.</strong> This locally hosted preview is not connected to NevTan authentication. Do not enter passwords.</div>
        <h2 style={{fontSize:30,margin:"0 0 10px"}}>Welcome back</h2><p style={{color:"#64748b",margin:"0 0 30px"}}>Sign in to your business email workspace.</p>
        <div style={{display:"grid",gap:17}}>
          <label style={{display:"grid",gap:7,fontSize:13,fontWeight:600}}>Email address<input disabled autoComplete="off" placeholder="name@yourdomain.com" style={{padding:15,border:"1px solid #cbd5e1",borderRadius:7,background:"#f8fafc"}} /></label>
          <label style={{display:"grid",gap:7,fontSize:13,fontWeight:600}}>Password<input disabled type="password" placeholder="••••••••" style={{padding:15,border:"1px solid #cbd5e1",borderRadius:7,background:"#f8fafc"}} /></label>
          <button disabled style={{padding:15,background:"#0f766e",color:"white",border:"none",borderRadius:7,opacity:.6}}>Sign in (preview only)</button>
          <a href="https://mail.nevtan.com/login" target="_blank" rel="noopener noreferrer" style={{color:"#0f766e",fontSize:14,textAlign:"center"}}>Open official NevTan login ↗</a>
        </div>
      </div>
    </section>
  </main>;
}
