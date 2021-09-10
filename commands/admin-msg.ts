import {
  CommandInteraction,
  CommandInteractionOption,
  GuildChannel,
  IntegrationApplication,
  MessageActionRow,
  MessageButton,
} from "discord.js";

import { APIInteractionDataResolvedChannel } from "discord-api-types";
import { SlashCommandBuilder } from "@discordjs/builders";

import majorsInfo from "../assets/majors-info.json";
import { MODERATOR_ROLE_ID } from "../assets/constants";

const ADMIN_TEAM_ID = "482768358232555521";

export default {
  data: new SlashCommandBuilder()
    .setName("sendmsg")
    .setDescription(
      "[STAFF ONLY], send a message as Bearcat Bot to whichever channel specified"
    )
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("the message to send")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("the channel to send the message to")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    const givenMsg = interaction.options.get("message")?.value;
    const givenChannel = interaction.options.get("channel");
    if (
      givenMsg == null ||
      givenChannel == null ||
      typeof givenMsg !== "string"
    )
      return;

    const channel = givenChannel.channel as GuildChannel;

    if (channel == null || !channel.isText()) {
      interaction.reply(`ERROR: "${channel.name}" is not a text channel`);
      return;
    }

    const btn = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("yesBtn").setLabel(`Yes`).setStyle(1),
      new MessageButton().setCustomId("noBtn").setLabel("No").setStyle(2)
    );

    await interaction.reply(`"${givenMsg}"`);
    await interaction.channel.send({
      content: `Are you sure you want to send the above message to ${channel.name}?`,
      components: [btn],
    });

    // TODO: Might have to confirm this with a general-purpose ButtonInteraction listener,
    // meaning we will have to store pending message sends in memory and identify them with a customId.
  },
  allowedRoles: [ADMIN_TEAM_ID, MODERATOR_ROLE_ID],
};
