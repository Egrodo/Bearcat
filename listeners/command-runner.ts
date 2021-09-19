import { Interaction, Formatters } from "discord.js";
import getCommands from "../commands";
import ClientListeners from "../utils/client-listener-type";
import type { Collection } from "discord.js";

export default class CommandRunner extends ClientListeners {
  private _commands: Collection<string, any>;

  constructor() {
    super("interactionCreate");
  }

  async handler(interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (this._commands == null) this._commands = await getCommands();

    const command = this._commands.get(interaction.commandName);

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
