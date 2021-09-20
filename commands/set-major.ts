import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Formatters } from "discord.js";
import majorsInfo from "../assets/majors-info.json";
import { MAJOR_ASSIGNMENT_CHANNEL_ID } from "../assets/constants";
import {
  ADMIN_ROLE_ID,
  STUDENT_ROLE_ID,
  GRAD_STUDENT_ROLE_ID,
  ALUMNI_ROLE_ID,
  MODERATOR_ROLE_ID,
} from "../assets/constants";

export default {
  data: new SlashCommandBuilder()
    .setName("setmajor")
    .setDescription("Set your major using a major shortname listed above")
    .setDefaultPermission(false)
    .addStringOption((option) =>
      option
        .setName("major")
        .setDescription("major shortname")
        .setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const givenMajor = interaction.options.get("major")?.value;
    if (givenMajor == null || typeof givenMajor !== "string") return;

    const fullMajorName = majorsInfo[givenMajor.toUpperCase()];

    if (fullMajorName == null) {
      interaction.reply({ content: "Major not found", ephemeral: true });
      return;
    }

    const newRole = await interaction.guild.roles.cache.find(
      (r) => r.name === fullMajorName
    );
    if (newRole == null) {
      const adminMention = Formatters.roleMention(
        interaction.guild.roles.highest.id
      );
      interaction.reply(
        `"${fullMajorName}" role not found on server, bug? ${adminMention}`
      );
      return;
    }

    const guildMember = await interaction.guild.members.fetch(
      interaction.user.id
    );
    // If user has a major role, remove it first.
    const allMajorRoles = interaction.guild.roles.cache.filter((role) => {
      if (role.name.endsWith("Major") || role.name === majorsInfo.UNDECIDED) {
        return true;
      }
      return false;
    });
    await guildMember.roles.remove(allMajorRoles);
    await guildMember.roles.add(newRole);

    await interaction.reply({
      content: `Ok, added the ${fullMajorName} role to ${Formatters.userMention(
        guildMember.id
      )}`,
      ephemeral: true,
    });
  },
  allowedRoles: [
    ADMIN_ROLE_ID,
    MODERATOR_ROLE_ID,
    STUDENT_ROLE_ID,
    GRAD_STUDENT_ROLE_ID,
    ALUMNI_ROLE_ID,
  ],
  allowedChannels: [MAJOR_ASSIGNMENT_CHANNEL_ID],
};
