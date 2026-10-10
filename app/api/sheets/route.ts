import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const FALLBACK_URL = "https://script.google.com/macros/s/AKfycbyB0byIAWvzHbUW4br0gKSRPtRaGDpYw_MZr0quccM6HZ22mexv80ufThdiNdMtPIphGg/exec";
const allowedReads = new Set(["bootstrap", "health", "getart", "getproducts", "getexperiences", "getinformation", "getcontent"]);
const allowedWrites = new Set([
  "signup", "register", "registeruser", "verifyemail", "login", "logout", "dashboard", "getdashboard",
  "updateprofile", "changepassword", "startpasswordreset", "completepasswordreset", "submitorder", "createorder",
  "artenquiry", "submitartenquiry", "tfcrequest", "submittfcrequest", "feedback", "submitfeedback", "admindashboard", "adminupdate", "adminedit", "admincreate", "quickexperience",
]);
function endpoint() { return process.env.RAKHI_GAS_URL || FALLBACK_URL; }
async function parseResponse(response: Response) {
  const text = await response.text();
  try { return JSON.parse(text); } catch { throw new Error("Apps Script returned a non-JSON response. Check that the latest Web App deployment is active."); }
}
export async function GET(request: NextRequest) {
  const action = (request.nextUrl.searchParams.get("action") || "bootstrap").toLowerCase();
  if (!allowedReads.has(action)) return NextResponse.json({ ok: false, error: "Invalid public read action." }, { status: 400 });
  try {
    const url = new URL(endpoint());
    url.searchParams.set("action", action);
    const upstream = await fetch(url, { cache: "no-store", redirect: "follow" });
    const data = await parseResponse(upstream);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not contact Google Apps Script." }, { status: 502 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Record<string, unknown>;
    const action = String(data.action || data.type || "").replace(/[^a-z]/gi, "").toLowerCase();
    if (!allowedWrites.has(action)) return NextResponse.json({ ok: false, error: "Invalid action." }, { status: 400 });
    const upstream = await fetch(endpoint(), {
      method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(data), cache: "no-store", redirect: "follow",
    });
    const result = await parseResponse(upstream);
    return NextResponse.json(result, { status: result?.ok === false ? 400 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not contact Google Apps Script." }, { status: 502 });
  }
}
