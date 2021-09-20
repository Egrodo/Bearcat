import { CommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";
import { ADMIN_ROLE_ID, MODERATOR_ROLE_ID } from "../assets/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping to check if the bot is online")
    .setDefaultPermission(false),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("pong");
  },
  allowedRoles: [ADMIN_ROLE_ID, MODERATOR_ROLE_ID],
};
