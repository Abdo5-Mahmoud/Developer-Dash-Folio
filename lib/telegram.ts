// Escape Telegram MarkdownV1 metacharacters in user-controlled input so a
// name/message containing *_[]`() never breaks formatting or the send.
function escapeTelegramMarkdown(value: string): string {
  return value.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

export async function sendTelegramNotification({
  name,
  email,
  message,
  subject,
}: {
  name: string;
  email: string;
  message: string;
  subject: string;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("Telegram notification skipped: Missing credentials in .env");
    return;
  }

  try {
    const text = `📬 *New Message on Devfolio!*\n\n*From:* ${escapeTelegramMarkdown(name)}\n*Email:* ${escapeTelegramMarkdown(email)}\n\n*Subject:*\n${escapeTelegramMarkdown(subject)}\n\n*Message:*\n${escapeTelegramMarkdown(message)}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram notification failed:", err);
  }
}
