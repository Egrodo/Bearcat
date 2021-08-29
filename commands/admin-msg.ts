import type { Interaction } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import majorsInfo from "../assets/majors-info.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmsg")
    .setDescription(
      "[ADMIN ONLY], send a message as Bearcat Bot to whichever channel specified"
    ),
  async execute(interaction: Interaction) {
    console.log(interaction?.member?.roles);
    // TODO: Verify if user is admin/mod.
  },
};
