import { GuildMember } from "discord.js";
import { ClientListeners } from "./index";
import {
  UNKNOWN_ROLE_ID,
  MANAGEMENT_ROLES,
  CORE_ROLES,
} from "../assets/constants";

export default class guildMemberUpdate extends ClientListeners {
  constructor() {
    super("guildMemberUpdate");
  }

  async handler(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    if (oldMember.roles.cache.hasAny(...MANAGEMENT_ROLES)) return;

    // If member removes one of the coreRoles (and does not have another one), remove all roles and add unknown.
    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    if (oldRoles.hasAny(...CORE_ROLES) && !newRoles.hasAny(...CORE_ROLES)) {
      // Then remove all roles and add unknown.
      try {
        const unknownRole = await newMember.guild.roles.fetch(UNKNOWN_ROLE_ID);
        await newMember.roles.remove(newRoles);
        await newMember.roles.add(unknownRole);
      } catch (err) {
        console.log(`Error with ${this.event} handler: `);
        console.error(err);
      }
    }
  }
}
