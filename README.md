## Telegram Bot

Telegram bot nizar yang dibuat pake Node.js, fitur: cek gempa berdasarkan data resmi BMKG, bisa menjawab soal matematika dari API Wolfram Alpha.

## Installation

Pastiin udah install nodejs ya

**Clone Repository**

```bash
$ git clone https://github.com/nizaralghifary/botnizar
$ cd botnizar
```

**Install Library**

```bash
$ npm install
```

**Set Up Environment Variable**

Buat file `.env` terus tambahin :

```env
TELEGRAM_TOKEN = YOUR_TELEGRAM_TOKEN
WOLFRAM_ALPHA_API_KEY = YOUR_WOLFRAM_ALPHA_API
```

**Run Bot**

```bash
$ npm run bot
```
