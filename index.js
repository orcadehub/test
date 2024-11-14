require("dotenv").config();
const express = require("express");
const axios = require("axios");
// const bodyParser = require("body-parser");

const { TOKEN, TELEGRAM_WEBHOOK_URL } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = TELEGRAM_WEBHOOK_URL + URI;

const app = express();
app.use(express.json());

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
};

app.post(URI, async (req, res) => {
  const chatId = req.body.message?.chat.id;
  const text = req.body.message?.text;
  res.status(200).send("ok");

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: text,
  });
  return res.send();
});

app.get("/", (req, res) => {
    res.send("it's working");
});

app.listen(process.env.PORT || 5000, async () => {
  console.log("🚀 app running on port", process.env.PORT || 5000);
  await init();
});