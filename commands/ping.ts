import { CommandInteraction, GuildChannel, Formatters } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";
import { GetSendMajorInfo } from "../assets/messages";
import { MODERATOR_ROLE_ID } from "../assets/constants";

const ADMIN_TEAM_ID = "482768358232555521";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping to check if the bot is online")
    .setDefaultPermission(false),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("pong");
  },
  allowedRoles: [ADMIN_TEAM_ID, MODERATOR_ROLE_ID],
};
