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

    const chunks = model.text.match(/[\s\S]{1,1900}/g); // 1900 para margem de segurança
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
  }
});

client.login(process.env.DISCORD_TOKEN);
