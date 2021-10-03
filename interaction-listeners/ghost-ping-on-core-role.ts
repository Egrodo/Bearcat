import { GuildMember, TextChannel, Formatters } from "discord.js";
import { ClientListeners } from "./index";
import {
  MAJOR_ASSIGNMENT_CHANNEL_ID,
  BARUCH_GUILD_ID,
  CORE_ROLES,
  UNKNOWN_ROLE_ID,
} from "../assets/constants";
import ghostPing from "../utils/ghostPing";

/**
 * When a user adds a core role but doesn't have any major roles, ghostping them to the major-assignment channel.
 */
export default class GhostPingOnCoreRole extends ClientListeners {
  constructor() {
    super("guildMemberUpdate");
  }

  async handler(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    const coreRolesWithoutVisitor = CORE_ROLES.slice(0, -1); // Visitors can't have major roles ¯\_(ツ)_/¯
    if (
      oldRoles.has(UNKNOWN_ROLE_ID) &&
      newRoles.hasAny(...coreRolesWithoutVisitor)
    ) {
      const baruchGuild = await newMember.client.guilds.fetch(BARUCH_GUILD_ID);
      const channel = (await baruchGuild.channels.fetch(
        MAJOR_ASSIGNMENT_CHANNEL_ID
      )) as TextChannel;

      await ghostPing(channel, newMember);
    }
  }
}
