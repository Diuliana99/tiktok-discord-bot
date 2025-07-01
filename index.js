const { WebcastPushConnection } = require('tiktok-live-connector');
const axios = require('axios');

const tiktokUsername = process.env.TIKTOK_USER;
const discordWebhook = process.env.DISCORD_WEBHOOK;

if (!tiktokUsername || !discordWebhook) {
  console.error("❌ Lipsesc variabilele de mediu TIKTOK_USER sau DISCORD_WEBHOOK");
  process.exit(1);
}

let isLive = false;

const tiktok = new WebcastPushConnection(tiktokUsername);

tiktok.connect().then(() => {
  console.log(`✅ Conectat la TikTok: ${tiktokUsername}`);
}).catch(err => {
  console.error("❌ Eroare la conectare:", err);
});

tiktok.on('streamStart', () => {
  if (!isLive) {
    isLive = true;
    console.log("🔴 LIVE START");
    axios.post(discordWebhook, {
      content: `🔴 **${tiktokUsername} este LIVE pe TikTok!**\n📲 https://tiktok.com/@${tiktokUsername}/live`
    });
  }
});

tiktok.on('streamEnd', () => {
  if (isLive) {
    isLive = false;
    console.log("⚪ LIVE END");
    axios.post(discordWebhook, {
      content: `⚪ **${tiktokUsername} a încheiat live-ul.**`
    });
  }
});

tiktok.on('disconnected', () => {
  console.warn("⚠️ Deconectat. Reconectare...");
});

