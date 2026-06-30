import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or less"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be 5000 characters or less"),
});

export async function POST(request: Request) {
  // Validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Discord notification (best-effort — user sends email via their own client)
  const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (discordWebhookUrl) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const discordRes = await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          embeds: [
            {
              title: "New Contact Form Submission",
              color: 0xf74c00,
              fields: [
                { name: "Subject", value: subject, inline: true },
                { name: "Email", value: email, inline: true },
                { name: "Name", value: name, inline: true },
                {
                  name: "Message",
                  value:
                    message.length > 500
                      ? `${message.slice(0, 500)}...`
                      : message,
                },
              ],
              footer: { text: "NammaRust Contact Form" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
      clearTimeout(timeout);
      console.log("[DEBUG] Discord webhook response:", discordRes.status);
    } catch (discordError) {
      console.error("Discord webhook failed:", discordError);
    }
  }

  return NextResponse.json({ success: true });
}
