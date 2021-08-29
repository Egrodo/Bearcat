import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import majorsInfo from "../assets/majors-info.json";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("majors")
    .setDescription("Display all the possible major roles at Baruch"),
  async execute(interaction) {
    const options = Object.entries(majorsInfo).map(([shortName, longName]) => ({
      label: `${shortName} - ${longName}`,
      description: "This is a description",
      value: shortName,
    }));

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("majorSelect")
        .setPlaceholder("UNDECIDED: Major Undecided")
        .addOptions(options)
    );

    await interaction.reply({
      content: "Please select a major to be assigned it",
      components: [row],
    });
  },
};
