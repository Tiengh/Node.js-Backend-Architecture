"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { OpenAI } = require("openai");

const { CHANNELID_DISCORD, TOKEN_DISCORD, OPENAI_API_KEY } = process.env;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelID = CHANNELID_DISCORD;

    this.client.on("ready", () => {
      console.log(`✅ Discord Logger connected as ${this.client.user.tag}`);
    });

    this.client.login(TOKEN_DISCORD).catch((err) => {
      console.error("❌ Failed to login Discord bot:", err.message);
    });
  }

  async sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    return await this.sendToMessage(codeMessage);
  }

  async sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelID);
    if (!channel) {
      const errorMsg = `❌ Cannot find Discord channel with ID: ${this.channelID}`;
      console.error(errorMsg);
      const gptResponse = await this.sendToChatGPT(errorMsg);
      console.log("🤖 GPT response:", gptResponse);
      return gptResponse;
    }

    try {
      await channel.send(message);
      return "✅ Message sent to Discord successfully.";
    } catch (error) {
      console.error("❌ Failed to send message to Discord:", error.message);
      const gptResponse = await this.sendToChatGPT(error.message);
      console.log("🤖 GPT response:", gptResponse);
      return gptResponse;
    }
  }

  async sendToChatGPT(errorMessage) {
    try {
      console.log("🔁 Sending error to ChatGPT:", errorMessage);
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // hoặc "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for debugging Node.js applications.",
          },
          {
            role: "user",
            content: `Tôi gặp lỗi khi gửi log tới Discord: "${errorMessage}". Hãy giải thích giúp tôi nguyên nhân và cách khắc phục.`,
          },
        ],
      });

      return completion.choices[0].message.content;
    } catch (err) {
      console.error("❌ Failed to call ChatGPT API:", err.message);
      return "❌ Gặp lỗi khi gọi ChatGPT API.";
    }
  }
}

module.exports = new LoggerService();
