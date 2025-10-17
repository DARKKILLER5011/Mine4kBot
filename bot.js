const mineflayer = require('mineflayer');
const TelegramBot = require('node-telegram-bot-api');

// === CONFIGURATION ===
// Replace with your own values:
const MINECRAFT_CONFIG = {
  host: 'localhost',    // Minecraft server IP or hostname
  port: 25565,          // Minecraft server port
  username: 'BotName',  // Minecraft username for your bot
  // version: false,     // Optional: specify version, e.g., '1.20.1'
};
const TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'; // <-- Replace with your Telegram bot token!
const TELEGRAM_CHAT_ID = 'YOUR_TELEGRAM_CHAT_ID'; // <-- Replace with your Telegram chat ID!

// === MINEFLAYER BOT ===
const bot = mineflayer.createBot(MINECRAFT_CONFIG);

// === TELEGRAM BOT ===
const telegramBot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Forward Minecraft chat to Telegram
bot.on('chat', (username, message) => {
  if (username === bot.username) return;
  const chatMsg = `${username}: ${message}`;
  telegramBot.sendMessage(TELEGRAM_CHAT_ID, chatMsg);
});

// Forward Telegram messages to Minecraft chat
telegramBot.on('message', (msg) => {
  if (msg.chat.id.toString() !== TELEGRAM_CHAT_ID.toString()) return;
  if (msg.text) {
    bot.chat(`[TG] ${msg.from.username || msg.from.first_name}: ${msg.text}`);
  }
});

// Notify when bot spawns
bot.on('spawn', () => {
  console.log('Bot has spawned in the Minecraft world!');
  telegramBot.sendMessage(TELEGRAM_CHAT_ID, 'Bot has spawned in the Minecraft world!');
});

// Bot error handling
bot.on('error', (err) => {
  console.error('Mineflayer error:', err);
  telegramBot.sendMessage(TELEGRAM_CHAT_ID, 'Mineflayer error: ' + err.message);
});

bot.on('end', () => {
  telegramBot.sendMessage(TELEGRAM_CHAT_ID, 'Bot disconnected from Minecraft server.');
});

console.log('Mineflayer + Telegram bot started.');

// === Instructions ===
// 1. Run "npm install mineflayer node-telegram-bot-api"
// 2. Replace TELEGRAM_TOKEN and TELEGRAM_CHAT_ID with your actual details.
// 3. Run "node bot.js"