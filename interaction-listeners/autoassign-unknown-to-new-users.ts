import { GuildMember } from "discord.js";
import { ClientListeners } from "./index";
import { UNKNOWN_ROLE_ID } from "../assets/constants";

export default class AutoassignUnknownToNewUsers extends ClientListeners {
  constructor() {
    super("guildMemberAdd");
  }

  async handler(member: GuildMember): Promise<void> {
    const unknownRole = member.guild.roles.cache.get(UNKNOWN_ROLE_ID);
    member.roles.add(unknownRole);
  }
}
