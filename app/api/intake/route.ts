import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface LeadData {
  name: string;
  budget: string;
  neighborhoods: string;
  bedrooms: string;
  timeline: string;
  preApproved: string;
}

type LeadScore = "HOT" | "WARM" | "COLD";

function scoreLeadFromData(data: LeadData): LeadScore {
  const timeline = data.timeline.toLowerCase();
  const preApproved = data.preApproved.toLowerCase();
  const budget = data.budget.trim();

  const isHotTimeline =
    timeline.includes("1 month") ||
    timeline.includes("2 month") ||
    timeline.includes("3 month") ||
    timeline.includes("asap") ||
    timeline.includes("immediately") ||
    timeline.includes("right away") ||
    timeline.includes("now") ||
    /\b[1-3]\s*month/i.test(timeline);

  const isPreApproved =
    preApproved.startsWith("yes") || preApproved === "y";

  const hasBudget = budget.length > 0 && budget.toLowerCase() !== "n/a";

  if (isHotTimeline && isPreApproved && hasBudget) {
    return "HOT";
  }

  const isWarmTimeline =
    timeline.includes("4 month") ||
    timeline.includes("5 month") ||
    timeline.includes("6 month") ||
    /\b[4-6]\s*month/i.test(timeline);

  if (isWarmTimeline || !isPreApproved) {
    return "WARM";
  }

  return "COLD";
}

interface BadgeStyle {
  background: string;
  color: string;
}

function getBadgeStyle(score: LeadScore): BadgeStyle {
  switch (score) {
    case "HOT":
      return { background: "#e8f5e9", color: "#2e7d32" };
    case "WARM":
      return { background: "#fff8e6", color: "#b8860b" };
    case "COLD":
      return { background: "#f5f5f5", color: "#666" };
  }
}

function getLabel(score: LeadScore): string {
  switch (score) {
    case "HOT":
      return "Ready to Move";
    case "WARM":
      return "Actively Searching";
    case "COLD":
      return "Early Research";
  }
}

function getRecommendedAction(score: LeadScore): string {
  switch (score) {
    case "HOT":
      return "Follow up within the hour. This client has a clear budget, defined timeline, and financing in place.";
    case "WARM":
      return "Reach out within 24 hours. Client is engaged but may benefit from pre-approval guidance or a tighter shortlist.";
    case "COLD":
      return "Add to your follow-up sequence. Send a personal note within the week — this buyer is still forming their criteria.";
  }
}

function buildEmailHtml(data: LeadData, score: LeadScore): string {
  const badge = getBadgeStyle(score);
  const label = getLabel(score);
  const action = getRecommendedAction(score);
  const submittedAt = new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Client Inquiry — ${data.name} (via Intake)</title>
</head>
<body style="margin:0;padding:24px 0;background:#f4f4f4;font-family:'Inter',Arial,sans-serif;">
  <div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

    <!-- Header bar -->
    <div style="background:#0A1628;padding:24px 32px;">
      <span style="color:#C9A84C;font-size:18px;letter-spacing:0.05em;font-weight:600;">INTAKE</span>
      <span style="color:rgba(255,255,255,0.4);font-size:13px;margin-left:12px;">Client Inquiry</span>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:22px;font-weight:600;margin:0 0 4px;color:#1a1a1a;">${data.name}</h2>
      <p style="color:#888;font-size:14px;margin:0 0 28px;">Submitted ${submittedAt}</p>

      <!-- Priority badge -->
      <div style="margin-bottom:28px;">
        <span style="display:inline-block;padding:6px 14px;border-radius:4px;font-size:13px;font-weight:600;letter-spacing:0.04em;background:${badge.background};color:${badge.color};">
          ${label}
        </span>
      </div>

      <!-- Details table -->
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px 0;color:#888;width:40%;">Budget</td>
          <td style="padding:12px 0;font-weight:500;">${data.budget}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px 0;color:#888;">Neighborhoods</td>
          <td style="padding:12px 0;font-weight:500;">${data.neighborhoods}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px 0;color:#888;">Bedrooms</td>
          <td style="padding:12px 0;font-weight:500;">${data.bedrooms}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:12px 0;color:#888;">Timeline</td>
          <td style="padding:12px 0;font-weight:500;">${data.timeline}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;color:#888;">Pre-Approved</td>
          <td style="padding:12px 0;font-weight:500;">${data.preApproved}</td>
        </tr>
      </table>

      <!-- Recommended action -->
      <div style="margin-top:28px;padding:16px 20px;background:#f8f8f8;border-left:3px solid #C9A84C;border-radius:0 4px 4px 0;">
        <p style="font-size:13px;color:#888;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em;">Recommended Action</p>
        <p style="font-size:15px;color:#1a1a1a;margin:0;">${action}</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #f0f0f0;">
      <p style="font-size:12px;color:#bbb;margin:0;">Sent by Intake · Private client intake for real estate professionals</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();

    if (!data.name || !data.timeline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const score = scoreLeadFromData(data);
    const toEmail = process.env.REALTOR_EMAIL ?? "jamarsenic@gmail.com";
    const html = buildEmailHtml(data, score);

    const { error } = await resend.emails.send({
      from: "Intake <onboarding@resend.dev>",
      to: [toEmail],
      subject: `New Client Inquiry — ${data.name} (via Intake)`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, score });
  } catch (err) {
    console.error("Intake API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
