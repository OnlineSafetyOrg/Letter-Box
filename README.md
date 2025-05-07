# 💌 Letter Box — Anonymous Letter System

[![Join Our Discord](https://img.shields.io/discord/1360001636424093928?label=Join%20Our%20Community&logo=discord&style=flat-square&color=5865F2)](https://discord.com/invite/P3bfEux5cv)

**Letter Box** is an anonymous letter and reply system built for Discord, created by the **Online Safety** team. It empowers users to submit letters anonymously and receive supportive responses — all while keeping identities strictly confidential.

---

## ✨ Features

- 📩 **Anonymous Letter Submission**  
  Users submit letters privately via modals.

- 💬 **Admin-Only Replies**  
  Admins can send one anonymous reply per letter, delivered via DM.

- 🔒 **Privacy by Design**  
  No user identities are stored or displayed.

- 📡 **Channel Embeds**  
  Letters and replies are published in a configured channel with dynamically updated embeds.

- 🧠 **AI Reply Support (Coming Soon)**  
  Optional integration with OpenAI to generate helpful replies automatically.

- 📊 **Insights**  
  Track totals, daily submissions, replies, and flags in real time with insight channels.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/OnlineSafetyOrg/letter-box.git
cd letter-box
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file and configure it with your bot and database credentials:

```env
# Discord Bot Credentials
CLIENT_TOKEN=""
CLIENT_ID=""
CLIENT_SECRET=""

# Letter System Configuration
LETTER_GUILD_ID=""
LETTER_CHANNEL_ID=""

# Insights Channel IDs (Optional)
TOTAL_LETTERS_CHANNEL_ID=""
TODAY_LETTERS_CHANNEL_ID=""
REPLIED_LETTERS_CHANNEL_ID=""
PENDING_LETTERS_CHANNEL_ID=""
FLAGGED_LETTERS_CHANNEL_ID=""

# Database
DATABASE_URL=""
```

### 4. Set Up the Database (Prisma)

```bash
npx prisma migrate dev --name init
```

---

## ✅ Required Bot Permissions

Make sure your bot has the following permissions in your server:

* `Read Messages`
* `Send Messages`
* `Manage Messages` (for editing embeds)
* `Send DMs` (for private replies)

---

## 🧩 Tech Stack

* **Language:** TypeScript
* **Framework:** Discord.js v14
* **Database ORM:** Prisma
* **Database:** MongoDB
* **AI Integration:** OpenAI (coming soon)

---

## 🤝 Contributing

We welcome contributions!
Feel free to open [issues](https://github.com/OnlineSafetyOrg/letter-box/issues) or submit pull requests if you have suggestions or want to improve the project.

---

## 🛟 Need Help?

Join our support and development community on Discord:

👉 [**Join the Server**](https://discord.com/invite/P3bfEux5cv)

---

## 👥 About Online Safety

**Online Safety** builds tools that protect Discord users by encouraging safe, private, and mentally supportive communication.

---

## 📜 License

This project is licensed under the **[GNU GPL v3.0](LICENSE)**.