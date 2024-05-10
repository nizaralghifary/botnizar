const TelegramBot = require("node-telegram-bot-api")

require('dotenv').config()
const token = process.env.TELEGRAM_TOKEN

const options = {
  polling: true
}
console.log("nizar-bot ready !")

const botnizar = new TelegramBot(token,options)

const prefix = "/"

const start = new RegExp (`${prefix}start`)
const menu = new RegExp(`${prefix}menu$`)
const cekgempa = new RegExp(`${prefix}cekgempa$`)

// Deteksi kata di terminal
botnizar.on('message', (msg) => {
    const now = new Date();
    console.log(`[${now.toLocaleString()}] Pesan dari ${msg.from.first_name}: ${msg.text}`);

    // Keyword
    const kataKunci = msg.text.split(" ");
    console.log(`Keyword yang diketik ${msg.from.first_name}:`, kataKunci);
});

// Start
botnizar.onText(start, (msg) => {
    botnizar.sendMessage(msg.chat.id, `
Welcome to Nizar Bot Version 1.0.0! 
This bot is just for fun
🤖 Menu:
${prefix}menu - Lihat semua command`);
});

// Menu
botnizar.onText(menu, (msg) => {
    botnizar.sendMessage(msg.chat.id, `
🤖 Menu Bot Commands:  
${prefix}cekgempa - Cek info gempa terbaru`);
});

// Cek gempa
botnizar.onText(cekgempa, async (msg) => {
    const BMKG_ENDPOINT = "https://data.bmkg.go.id/DataMKG/TEWS/";
  
    try {
        const apiCall = await fetch(BMKG_ENDPOINT + "/autogempa.json");
        const data = await apiCall.json();
        const { 
            Infogempa: { 
                gempa: {
                    Jam, Magnitude, Tanggal, Wilayah, Potensi, Kedalaman, Shakemap
                }
            } 
        } = data;
        
        const BMKGImage = BMKG_ENDPOINT + Shakemap;
        
        const resultText = `
Data Resmi Dari BMKG
🕒 Waktu: ${Tanggal} | ${Jam}
🔎 Besar Gempa: ${Magnitude} SR 
🏡 Wilayah: ${Wilayah}
🌊 Potensi: ${Potensi}
🕳️ Kedalaman: ${Kedalaman}
`;
        
        botnizar.sendPhoto(msg.chat.id, BMKGImage, {
            caption: resultText
        });
    } catch (error) {
        console.error("Gagal mengambil data gempa:", error);
        botnizar.sendMessage(msg.chat.id, "Maaf, terjadi kesalahan saat memeriksa informasi gempa.");
    }
});