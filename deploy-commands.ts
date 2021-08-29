import path from "path";
import fs from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "./config.json";

const commands = [];
const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "./dist/commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.resolve(__dirname, `./dist/commands/${file}`));
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

export default async function deployCommands() {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
}
