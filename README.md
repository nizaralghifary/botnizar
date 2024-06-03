## Telegram Bot

Telegram bot nizar yang dibuat pake node js, untuk saat ini fiturnya baru bisa cek gempa aja berdasarkan data resmi BMKG.

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
