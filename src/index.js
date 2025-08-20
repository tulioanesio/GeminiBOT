import { Client, Events, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();

const ai = new GoogleGenAI({});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    const prompt = message.content.replace(`<@${client.user.id}>`, "").trim();

    if (!prompt) {
      return message.reply(
        "Você precisa digitar um prompt depois de me marcar!"
      );
    }

    const model = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    for (let i = 0; i < model.text.length; i += 1900) {
      const chunk = model.text.slice(i, i + 1900);
      await message.reply(chunk);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
