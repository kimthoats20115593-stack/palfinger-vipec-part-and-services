import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendInquiryNotification(params: {
  type: "QUOTE" | "CONTACT";
  name: string;
  phone: string;
  email: string;
  company?: string | null;
  message: string;
  partLabel?: string | null;
}) {
  const to = process.env.INQUIRY_NOTIFY_TO;
  const t = getTransporter();
  if (!t || !to) return;

  const subject =
    params.type === "QUOTE"
      ? `[Yêu cầu báo giá] ${params.name}`
      : `[Liên hệ website] ${params.name}`;

  const lines = [
    `Loại: ${params.type === "QUOTE" ? "Yêu cầu báo giá" : "Liên hệ chung"}`,
    `Họ tên: ${params.name}`,
    `Điện thoại: ${params.phone}`,
    `Email: ${params.email}`,
    params.company ? `Công ty: ${params.company}` : null,
    params.partLabel ? `Phụ tùng quan tâm: ${params.partLabel}` : null,
    "",
    "Nội dung:",
    params.message,
  ].filter(Boolean);

  await t.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: params.email,
    subject,
    text: lines.join("\n"),
  });
}
