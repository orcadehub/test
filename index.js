const { Telegraf } = require("telegraf");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.json());

// Create the bot instance without polling
const bot = new Telegraf(process.env.TOKEN);

// Webhook route for Telegram to send updates to
app.post("/webhook", (req, res) => {
  try {
    bot.handleUpdate(req.body);
    res.sendStatus(200); // Respond immediately for serverless function
  } catch (error) {
    console.error("Error processing update:", error);
    res.sendStatus(500); // Handle unexpected errors
  }
});

// Define a simple bot command, e.g., /start
bot.start(async (ctx) => {
  const chatId = ctx.chat.id.toString(); // Accessing the chat ID from context

  try {
    await ctx.reply("Welcome! Please use the web app:", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Web App",
              web_app: { url: "https://thewhiteshark.io/" },
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Error responding to user:", error);
    ctx.reply("An error occurred. Please try again later.");
  }
});

// Set the webhook manually via cURL or Telegram Bot API
const setWebhook = async () => {
  const webhookUrl = `${process.env.TELEGRAM_WEBHOOK_URL}/webhook`; // Replace with your URL

  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set to ${webhookUrl}`);
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
};

// Call setWebhook to manually set it when deploying
setWebhook();

// Root route to check server
app.get("/", (req, res) => {
  res.send("It is Working");
});

module.exports = app;
