import { Client, Interaction, Formatters } from "discord.js";
import commands from "../commands";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId } from "../config.json";
import ClientListeners from "../utils/client-listener";

export default class CommandRunner extends ClientListeners {
  constructor() {
    super("interactionCreate");
  }

  async handler(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    const command = commands.get(interaction.commandName);

    if (!command) return;
    if (
      command.allowedChannels?.length &&
      !command.allowedChannels.includes(interaction.channelId)
    ) {
      const allowedChannelMentions = command.allowedChannels.map((channelId) =>
        Formatters.channelMention(channelId)
      );
      interaction.reply({
        content: `This command can only be used in the ${allowedChannelMentions.join(
          ", "
        )} channel${allowedChannelMentions.length > 1 ? "s" : ""}.`,
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}
