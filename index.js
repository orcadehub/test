// const TOKEN = "7636130435:AAGO6lV_ptqI8z4ZMK3dkNc-arDnax5xvyI";
// const url = "https://thewhiteshark.vercel.app"; // Your Vercel deployment URL
const port = 3300;

const { Telegraf } = require("telegraf");
const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
// JSON middleware
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

// Set the webhook
const setWebhook = async () => {
  const webhookUrl = `${process.env.TELEGRAM_WEBHOOK_URL}/webhook`; // Replace with your URL

  try {
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`Webhook set to ${webhookUrl}`);
  } catch (error) {
    console.error("Error setting webhook:", error);
  }
};

setWebhook();
// bot.launch();

// Root route to check server
app.get("/", (req, res) => {
  res.send("It is Working");
});

// Start Express Server
app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
