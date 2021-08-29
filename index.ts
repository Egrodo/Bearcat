import path from "path";
import fs from "fs";
import { Client, Collection, Intents } from "discord.js";
import { token } from "./config.json";
import deployCommands from "./deploy-commands";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands = new Collection<string, any>();

const commandFiles = fs
  .readdirSync(path.resolve(__dirname, "./dist/commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.resolve(__dirname, `./dist/commands/${file}`));
  commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
  deployCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
