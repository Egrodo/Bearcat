import path from "path";
import fs from "fs";
import { Client, Collection, GuildStickerManager, Intents } from "discord.js";
import type { ApplicationCommandPermissionType } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "./config.json";
import { MAJOR_ASSIGNMENT_CHANNEL_ID } from "./assets/constants";
import { REST } from "@discordjs/rest";
import commands from "./commands";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const rest = new REST({ version: "9" }).setToken(token);

async function deployCommands() {
  if (commands.size === 0) {
    console.error("There are no commands to register, exiting");
    return;
  }
  const guild = await client.guilds.fetch(guildId);
  const channel = guild.channels.fetch(MAJOR_ASSIGNMENT_CHANNEL_ID);

  try {
    const cmdData: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {
        body: commands.map((command) => command.data.toJSON()),
      }
    );

    // Set permissions for each command if applicable
    for (const command of cmdData) {
      const { id, name } = command;
      const cmd = await guild.commands.fetch(id);
      const { allowedRoles } = commands.get(name);
      if (allowedRoles == null) continue; // No permissions to set for this command
      const permissions = allowedRoles.map((roleId) => ({
        id: roleId,
        type: 1,
        permission: true,
      }));
      await cmd.permissions.add({ permissions });
    }

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
}

client.once("ready", () => {
  console.log("Ready!");
  deployCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return; // TODO: Handle button submissions isButton, check ID, send queue'd msg.
  // TODO: Init new instance of ButtonQueue here and export the instance
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
