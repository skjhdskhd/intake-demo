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

function getScoreColor(score: LeadScore): string {
  switch (score) {
    case "HOT":
      return "#dc2626";
    case "WARM":
      return "#d97706";
    case "COLD":
      return "#2563eb";
  }
}

function getRecommendedAction(score: LeadScore): string {
  switch (score) {
    case "HOT":
      return "📞 Call within 24 hours — this buyer is ready to move.";
    case "WARM":
      return "📬 Follow up within 48 hours. Consider offering pre-approval resources or a free consultation.";
    case "COLD":
      return "📋 Add to nurture sequence and follow up in 7 days. Keep them warm with listings and market updates.";
  }
}

function buildEmailHtml(data: LeadData, score: LeadScore): string {
  const scoreColor = getScoreColor(score);
  const action = getRecommendedAction(score);
  const scoreEmoji = score === "HOT" ? "🔥" : score === "WARM" ? "🌤️" : "❄️";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Lead — Prestige Properties</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:#1e3a5f;padding:28px 32px;text-align:center;">
      <p style="color:#c9a84c;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px 0;">Prestige Properties</p>
      <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">New Intake Lead</h1>
    </div>

    <!-- Score Badge -->
    <div style="background:#f8f7f4;border-bottom:1px solid #e5e5e5;padding:20px 32px;text-align:center;">
      <p style="margin:0 0 8px 0;color:#6b7280;font-size:13px;font-weight:500;">Lead Score</p>
      <span style="display:inline-block;background:${scoreColor};color:#fff;font-size:18px;font-weight:800;letter-spacing:2px;padding:8px 24px;border-radius:100px;">
        ${scoreEmoji} ${score}
      </span>
    </div>

    <!-- Body -->
    <div style="padding:32px;">

      <!-- Recommended Action -->
      <div style="background:#f0f9ff;border-left:4px solid ${scoreColor};padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:28px;">
        <p style="margin:0;font-size:14px;color:#1e3a5f;font-weight:600;">Recommended Action</p>
        <p style="margin:6px 0 0 0;font-size:14px;color:#374151;">${action}</p>
      </div>

      <!-- Lead Details -->
      <h2 style="color:#1e3a5f;font-size:15px;font-weight:700;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;">Lead Details</h2>

      <table style="width:100%;border-collapse:collapse;">
        ${[
          ["Full Name", data.name],
          ["Budget Range", data.budget],
          ["Preferred Areas", data.neighborhoods],
          ["Bedrooms Needed", data.bedrooms],
          ["Move-in Timeline", data.timeline],
          ["Pre-Approved", data.preApproved],
        ]
          .map(
            ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;font-size:13px;font-weight:600;width:40%;vertical-align:top;">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#111827;font-size:14px;vertical-align:top;">${value}</td>
        </tr>`
          )
          .join("")}
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f8f7f4;border-top:1px solid #e5e5e5;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        This lead was submitted via the Prestige Properties Intake Widget.<br/>
        Powered by <strong style="color:#1e3a5f;">Intake</strong> — AI Lead Qualification
      </p>
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
      from: "Intake Agent <onboarding@resend.dev>",
      to: [toEmail],
      subject: `[${score}] New Lead: ${data.name} — Prestige Properties`,
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
