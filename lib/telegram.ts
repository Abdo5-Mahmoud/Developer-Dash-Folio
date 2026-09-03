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
    const text = `📬 *New Message on Devfolio!*\n\n*From:* ${name}\n*Email:* ${email}\n\n*Subject:*\n${subject}\n\n*Message:*\n${message}`;
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.log("Telegram notification failed:", err);
  }
}
