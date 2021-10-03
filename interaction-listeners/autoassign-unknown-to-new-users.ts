import { GuildMember } from "discord.js";
import { ClientListeners } from "./index";
import { UNKNOWN_ROLE_ID } from "../assets/constants";

export default class AutoassignUnknownToNewUsers extends ClientListeners {
  constructor() {
    super("guildMemberAdd");
  }

  async handler(member: GuildMember): Promise<void> {
    member.roles.add(UNKNOWN_ROLE_ID);
  }
}
