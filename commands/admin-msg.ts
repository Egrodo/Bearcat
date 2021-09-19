import { CommandInteraction, GuildChannel, Formatters } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";
import { GetSendMajorInfo } from "../assets/messages";
import { ADMIN_ROLE_ID, MODERATOR_ROLE_ID } from "../assets/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("sendmsg")
    .setDescription(
      "[STAFF ONLY], send a message as Bearcat Bot to whichever channel specified"
    )
    .setDefaultPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("message")
        .setDescription("Send an arbitrary message to a given channel")
        .addStringOption((msg) =>
          msg
            .setName("message")
            .setDescription("The message to send")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("the channel to send the message to")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("sendmajorinfo")
        .setDescription(
          "Send information about how to use /setmajor to a given channel"
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("the channel to send the message to")
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const givenChannel = interaction.options.get("channel");
    const channel = givenChannel.channel as GuildChannel;
    if (channel == null || !channel.isText()) {
      interaction.reply(`ERROR: "${channel.name}" is not a text channel`);
      return;
    }
    if (interaction.options.getSubcommand() === "sendmajorinfo") {
      const str = GetSendMajorInfo();
      await channel.send(str);
      return;
    }

    const givenMsg = interaction.options.get("message")?.value;

    if (givenMsg == null || typeof givenMsg !== "string") return;

    await channel.send(givenMsg);
    await interaction.reply(
      `Successfully sent message to ${Formatters.channelMention(channel.id)}`
    );
  },
  allowedRoles: [ADMIN_ROLE_ID, MODERATOR_ROLE_ID],
};
