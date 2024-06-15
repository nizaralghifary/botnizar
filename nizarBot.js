require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const TelegramBot = require('node-telegram-bot-api');

app.use(express.json());
app.use(cors({
  origin: "*",
}));

app.get("/", (req, res) => {
  res.json({ message: "nizar bot is running" });
});

const token = process.env.TELEGRAM_BOT_TOKEN;
const wolframApiKey = process.env.WOLFRAM_ALPHA_API_KEY;
console.log("Nizar Bot Ready!");
const bot = new TelegramBot(token, { polling: true });

const prefix = "/";
const start = new RegExp(`${prefix}start`);
const menu = new RegExp(`${prefix}menu$`);
const cekgempa = new RegExp(`${prefix}cekgempa$`);

// Deteksi kata di terminal
bot.on('message', (msg) => {
    const now = new Date();
    console.log(`[${now.toLocaleString()}] Pesan dari ${msg.from.first_name}: ${msg.text}`);

    // Keyword
    const kataKunci = msg.text.split(" ");
    console.log(`Keyword yang diketik ${msg.from.first_name}:`, kataKunci);
});

// Jawaban dari Wolfram Alpha
const getWolframAlphaResponse = async (query) => {
  const url = `http://api.wolframalpha.com/v2/query?input=${encodeURIComponent(query)}&appid=${wolframApiKey}&output=JSON`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data.queryresult.success) {
      const pods = data.queryresult.pods;
      let result = 'Here are the results:\n';
      pods.forEach(pod => {
        result += `*${pod.title}*\n`;
        pod.subpods.forEach(subpod => {
          result += `${subpod.plaintext}\n`;
        });
      });
      return result;
    } else {
      return 'No results found for your query.';
    }
  } catch (error) {
    console.error(error);
    return 'There was an error fetching the data.';
  }
};

// Start
bot.onText(start, (msg) => {
    const responseMessage = `
Welcome to Nizar Bot Version 1.1.0! 
This bot is just for fun
🤖 Menu:
${prefix}menu - Lihat semua command`;

    bot.sendMessage(msg.chat.id, responseMessage);

    // Log the response
    console.log(`[${new Date().toLocaleString()}] Sent to ${msg.from.first_name}: ${responseMessage}`);
});

// Menu
bot.onText(menu, (msg) => {
    const responseMessage = `
🤖 Menu Bot Commands:  
${prefix}cekgempa - Cek info gempa terbaru
${prefix}ask - Jawab soal matematika`;

    bot.sendMessage(msg.chat.id, responseMessage);

    // Log the response
    console.log(`[${new Date().toLocaleString()}] Sent to ${msg.from.first_name}: ${responseMessage}`);
});

// Cek gempa
bot.onText(cekgempa, async (msg) => {
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";

    try {
        const apiCall = await fetch(BMKG_ENDPOINT + "autogempa.json");
        const data = await apiCall.json();
        const { 
            Infogempa: { 
                gempa: {
                    Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Coordinates ,Shakemap
                }
            } 
        } = data;

        const BMKGImage = BMKG_ENDPOINT + Shakemap;

        const resultText = `
Data Resmi Dari BMKG
🕒 Waktu: ${Tanggal} | ${Jam}
🔎 Besar Gempa: ${Magnitude} SR 
🏡 Wilayah: ${Wilayah}
📍 Koordinat: ${Coordinates}
🌊 Potensi: ${Potensi}
🕳️ Kedalaman: ${Kedalaman}`;

        bot.sendPhoto(msg.chat.id, BMKGImage, {
            caption: resultText
        });

        // Log the response
        console.log(`[${new Date().toLocaleString()}] Kirim ke ${msg.from.first_name}: ${resultText}`);
    } catch (error) {
        console.error("Gagal mengambil data gempa:", error);
        const errorMessage = "Maaf, terjadi kesalahan saat memeriksa informasi gempa.";
        bot.sendMessage(msg.chat.id, errorMessage);

        // Log the error response
        console.log(`[${new Date().toLocaleString()}] Sent to ${msg.from.first_name}: ${errorMessage}`);
    }
});

// Mengatur handler untuk pesan yang masuk
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.toLowerCase().startsWith('/ask')) {
    const query = text.replace('/ask', '').trim();
    if (query) {
      const responseMessage = await getWolframAlphaResponse(query);
      bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' }).then(() => {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] Jawaban ke ${msg.from.first_name}: ${responseMessage}`);
      });
    } else {
      const warningMessage = 'Please enter a question after the command /ask.';
      bot.sendMessage(chatId, warningMessage).then(() => {
        const now = new Date();
        console.log(`[${now.toLocaleString()}] Jawaban ke ${msg.from.first_name}: ${warningMessage}`);
      });
    }
  } 
});

app.listen(8002, () => {
  console.log('Server is running on port 8002');
});