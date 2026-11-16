import "server-only";
import nodemailer from "nodemailer";

export function isSmtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

type Inquiry = {
  fullName: string;
  businessName?: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
};

/**
 * Sends the inquiry notification. Returns "sent" only when the SMTP server
 * accepted the recipient; never claims success otherwise.
 */
export async function sendInquiryNotification(inq: Inquiry): Promise<"sent" | "failed" | "not_configured"> {
  if (!isSmtpConfigured()) return "not_configured";
  const to = process.env.CONTACT_NOTIFICATION_EMAIL || "angela@bestbizaccounting.ca";
  const port = Number(process.env.SMTP_PORT || 587);
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    const rows: Array<[string, string]> = [
      ["Name", inq.fullName],
      ["Business", inq.businessName || "-"],
      ["Email", inq.email],
      ["Phone", inq.phone || "-"],
      ["Service", inq.service],
    ];
    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || `"Best Biz Accounting Website" <${process.env.SMTP_USER}>`,
      to,
      replyTo: inq.email,
      subject: `New website inquiry: ${inq.service} — ${inq.fullName}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${inq.message}`,
      html: `<h2>New website inquiry</h2><table>${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escape(v)}</td></tr>`)
        .join("")}</table><p><strong>Message</strong></p><p>${escape(inq.message).replace(/\n/g, "<br>")}</p>`,
    });
    return info.accepted?.length ? "sent" : "failed";
  } catch (err) {
    console.error("[mailer] send failed", err);
    return "failed";
  }
}
